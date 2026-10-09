import { describe, it, expect } from "vitest";
import { INITIAL_TARGETS } from "../lib/data/targets";
import { withLiveClock } from "../lib/pipeline/clock";
import { seedToCandidate } from "../lib/pipeline/seed";
import { buildUniverse, mergeSeedAndIngestedTargets } from "../lib/pipeline/universe";
import type { Candidate } from "../lib/pipeline/types";
import type { TargetCompany } from "../lib/types";
import ingestedStore from "../data/ingested-targets.json";

const NOW = new Date("2026-10-09T12:00:00Z");
const empty = { generatedAt: null, candidates: [] as Candidate[] };

describe("Seed records flow through the universe with nothing dropped", () => {
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

describe("Merging ingested targets into TargetCompany universe", () => {
  it("merges seeds with ingested records, deduping by CIK with leading zeros stripped", () => {
    const xela = INITIAL_TARGETS.find((t) => t.ticker === "XELA")!;
    const dummyIngested: TargetCompany = {
      ...xela,
      id: `edgar-${xela.cik}`,
      cik: `000${xela.cik}`, // leading zeros
      vehicleDistress: {
        ...xela.vehicleDistress,
        secTriggers: ["item_301 (2026-10-01 8-K)"],
      },
    };

    const combined = mergeSeedAndIngestedTargets(INITIAL_TARGETS, [dummyIngested]);
    // Should NOT duplicate XELA
    expect(combined).toHaveLength(INITIAL_TARGETS.length);
    const mergedXela = combined.find((t) => t.ticker === "XELA")!;
    // Ingested trigger appended to seed
    expect(mergedXela.vehicleDistress.secTriggers).toContain("item_301 (2026-10-01 8-K)");
  });

  it("adds net-new ingested records as separate companies", () => {
    const newCo: TargetCompany = {
      ...INITIAL_TARGETS[0],
      id: "edgar-9999999",
      cik: "9999999",
      ticker: "NEWCO",
      name: "New Discovery Target Inc",
    };

    const combined = mergeSeedAndIngestedTargets(INITIAL_TARGETS, [newCo]);
    expect(combined).toHaveLength(INITIAL_TARGETS.length + 1);
    expect(combined.some((t) => t.ticker === "NEWCO")).toBe(true);
  });

  it("the committed data/ingested-targets.json file contains valid targets array with hundreds of companies", () => {
    expect(Array.isArray(ingestedStore.targets)).toBe(true);
    expect(ingestedStore.targets.length).toBeGreaterThanOrEqual(100);
  });
});

describe("Live catalyst clocks on seed targets", () => {
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
