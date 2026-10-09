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
 * GRADED SCORING MODEL
 *
 * Replaces the three binary gates. The old funnel asked three yes/no questions and
 * threw everything away that failed any of them (including "≤3 secured lenders" and
 * "must not be a current filer"). Here:
 *
 *   - Must-haves are the only hard filter: there is *some* distress/seller signal,
 *     *some* separable asset, and *some* identifiable creditor (or a process where
 *     that is public record).
 *   - Everything else is graded 0-100 and combined with class-specific weights.
 *   - Unknowns are scored as unknown (neutral-low), never as pass or fail.
 *
 * Timing clocks derived from filings are rules of thumb and labelled as such.
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
  expert_market: 14,
  equity_deficit: 14,
  item_402: 14,
  toxic_convertibles: 10,
  item_401: 10,
  nt_10q: 10,
  delinquent_10q: 10,
  strategic_review: 8,
  asset_sale: 6,
};

/** Signals that indicate a seller is motivated rather than that the vehicle is broken. */
const SELLER_SIGNALS: SignalCode[] = ["strategic_review", "asset_sale"];

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
  fragmented: 30,
  unknown: 40,
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

/** Half-life 365d, floored at 0.2 so old-but-unresolved distress still counts. */
export function recencyFactor(signalDate: string, now: Date): number {
  const ageDays = Math.max(0, (now.getTime() - parseDate(signalDate)) / DAY_MS);
  return Math.max(0.2, Math.pow(0.5, ageDays / 365));
}

export function distressScore(signals: Signal[], now: Date): number {
  let total = 0;
  for (const s of latestSignals(signals)) {
    if (SELLER_SIGNALS.includes(s.code)) continue;
    total += SIGNAL_WEIGHTS[s.code] * recencyFactor(s.date, now);
  }
  return Math.min(100, Math.round(total));
}

export function sellerScore(signals: Signal[], now: Date): number {
  let total = 0;
  for (const s of latestSignals(signals)) {
    if (!SELLER_SIGNALS.includes(s.code)) continue;
    total += 40 * recencyFactor(s.date, now);
  }
  return Math.min(100, Math.round(total));
}

export function separableScore(c: Candidate): number {
  const s = c.separable;
  let score = 0;

  if (s.ex21Count >= 10) score += 30;
  else if (s.ex21Count >= 3) score += 25;
  else if (s.ex21Count >= 1) score += 15;
  else if (s.entities.length > 0) score += 10;

  if (s.subsidiaryRevenue !== undefined && s.subsidiaryRevenue > 0) {
    const r = s.subsidiaryRevenue;
    score += r >= 50e6 ? 35 : r >= 20e6 ? 28 : r >= 5e6 ? 20 : 12;
  } else if (s.consolidatedRevenue !== undefined && s.consolidatedRevenue > 0) {
    const r = s.consolidatedRevenue;
    score += r >= 20e6 ? 15 : r >= 5e6 ? 10 : 5;
  }

  if (s.subsidiaryEbitda !== undefined) {
    if (s.subsidiaryEbitda > 0) score += 20;
    else if (s.subsidiaryEbitda < 0) score -= 5;
  }
  if (s.hasIp) score += 10;
  if (s.entities.length > 0) score += 5;

  return Math.max(0, Math.min(100, score));
}

export function controlScore(c: Candidate): number {
  return CONTROL_SCORES[c.control.structure];
}

/**
 * Clocks derived from filings. These are *typical* statutory/exchange windows, not
 * deadlines read from a document, and are tagged `rule_of_thumb`.
 */
export function deriveClocks(signals: Signal[]): Clock[] {
  const clocks: Clock[] = [];
  // Seed-synthesized signals carry the retrieval date, not a filing date, so a clock derived
  // from them would be fabricated urgency. Only real filings generate clocks.
  for (const s of latestSignals(signals.filter((x) => x.form !== "seed"))) {
    switch (s.code) {
      case "nt_10k":
        clocks.push({
          kind: "rule_of_thumb",
          label: "NT 10-K extension lapses",
          deadline: addDays(s.date, 15),
          basis: "Rule 12b-25: 15 calendar days after the 10-K due date",
        });
        break;
      case "nt_10q":
        clocks.push({
          kind: "rule_of_thumb",
          label: "NT 10-Q extension lapses",
          deadline: addDays(s.date, 5),
          basis: "Rule 12b-25: 5 calendar days after the 10-Q due date",
        });
        break;
      case "item_301":
        clocks.push({
          kind: "rule_of_thumb",
          label: "Listing cure period ends",
          deadline: addDays(s.date, 180),
          basis: "Typical Nasdaq/NYSE American compliance period (180d); varies by deficiency type",
        });
        break;
      case "item_103":
        clocks.push({
          kind: "rule_of_thumb",
          label: "363 sale / bid window",
          deadline: addDays(s.date, 75),
          basis: "Typical Ch.11 sale-process timeline (60-90d); check the bid-procedures order",
        });
        break;
      case "item_204":
        clocks.push({
          kind: "rule_of_thumb",
          label: "Forbearance / cure window",
          deadline: addDays(s.date, 30),
          basis: "Typical post-acceleration forbearance window; depends on credit agreement",
        });
        break;
      default:
        break;
    }
  }
  return clocks.sort((a, b) => a.deadline.localeCompare(b.deadline));
}

function allClocks(c: Candidate): Clock[] {
  const derived = deriveClocks(c.signals);
  // Seed-recorded clocks are kept; derived clocks fill in for ingested candidates.
  return [...c.clocks, ...derived.filter((d) => !c.clocks.some((e) => e.label === d.label))];
}

/**
 * The next clock that still matters: soonest future clock, otherwise the most
 * recently lapsed one (flagged by a negative daysRemaining).
 */
export function pickNextClock(clocks: Clock[], now: Date): (Clock & { daysRemaining: number }) | undefined {
  const withDays = clocks.map((k) => ({ ...k, daysRemaining: daysUntil(k.deadline, now) }));
  const future = withDays.filter((k) => k.daysRemaining >= 0).sort((a, b) => a.daysRemaining - b.daysRemaining);
  if (future.length) return future[0];
  const lapsed = withDays.sort((a, b) => b.daysRemaining - a.daysRemaining);
  return lapsed[0];
}

export function timingScore(next?: { daysRemaining: number }): number {
  if (!next) return 10;
  const d = next.daysRemaining;
  if (d < 0) return 20; // lapsed: stale or already resolved, worth a look but not urgent
  if (d <= 30) return 100;
  if (d <= 60) return 85;
  if (d <= 90) return 70;
  if (d <= 180) return 45;
  if (d <= 365) return 25;
  return 10;
}

export const ACTIONABLE_MIN = 55;
export const WATCH_MIN = 35;

export function scoreCandidate(c: Candidate, now: Date = new Date()): ScoredCandidate {
  const clocks = allClocks(c);
  const nextClock = pickNextClock(clocks, now);

  const distressBase = distressScore(c.signals, now);
  const seller = sellerScore(c.signals, now);
  // For a motivated seller the "distress" axis is the seller-intent signal.
  const distress = c.class === "motivated_seller" ? Math.max(distressBase, seller) : distressBase;
  const separable = separableScore(c);
  const control = controlScore(c);
  const timing = timingScore(nextClock);

  const w = CLASS_WEIGHTS[c.class];
  const priority = Math.round(distress * w.distress + separable * w.separable + control * w.control + timing * w.timing);

  // Signal must be meaningful, not a single stale or minor filing.
  const MIN_SIGNAL = 15;
  const hasDistressSignal = c.class === "motivated_seller" ? seller >= 20 : distressBase >= MIN_SIGNAL;
  const hasSeparable =
    c.class === "dormant_shell" ||
    c.separable.entities.length > 0 ||
    (c.separable.subsidiaryRevenue ?? 0) > 0 ||
    c.separable.hasIp;
  const hasCreditor =
    c.control.structure !== "unknown" ||
    c.class === "bankruptcy_sale" || // creditors are public record on the docket
    c.class === "dormant_shell" ||
    c.class === "motivated_seller";

  const mustHaves = {
    distressSignal: hasDistressSignal,
    separableAsset: hasSeparable,
    identifiableCreditor: hasCreditor,
  };
  const allMust = mustHaves.distressSignal && mustHaves.separableAsset && mustHaves.identifiableCreditor;

  let bucket: Bucket = "low";
  if (allMust && priority >= ACTIONABLE_MIN) bucket = "actionable";
  else if (priority >= WATCH_MIN && (mustHaves.distressSignal || mustHaves.separableAsset)) bucket = "watch";

  const explain: string[] = [];
  const top = latestSignals(c.signals)
    .filter((s) => !SELLER_SIGNALS.includes(s.code))
    .sort((a, b) => SIGNAL_WEIGHTS[b.code] * recencyFactor(b.date, now) - SIGNAL_WEIGHTS[a.code] * recencyFactor(a.date, now))
    .slice(0, 3);
  if (top.length) explain.push(`Distress ${distress}: ${top.map((s) => `${s.code} (${s.date})`).join(", ")}`);
  else explain.push(`Distress ${distress}: no distress filings in window`);
  explain.push(
    `Separable ${separable}: ${c.separable.ex21Count} EX-21 entities` +
      (c.separable.subsidiaryRevenue ? `, sub revenue $${(c.separable.subsidiaryRevenue / 1e6).toFixed(1)}M` : "") +
      (c.separable.hasIp ? ", IP" : "")
  );
  explain.push(`Control ${control}: ${c.control.structure.replace("_", " ")}${c.control.securedHolders ? ` (${c.control.securedHolders} holder${c.control.securedHolders > 1 ? "s" : ""})` : ""}`);
  if (nextClock) {
    explain.push(
      `Timing ${timing}: ${nextClock.label} ${nextClock.daysRemaining >= 0 ? `in ${nextClock.daysRemaining}d` : `lapsed ${-nextClock.daysRemaining}d ago`} (${nextClock.kind === "rule_of_thumb" ? "rule of thumb" : "recorded"})`
    );
  } else {
    explain.push("Timing 10: no clock identified");
  }
  const missing = (Object.keys(mustHaves) as (keyof typeof mustHaves)[]).filter((k) => !mustHaves[k]);
  if (missing.length) explain.push(`Missing must-have: ${missing.join(", ")}`);

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
  if (ctx.exchange === "TSXV" || (ctx.incState && CANADIAN_STATE_CODES.test(ctx.incState)) || signals.some((s) => s.code === "cease_trade")) {
    return "cross_border";
  }
  if (ctx.sic === "6770") return "dormant_shell";
  const distress = distressScore(signals, now);
  const seller = sellerScore(signals, now);
  if (distress < 20 && seller > 0) return "motivated_seller";
  if (ctx.consolidatedRevenue === 0 && ctx.entityCount === 0 && distress > 0) return "dormant_shell";
  return "distressed_carveout";
}
