import { describe, it, expect } from "vitest";
import {
  distressScore,
  recencyFactor,
  determineTier,
  scoreCandidate,
} from "../lib/pipeline/model";
import { candidateToTargetCompany } from "../lib/pipeline/adapter";
import type { Candidate, Signal } from "../lib/pipeline/types";

describe("Tier & Gate Rules Suite", () => {
  const NOW = new Date("2026-10-09T12:00:00Z");

  it("calculates recency decay accurately with 0.2 floor", () => {
    // 0 days old -> 1.0
    expect(recencyFactor("2026-10-09", NOW)).toBeCloseTo(1.0, 2);
    // 365 days old -> 0.5
    expect(recencyFactor("2025-10-09", NOW)).toBeCloseTo(0.5, 2);
    // 730 days old (2 years) -> 0.25
    expect(recencyFactor("2024-10-09", NOW)).toBeCloseTo(0.25, 2);
    // 1500 days old -> clamped to 0.2
    expect(recencyFactor("2022-01-01", NOW)).toBe(0.2);
  });

  it("calculates distress score by summing weighted non-repeating signals", () => {
    const signals: Signal[] = [
      { code: "item_204", date: "2026-10-09", form: "8-K", url: "https://x" }, // 30 * 1.0 = 30
      { code: "item_301", date: "2026-10-09", form: "8-K", url: "https://x" }, // 16 * 1.0 = 16
      { code: "nt_10k", date: "2026-10-09", form: "NT 10-K", url: "https://x" }, // 18 * 1.0 = 18
    ];
    // 30 + 16 + 18 = 64
    expect(distressScore(signals, NOW)).toBe(64);
  });

  it("does not allow an ingested record to reach 'verified' when creditors are unidentified", () => {
    const candidate: Candidate = {
      id: "edgar-111111",
      cik: "111111",
      name: "High Distress Carveout Inc",
      class: "distressed_carveout",
      source: "edgar",
      provenance: "edgar_derived",
      signals: [
        { code: "item_103", date: "2026-10-01", form: "8-K", url: "https://x" }, // 40 pts
        { code: "item_204", date: "2026-10-01", form: "8-K", url: "https://x" }, // 30 pts
      ],
      separable: {
        entities: ["Golden Operating Subsidiary LLC"],
        ex21Count: 3,
        hasIp: true,
        subsidiaryRevenue: 30000000,
        subsidiaryEbitda: 2500000,
      },
      control: {
        structure: "unknown", // Creditors unidentified!
        securedHolders: null,
      },
      clocks: [],
      firstSeen: "2026-10-01",
      lastUpdated: "2026-10-01",
      dataQualityFlags: [],
    };

    const target = candidateToTargetCompany(candidate, NOW);

    // Gate 1: passes (distress >= 15)
    expect(target.threeGates.gate1_parentDistress.passed).toBe(true);
    // Gate 2: passes (separable asset exists)
    expect(target.threeGates.gate2_separableValue.passed).toBe(true);
    // Gate 3: FAILS because control structure is unknown
    expect(target.threeGates.gate3_controlPoint.passed).toBe(false);
    expect(target.threeGates.gate3_controlPoint.metric).toBe("creditors unidentified");

    // Tier cannot be verified
    expect(target.tier).not.toBe("verified");
    expect(target.tier).toBe("screened");
  });

  it("promotes to 'verified' when distress >= 15, separable asset present, creditor identified, clock <= 90d, priority >= 55", () => {
    const candidate: Candidate = {
      id: "edgar-222222",
      cik: "222222",
      name: "Actionable Workout Target Corp",
      class: "distressed_carveout",
      source: "edgar",
      provenance: "edgar_derived",
      signals: [
        { code: "item_204", date: "2026-10-05", form: "8-K", url: "https://x" }, // 30 pts
      ],
      separable: {
        entities: ["Operating Tech Sub LLC"],
        ex21Count: 2,
        hasIp: true,
        subsidiaryRevenue: 25000000,
        subsidiaryEbitda: 1500000,
      },
      control: {
        structure: "single_holder",
        securedHolders: 1,
        seniorLender: "Streeterville Capital, LLC",
        seniorDebt: 3000000,
      },
      clocks: [
        {
          kind: "rule_of_thumb",
          label: "Forbearance / cure window (rule of thumb)",
          deadline: "2026-11-04", // Inside 90d
          basis: "30-day cure window",
        },
      ],
      firstSeen: "2026-10-05",
      lastUpdated: "2026-10-05",
      dataQualityFlags: [],
    };

    const target = candidateToTargetCompany(candidate, NOW);
    expect(target.threeGates.gate1_parentDistress.passed).toBe(true);
    expect(target.threeGates.gate2_separableValue.passed).toBe(true);
    expect(target.threeGates.gate3_controlPoint.passed).toBe(true);
    expect(target.threeGates.overallGate).toBe("passed_all_3");
    expect(target.tier).toBe("verified");
  });

  it("classifies candidates with distress < 15 and no seller signal as 'disqualified'", () => {
    const tier = determineTier({
      distress: 10,
      separableAssetPresent: false,
      creditorIdentified: false,
      priority: 20,
      hasSellerSignal: false,
    });
    expect(tier).toBe("disqualified");
  });
});
