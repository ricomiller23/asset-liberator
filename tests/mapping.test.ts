import { describe, it, expect } from "vitest";
import { z } from "zod";
import { candidateToTargetCompany, mapExchange } from "../lib/pipeline/adapter";
import type { Candidate } from "../lib/pipeline/types";

// Comprehensive Zod schema validating TargetCompany contract
export const TargetCompanySchema = z.object({
  id: z.string().min(1),
  ticker: z.string().min(1),
  name: z.string().min(1),
  cik: z.string(),
  exchange: z.enum([
    "NASDAQ",
    "NYSE_AMERICAN",
    "OTCQX",
    "OTCQB",
    "PINK_CURRENT",
    "PINK_LIMITED",
    "OTCID_BASIC",
    "EXPERT_MARKET",
    "TSXV",
    "TSX",
    "CSE",
    "NEO",
    "ASX",
  ]),
  sector: z.string(),
  industry: z.string(),
  headquarters: z.string(),
  marketCap: z.number(),
  stockPrice: z.number(),
  sharesOutstanding: z.number(),
  authorizedShares: z.number(),
  tier: z.enum(["verified", "screened", "radar", "disqualified"]),
  vertical: z.enum([
    "b2b_software",
    "specialty_manufacturing",
    "solar_energy",
    "pre_revenue_ip",
    "cross_border_canada",
    "cross_border_australia",
    "unthemed",
  ]),
  threeGates: z.object({
    gate1_parentDistress: z.object({
      passed: z.boolean(),
      citation: z.string(),
      sourceUrl: z.string(),
      retrievedAt: z.string(),
    }),
    gate2_separableValue: z.object({
      passed: z.boolean(),
      legalEntityName: z.string(),
      ex21Confirmed: z.boolean(),
      segmentRevenue: z.number(),
      segmentOperatingIncome: z.number(),
      citation: z.string(),
      sourceUrl: z.string(),
      retrievedAt: z.string(),
    }),
    gate3_controlPoint: z.object({
      passed: z.boolean(),
      securedCreditorCount: z.number(),
      seniorLenderName: z.string(),
      uccJurisdiction: z.string(),
      uccFilingNumber: z.string(),
      buyoutCost: z.number(),
      citation: z.string(),
      sourceUrl: z.string(),
      retrievedAt: z.string(),
    }),
    overallGate: z.enum(["passed_all_3", "partial_screened", "failed_disqualified"]),
  }),
  forcingEvent: z.object({
    type: z.enum([
      "loan_maturity",
      "forbearance_expiry",
      "nasdaq_deficiency_180d",
      "nt_deadline",
      "ch11_363_bid_deadline",
      "ccaa_stay_expiry",
      "ccaa_sisp_bid_deadline",
    ]),
    description: z.string(),
    deadlineDate: z.string(),
    daysRemaining: z.number(),
    leadTimeWindow: z.enum(["inside_90d_active", "outside_90d_radar"]),
    sourceUrl: z.string(),
    retrievedAt: z.string(),
  }),
  segmentMismatch: z.object({
    parentConsolidatedLoss: z.number(),
    subOperatingIncome: z.number(),
    spreadDelta: z.number(),
    ex21Subsidiary: z.string(),
    sourceFiling: z.string(),
    sourceUrl: z.string(),
    retrievedAt: z.string(),
  }),
  otcMarketsUrl: z.string(),
  secEdgarUrl: z.string(),
  latestFilingUrl: z.string(),
  latestFilingType: z.string(),
  latestFilingDate: z.string(),
  dataProvenance: z.enum(["sec_sourced", "ucc_filed", "court_docket", "analyst_estimate"]),
  asset: z.object({
    subsidiaryName: z.string(),
    businessSummary: z.string(),
    annualRevenue: z.number(),
    grossMarginPct: z.number(),
    ebitda: z.number(),
    employees: z.number(),
    facilities: z.string(),
    patentsCount: z.number(),
    keyClients: z.array(z.string()),
    ipDetails: z.string(),
    commercialReadiness: z.enum([
      "revenue_generating",
      "commercial_contracts",
      "fda_cleared",
      "patented_tech",
      "pre_clinical_r_and_d",
    ]),
    revenueSourceReceipt: z.string().optional(),
    revenueSourceUrl: z.string().optional(),
  }),
  vehicleDistress: z.object({
    statusSummary: z.string(),
    filingStatus: z.enum(["current", "delinquent_10k", "delinquent_10q", "suspended_15c211"]),
    auditorStatus: z.enum(["active", "resigned_item401", "unpaid", "adverse_opinion"]),
    lastAuditorName: z.string(),
    lastAuditorCity: z.string(),
    lastFilingDate: z.string(),
    secTriggers: z.array(z.string()),
    toxicDebtBalance: z.number(),
    toxicLenders: z.array(z.string()),
    convertibleDiscountPct: z.number(),
    defaultInterestRatePct: z.number(),
  }),
  extractionFeasibility: z.object({
    recommendedPlaybook: z.enum([
      "article_9_foreclosure",
      "section_363_sale",
      "abc_receivership",
      "consensual_carveout",
    ]),
    seniorSecuredDebtAmount: z.number(),
    seniorSecuredHolder: z.string(),
    uccLienJurisdiction: z.string(),
    uccLienStatus: z.string(),
    estimatedBuyoutDiscountPct: z.number(),
    estimatedAcquisitionCost: z.number(),
    cleanShellFit: z.enum(["exceptional", "high", "moderate", "low", "unfit"]),
    rationale: z.string(),
  }),
  scores: z.object({
    assetQualityScore: z.number().min(0).max(100),
    vehicleDistressScore: z.number().min(0).max(100),
    extractionFeasibilityScore: z.number().min(0).max(100),
    rollupOpportunityIndex: z.number().min(0).max(100),
  }),
  contacts: z.array(z.any()),
  crm: z.object({
    stage: z.enum([
      "new",
      "outreach_sent",
      "in_dialogue",
      "nda_signed",
      "diligence",
      "term_sheet",
      "foreclosure_pending",
      "closed",
      "passed",
    ]),
    priority: z.enum(["critical", "high", "medium", "low"]),
    notes: z.array(z.any()),
    activities: z.array(z.any()),
  }),
});

describe("Candidate to TargetCompany Mapping & Zod Validation Suite", () => {
  it("maps candidate to a valid TargetCompany satisfying the Zod schema", () => {
    const candidate: Candidate = {
      id: "edgar-123456",
      cik: "123456",
      ticker: "ABCD",
      name: "Alpha Beta Corp",
      exchange: "NASDAQ",
      sic: "3674",
      incState: "DE",
      class: "distressed_carveout",
      source: "edgar",
      provenance: "edgar_derived",
      signals: [
        {
          code: "item_204",
          date: "2026-09-15",
          form: "8-K",
          url: "https://www.sec.gov/Archives/edgar/data/123456/sample.htm",
          detail: "Item 2.04: acceleration notice received",
        },
      ],
      separable: {
        entities: ["Semiconductor Sub LLC"],
        ex21Count: 1,
        hasIp: true,
        subsidiaryRevenue: 15000000,
        subsidiaryEbitda: 1200000,
        consolidatedRevenue: 15000000,
        consolidatedEquity: -2500000,
      },
      control: {
        structure: "unknown",
        securedHolders: null,
      },
      clocks: [],
      firstSeen: "2026-09-15",
      lastUpdated: "2026-09-15",
      dataQualityFlags: [],
    };

    const target = candidateToTargetCompany(candidate);
    const parsed = TargetCompanySchema.safeParse(target);

    expect(parsed.success).toBe(true);
    expect(target.id).toBe("edgar-123456");
    expect(target.ticker).toBe("ABCD");
    expect(target.marketCap).toBe(0);
    expect(target.stockPrice).toBe(0);
    expect(target.contacts).toEqual([]);
    expect(target.extractionFeasibility.seniorSecuredHolder).toBe(
      "Unidentified: requires UCC / credit agreement review"
    );
    expect(target.asset.revenueSourceReceipt).toBe("Consolidated, not subsidiary-level");
    expect(target.dataProvenance).toBe("sec_sourced");
  });

  it("maps exchanges accurately", () => {
    expect(mapExchange("Nasdaq")).toBe("NASDAQ");
    expect(mapExchange("NYSE American")).toBe("NYSE_AMERICAN");
    expect(mapExchange("AMEX")).toBe("NYSE_AMERICAN");
    expect(mapExchange("TSXV")).toBe("TSXV");
    expect(mapExchange("TSX")).toBe("TSX");
    expect(mapExchange("CSE")).toBe("CSE");
    expect(mapExchange("NEO")).toBe("NEO");
    expect(mapExchange("ASX")).toBe("ASX");
    expect(mapExchange("OTC", false)).toBe("PINK_CURRENT");
    expect(mapExchange("OTC", true)).toBe("PINK_LIMITED");
  });
});
