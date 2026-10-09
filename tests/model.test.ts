import { describe, it, expect } from "vitest";
import {
  ACTIONABLE_MIN,
  classify,
  controlScore,
  deriveClocks,
  distressScore,
  pickNextClock,
  recencyFactor,
  scoreCandidate,
  separableScore,
  timingScore,
} from "../lib/pipeline/model";
import type { Candidate, Signal, SignalCode } from "../lib/pipeline/types";

const NOW = new Date("2026-10-09T12:00:00Z");

const sig = (code: SignalCode, date = "2026-10-01"): Signal => ({ code, date, form: "t", url: "https://x", accession: `${code}-${date}` });

function cand(over: Partial<Candidate> = {}): Candidate {
  return {
    id: "t",
    cik: "1",
    name: "Test Co",
    class: "distressed_carveout",
    source: "edgar",
    provenance: "edgar_derived",
    signals: [],
    separable: { entities: [], ex21Count: 0, hasIp: false },
    control: { structure: "unknown", securedHolders: null },
    clocks: [],
    firstSeen: "2026-10-01",
    lastUpdated: "2026-10-01",
    dataQualityFlags: [],
    ...over,
  };
}

describe("distress scoring", () => {
  it("grows with additional distinct signals and is capped at 100", () => {
    const one = distressScore([sig("nt_10k")], NOW);
    const two = distressScore([sig("nt_10k"), sig("item_204")], NOW);
    const many = distressScore(
      (["item_103", "item_204", "going_concern", "cease_trade", "form_15", "form_25", "nt_10k", "item_301"] as SignalCode[]).map((c) => sig(c)),
      NOW
    );
    expect(two).toBeGreaterThan(one);
    expect(many).toBe(100);
  });

  it("does not stack repeats of the same signal code", () => {
    const once = distressScore([sig("nt_10k", "2026-09-01")], NOW);
    const thrice = distressScore([sig("nt_10k", "2026-09-01"), sig("nt_10k", "2026-08-01"), sig("nt_10k", "2026-07-01")], NOW);
    expect(thrice).toBe(once);
  });

  it("decays with age but keeps a floor", () => {
    expect(recencyFactor("2026-10-09", NOW)).toBeCloseTo(1, 1);
    expect(recencyFactor("2025-10-09", NOW)).toBeCloseTo(0.5, 1);
    expect(recencyFactor("2020-01-01", NOW)).toBe(0.2);
  });
});

describe("control point is graded, not a ≤3-lender cliff", () => {
  it("ranks single > few funds > agent syndicate > unknown > fragmented", () => {
    const s = (structure: Candidate["control"]["structure"]) => controlScore(cand({ control: { structure, securedHolders: null } }));
    expect(s("single_holder")).toBeGreaterThan(s("few_funds"));
    expect(s("few_funds")).toBeGreaterThan(s("agent_syndicate"));
    expect(s("agent_syndicate")).toBeGreaterThan(s("unknown"));
    expect(s("unknown")).toBeGreaterThan(s("fragmented"));
  });

  it("a bank-syndicate borrower still reaches the actionable bucket", () => {
    const c = cand({
      signals: [sig("item_204"), sig("going_concern"), sig("nt_10k")],
      separable: { entities: ["SubCo LLC"], ex21Count: 4, subsidiaryRevenue: 40e6, subsidiaryEbitda: 3e6, hasIp: false },
      control: { structure: "agent_syndicate", securedHolders: 12 },
    });
    expect(scoreCandidate(c, NOW).bucket).toBe("actionable");
  });
});

describe("must-haves are the only hard filter", () => {
  it("heavy distress without a separable asset is not actionable", () => {
    const c = cand({
      signals: [sig("item_204"), sig("going_concern"), sig("nt_10k"), sig("form_15")],
      control: { structure: "single_holder", securedHolders: 1 },
    });
    const s = scoreCandidate(c, NOW);
    expect(s.mustHaves.separableAsset).toBe(false);
    expect(s.bucket).not.toBe("actionable");
    expect(s.explain.join(" ")).toContain("Missing must-have: separableAsset");
  });

  it("unknown creditor structure blocks actionable until diligence identifies one", () => {
    const c = cand({
      signals: [sig("item_204"), sig("going_concern"), sig("nt_10k")],
      separable: { entities: ["SubCo LLC"], ex21Count: 4, subsidiaryRevenue: 40e6, subsidiaryEbitda: 3e6, hasIp: false },
    });
    const s = scoreCandidate(c, NOW);
    expect(s.mustHaves.identifiableCreditor).toBe(false);
    expect(s.bucket).not.toBe("actionable");
  });

  it("a dormant shell does not need a separable asset", () => {
    const c = cand({ class: "dormant_shell", signals: [sig("form_15"), sig("nt_10k"), sig("going_concern")] });
    expect(scoreCandidate(c, NOW).mustHaves.separableAsset).toBe(true);
  });

  it("a current-filer parent with a divestiture signal can qualify as a motivated seller", () => {
    const c = cand({
      class: "motivated_seller",
      signals: [sig("strategic_review"), sig("asset_sale")],
      separable: { entities: ["NonCore LLC"], ex21Count: 6, subsidiaryRevenue: 60e6, subsidiaryEbitda: 8e6, hasIp: true },
    });
    const s = scoreCandidate(c, NOW);
    expect(s.mustHaves.distressSignal).toBe(true);
    expect(s.scores.priority).toBeGreaterThanOrEqual(35);
  });
});

describe("separable value", () => {
  it("rewards sub-level revenue and EBITDA over consolidated-only revenue", () => {
    const sub = separableScore(cand({ separable: { entities: ["A LLC"], ex21Count: 3, subsidiaryRevenue: 25e6, subsidiaryEbitda: 2e6, hasIp: false } }));
    const consolidatedOnly = separableScore(cand({ separable: { entities: ["A LLC"], ex21Count: 3, consolidatedRevenue: 25e6, hasIp: false } }));
    expect(sub).toBeGreaterThan(consolidatedOnly);
  });

  it("scores nothing for an empty candidate", () => {
    expect(separableScore(cand())).toBe(0);
  });
});

describe("clocks", () => {
  it("derives rule-of-thumb clocks from filings and labels them as such", () => {
    const clocks = deriveClocks([sig("nt_10k", "2026-10-01"), sig("item_301", "2026-10-01"), sig("item_103", "2026-10-01")]);
    const byLabel = Object.fromEntries(clocks.map((c) => [c.label, c]));
    expect(byLabel["NT 10-K extension lapses"].deadline).toBe("2026-10-16");
    expect(byLabel["Listing cure period ends"].deadline).toBe("2027-03-30");
    expect(byLabel["363 sale / bid window"].deadline).toBe("2026-12-15");
    expect(clocks.every((c) => c.kind === "rule_of_thumb")).toBe(true);
  });

  it("picks the soonest future clock, else the most recently lapsed", () => {
    const clocks = deriveClocks([sig("nt_10k", "2026-10-01"), sig("item_301", "2026-10-01")]);
    expect(pickNextClock(clocks, NOW)?.label).toBe("NT 10-K extension lapses");
    const later = new Date("2026-12-01T00:00:00Z");
    expect(pickNextClock(clocks, later)?.label).toBe("Listing cure period ends");
    const muchLater = new Date("2028-01-01T00:00:00Z");
    expect(pickNextClock(clocks, muchLater)!.daysRemaining).toBeLessThan(0);
  });

  it("clock countdown actually decays with time", () => {
    const c = cand({ clocks: [{ kind: "seed_recorded", label: "x", deadline: "2026-11-08", basis: "" }] });
    expect(scoreCandidate(c, NOW).nextClock?.daysRemaining).toBe(30);
    expect(scoreCandidate(c, new Date("2026-10-29T12:00:00Z")).nextClock?.daysRemaining).toBe(10);
  });

  it("does not derive clocks from seed-synthesized signals", () => {
    const seedSig: Signal = { code: "item_204", date: "2026-10-09", form: "seed", url: "u" };
    expect(deriveClocks([seedSig])).toEqual([]);
    const c = cand({
      signals: [seedSig],
      clocks: [{ kind: "seed_recorded", label: "recorded", deadline: "2026-12-06", basis: "" }],
    });
    expect(scoreCandidate(c, NOW).nextClock?.label).toBe("recorded");
  });

  it("timing score is monotonic in urgency", () => {
    const t = (d: number) => timingScore({ daysRemaining: d });
    expect(t(10)).toBeGreaterThan(t(45));
    expect(t(45)).toBeGreaterThan(t(80));
    expect(t(80)).toBeGreaterThan(t(120));
    expect(t(120)).toBeGreaterThan(t(300));
  });
});

describe("classification", () => {
  it("routes by evidence", () => {
    const ctx = { entityCount: 3, consolidatedRevenue: 10e6 };
    expect(classify([sig("item_103")], ctx, NOW)).toBe("bankruptcy_sale");
    expect(classify([sig("nt_10k")], { ...ctx, incState: "A6" }, NOW)).toBe("cross_border");
    expect(classify([sig("nt_10k")], { ...ctx, sic: "6770" }, NOW)).toBe("dormant_shell");
    expect(classify([sig("strategic_review")], ctx, NOW)).toBe("motivated_seller");
    expect(classify([sig("item_204"), sig("going_concern")], ctx, NOW)).toBe("distressed_carveout");
    expect(classify([sig("form_15")], { entityCount: 0, consolidatedRevenue: 0 }, NOW)).toBe("dormant_shell");
  });

  it("priority never exceeds 100 or drops below 0", () => {
    const hi = scoreCandidate(
      cand({
        signals: (["item_103", "item_204", "going_concern", "form_15", "nt_10k"] as SignalCode[]).map((c) => sig(c)),
        separable: { entities: ["A"], ex21Count: 12, subsidiaryRevenue: 90e6, subsidiaryEbitda: 9e6, hasIp: true },
        control: { structure: "single_holder", securedHolders: 1 },
        clocks: [{ kind: "seed_recorded", label: "x", deadline: "2026-10-20", basis: "" }],
      }),
      NOW
    );
    expect(hi.scores.priority).toBeLessThanOrEqual(100);
    expect(hi.scores.priority).toBeGreaterThanOrEqual(ACTIONABLE_MIN);
    expect(scoreCandidate(cand(), NOW).scores.priority).toBeGreaterThanOrEqual(0);
  });
});
