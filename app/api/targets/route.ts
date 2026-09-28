import { NextRequest, NextResponse } from "next/server";
import { INITIAL_TARGETS } from "@/lib/data/targets";
import { TargetCompany, SearchFilters } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query")?.toLowerCase();
  const sector = searchParams.get("sector");
  const playbook = searchParams.get("playbook");
  const exchange = searchParams.get("exchange");
  const filingStatus = searchParams.get("filingStatus");
  const revenueTier = searchParams.get("revenueTier");
  const minRevenue = searchParams.get("minRevenue") ? parseFloat(searchParams.get("minRevenue")!) : undefined;
  const maxSeniorDebt = searchParams.get("maxSeniorDebt") ? parseFloat(searchParams.get("maxSeniorDebt")!) : undefined;
  const minRoi = searchParams.get("minRoi") ? parseInt(searchParams.get("minRoi")!, 10) : undefined;
  const crmStage = searchParams.get("crmStage");
  const sortBy = searchParams.get("sortBy") || "roi";

  let results: TargetCompany[] = [...INITIAL_TARGETS];

  if (query) {
    results = results.filter((t) =>
      t.ticker.toLowerCase().includes(query) ||
      t.name.toLowerCase().includes(query) ||
      t.asset.subsidiaryName.toLowerCase().includes(query) ||
      t.sector.toLowerCase().includes(query) ||
      t.asset.businessSummary.toLowerCase().includes(query)
    );
  }

  if (sector && sector !== "all") {
    results = results.filter((t) => t.sector === sector);
  }

  if (playbook && playbook !== "all") {
    results = results.filter((t) => t.extractionFeasibility.recommendedPlaybook === playbook);
  }

  if (exchange && exchange !== "all") {
    results = results.filter((t) => t.exchange === exchange);
  }

  if (filingStatus && filingStatus !== "all") {
    results = results.filter((t) => t.vehicleDistress.filingStatus === filingStatus);
  }

  if (revenueTier === "commercial") {
    results = results.filter((t) => t.asset.annualRevenue > 0);
  } else if (revenueTier === "pre_revenue_ip") {
    results = results.filter((t) => t.asset.annualRevenue === 0);
  }

  if (minRevenue !== undefined) {
    results = results.filter((t) => t.asset.annualRevenue >= minRevenue);
  }

  if (maxSeniorDebt !== undefined) {
    results = results.filter((t) => t.extractionFeasibility.seniorSecuredDebtAmount <= maxSeniorDebt);
  }

  if (minRoi !== undefined) {
    results = results.filter((t) => t.scores.rollupOpportunityIndex >= minRoi);
  }

  if (crmStage && crmStage !== "all") {
    results = results.filter((t) => t.crm.stage === crmStage);
  }

  // Sorting
  results.sort((a, b) => {
    if (sortBy === "roi") return b.scores.rollupOpportunityIndex - a.scores.rollupOpportunityIndex;
    if (sortBy === "revenue") return b.asset.annualRevenue - a.asset.annualRevenue;
    if (sortBy === "distress") return b.scores.vehicleDistressScore - a.scores.vehicleDistressScore;
    if (sortBy === "debt_asc") return a.extractionFeasibility.seniorSecuredDebtAmount - b.extractionFeasibility.seniorSecuredDebtAmount;
    if (sortBy === "market_cap") return a.marketCap - b.marketCap;
    return 0;
  });

  // Calculate aggregates
  const totalSubsidiaryRevenue = results.reduce((acc, t) => acc + t.asset.annualRevenue, 0);
  const totalSeniorDebt = results.reduce((acc, t) => acc + t.extractionFeasibility.seniorSecuredDebtAmount, 0);
  const totalToxicDebtExtinguished = results.reduce((acc, t) => acc + t.vehicleDistress.toxicDebtBalance, 0);
  const totalContacts = results.reduce((acc, t) => acc + t.contacts.length, 0);

  return NextResponse.json({
    targets: results,
    meta: {
      total: results.length,
      timestamp: new Date().toISOString(),
      stats: {
        totalSubsidiaryRevenue,
        totalSeniorDebt,
        totalToxicDebtExtinguished,
        totalContacts,
      },
    },
  });
}
