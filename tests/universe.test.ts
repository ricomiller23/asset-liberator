import { describe, it, expect } from "vitest";
import { INITIAL_TARGETS } from "../lib/data/targets";
import { withLiveClock } from "../lib/pipeline/clock";
import { seedToCandidate } from "../lib/pipeline/seed";
import { buildUniverse } from "../lib/pipeline/universe";
import type { Candidate } from "../lib/pipeline/types";
import store from "../data/candidates.json";

const NOW = new Date("2026-10-09T12:00:00Z");
const empty = { generatedAt: null, candidates: [] as Candidate[] };

describe("seed records flow through the new model with nothing dropped", () => {
  const universe = buildUniverse(INITIAL_TARGETS, empty, NOW);

  it("retains every seed record", () => {
    expect(universe).toHaveLength(INITIAL_TARGETS.length);
    for (const t of INITIAL_TARGETS) {
      expect(universe.some((c) => c.seedTargetId === t.id && c.ticker === t.ticker)).toBe(true);
    }
  });

  it("tags seeds as unverified and surfaces data-quality problems instead of hiding them", () => {
    expect(universe.every((c) => c.provenance === "seed_unverified")).toBe(true);
    const rgbp = universe.find((c) => c.ticker === "RGBP")!;
    expect(rgbp.dataQualityFlags.join(" ")).toContain("vertical_revenue_mismatch");
    const nlst = universe.find((c) => c.ticker === "NLST")!;
    expect(nlst.dataQualityFlags.join(" ")).toContain("disqualified_current_filer");
  });

  it("keeps all scores within 0-100", () => {
    for (const c of universe) {
      for (const v of Object.values(c.scores)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });

  it("ranks the former Tier-1 names above the former excluded filers, without hard-excluding the latter", () => {
    const p = (t: string) => universe.find((c) => c.ticker === t)!;
    for (const top of ["XELA", "ALPP", "SING"]) {
      expect(p(top).bucket).toBe("actionable");
      for (const ex of ["NLST", "NWBO", "CYDY", "IQST"]) {
        expect(p(top).scores.priority).toBeGreaterThan(p(ex).scores.priority);
        expect(p(ex).bucket).not.toBe("actionable");
        expect(universe).toContain(p(ex)); // still in the universe
      }
    }
  });

  it("assigns the Chapter 11 record to the bankruptcy_sale class", () => {
    expect(universe.find((c) => c.ticker === "RWAX")!.class).toBe("bankruptcy_sale");
  });

  it("seed signals fade if never refreshed", () => {
    const later = buildUniverse(INITIAL_TARGETS, empty, new Date("2028-06-01T00:00:00Z"));
    const now = universe.find((c) => c.ticker === "ALPP")!;
    const stale = later.find((c) => c.ticker === "ALPP")!;
    expect(stale.scores.distress).toBeLessThan(now.scores.distress);
  });
});

describe("merging ingested candidates", () => {
  it("attaches EDGAR signals to the seed record sharing a CIK instead of duplicating it", () => {
    const xela = INITIAL_TARGETS.find((t) => t.ticker === "XELA")!;
    const cik = seedToCandidate(xela).cik;
    const ingested: Candidate = {
      id: `edgar-${cik}`,
      cik,
      name: xela.name,
      class: "distressed_carveout",
      source: "edgar",
      provenance: "edgar_derived",
      signals: [{ code: "going_concern", date: "2026-10-05", form: "10-K", url: "https://x", accession: "gc1" }],
      separable: { entities: ["Extra Sub LLC"], ex21Count: 9, hasIp: false, consolidatedRevenue: 1 },
      control: { structure: "unknown", securedHolders: null },
      clocks: [],
      firstSeen: "2026-10-05",
      lastUpdated: "2026-10-05",
      dataQualityFlags: [],
    };
    const u = buildUniverse(INITIAL_TARGETS, { generatedAt: "x", candidates: [ingested] }, NOW);
    expect(u).toHaveLength(INITIAL_TARGETS.length);
    const merged = u.find((c) => c.cik === cik)!;
    expect(merged.source).toBe("seed");
    expect(merged.signals.some((s) => s.code === "going_concern")).toBe(true);
    expect(merged.separable.entities).toContain("Extra Sub LLC");
    expect(merged.dataQualityFlags).toContain("edgar_signals_attached");
  });

  it("adds net-new CIKs as separate candidates", () => {
    const extra: Candidate = {
      id: "edgar-999999",
      cik: "999999",
      name: "NET NEW CO",
      class: "dormant_shell",
      source: "edgar",
      provenance: "edgar_derived",
      signals: [{ code: "form_15", date: "2026-10-01", form: "15-12G", url: "https://x", accession: "f15" }],
      separable: { entities: [], ex21Count: 0, hasIp: false },
      control: { structure: "unknown", securedHolders: null },
      clocks: [],
      firstSeen: "2026-10-01",
      lastUpdated: "2026-10-01",
      dataQualityFlags: [],
    };
    const u = buildUniverse(INITIAL_TARGETS, { generatedAt: "x", candidates: [extra] }, NOW);
    expect(u).toHaveLength(INITIAL_TARGETS.length + 1);
  });

  it("the committed store file has the expected shape", () => {
    expect(Array.isArray((store as { candidates: unknown[] }).candidates)).toBe(true);
  });
});

describe("live catalyst clocks on seed targets", () => {
  it("recomputes daysRemaining from deadlineDate so it decays", () => {
    const t = INITIAL_TARGETS.find((x) => x.ticker === "XELA")!;
    const a = withLiveClock(t, new Date("2026-10-09T12:00:00Z"));
    const b = withLiveClock(t, new Date("2026-10-19T12:00:00Z"));
    expect(a.forcingEvent.daysRemaining - b.forcingEvent.daysRemaining).toBe(10);
  });

  it("flips the 90-day window once the deadline is far enough away or has passed", () => {
    const t = INITIAL_TARGETS.find((x) => x.ticker === "XELA")!;
    expect(withLiveClock(t, new Date("2026-10-09T12:00:00Z")).forcingEvent.leadTimeWindow).toBe("inside_90d_active");
    expect(withLiveClock(t, new Date("2026-07-01T12:00:00Z")).forcingEvent.leadTimeWindow).toBe("outside_90d_radar");
    expect(withLiveClock(t, new Date("2027-01-01T12:00:00Z")).forcingEvent.daysRemaining).toBeLessThan(0);
  });
});
