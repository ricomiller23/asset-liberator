import { NextRequest, NextResponse } from "next/server";
import { getServerTargets } from "@/lib/serverStore";
import { buildCrmReport, generateCrmReportMarkdown, ReportPeriod } from "@/lib/crmReport";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const periodParam = (searchParams.get("period") || "today").toLowerCase();
    const format = (searchParams.get("format") || "json").toLowerCase();

    const validPeriod: ReportPeriod = 
      periodParam === "week" ? "week" :
      periodParam === "month" ? "month" :
      periodParam === "all" ? "all" : "today";

    const targets = getServerTargets();
    const reportData = buildCrmReport(targets, validPeriod);

    if (format === "markdown" || format === "md") {
      const markdown = generateCrmReportMarkdown(reportData);
      return new NextResponse(markdown, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="asset-liberator-crm-report-${validPeriod}.md"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      period: validPeriod,
      report: reportData,
      markdown: generateCrmReportMarkdown(reportData),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("API /api/crm/report error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
