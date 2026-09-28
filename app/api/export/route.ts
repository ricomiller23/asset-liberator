import { NextRequest, NextResponse } from "next/server";
import { INITIAL_TARGETS } from "@/lib/data/targets";
import Papa from "papaparse";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "csv";

  if (format === "json") {
    return NextResponse.json(INITIAL_TARGETS);
  }

  const flattened = INITIAL_TARGETS.map((t) => ({
    Ticker: t.ticker,
    Company_Name: t.name,
    Exchange: t.exchange,
    Sector: t.sector,
    Subsidiary_Name: t.asset.subsidiaryName,
    Annual_Revenue: t.asset.annualRevenue,
    Gross_Margin_Pct: t.asset.grossMarginPct,
    EBITDA: t.asset.ebitda,
    Filing_Status: t.vehicleDistress.filingStatus,
    Auditor_Status: t.vehicleDistress.auditorStatus,
    Toxic_Debt_Balance: t.vehicleDistress.toxicDebtBalance,
    Senior_Secured_Holder: t.extractionFeasibility.seniorSecuredHolder,
    Senior_Debt_Amount: t.extractionFeasibility.seniorSecuredDebtAmount,
    Estimated_Buyout_Cost: t.extractionFeasibility.estimatedAcquisitionCost,
    Recommended_Playbook: t.extractionFeasibility.recommendedPlaybook,
    CIK: t.cik,
    OTCMarkets_URL: t.otcMarketsUrl,
    SEC_EDGAR_URL: t.secEdgarUrl,
    Latest_Filing_Form: t.latestFilingType,
    Latest_Filing_Date: t.latestFilingDate,
    Latest_Filing_URL: t.latestFilingUrl,
    ROI_Score: t.scores.rollupOpportunityIndex,
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
