/**
 * Discovery pipeline types.
 *
 * A Candidate is anything that might be a carve-out / shell / asset-sale target.
 * It is deliberately lighter than TargetCompany (the hand-curated seed record):
 * ingested candidates only carry what can be machine-derived from EDGAR.
 */

export type CandidateClass =
  | "distressed_carveout" // broken parent, separable operating sub
  | "bankruptcy_sale" // Ch.11 / 363 process
  | "motivated_seller" // healthy-ish parent signalling a divestiture / strategic review
  | "dormant_shell" // clean listed vehicle, little or no operations
  | "cross_border"; // Canadian (CCAA/BIA/TSXV) and other foreign-incorporated issuers

export type SignalCode =
  | "going_concern"
  | "equity_deficit"
  | "nt_10k"
  | "nt_10q"
  | "delinquent_10k"
  | "delinquent_10q"
  | "item_103" // bankruptcy / receivership
  | "item_204" // acceleration of a direct financial obligation
  | "item_301" // delisting / listing-standard deficiency
  | "item_401" // auditor change
  | "item_402" // non-reliance on prior financials
  | "form_15" // deregistration / suspension of reporting
  | "form_25" // delisting
  | "expert_market" // Rule 15c2-11 demotion
  | "toxic_convertibles"
  | "strategic_review"
  | "asset_sale"
  | "cease_trade";

export interface Signal {
  code: SignalCode;
  /** YYYY-MM-DD filing / event date */
  date: string;
  form: string;
  accession?: string;
  url: string;
  detail?: string;
}

export type ClockKind = "seed_recorded" | "rule_of_thumb";

export interface Clock {
  kind: ClockKind;
  label: string;
  /** YYYY-MM-DD */
  deadline: string;
  basis: string;
}

export type ControlStructure = "single_holder" | "few_funds" | "agent_syndicate" | "fragmented" | "unknown";

export interface SeparableAsset {
  entities: string[];
  ex21Count: number;
  evidenceUrl?: string;
  subsidiaryRevenue?: number;
  subsidiaryEbitda?: number;
  hasIp: boolean;
  consolidatedRevenue?: number;
  consolidatedEquity?: number;
}

export interface ControlPoint {
  structure: ControlStructure;
  securedHolders: number | null;
  seniorLender?: string;
  seniorDebt?: number;
}

export type Provenance = "edgar_derived" | "seed_unverified";

export interface Candidate {
  id: string;
  /** zero-stripped CIK, string */
  cik: string;
  ticker?: string;
  name: string;
  exchange?: string;
  sic?: string;
  incState?: string;
  class: CandidateClass;
  source: "seed" | "edgar";
  provenance: Provenance;
  signals: Signal[];
  separable: SeparableAsset;
  control: ControlPoint;
  clocks: Clock[];
  firstSeen: string;
  lastUpdated: string;
  seedTargetId?: string;
  seedTier?: string;
  dataQualityFlags: string[];
}

export type Bucket = "actionable" | "watch" | "low";

export interface ScoredCandidate extends Candidate {
  scores: {
    distress: number;
    separable: number;
    control: number;
    timing: number;
    priority: number;
  };
  mustHaves: {
    distressSignal: boolean;
    separableAsset: boolean;
    identifiableCreditor: boolean;
  };
  bucket: Bucket;
  nextClock?: Clock & { daysRemaining: number };
  explain: string[];
}

export interface CandidateStoreFile {
  generatedAt: string | null;
  windowDays?: number;
  candidates: Candidate[];
}
