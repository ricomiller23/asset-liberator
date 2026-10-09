import type { Signal } from "./pipeline/types";
export type RevenueTier = "all" | "commercial" | "pre_revenue_ip";
export type ExchangeType = "NASDAQ" | "NYSE_AMERICAN" | "OTCQX" | "OTCQB" | "PINK_CURRENT" | "PINK_LIMITED" | "OTCID_BASIC" | "EXPERT_MARKET" | "TSXV" | "TSX" | "CSE" | "NEO" | "ASX";
export type FilingStatus = "current" | "delinquent_10k" | "delinquent_10q" | "suspended_15c211";
export type AuditorStatus = "active" | "resigned_item401" | "unpaid" | "adverse_opinion";
export type CommercialReadiness = "revenue_generating" | "commercial_contracts" | "fda_cleared" | "patented_tech" | "pre_clinical_r_and_d";
export type PlaybookType = "article_9_foreclosure" | "section_363_sale" | "abc_receivership" | "consensual_carveout";
export type CrmStage = "new" | "outreach_sent" | "in_dialogue" | "nda_signed" | "diligence" | "term_sheet" | "foreclosure_pending" | "closed" | "passed";
export type PriorityLevel = "critical" | "high" | "medium" | "low";

export type TargetTier = "verified" | "screened" | "radar" | "disqualified";
export type TargetVertical = "b2b_software" | "specialty_manufacturing" | "solar_energy" | "pre_revenue_ip" | "cross_border_canada" | "cross_border_australia" | "unthemed";

export interface GateAssessment {
  passed: boolean;
  metric?: string;
  citation: string;
  sourceUrl: string;
  retrievedAt: string;
}

export interface ThreeHardGates {
  gate1_parentDistress: GateAssessment;
  gate2_separableValue: GateAssessment & {
    legalEntityName: string;
    ex21Confirmed: boolean;
    segmentRevenue: number;
    segmentOperatingIncome: number;
  };
  gate3_controlPoint: GateAssessment & {
    securedCreditorCount: number;
    seniorLenderName: string;
    uccJurisdiction: string;
    uccFilingNumber: string;
    buyoutCost: number;
  };
  overallGate: "passed_all_3" | "partial_screened" | "failed_disqualified";
}

export interface ForcingEvent {
  type: "loan_maturity" | "forbearance_expiry" | "nasdaq_deficiency_180d" | "nt_deadline" | "ch11_363_bid_deadline" | "ccaa_stay_expiry" | "ccaa_sisp_bid_deadline";
  description: string;
  deadlineDate: string;
  daysRemaining: number;
  leadTimeWindow: "inside_90d_active" | "outside_90d_radar";
  sourceUrl: string;
  retrievedAt: string;
}

export interface SegmentMismatch {
  parentConsolidatedLoss: number;
  subOperatingIncome: number;
  spreadDelta: number;
  ex21Subsidiary: string;
  sourceFiling: string;
  sourceUrl: string;
  retrievedAt: string;
}

export interface EdgarEventFeedItem {
  id: string;
  ticker: string;
  companyName: string;
  itemType: "item_204" | "item_301" | "item_401" | "item_402" | "item_103" | "nt_10k" | "nt_10q" | "ccaa_notice";
  itemCode: string;
  filingDate: string;
  filingUrl: string;
  headline: string;
  accelerationOrDeficiencyDetails: string;
  leadTimeMonths: number;
  separableAssetIdentified: string;
  primaryLender: string;
  sourceUrl: string;
  retrievedAt: string;
}

export interface LenderPortfolioGroup {
  lenderId: string;
  lenderName: string;
  principal: string;
  borrowerCount: number;
  totalSecuredDebt: number;
  borrowerTickers: string[];
  uccFilingStates: string[];
  playbookFit: PlaybookType;
  negotiationStrategy: string;
}

export interface ExecutiveContact {
  id: string;
  name: string;
  title: string;
  entity: "Operating Subsidiary" | "Public Parent" | "Senior Creditor" | "Legal Counsel";
  email: string;
  phone: string;
  linkedIn?: string;
  address?: string;
  roleSummary: string;
  receptivityScore: "very_high" | "high" | "moderate";
}

export interface CrmNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface CrmActivity {
  id: string;
  date: string;
  type: "call" | "email" | "meeting" | "filing_alert" | "term_sheet";
  summary: string;
}

export interface TargetCompany {
  id: string;
  ticker: string;
  name: string;
  cik: string;
  exchange: ExchangeType;
  sector: string;
  industry: string;
  headquarters: string;
  marketCap: number;
  stockPrice: number;
  sharesOutstanding: number;
  authorizedShares: number;

  // New Classification & Funnel Gates
  tier: TargetTier;
  vertical: TargetVertical;
  threeGates: ThreeHardGates;
  forcingEvent: ForcingEvent;
  segmentMismatch: SegmentMismatch;
  disqualificationReason?: string;
  
  // Verified Primary Source & Regulatory Links
  otcMarketsUrl: string;
  secEdgarUrl: string;
  latestFilingUrl: string;
  latestFilingType: string;
  latestFilingDate: string;
  baseline10KFilingUrl?: string;
  baseline10KFilingType?: string;
  baseline10KFilingDate?: string;
  previousFilingUrl?: string;
  previousFilingType?: string;
  previousFilingDate?: string;
  secVerifiedDate?: string;
  secVerifiedStatus?: string;
  dataProvenance?: "sec_sourced" | "ucc_filed" | "court_docket" | "analyst_estimate";
  priceSource?: string;
  retrievedAt?: string;
  
  // The Asset (The Gold)
  asset: {
    subsidiaryName: string;
    businessSummary: string;
    annualRevenue: number;
    grossMarginPct: number;
    ebitda: number;
    employees: number;
    facilities: string;
    patentsCount: number;
    keyClients: string[];
    ipDetails: string;
    commercialReadiness: CommercialReadiness;
    revenueSourceReceipt?: string;
    revenueSourceUrl?: string;
  };

  // The Vehicle Distress (The Grave)
  vehicleDistress: {
    statusSummary: string;
    filingStatus: FilingStatus;
    auditorStatus: AuditorStatus;
    lastAuditorName: string;
    lastAuditorCity: string;
    lastFilingDate: string;
    secTriggers: string[];
    toxicDebtBalance: number;
    toxicLenders: string[];
    convertibleDiscountPct: number;
    defaultInterestRatePct: number;
    debtSourceReceipt?: string;
    debtSourceUrl?: string;
  };

  // Extraction & Rollup Mechanics
  extractionFeasibility: {
    recommendedPlaybook: PlaybookType;
    seniorSecuredDebtAmount: number;
    seniorSecuredHolder: string;
    uccLienJurisdiction: string;
    uccLienStatus: string;
    estimatedBuyoutDiscountPct: number;
    estimatedAcquisitionCost: number;
    cleanShellFit: "exceptional" | "high" | "moderate" | "low" | "unfit";
    rationale: string;
    provenanceNote?: string;
    uccSearchNumber?: string;
    uccSourceUrl?: string;
  };

  // Tri-Factor Scores (Recalibrated Discriminative Spread 15-95)
  scores: {
    assetQualityScore: number;
    vehicleDistressScore: number;
    extractionFeasibilityScore: number;
    rollupOpportunityIndex: number;
  };

  // Management & Creditor Dossier
  contacts: ExecutiveContact[];

  // Built-in CRM Metadata
  crm: {
    stage: CrmStage;
    priority: PriorityLevel;
    notes: CrmNote[];
    activities: CrmActivity[];
    lastContactDate?: string;
    nextFollowUpDate?: string;
  };

  // Optional extended pipeline fields
  signals?: Signal[];
  dataQualityFlags?: string[];
  jurisdiction?: string;
  source?: string;
  foreignId?: string;
}

export interface SearchFilters {
  query?: string;
  sector?: string;
  playbook?: PlaybookType | "all";
  exchange?: ExchangeType | "all";
  filingStatus?: FilingStatus | "all";
  revenueTier?: RevenueTier;
  tier?: TargetTier | "all";
  vertical?: TargetVertical | "all";
  leadTime?: "inside_90d" | "outside_90d" | "all";
  minRevenue?: number;
  maxSeniorDebt?: number;
  minRoi?: number;
  crmStage?: CrmStage | "all";
  sortBy?: "roi" | "revenue" | "distress" | "debt_asc" | "market_cap" | "catalyst_asc";
}
