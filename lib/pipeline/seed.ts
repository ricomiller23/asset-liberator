import type { TargetCompany } from "../types";
import type { Candidate, CandidateClass, ControlStructure, Signal, SignalCode } from "./types";

/**
 * Adapts the hand-curated TargetCompany seed records into pipeline Candidates so the
 * original 18 are scored by the same model as anything ingested from EDGAR.
 *
 * Nothing is dropped. Seed data is tagged `seed_unverified`: it conflicts with
 * BUILD_REPORT.md in several places and some records are internally inconsistent,
 * so those are surfaced as dataQualityFlags rather than silently trusted.
 */

export function normalizeCik(cik: string): string {
  return String(cik).replace(/^0+/, "") || "0";
}

function triggerHas(t: TargetCompany, re: RegExp): boolean {
  return t.vehicleDistress.secTriggers.some((s) => re.test(s));
}

export function seedSignals(t: TargetCompany): Signal[] {
  // The seed asserts these conditions hold as of retrieval, so date signals then (not at the last
  // filing date). Seeds fade via normal recency decay if they are never refreshed.
  const date = t.retrievedAt || "2026-10-09";
  const url = t.latestFilingUrl || t.secEdgarUrl;
  const out: Signal[] = [];
  const add = (code: SignalCode, detail: string, form = "seed") => out.push({ code, date, form, url, detail });
  const v = t.vehicleDistress;

  if (v.filingStatus === "delinquent_10k" || v.filingStatus === "suspended_15c211") add("delinquent_10k", "Seed: delinquent/suspended annual reporting");
  if (v.filingStatus === "delinquent_10q") add("delinquent_10q", "Seed: delinquent quarterly reporting");
  if (v.auditorStatus === "resigned_item401") add("item_401", "Seed: auditor resignation");
  if (v.auditorStatus === "adverse_opinion" || v.auditorStatus === "unpaid") add("going_concern", `Seed: auditor status ${v.auditorStatus}`);
  if (t.exchange === "EXPERT_MARKET" || t.exchange === "PINK_LIMITED" || t.exchange === "OTCID_BASIC") add("expert_market", `Seed: ${t.exchange}`);
  if (v.toxicDebtBalance >= 500_000) add("toxic_convertibles", `Seed: $${(v.toxicDebtBalance / 1e6).toFixed(1)}M toxic convertibles`);
  if (triggerHas(t, /form 15/i)) add("form_15", "Seed trigger: Form 15");
  if (triggerHas(t, /delist|item 3\.01/i)) add("item_301", "Seed trigger: delisting/deficiency");
  if (triggerHas(t, /accelerat/i)) add("item_204", "Seed trigger: acceleration");
  if (t.forcingEvent.type === "ch11_363_bid_deadline") add("item_103", "Seed: Chapter 11 / 363 process");
  if (t.forcingEvent.type === "ccaa_stay_expiry") add("cease_trade", "Seed: CCAA stay");
  return out;
}

export function seedControlStructure(t: TargetCompany): ControlStructure {
  const g3 = t.threeGates.gate3_controlPoint;
  const name = g3.seniorLenderName || t.extractionFeasibility.seniorSecuredHolder || "";
  if (/syndicate|agent/i.test(name)) return "agent_syndicate";
  if (g3.securedCreditorCount <= 0) return "unknown";
  if (g3.securedCreditorCount === 1) return "single_holder";
  if (g3.securedCreditorCount <= 3) return "few_funds";
  return "fragmented";
}

export function seedClass(t: TargetCompany): CandidateClass {
  if (t.forcingEvent.type === "ch11_363_bid_deadline") return "bankruptcy_sale";
  if (t.exchange === "TSXV" || t.vertical === "cross_border_canada" || t.forcingEvent.type === "ccaa_stay_expiry") return "cross_border";
  return "distressed_carveout";
}

export function seedQualityFlags(t: TargetCompany): string[] {
  const flags = ["seed_unverified: not machine-checked against EDGAR"];
  if (t.vertical === "pre_revenue_ip" && t.asset.annualRevenue > 0) {
    flags.push(`vertical_revenue_mismatch: tagged pre_revenue_ip but carries $${(t.asset.annualRevenue / 1e6).toFixed(1)}M revenue`);
  }
  if (t.tier === "disqualified" && t.asset.annualRevenue > 0 && t.vehicleDistress.filingStatus === "current") {
    flags.push("disqualified_current_filer: retained; no distress or divestiture filings, so it scores low until EDGAR signals attach");
  }
  const ucc = t.extractionFeasibility.uccSearchNumber;
  if (ucc && /^[A-Z]{2}-\d{4}-\d+$/.test(ucc)) {
    flags.push(`ucc_reference_unverifiable: ${ucc} matches an internal pattern, not a state search receipt`);
  }
  if (t.asset.ebitda === 0 && t.asset.annualRevenue > 0) flags.push("zero_ebitda_on_revenue");
  return flags;
}

export function seedToCandidate(t: TargetCompany): Candidate {
  const clocks = t.forcingEvent?.deadlineDate
    ? [
        {
          kind: "seed_recorded" as const,
          label: t.forcingEvent.description || t.forcingEvent.type,
          deadline: t.forcingEvent.deadlineDate,
          basis: "Recorded in seed data; not independently verified",
        },
      ]
    : [];

  return {
    id: `seed-${t.id}`,
    cik: normalizeCik(t.cik),
    ticker: t.ticker,
    name: t.name,
    exchange: t.exchange,
    class: seedClass(t),
    source: "seed",
    provenance: "seed_unverified",
    signals: seedSignals(t),
    separable: {
      entities: t.asset.subsidiaryName ? [t.asset.subsidiaryName] : [],
      ex21Count: t.threeGates.gate2_separableValue.ex21Confirmed ? 1 : 0,
      evidenceUrl: t.threeGates.gate2_separableValue.sourceUrl,
      subsidiaryRevenue: t.asset.annualRevenue,
      subsidiaryEbitda: t.asset.ebitda,
      hasIp: t.asset.patentsCount > 0,
    },
    control: {
      structure: seedControlStructure(t),
      securedHolders: t.threeGates.gate3_controlPoint.securedCreditorCount || null,
      seniorLender: t.threeGates.gate3_controlPoint.seniorLenderName || t.extractionFeasibility.seniorSecuredHolder,
      seniorDebt: t.extractionFeasibility.seniorSecuredDebtAmount,
    },
    clocks,
    firstSeen: t.retrievedAt || "2026-10-09",
    lastUpdated: t.retrievedAt || "2026-10-09",
    seedTargetId: t.id,
    seedTier: t.tier,
    dataQualityFlags: seedQualityFlags(t),
  };
}
