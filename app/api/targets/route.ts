import { NextRequest, NextResponse } from "next/server";
import { getServerTargets } from "@/lib/serverStore";
import { TargetCompany } from "@/lib/types";
import { withLiveClock } from "@/lib/pipeline/clock";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query")?.toLowerCase();
  const sector = searchParams.get("sector");
  const playbook = searchParams.get("playbook");
  const exchange = searchParams.get("exchange");
  const filingStatus = searchParams.get("filingStatus");
  const revenueTier = searchParams.get("revenueTier");
  const tier = searchParams.get("tier");
  const vertical = searchParams.get("vertical");
  const leadTime = searchParams.get("leadTime");
  const gateStatus = searchParams.get("gateStatus");
  const minRevenue = searchParams.get("minRevenue") ? parseFloat(searchParams.get("minRevenue")!) : undefined;
  const maxSeniorDebt = searchParams.get("maxSeniorDebt") ? parseFloat(searchParams.get("maxSeniorDebt")!) : undefined;
  const minRoi = searchParams.get("minRoi") ? parseInt(searchParams.get("minRoi")!, 10) : undefined;
  const crmStage = searchParams.get("crmStage");
  const sortBy = searchParams.get("sortBy") || "roi";

  const limitParam = searchParams.get("limit");
  const offsetParam = searchParams.get("offset");
  const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : undefined;
  const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10)) : 0;

  const now = new Date();
  const allTargets = getServerTargets().map((t) => withLiveClock(t, now));
  let results: TargetCompany[] = [...allTargets];

  // Default behavior: unless specifically requesting 'disqualified' or 'all', hide disqualified filers from active screener
  if (tier && tier !== "all") {
    results = results.filter((t) => t.tier === tier);
  } else if (!tier) {
    results = results.filter((t) => t.tier !== "disqualified");
  }

  if (vertical && vertical !== "all") {
    results = results.filter((t) => t.vertical === vertical);
  }

  if (leadTime === "inside_90d") {
    results = results.filter((t) => t.forcingEvent?.leadTimeWindow === "inside_90d_active");
  } else if (leadTime === "outside_90d") {
    results = results.filter((t) => t.forcingEvent?.leadTimeWindow === "outside_90d_radar");
  }

  if (gateStatus === "passed_all_3") {
    results = results.filter((t) => t.threeGates?.overallGate === "passed_all_3");
  }

  if (query) {
    const cleanDigits = query.replace(/[^0-9]/g, "");
    results = results.filter((t) =>
      t.ticker.toLowerCase().includes(query) ||
      t.name.toLowerCase().includes(query) ||
      t.asset.subsidiaryName.toLowerCase().includes(query) ||
      t.sector.toLowerCase().includes(query) ||
      t.asset.businessSummary.toLowerCase().includes(query) ||
      (t.vertical && t.vertical.toLowerCase().includes(query)) ||
      t.contacts.some((c) =>
        c.name.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        (cleanDigits.length >= 3 && c.phone.replace(/[^0-9]/g, "").includes(cleanDigits))
      )
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
    if (sortBy === "catalyst_asc") return (a.forcingEvent?.daysRemaining || 999) - (b.forcingEvent?.daysRemaining || 999);
    return 0;
  });

  const totalFilteredCount = results.length;
  const paginatedResults = limit !== undefined ? results.slice(offset, offset + limit) : results;

  // Calculate aggregates
  const totalSubsidiaryRevenue = results.reduce((acc, t) => acc + t.asset.annualRevenue, 0);
  const totalSeniorDebt = results.reduce((acc, t) => acc + t.extractionFeasibility.seniorSecuredDebtAmount, 0);
  const totalToxicDebtExtinguished = results.reduce((acc, t) => acc + t.vehicleDistress.toxicDebtBalance, 0);
  const totalContacts = results.reduce((acc, t) => acc + t.contacts.length, 0);

  // Funnel Gate statistics across all targets in universe
  const allVerifiedCount = allTargets.filter((t) => t.tier === "verified").length;
  const allScreenedCount = allTargets.filter((t) => t.tier === "screened").length;
  const allRadarCount = allTargets.filter((t) => t.tier === "radar").length;
  const allDisqualifiedCount = allTargets.filter((t) => t.tier === "disqualified").length;

  return NextResponse.json({
    targets: paginatedResults,
    meta: {
      total: totalFilteredCount,
      allTotal: allTargets.length,
      offset,
      limit,
      tiers: {
        verified: allVerifiedCount,
        screened: allScreenedCount,
        radar: allRadarCount,
        disqualified: allDisqualifiedCount,
      },
      tierCounts: {
        verified: allVerifiedCount,
        screened: allScreenedCount,
        radar: allRadarCount,
        disqualified: allDisqualifiedCount,
      },
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
