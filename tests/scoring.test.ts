import { describe, it, expect } from "vitest";
import { 
  computeAssetQualityScore, 
  computeVehicleDistressScore, 
  computeExtractionFeasibilityScore, 
  computeRollupOpportunityIndex,
  enrichTargetScores 
} from "../lib/scoring";
import { INITIAL_TARGETS } from "../lib/data/targets";

describe("Asset Liberator Tri-Factor Scoring Suite", () => {
  it("computes high asset quality for strong revenue and positive gross margin", () => {
    const mockAsset = {
      subsidiaryName: "Test Co",
      businessSummary: "Test business",
      annualRevenue: 15000000,
      grossMarginPct: 55,
      ebitda: 1500000,
      employees: 40,
      facilities: "Test facility",
      patentsCount: 5,
      keyClients: ["Client A", "Client B", "Client C"],
      ipDetails: "Proprietary algorithms",
      commercialReadiness: "revenue_generating" as const,
    };

    const score = computeAssetQualityScore(mockAsset);
    expect(score).toBeGreaterThanOrEqual(80);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("penalizes companies with severe vehicle distress", () => {
    const mockDistress = {
      statusSummary: "Severe toxic debt",
      filingStatus: "suspended_15c211" as const,
      auditorStatus: "resigned_item401" as const,
      lastAuditorName: "BF Borgers",
      lastAuditorCity: "Lakewood, CO",
      lastFilingDate: "2023-01-01",
      secTriggers: ["Item 4.01", "Item 2.04", "Rule 15c2-11", "Toxic Ratchet"],
      toxicDebtBalance: 7500000,
      toxicLenders: ["Auctus", "Geneva Roth"],
      convertibleDiscountPct: 50,
      defaultInterestRatePct: 24,
    };

    const distressScore = computeVehicleDistressScore(mockDistress);
    expect(distressScore).toBeGreaterThanOrEqual(85);
  });

  it("calculates weighted Rollup Opportunity Index correctly", () => {
    const aqs = 85;
    const vts = 90;
    const efs = 80;
    // (85 * 0.40) + (90 * 0.35) + (80 * 0.25) = 34 + 31.5 + 20 = 85.5 -> 86
    const roi = computeRollupOpportunityIndex(aqs, vts, efs);
    expect(roi).toBe(86);
  });

  it("correctly enriches all initial targets with valid bounded scores", () => {
    INITIAL_TARGETS.forEach((target) => {
      expect(target.scores.assetQualityScore).toBeGreaterThan(0);
      expect(target.scores.vehicleDistressScore).toBeGreaterThan(0);
      expect(target.scores.extractionFeasibilityScore).toBeGreaterThan(0);
      expect(target.scores.rollupOpportunityIndex).toBeGreaterThan(0);
      expect(target.scores.rollupOpportunityIndex).toBeLessThanOrEqual(100);
    });
  });
});
