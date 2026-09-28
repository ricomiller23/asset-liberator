import { TargetCompany } from "./types";

export function computeAssetQualityScore(asset: TargetCompany["asset"]): number {
  let score = 50;

  // Revenue tiers
  if (asset.annualRevenue >= 20000000) score += 20;
  else if (asset.annualRevenue >= 10000000) score += 15;
  else if (asset.annualRevenue >= 5000000) score += 12;
  else if (asset.annualRevenue >= 2000000) score += 8;
  else score += 4;

  // Gross margin
  if (asset.grossMarginPct >= 60) score += 15;
  else if (asset.grossMarginPct >= 40) score += 10;
  else if (asset.grossMarginPct >= 25) score += 5;

  // EBITDA positive or near breakeven
  if (asset.ebitda > 0) score += 10;
  else if (asset.ebitda > -500000) score += 5;

  // IP & Patents
  if (asset.patentsCount >= 10) score += 10;
  else if (asset.patentsCount >= 3) score += 6;
  else if (asset.patentsCount >= 1) score += 3;

  // Commercial validation & clients
  if (asset.keyClients && asset.keyClients.length >= 3) score += 5;

  return Math.min(100, Math.max(10, Math.round(score)));
}

export function computeVehicleDistressScore(vehicle: TargetCompany["vehicleDistress"]): number {
  let score = 40;

  // Filing status
  if (vehicle.filingStatus === "suspended_15c211") score += 20;
  else if (vehicle.filingStatus === "delinquent_10k") score += 16;
  else if (vehicle.filingStatus === "delinquent_10q") score += 12;

  // Auditor status
  if (vehicle.auditorStatus === "resigned_item401") score += 15;
  else if (vehicle.auditorStatus === "unpaid") score += 12;
  else if (vehicle.auditorStatus === "adverse_opinion") score += 10;

  // SEC Triggers count
  if (vehicle.secTriggers.length >= 4) score += 15;
  else if (vehicle.secTriggers.length >= 2) score += 10;
  else if (vehicle.secTriggers.length >= 1) score += 5;

  // Toxic debt overhang
  if (vehicle.toxicDebtBalance >= 5000000) score += 10;
  else if (vehicle.toxicDebtBalance >= 2000000) score += 7;
  else if (vehicle.toxicDebtBalance >= 500000) score += 4;

  return Math.min(100, Math.max(15, Math.round(score)));
}

export function computeExtractionFeasibilityScore(
  extraction: TargetCompany["extractionFeasibility"],
  asset: TargetCompany["asset"]
): number {
  let score = 50;

  // Clean shell fit
  if (extraction.cleanShellFit === "exceptional") score += 20;
  else if (extraction.cleanShellFit === "high") score += 14;
  else score += 8;

  // Senior debt relative to annual revenue (the lower the ratio, the easier to foreclose)
  if (asset.annualRevenue > 0) {
    const debtToRev = extraction.seniorSecuredDebtAmount / asset.annualRevenue;
    if (debtToRev < 0.2) score += 15; // e.g. < $1M debt on $5M revenue
    else if (debtToRev < 0.5) score += 10;
    else if (debtToRev < 1.0) score += 5;
  }

  // Discount potential
  if (extraction.estimatedBuyoutDiscountPct >= 70) score += 15;
  else if (extraction.estimatedBuyoutDiscountPct >= 50) score += 10;
  else if (extraction.estimatedBuyoutDiscountPct >= 30) score += 5;

  return Math.min(100, Math.max(20, Math.round(score)));
}

export function computeRollupOpportunityIndex(
  aqs: number,
  vts: number,
  efs: number
): number {
  const roi = (aqs * 0.40) + (vts * 0.35) + (efs * 0.25);
  return Math.min(100, Math.max(10, Math.round(roi)));
}

export function enrichTargetScores(target: TargetCompany): TargetCompany {
  const aqs = computeAssetQualityScore(target.asset);
  const vts = computeVehicleDistressScore(target.vehicleDistress);
  const efs = computeExtractionFeasibilityScore(target.extractionFeasibility, target.asset);
  const roi = computeRollupOpportunityIndex(aqs, vts, efs);

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
