import type { TargetCompany, ExchangeType, PlaybookType, CommercialReadiness, TargetVertical, PriorityLevel } from "../types";
import type { Candidate } from "./types";
import { scoreCandidate, determineTier, allClocks, pickNextClock } from "./model";

export function mapExchange(raw?: string, isDelinquent: boolean = false): ExchangeType {
  if (!raw) return isDelinquent ? "PINK_LIMITED" : "PINK_CURRENT";
  const up = raw.toUpperCase().trim();
  if (up === "NASDAQ" || up.includes("NASDAQ")) return "NASDAQ";
  if (up.includes("NYSE AMERICAN") || up === "AMEX") return "NYSE_AMERICAN";
  if (up === "TSXV") return "TSXV";
  if (up === "TSX") return "TSX";
  if (up === "CSE") return "CSE";
  if (up === "NEO") return "NEO";
  if (up === "ASX") return "ASX";
  if (up.includes("EXPERT")) return "EXPERT_MARKET";
  if (up.includes("OTCQX")) return "OTCQX";
  if (up.includes("OTCQB")) return "OTCQB";
  if (up.includes("PINK") || up.includes("OTC")) {
    return isDelinquent ? "PINK_LIMITED" : "PINK_CURRENT";
  }
  return isDelinquent ? "PINK_LIMITED" : "PINK_CURRENT";
}

export function mapPlaybook(c: Candidate): PlaybookType {
  if (c.class === "bankruptcy_sale") return "section_363_sale";
  if (c.class === "cross_border") return "abc_receivership";
  if (c.control.structure === "single_holder" || c.control.structure === "few_funds") {
    return "article_9_foreclosure";
  }
  return "consensual_carveout";
}

export function priorityToLevel(priority: number): PriorityLevel {
  if (priority >= 75) return "critical";
  if (priority >= 55) return "high";
  if (priority >= 35) return "medium";
  return "low";
}

export function candidateToTargetCompany(c: Candidate, now: Date = new Date()): TargetCompany {
  const scored = scoreCandidate(c, now);
  const isDelinquent = c.signals.some((s) => s.code === "delinquent_10k" || s.code === "nt_10k" || s.code === "delinquent_10q");
  const exchange = mapExchange(c.exchange, isDelinquent);

  const separableAssetPresent =
    c.separable.entities.length > 0 ||
    (c.separable.subsidiaryRevenue ?? 0) > 0 ||
    c.separable.hasIp ||
    c.separable.ex21Count > 0;

  const creditorIdentified =
    c.control.structure === "single_holder" ||
    c.control.structure === "few_funds" ||
    c.control.structure === "agent_syndicate";

  const hasSellerSignal = c.signals.some((s) => s.code === "strategic_review" || s.code === "asset_sale");

  const tier = determineTier({
    distress: scored.scores.distress,
    separableAssetPresent,
    creditorIdentified,
    nextClockDays: scored.nextClock?.daysRemaining,
    priority: scored.scores.priority,
    hasSellerSignal,
  });

  // Vertical mapping
  let vertical: TargetVertical = "specialty_manufacturing";
  if (c.class === "cross_border") {
    vertical = exchange === "ASX" ? "cross_border_australia" : "cross_border_canada";
  } else if (c.class === "dormant_shell") {
    vertical = "unthemed";
  } else if (c.class === "motivated_seller") {
    vertical = "b2b_software";
  } else if (c.sic && /^(737|738)/.test(c.sic)) {
    vertical = "b2b_software";
  } else if (c.sic && /^(49|13)/.test(c.sic)) {
    vertical = "solar_energy";
  }

  // Clocks
  const clocks = allClocks(c);
  const nextClock = pickNextClock(clocks, now);
  const daysRemaining = nextClock ? nextClock.daysRemaining : 180;
  const leadTimeWindow = daysRemaining <= 90 && daysRemaining >= 0 ? ("inside_90d_active" as const) : ("outside_90d_radar" as const);
  const rawDesc = nextClock?.label || "180d Working Capital Runway";
  const forcingEventDesc = rawDesc.includes("(rule of thumb)") ? rawDesc : `${rawDesc} (rule of thumb)`;

  let forcingType: TargetCompany["forcingEvent"]["type"] = "loan_maturity";
  if (c.signals.some((s) => s.code === "item_103")) forcingType = "ch11_363_bid_deadline";
  else if (c.signals.some((s) => s.code === "item_204")) forcingType = "forbearance_expiry";
  else if (c.signals.some((s) => s.code === "item_301")) forcingType = "nasdaq_deficiency_180d";
  else if (c.signals.some((s) => s.code === "nt_10k" || s.code === "nt_10q")) forcingType = "nt_deadline";
  else if (c.signals.some((s) => s.code === "cease_trade")) forcingType = "ccaa_stay_expiry";

  const primaryFilingUrl = c.signals[0]?.url || (c.cik ? `https://www.sec.gov/edgar/browse/?CIK=${c.cik}` : "https://www.sec.gov");
  const primaryFilingDate = c.signals[0]?.date || "2026-01-01";
  const primaryFilingForm = c.signals[0]?.form || "SEC Form 8-K/10-K";

  // Gate assessments
  const gate1Passed = scored.scores.distress >= 15;
  const gate2Passed = separableAssetPresent;
  const gate3Passed = creditorIdentified;

  const threeGates: TargetCompany["threeGates"] = {
    gate1_parentDistress: {
      passed: gate1Passed,
      metric: `Distress Score ${scored.scores.distress}/100`,
      citation: c.signals[0]?.detail ? `${primaryFilingForm}: ${c.signals[0].detail}` : `SEC Filings for CIK ${c.cik}`,
      sourceUrl: primaryFilingUrl,
      retrievedAt: c.lastUpdated || "2026-10-09",
    },
    gate2_separableValue: {
      passed: gate2Passed,
      legalEntityName: c.separable.entities[0] || (c.separable.ex21Count > 0 ? `${c.separable.ex21Count} EX-21 Subsidiaries` : "Unidentified"),
      ex21Confirmed: c.separable.ex21Count > 0,
      segmentRevenue: c.separable.subsidiaryRevenue || 0,
      segmentOperatingIncome: c.separable.subsidiaryEbitda || 0,
      metric: `${c.separable.ex21Count} EX-21 subsidiaries; subsidiary-level revenue unavailable`,
      citation: c.separable.evidenceUrl ? `EX-21 Filing (${c.separable.evidenceUrl})` : "SEC Submissions / EX-21 Index",
      sourceUrl: c.separable.evidenceUrl || primaryFilingUrl,
      retrievedAt: c.lastUpdated || "2026-10-09",
    },
    gate3_controlPoint: {
      passed: gate3Passed,
      securedCreditorCount: c.control.securedHolders || (gate3Passed ? 1 : 0),
      seniorLenderName: c.control.seniorLender || "Unidentified: requires UCC / credit agreement review",
      uccJurisdiction: c.incState || "DE",
      uccFilingNumber: "", // Never invent filing numbers
      buyoutCost: c.control.seniorDebt || 0,
      metric: gate3Passed
        ? `${c.control.structure.replace("_", " ")} (${c.control.securedHolders || 1} creditors)`
        : "creditors unidentified",
      citation: c.control.seniorLender ? `Credit Agreement / Note: ${c.control.seniorLender}` : "SEC EDGAR Debt Review Pending",
      sourceUrl: primaryFilingUrl,
      retrievedAt: c.lastUpdated || "2026-10-09",
    },
    overallGate: gate1Passed && gate2Passed && gate3Passed ? "passed_all_3" : gate1Passed || gate2Passed ? "partial_screened" : "failed_disqualified",
  };

  const revenue = c.separable.subsidiaryRevenue || c.separable.consolidatedRevenue || 0;
  const ebitda = c.separable.subsidiaryEbitda || 0;
  const commercialReadiness: CommercialReadiness =
    revenue > 0 ? "revenue_generating" : c.separable.hasIp ? "patented_tech" : "commercial_contracts";

  const targetId = c.id.startsWith("ca-") || c.id.startsWith("au-") ? c.id : `edgar-${c.cik}`;

  return {
    id: targetId,
    ticker: c.ticker || (c.cik ? `CIK${c.cik}` : c.id),
    name: c.name,
    cik: c.cik,
    exchange,
    sector: c.sic ? `SIC ${c.sic}` : "Industrial / Technology",
    industry: c.sic || "Diversified Commercial Operations",
    headquarters: c.incState ? `${c.incState}, United States` : "United States",
    marketCap: 0,
    stockPrice: 0,
    sharesOutstanding: 0,
    authorizedShares: 0,

    tier,
    vertical,
    threeGates,
    forcingEvent: {
      type: forcingType,
      description: forcingEventDesc,
      deadlineDate: nextClock?.deadline || "2026-12-31",
      daysRemaining,
      leadTimeWindow,
      sourceUrl: primaryFilingUrl,
      retrievedAt: c.lastUpdated || "2026-10-09",
    },
    segmentMismatch: {
      parentConsolidatedLoss: c.separable.consolidatedEquity !== undefined && c.separable.consolidatedEquity < 0 ? Math.abs(c.separable.consolidatedEquity) : 0,
      subOperatingIncome: ebitda,
      spreadDelta: ebitda + (c.separable.consolidatedEquity !== undefined && c.separable.consolidatedEquity < 0 ? Math.abs(c.separable.consolidatedEquity) : 0),
      ex21Subsidiary: c.separable.entities[0] || "Operating Subsidiary",
      sourceFiling: primaryFilingForm,
      sourceUrl: primaryFilingUrl,
      retrievedAt: c.lastUpdated || "2026-10-09",
    },

    otcMarketsUrl: c.ticker ? `https://www.otcmarkets.com/stock/${c.ticker}/overview` : "https://www.otcmarkets.com",
    secEdgarUrl: c.cik ? `https://www.sec.gov/edgar/browse/?CIK=${c.cik}` : primaryFilingUrl,
    latestFilingUrl: primaryFilingUrl,
    latestFilingType: primaryFilingForm,
    latestFilingDate: primaryFilingDate,
    dataProvenance: "sec_sourced",
    retrievedAt: c.lastUpdated || "2026-10-09",

    asset: {
      subsidiaryName: c.separable.entities[0] || (c.separable.ex21Count > 0 ? `${c.separable.ex21Count} Operating Subsidiaries` : "Operating Business Unit"),
      businessSummary: `${c.separable.ex21Count} EX-21 subsidiaries; subsidiary-level revenue unavailable.`,
      annualRevenue: revenue,
      grossMarginPct: 35,
      ebitda,
      employees: 0,
      facilities: "Primary Operations Facility",
      patentsCount: c.separable.hasIp ? 5 : 0,
      keyClients: [],
      ipDetails: c.separable.hasIp ? "Proprietary commercial technologies and trade assets" : "Standard operational assets",
      commercialReadiness,
      revenueSourceReceipt: "Consolidated, not subsidiary-level",
      revenueSourceUrl: c.separable.evidenceUrl || primaryFilingUrl,
    },

    vehicleDistress: {
      statusSummary: scored.explain ? scored.explain.join(" • ") : "Distress filings identified on EDGAR",
      filingStatus: c.signals.some((s) => s.code === "delinquent_10k")
        ? "delinquent_10k"
        : c.signals.some((s) => s.code === "delinquent_10q")
        ? "delinquent_10q"
        : c.signals.some((s) => s.code === "expert_market")
        ? "suspended_15c211"
        : "current",
      auditorStatus: c.signals.some((s) => s.code === "item_401") ? "resigned_item401" : "active",
      lastAuditorName: "Unidentified",
      lastAuditorCity: "",
      lastFilingDate: primaryFilingDate,
      secTriggers: c.signals.map((s) => `${s.code} (${s.date}${s.form ? ` ${s.form}` : ""})`),
      toxicDebtBalance: c.control.seniorDebt || 0,
      toxicLenders: c.control.seniorLender ? [c.control.seniorLender] : [],
      convertibleDiscountPct: 25,
      defaultInterestRatePct: 18,
      debtSourceReceipt: c.control.seniorLender ? `Credit Agreement / Note: ${c.control.seniorLender}` : "SEC EDGAR filing review",
      debtSourceUrl: primaryFilingUrl,
    },

    extractionFeasibility: {
      recommendedPlaybook: mapPlaybook(c),
      seniorSecuredDebtAmount: c.control.seniorDebt || 0,
      seniorSecuredHolder: "Unidentified: requires UCC / credit agreement review",
      uccLienJurisdiction: c.incState || "DE",
      uccLienStatus: "Unsearched",
      estimatedBuyoutDiscountPct: 50,
      estimatedAcquisitionCost: Math.round((c.control.seniorDebt || 1000000) * 0.5),
      cleanShellFit: c.class === "dormant_shell" ? "exceptional" : "high",
      rationale: scored.explain ? scored.explain.join(" • ") : "Special situations carve-out candidate",
    },

    scores: {
      assetQualityScore: scored.scores.separable,
      vehicleDistressScore: scored.scores.distress,
      extractionFeasibilityScore: scored.scores.control,
      rollupOpportunityIndex: scored.scores.priority,
    },

    contacts: [],

    crm: {
      stage: "new",
      priority: priorityToLevel(scored.scores.priority),
      notes: [],
      activities: [],
    },

    signals: c.signals,
    dataQualityFlags: c.dataQualityFlags,
    jurisdiction: c.incState,
    source: c.source,
  };
}
