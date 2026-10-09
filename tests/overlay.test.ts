import { describe, it, expect, beforeEach } from "vitest";
import {
  getCrmOverlay,
  saveCrmOverlay,
  applyCrmOverlay,
  updateTargetCrmStage,
  addTargetCrmNote,
  logTargetActivity,
  addTargetContact,
  resetMemoryOverlay,
} from "../lib/crm";
import type { TargetCompany } from "../lib/types";

describe("CRM Overlay Persistence Suite", () => {
  beforeEach(() => {
    resetMemoryOverlay();
  });

  it("stores only modified overlay entries without persisting full TargetCompany records", () => {
    const nonSeedId = "edgar-0000001750";

    updateTargetCrmStage(nonSeedId, "in_dialogue", "high");
    addTargetCrmNote(nonSeedId, "Initial call with receiver: confirmed separable operating subsidiary.");

    const overlay = getCrmOverlay();
    expect(overlay[nonSeedId]).toBeDefined();
    expect(overlay[nonSeedId].crm.stage).toBe("in_dialogue");
    expect(overlay[nonSeedId].crm.priority).toBe("high");
    expect(overlay[nonSeedId].crm.notes.length).toBe(1);
    expect(overlay[nonSeedId].crm.notes[0].text).toContain("Initial call with receiver");

    // Ensure the overlay map only contains contacts and crm, not full company objects
    const keys = Object.keys(overlay[nonSeedId]);
    expect(keys.sort()).toEqual(["contacts", "crm"]);
    expect((overlay[nonSeedId] as any).ticker).toBeUndefined();
    expect((overlay[nonSeedId] as any).marketCap).toBeUndefined();
  });

  it("merges overlay correctly onto non-seed company from API", () => {
    const nonSeedId = "edgar-0000888888";
    addTargetContact(nonSeedId, {
      name: "Marcus Vance",
      title: "Chief Restructuring Officer",
      entity: "Public Parent",
      email: "mvance@example.com",
      phone: "(415) 555-0123",
      roleSummary: "CRO leading carveout sale.",
      receptivityScore: "very_high",
    });

    const mockApiTarget: TargetCompany = {
      id: nonSeedId,
      ticker: "MVNC",
      name: "Vance Technologies Inc",
      cik: "0000888888",
      exchange: "NASDAQ",
      sector: "Technology",
      industry: "Software",
      headquarters: "CA, United States",
      marketCap: 0,
      stockPrice: 0,
      sharesOutstanding: 0,
      authorizedShares: 0,
      tier: "screened",
      vertical: "b2b_software",
      threeGates: {} as any,
      forcingEvent: {} as any,
      segmentMismatch: {} as any,
      otcMarketsUrl: "",
      secEdgarUrl: "",
      latestFilingUrl: "",
      latestFilingType: "",
      latestFilingDate: "",
      dataProvenance: "sec_sourced",
      asset: {
        subsidiaryName: "Vance Cloud LLC",
        businessSummary: "",
        annualRevenue: 10000000,
        grossMarginPct: 50,
        ebitda: 1500000,
        employees: 0,
        facilities: "",
        patentsCount: 0,
        keyClients: [],
        ipDetails: "",
        commercialReadiness: "revenue_generating",
      },
      vehicleDistress: {} as any,
      extractionFeasibility: {} as any,
      scores: { assetQualityScore: 50, vehicleDistressScore: 60, extractionFeasibilityScore: 70, rollupOpportunityIndex: 65 },
      contacts: [],
      crm: { stage: "new", priority: "medium", notes: [], activities: [] },
    };

    const merged = applyCrmOverlay([mockApiTarget]);
    expect(merged[0].contacts.length).toBe(1);
    expect(merged[0].contacts[0].name).toBe("Marcus Vance");
    expect(merged[0].crm.activities.length).toBe(1);
  });
});
