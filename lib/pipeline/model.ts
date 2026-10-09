import type {
  Bucket,
  Candidate,
  CandidateClass,
  Clock,
  ControlStructure,
  Signal,
  SignalCode,
  ScoredCandidate,
} from "./types";

/**
 * GRADED SCORING AND TIERING ENGINE
 *
 * Signal weights (take the most recent signal per code; do not stack repeats):
 * - Ch.11 (8-K 1.03): 40
 * - Acceleration (8-K 2.04): 30
 * - Going-concern language: 22
 * - Cease-trade order: 22
 * - Form 15: 20
 * - Form 25: 18
 * - NT 10-K / delinquent 10-K: 18
 * - Listing deficiency (3.01): 16
 * - Equity deficit: 14
 * - Non-reliance (4.02): 14
 * - Toxic convertibles: 10
 * - Auditor change (4.01): 10
 * - NT 10-Q: 10
 * - Strategic review: 8
 * - Asset sale: 6
 * - Rule 15c2-11 / Expert Market: 14
 *
 * Recency: multiply each weight by max(0.2, 0.5^(ageDays/365)). Distress score = sum, capped at 100.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export const SIGNAL_WEIGHTS: Record<SignalCode, number> = {
  item_103: 40,
  item_204: 30,
  going_concern: 22,
  cease_trade: 22,
  form_15: 20,
  form_25: 18,
  nt_10k: 18,
  delinquent_10k: 18,
  item_301: 16,
  equity_deficit: 14,
  item_402: 14,
  expert_market: 14,
  toxic_convertibles: 10,
  item_401: 10,
  nt_10q: 10,
  delinquent_10q: 10,
  strategic_review: 8,
  asset_sale: 6,
};

/** Signals that indicate a seller is motivated rather than that the vehicle is broken. */
export const SELLER_SIGNALS: SignalCode[] = ["strategic_review", "asset_sale"];

export const CLASS_WEIGHTS: Record<CandidateClass, { distress: number; separable: number; control: number; timing: number }> = {
  distressed_carveout: { distress: 0.3, separable: 0.3, control: 0.2, timing: 0.2 },
  bankruptcy_sale: { distress: 0.15, separable: 0.35, control: 0.1, timing: 0.4 },
  motivated_seller: { distress: 0.1, separable: 0.45, control: 0.15, timing: 0.3 },
  dormant_shell: { distress: 0.5, separable: 0.1, control: 0.2, timing: 0.2 },
  cross_border: { distress: 0.3, separable: 0.3, control: 0.2, timing: 0.2 },
};

export const CONTROL_SCORES: Record<ControlStructure, number> = {
  single_holder: 100,
  few_funds: 80,
  agent_syndicate: 70,
  unknown: 40,
  fragmented: 30,
};

export function parseDate(d: string): number {
  return new Date(`${d}T00:00:00Z`).getTime();
}

export function toIsoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  return toIsoDate(parseDate(date) + days * DAY_MS);
}

export function daysUntil(date: string, now: Date): number {
  const today = parseDate(toIsoDate(now.getTime()));
  return Math.round((parseDate(date) - today) / DAY_MS);
}

/** Most recent signal per code. Repeats of the same code do not stack. */
export function latestSignals(signals: Signal[]): Signal[] {
  const byCode = new Map<SignalCode, Signal>();
  for (const s of signals) {
    const prev = byCode.get(s.code);
    if (!prev || s.date > prev.date) byCode.set(s.code, s);
  }
  return [...byCode.values()];
}

/** Recency factor: multiply each weight by max(0.2, 0.5^(ageDays/365)) */
export function recencyFactor(signalDate: string, now: Date): number {
  const ageDays = Math.max(0, (now.getTime() - parseDate(signalDate)) / DAY_MS);
  return Math.max(0.2, Math.pow(0.5, ageDays / 365));
}

export function distressScore(signals: Signal[], now: Date): number {
  let total = 0;
  for (const s of latestSignals(signals)) {
    if (SELLER_SIGNALS.includes(s.code)) continue;
    const weight = SIGNAL_WEIGHTS[s.code] ?? 0;
    total += weight * recencyFactor(s.date, now);
  }
  return Math.min(100, Math.round(total));
}

export function sellerScore(signals: Signal[], now: Date): number {
  let total = 0;
  for (const s of latestSignals(signals)) {
    if (!SELLER_SIGNALS.includes(s.code)) continue;
    const weight = SIGNAL_WEIGHTS[s.code] ?? 0;
    total += weight * recencyFactor(s.date, now);
  }
  return Math.min(100, Math.round(total));
}

/**
 * Separable value axis (0-100):
 * - EX-21 entity count: 1-2 -> 15, 3-9 -> 25, 10+ -> 30
 * - Subsidiary revenue scale: >=$50M -> 35, >=$20M -> 28, >=$5M -> 20, >0 -> 12
 *   (consolidated-only revenue gets ~40% of that: >=$50M -> 14, >=$20M -> 11, >=$5M -> 8, >0 -> 5)
 * - Positive EBITDA: +20
 * - IP: +10
 * - Named entity: +5
 */
export function separableScore(c: Candidate): number {
  const s = c.separable;
  let score = 0;

  // EX-21 entity count
  if (s.ex21Count >= 10) score += 30;
  else if (s.ex21Count >= 3) score += 25;
  else if (s.ex21Count >= 1) score += 15;

  // Revenue scale
  if (s.subsidiaryRevenue !== undefined && s.subsidiaryRevenue > 0) {
    const r = s.subsidiaryRevenue;
    score += r >= 50e6 ? 35 : r >= 20e6 ? 28 : r >= 5e6 ? 20 : 12;
  } else if (s.consolidatedRevenue !== undefined && s.consolidatedRevenue > 0) {
    const r = s.consolidatedRevenue;
    score += r >= 50e6 ? 14 : r >= 20e6 ? 11 : r >= 5e6 ? 8 : 5;
  }

  // Positive EBITDA
  if (s.subsidiaryEbitda !== undefined && s.subsidiaryEbitda > 0) {
    score += 20;
  }

  // IP
  if (s.hasIp) {
    score += 10;
  }

  // Named entity
  if (s.entities.length > 0) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

export function controlScore(c: Candidate): number {
  return CONTROL_SCORES[c.control.structure] ?? 40;
}

/**
 * Clocks derived from filings: rule-of-thumb windows, not documents.
 * Label them in forcingEvent.description with "(rule of thumb)":
 * - NT 10-K +15d
 * - NT 10-Q +5d
 * - Item 3.01 +180d
 * - Item 1.03 +75d
 * - Item 2.04 +30d
 * Never derive a clock from a synthetic or seed signal.
 */
export function deriveClocks(signals: Signal[]): Clock[] {
  const clocks: Clock[] = [];
  for (const s of latestSignals(signals.filter((x) => x.form !== "seed"))) {
    switch (s.code) {
      case "nt_10k":
        clocks.push({
          kind: "rule_of_thumb",
          label: "NT 10-K extension lapses",
          deadline: addDays(s.date, 15),
          basis: "Rule 12b-25: 15 calendar days after 10-K due date (rule of thumb)",
        });
        break;
      case "nt_10q":
        clocks.push({
          kind: "rule_of_thumb",
          label: "NT 10-Q extension lapses",
          deadline: addDays(s.date, 5),
          basis: "Rule 12b-25: 5 calendar days after 10-Q due date (rule of thumb)",
        });
        break;
      case "item_301":
        clocks.push({
          kind: "rule_of_thumb",
          label: "Listing cure period ends",
          deadline: addDays(s.date, 180),
          basis: "Typical Nasdaq/NYSE American compliance period (180d) (rule of thumb)",
        });
        break;
      case "item_103":
        clocks.push({
          kind: "rule_of_thumb",
          label: "363 sale / bid window",
          deadline: addDays(s.date, 75),
          basis: "Typical Ch.11 sale-process timeline (75d) (rule of thumb)",
        });
        break;
      case "item_204":
        clocks.push({
          kind: "rule_of_thumb",
          label: "Forbearance / cure window",
          deadline: addDays(s.date, 30),
          basis: "Typical post-acceleration forbearance window (30d) (rule of thumb)",
        });
        break;
      default:
        break;
    }
  }
  return clocks.sort((a, b) => a.deadline.localeCompare(b.deadline));
}

export function allClocks(c: Candidate): Clock[] {
  const derived = deriveClocks(c.signals);
  return [...c.clocks, ...derived.filter((d) => !c.clocks.some((e) => e.label === d.label))];
}

export function pickNextClock(clocks: Clock[], now: Date): (Clock & { daysRemaining: number }) | undefined {
  const withDays = clocks.map((k) => ({ ...k, daysRemaining: daysUntil(k.deadline, now) }));
  const future = withDays.filter((k) => k.daysRemaining >= 0).sort((a, b) => a.daysRemaining - b.daysRemaining);
  if (future.length) return future[0];
  const lapsed = withDays.sort((a, b) => b.daysRemaining - a.daysRemaining);
  return lapsed[0];
}

/**
 * Timing axis (0-100):
 * - <= 30d -> 100
 * - <= 60d -> 85
 * - <= 90d -> 70
 * - <= 180d -> 45
 * - <= 365d -> 25
 * - none -> 10
 * - lapsed -> 20
 */
export function timingScore(next?: { daysRemaining: number }): number {
  if (!next) return 10;
  const d = next.daysRemaining;
  if (d < 0) return 20; // lapsed: stale or already resolved
  if (d <= 30) return 100;
  if (d <= 60) return 85;
  if (d <= 90) return 70;
  if (d <= 180) return 45;
  if (d <= 365) return 25;
  return 10;
}

export const ACTIONABLE_MIN = 55;
export const WATCH_MIN = 35;

/**
 * Tiers:
 * - verified: distress >= 15, separable asset present, creditor identified, a clock <= 90 days, priority >= 55.
 * - screened: distress >= 15 and separable asset.
 * - radar: distress >= 15 or separable only.
 * - disqualified: distress < 15 and no seller signal.
 */
export function determineTier(params: {
  distress: number;
  separableAssetPresent: boolean;
  creditorIdentified: boolean;
  nextClockDays?: number;
  priority: number;
  hasSellerSignal: boolean;
}): "verified" | "screened" | "radar" | "disqualified" {
  const { distress, separableAssetPresent, creditorIdentified, nextClockDays, priority, hasSellerSignal } = params;
  const clockInside90 = nextClockDays !== undefined && nextClockDays >= 0 && nextClockDays <= 90;

  if (distress >= 15 && separableAssetPresent && creditorIdentified && clockInside90 && priority >= 55) {
    return "verified";
  }
  if (distress >= 15 && separableAssetPresent) {
    return "screened";
  }
  if (distress >= 15 || separableAssetPresent) {
    return "radar";
  }
  if (distress < 15 && !hasSellerSignal) {
    return "disqualified";
  }
  return "radar";
}

export function scoreCandidate(c: Candidate, now: Date = new Date()): ScoredCandidate {
  const clocks = allClocks(c);
  const nextClock = pickNextClock(clocks, now);

  const distressBase = distressScore(c.signals, now);
  const seller = sellerScore(c.signals, now);
  const distress = c.class === "motivated_seller" ? Math.max(distressBase, seller) : distressBase;
  const separable = separableScore(c);
  const control = controlScore(c);
  const timing = timingScore(nextClock);

  // Default weights: distress 0.30, separable 0.30, control 0.20, timing 0.20
  const priority = Math.round(distress * 0.30 + separable * 0.30 + control * 0.20 + timing * 0.20);

  const separableAssetPresent =
    c.class === "dormant_shell" ||
    c.separable.entities.length > 0 ||
    (c.separable.subsidiaryRevenue ?? 0) > 0 ||
    c.separable.hasIp ||
    c.separable.ex21Count > 0;

  const creditorIdentified =
    c.control.structure === "single_holder" ||
    c.control.structure === "few_funds" ||
    c.control.structure === "agent_syndicate";

  const hasSellerSignal = c.signals.some((s) => SELLER_SIGNALS.includes(s.code));

  const mustHaves = {
    distressSignal: distress >= 15 || (c.class === "motivated_seller" && hasSellerSignal),
    separableAsset: separableAssetPresent,
    identifiableCreditor: creditorIdentified,
  };

  const tier = determineTier({
    distress,
    separableAssetPresent,
    creditorIdentified,
    nextClockDays: nextClock?.daysRemaining,
    priority,
    hasSellerSignal,
  });

  let bucket: Bucket = "low";
  if (tier === "verified") bucket = "actionable";
  else if (tier === "screened" || tier === "radar") bucket = "watch";

  const explain: string[] = [
    `Distress ${distress}/100`,
    `Separable ${separable}/100: ${c.separable.ex21Count} EX-21 entities`,
    `Control ${control}/100: ${c.control.structure.replace("_", " ")}`,
    `Timing ${timing}/100: ${nextClock ? `${nextClock.label} in ${nextClock.daysRemaining}d` : "no active clock"}`,
  ];

  const missing: string[] = [];
  if (!mustHaves.distressSignal) missing.push("distressSignal");
  if (!mustHaves.separableAsset) missing.push("separableAsset");
  if (!mustHaves.identifiableCreditor) missing.push("identifiableCreditor");
  if (missing.length > 0) {
    explain.push(`Missing must-have: ${missing.join(", ")}`);
  }

  return {
    ...c,
    scores: { distress, separable, control, timing, priority },
    mustHaves,
    bucket,
    nextClock,
    explain,
  };
}

export interface ClassifyContext {
  sic?: string;
  incState?: string;
  exchange?: string;
  consolidatedRevenue?: number;
  entityCount: number;
}

const CANADIAN_STATE_CODES = /^(A[0-9]|B0)$/;

export function classify(signals: Signal[], ctx: ClassifyContext, now: Date = new Date()): CandidateClass {
  const recent103 = signals.some((s) => s.code === "item_103" && (now.getTime() - parseDate(s.date)) / DAY_MS <= 365);
  if (recent103) return "bankruptcy_sale";
  if (ctx.exchange === "TSXV" || ctx.exchange === "TSX" || ctx.exchange === "CSE" || ctx.exchange === "NEO" || (ctx.incState && CANADIAN_STATE_CODES.test(ctx.incState)) || signals.some((s) => s.code === "cease_trade")) {
    return "cross_border";
  }
  if (ctx.exchange === "ASX") return "cross_border";
  if (ctx.sic === "6770") return "dormant_shell";
  const distress = distressScore(signals, now);
  const seller = sellerScore(signals, now);
  if (distress < 20 && seller > 0) return "motivated_seller";
  if (ctx.consolidatedRevenue === 0 && ctx.entityCount === 0 && distress > 0) return "dormant_shell";
  return "distressed_carveout";
}
