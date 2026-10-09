import { NextRequest, NextResponse } from "next/server";
import { INITIAL_TARGETS as SEED_TARGETS } from "@/lib/data/targets";
import { withLiveClock } from "@/lib/pipeline/clock";
import Papa from "papaparse";

export async function GET(req: NextRequest) {
  const INITIAL_TARGETS = SEED_TARGETS.map((t) => withLiveClock(t));
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "csv";

  if (format === "json") {
    return NextResponse.json(INITIAL_TARGETS);
  }

  const flattened = INITIAL_TARGETS.map((t) => ({
    Ticker: t.ticker,
    Company_Name: t.name,
    Tier: t.tier,
    Vertical: t.vertical,
    Exchange: t.exchange,
    Sector: t.sector,
    Subsidiary_Name: t.asset.subsidiaryName,
    Annual_Revenue: t.asset.annualRevenue,
    Gross_Margin_Pct: t.asset.grossMarginPct,
    EBITDA: t.asset.ebitda,
    Three_Gates_Status: t.threeGates?.overallGate || "N/A",
    Gate1_Distress: t.threeGates?.gate1_parentDistress.passed ? "PASSED" : "FAILED",
    Gate2_Separable_Sub: t.threeGates?.gate2_separableValue.passed ? "PASSED" : "FAILED",
    Gate3_Control_Point: t.threeGates?.gate3_controlPoint.passed ? "PASSED" : "FAILED",
    Catalyst_Clock_Days: t.forcingEvent?.daysRemaining || "N/A",
    Catalyst_Deadline: t.forcingEvent?.deadlineDate || "N/A",
    Filing_Status: t.vehicleDistress.filingStatus,
    Auditor_Status: t.vehicleDistress.auditorStatus,
    Toxic_Debt_Balance: t.vehicleDistress.toxicDebtBalance,
    Senior_Secured_Holder: t.extractionFeasibility.seniorSecuredHolder,
    Senior_Debt_Amount: t.extractionFeasibility.seniorSecuredDebtAmount,
    UCC_Filing_Number: t.extractionFeasibility.uccSearchNumber || "N/A",
    Estimated_Buyout_Cost: t.extractionFeasibility.estimatedAcquisitionCost,
    Recommended_Playbook: t.extractionFeasibility.recommendedPlaybook,
    CIK: t.cik,
    OTCMarkets_URL: t.otcMarketsUrl,
    SEC_EDGAR_URL: t.secEdgarUrl,
    Latest_Filing_Form: t.latestFilingType,
    Latest_Filing_Date: t.latestFilingDate,
    Latest_Filing_URL: t.latestFilingUrl,
    Baseline_10K_Form: t.baseline10KFilingType || "Form 10-K",
    Baseline_10K_Date: t.baseline10KFilingDate || "",
    Baseline_10K_URL: t.baseline10KFilingUrl || "",
    Data_Provenance: t.dataProvenance || "sec_sourced",
    Retrieved_At: t.retrievedAt || "2026-10-09",
    ROI_Score: t.scores.rollupOpportunityIndex,
    Disqualification_Reason: t.disqualificationReason || "",
    CRM_Stage: t.crm.stage,
    Priority: t.crm.priority,
    Key_Contact_Name: t.contacts[0]?.name || "N/A",
    Key_Contact_Title: t.contacts[0]?.title || "N/A",
    Key_Contact_Email: t.contacts[0]?.email || "N/A",
    Key_Contact_Phone: t.contacts[0]?.phone || "N/A",
  }));

  const csv = Papa.unparse(flattened);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="asset-liberator-targets-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
