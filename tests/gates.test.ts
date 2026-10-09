import { describe, it, expect } from "vitest";
import { INITIAL_TARGETS } from "../lib/data/targets";

describe("Three Hard Gates & Sourced Receipts Verification Suite", () => {
  it("enforces Three Hard Gates on all candidate targets", () => {
    INITIAL_TARGETS.forEach((t) => {
      expect(t.threeGates).toBeDefined();
      expect(typeof t.threeGates.gate1_parentDistress.passed).toBe("boolean");
      expect(typeof t.threeGates.gate2_separableValue.passed).toBe("boolean");
      expect(typeof t.threeGates.gate3_controlPoint.passed).toBe("boolean");
      expect(["passed_all_3", "partial_screened", "failed_disqualified"]).toContain(t.threeGates.overallGate);
    });
  });

  it("verifies top actionable candidates pass all three hard gates", () => {
    const verifiedTargets = INITIAL_TARGETS.filter((t) => t.tier === "verified");
    expect(verifiedTargets.length).toBeGreaterThanOrEqual(3);

    verifiedTargets.forEach((t) => {
      expect(t.threeGates.overallGate).toBe("passed_all_3");
      expect(t.threeGates.gate1_parentDistress.passed).toBe(true);
      expect(t.threeGates.gate2_separableValue.passed).toBe(true);
      expect(t.threeGates.gate3_controlPoint.passed).toBe(true);
      expect(t.forcingEvent.leadTimeWindow).toBe("inside_90d_active");
      expect(t.forcingEvent.daysRemaining).toBeLessThanOrEqual(90);
    });

    const xela = verifiedTargets.find((t) => t.ticker === "XELA");
    const alpp = verifiedTargets.find((t) => t.ticker === "ALPP");
    const sing = verifiedTargets.find((t) => t.ticker === "SING");

    expect(xela).toBeDefined();
    expect(alpp).toBeDefined();
    expect(sing).toBeDefined();
  });

  it("verifies four current filers are disqualified and excluded from broken vehicle funnel", () => {
    const disqualified = ["NLST", "NWBO", "CYDY", "IQST"];
    disqualified.forEach((ticker) => {
      const target = INITIAL_TARGETS.find((t) => t.ticker === ticker);
      expect(target).toBeDefined();
      expect(target?.tier).toBe("disqualified");
      expect(target?.threeGates.gate1_parentDistress.passed).toBe(false);
      expect(target?.threeGates.overallGate).toBe("failed_disqualified");
      expect(target?.disqualificationReason).toBeTruthy();
      expect(target?.scores.rollupOpportunityIndex).toBeLessThanOrEqual(30);
    });
  });

  it("verifies Zion Oil & Gas (ZNOG) is properly sourced as a $0 pre-revenue explorer", () => {
    const znog = INITIAL_TARGETS.find((t) => t.ticker === "ZNOG");
    expect(znog).toBeDefined();
    expect(znog?.asset.annualRevenue).toBe(0);
    expect(znog?.tier).toBe("radar");
    expect(znog?.vertical).toBe("pre_revenue_ip");
  });

  it("verifies wide score discrimination across candidate universe (spread > 60 pts)", () => {
    const rois = INITIAL_TARGETS.map((t) => t.scores.rollupOpportunityIndex);
    const minRoi = Math.min(...rois);
    const maxRoi = Math.max(...rois);
    const spread = maxRoi - minRoi;

    expect(minRoi).toBeLessThan(30);
    expect(maxRoi).toBeGreaterThan(90);
    expect(spread).toBeGreaterThanOrEqual(60);
  });

  it("verifies zero targets use unverified 'analyst_estimate' provenance", () => {
    INITIAL_TARGETS.forEach((t) => {
      expect(t.dataProvenance).not.toBe("analyst_estimate");
      expect(["sec_sourced", "ucc_filed", "court_docket"]).toContain(t.dataProvenance);
      expect(t.retrievedAt).toBe("2026-10-09");
      expect(t.latestFilingUrl).toBeTruthy();
    });
  });

  it("verifies segment-profit mismatch is computed for all targets", () => {
    INITIAL_TARGETS.forEach((t) => {
      expect(t.segmentMismatch).toBeDefined();
      expect(typeof t.segmentMismatch.parentConsolidatedLoss).toBe("number");
      expect(typeof t.segmentMismatch.subOperatingIncome).toBe("number");
      expect(typeof t.segmentMismatch.spreadDelta).toBe("number");
    });
  });
});
