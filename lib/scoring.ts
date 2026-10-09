import { TargetCompany, ThreeHardGates } from "./types";

/**
 * RECALIBRATED DISCRIMINATIVE SCORING ENGINE
 * 
 * Replaces the flat 72-97 clustering with an authentic, wide-spread distribution (15 - 95).
 * Penalizes current filers, pre-revenue assets without commercial contracts, and fragmented creditor bases.
 * Rewards verifiable positive operating segment income, perfected 1st-lien control points, and imminent catalysts.
 */

export function computeAssetQualityScore(
  asset: TargetCompany["asset"], 
  threeGates?: TargetCompany["threeGates"]
): number {
  let score = 10; // True baseline

  // 1. Revenue scale
  if (asset.annualRevenue >= 50000000) {
    score += 35;
  } else if (asset.annualRevenue >= 20000000) {
    score += 28;
  } else if (asset.annualRevenue >= 5000000) {
    score += 20;
  } else if (asset.annualRevenue >= 1000000) {
    score += 12;
  } else if (asset.annualRevenue > 0) {
    score += 6;
  } else {
    // $0 Pre-Revenue Explorer or pure IP
    score += 2;
  }

  // 2. Operating margin & EBITDA contribution
  if (asset.ebitda > 5000000) {
    score += 25;
  } else if (asset.ebitda > 1000000) {
    score += 20;
  } else if (asset.ebitda > 0) {
    score += 14;
  } else if (asset.ebitda > -500000) {
    score += 4;
  } else {
    // Heavy cash burn
    score -= 10;
  }

  // 3. Gross margin health
  if (asset.grossMarginPct >= 50) {
    score += 15;
  } else if (asset.grossMarginPct >= 30) {
    score += 10;
  } else if (asset.grossMarginPct >= 15) {
    score += 5;
  }

  // 4. Commercial contracts & client validation
  if (asset.keyClients && asset.keyClients.length >= 3) {
    score += 10;
  } else if (asset.keyClients && asset.keyClients.length >= 1) {
    score += 5;
  }

  // 5. IP & Patents
  if (asset.patentsCount >= 15) {
    score += 8;
  } else if (asset.patentsCount >= 5) {
    score += 5;
  } else if (asset.patentsCount >= 1) {
    score += 2;
  }

  // Gate 2 separable entity check
  if (threeGates?.gate2_separableValue.passed) {
    score += 5;
  }

  return Math.min(100, Math.max(10, Math.round(score)));
}

export function computeVehicleDistressScore(
  vehicle: TargetCompany["vehicleDistress"],
  exchange?: TargetCompany["exchange"]
): number {
  let score = 10; // True baseline

  // 1. Filing distress & SEC status
  if (vehicle.filingStatus === "suspended_15c211") {
    score += 32;
  } else if (vehicle.filingStatus === "delinquent_10k") {
    score += 25;
  } else if (vehicle.filingStatus === "delinquent_10q") {
    score += 18;
  } else if (vehicle.filingStatus === "current") {
    // Current filers contradict broken shell thesis -> severe penalty
    score -= 15;
  }

  // 2. Exchange distress
  if (exchange === "EXPERT_MARKET") {
    score += 20;
  } else if (exchange === "PINK_LIMITED" || exchange === "OTCID_BASIC") {
    score += 14;
  } else if (exchange === "PINK_CURRENT") {
    score += 8;
  } else if (exchange === "NASDAQ" || exchange === "NYSE_AMERICAN") {
    // Still listed, but may have deficiency notice
    score += 5;
  }

  // 3. Auditor abandonment
  if (vehicle.auditorStatus === "resigned_item401") {
    score += 20;
  } else if (vehicle.auditorStatus === "unpaid" || vehicle.auditorStatus === "adverse_opinion") {
    score += 14;
  }

  // 4. Toxic convertible debt overhang
  if (vehicle.toxicDebtBalance >= 10000000) {
    score += 15;
  } else if (vehicle.toxicDebtBalance >= 2000000) {
    score += 10;
  } else if (vehicle.toxicDebtBalance >= 500000) {
    score += 5;
  }

  // 5. Multiple SEC triggers (Item 2.04, 3.01, 4.01, 15c2-11)
  if (vehicle.secTriggers && vehicle.secTriggers.length >= 3) {
    score += 15;
  } else if (vehicle.secTriggers && vehicle.secTriggers.length >= 1) {
    score += 6;
  }

  return Math.min(100, Math.max(10, Math.round(score)));
}

export function computeExtractionFeasibilityScore(
  extraction: TargetCompany["extractionFeasibility"],
  asset: TargetCompany["asset"],
  threeGates?: TargetCompany["threeGates"],
  forcingEvent?: TargetCompany["forcingEvent"]
): number {
  let score = 10; // True baseline

  // 1. Clean shell fit tiering
  if (extraction.cleanShellFit === "exceptional") {
    score += 30;
  } else if (extraction.cleanShellFit === "high") {
    score += 22;
  } else if (extraction.cleanShellFit === "moderate") {
    score += 14;
  } else if (extraction.cleanShellFit === "low") {
    score += 6;
  } else if (extraction.cleanShellFit === "unfit") {
    score -= 15;
  }

  // 2. Control Point (Gate 3) - Secured creditor concentration
  if (threeGates?.gate3_controlPoint) {
    const credCount = threeGates.gate3_controlPoint.securedCreditorCount;
    if (credCount === 1) {
      score += 25; // Single secured noteholder = clean negotiation
    } else if (credCount <= 2) {
      score += 18;
    } else if (credCount <= 3) {
      score += 10;
    } else {
      score -= 15; // Fragmented creditor syndicate
    }
  } else {
    // Default fallback
    score += 12;
  }

  // 3. Senior debt coverage relative to revenue
  if (asset.annualRevenue > 0) {
    const debtRatio = extraction.seniorSecuredDebtAmount / asset.annualRevenue;
    if (debtRatio < 0.20) {
      score += 20; // < $2M debt on $10M revenue
    } else if (debtRatio < 0.50) {
      score += 14;
    } else if (debtRatio < 1.0) {
      score += 7;
    } else {
      score -= 5;
    }
  }

  // 4. Buyout discount depth
  if (extraction.estimatedBuyoutDiscountPct >= 65) {
    score += 15;
  } else if (extraction.estimatedBuyoutDiscountPct >= 45) {
    score += 10;
  } else if (extraction.estimatedBuyoutDiscountPct >= 25) {
    score += 5;
  }

  // 5. Catalyst clock forcing date
  if (forcingEvent && forcingEvent.daysRemaining <= 90 && forcingEvent.daysRemaining > 0) {
    score += 10; // Urgent catalyst creates seller concession
  }

  return Math.min(100, Math.max(10, Math.round(score)));
}

export function computeRollupOpportunityIndex(
  aqs: number,
  vts: number,
  efs: number,
  isDisqualified: boolean = false
): number {
  if (isDisqualified) {
    // Current filers or disqualified targets cannot score above 30
    return Math.min(28, Math.round((aqs * 0.2) + (vts * 0.1)));
  }

  // Multi-factor weighted index:
  // Asset Quality: 40% (must have real cash generation or landmark IP)
  // Vehicle Distress: 35% (must be truly broken to justify foreclosure/363)
  // Extraction Feasibility: 25% (must have a single control point and workable legal playbook)
  const weighted = (aqs * 0.40) + (vts * 0.35) + (efs * 0.25);
  return Math.min(100, Math.max(12, Math.round(weighted)));
}

export function enrichTargetScores(target: TargetCompany): TargetCompany {
  const isDisqualified = target.tier === "disqualified" || target.vehicleDistress.filingStatus === "current";
  const aqs = computeAssetQualityScore(target.asset, target.threeGates);
  const vts = computeVehicleDistressScore(target.vehicleDistress, target.exchange);
  const efs = computeExtractionFeasibilityScore(
    target.extractionFeasibility,
    target.asset,
    target.threeGates,
    target.forcingEvent
  );
  const roi = computeRollupOpportunityIndex(aqs, vts, efs, isDisqualified);

  return {
    ...target,
    scores: {
      assetQualityScore: aqs,
      vehicleDistressScore: vts,
      extractionFeasibilityScore: efs,
      rollupOpportunityIndex: roi,
    },
  };
}
