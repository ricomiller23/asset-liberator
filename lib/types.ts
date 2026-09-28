export type ExchangeType = "NASDAQ" | "NYSE_AMERICAN" | "OTCQX" | "OTCQB" | "PINK_CURRENT" | "PINK_LIMITED" | "OTCID_BASIC" | "EXPERT_MARKET";
export type FilingStatus = "current" | "delinquent_10k" | "delinquent_10q" | "suspended_15c211";
export type AuditorStatus = "active" | "resigned_item401" | "unpaid" | "adverse_opinion";
export type CommercialReadiness = "revenue_generating" | "commercial_contracts" | "fda_cleared" | "patented_tech";
export type PlaybookType = "article_9_foreclosure" | "section_363_sale" | "abc_receivership" | "consensual_carveout";
export type CrmStage = "new" | "outreach_sent" | "in_dialogue" | "nda_signed" | "diligence" | "term_sheet" | "foreclosure_pending" | "closed" | "passed";
export type PriorityLevel = "critical" | "high" | "medium" | "low";

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
  
  // Verified Primary Source & Regulatory Links
  otcMarketsUrl: string;
  secEdgarUrl: string;
  latestFilingUrl: string;
  latestFilingType: string;
  latestFilingDate: string;
  
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
    cleanShellFit: "high" | "medium" | "exceptional";
    rationale: string;
  };

  // Tri-Factor Scores
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
}

export interface SearchFilters {
  query?: string;
  sector?: string;
  playbook?: PlaybookType | "all";
  exchange?: ExchangeType | "all";
  filingStatus?: FilingStatus | "all";
  minRevenue?: number;
  maxSeniorDebt?: number;
  minRoi?: number;
  crmStage?: CrmStage | "all";
  sortBy?: "roi" | "revenue" | "distress" | "debt_asc" | "market_cap";
}
