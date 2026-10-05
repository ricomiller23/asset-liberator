import { TargetCompany, CrmStage, CrmActivity, CrmNote, ExecutiveContact } from "./types";
import { formatCurrency } from "./utils";

export type ReportPeriod = "today" | "week" | "month" | "all";

export interface EnrichedCrmActivity {
  id: string;
  date: string;
  type: CrmActivity["type"];
  summary: string;
  targetId: string;
  ticker: string;
  companyName: string;
  subsidiaryName: string;
  contactName: string;
  contactTitle: string;
  contactPhone: string;
  contactEmail: string;
  currentStage: CrmStage;
  isToday: boolean;
}

export interface CrmReportMetrics {
  totalActivities: number;
  emailsSent: number;
  callsLogged: number;
  notesCount: number;
  stageTransitions: number;
  uniqueTargetsEngaged: number;
  totalSubsidiaryRevenueEngaged: number;
  totalSeniorDebtEngaged: number;
  period: ReportPeriod;
  periodLabel: string;
  dateRangeStr: string;
}

export interface TargetReportRow {
  targetId: string;
  ticker: string;
  name: string;
  subsidiaryName: string;
  stage: CrmStage;
  stageTitle: string;
  primaryContact: ExecutiveContact;
  annualRevenue: number;
  seniorSecuredDebt: number;
  activitiesInPeriod: number;
  lastContactDate: string;
  statusBadge: string;
  latestActivity: string;
}

export interface EnrichedCrmNote {
  id: string;
  date: string;
  author: string;
  text: string;
  targetId: string;
  ticker: string;
  companyName: string;
}

export interface CrmReportData {
  metrics: CrmReportMetrics;
  activities: EnrichedCrmActivity[];
  targetRows: TargetReportRow[];
  notes: EnrichedCrmNote[];
}

export const STAGE_TITLES: Record<CrmStage, string> = {
  new: "New Opportunities",
  outreach_sent: "Outreach Sent",
  in_dialogue: "Active Dialogue",
  nda_signed: "NDA Executed",
  diligence: "In Diligence",
  term_sheet: "Term Sheet Issued",
  foreclosure_pending: "Foreclosure / Closing",
  closed: "Transaction Closed",
  passed: "Passed / Archived",
};

/**
 * Filter activities and notes by selected period relative to current reference date
 */
export function isDateInPeriod(dateStr: string, period: ReportPeriod, referenceDateStr: string = "2026-10-05"): boolean {
  if (period === "all") return true;

  const refDate = new Date(referenceDateStr + "T23:59:59Z");
  const targetDate = new Date(dateStr + "T00:00:00Z");

  if (isNaN(targetDate.getTime())) return false;

  const diffMs = refDate.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (period === "today") {
    return dateStr === referenceDateStr || diffDays <= 0;
  }
  if (period === "week") {
    return diffDays <= 7;
  }
  if (period === "month") {
    return diffDays <= 30;
  }
  return true;
}

/**
 * Generate full CRM Report analytics from targets
 */
export function buildCrmReport(
  targets: TargetCompany[],
  period: ReportPeriod = "today",
  referenceDateStr: string = "2026-10-05"
): CrmReportData {
  const periodLabels: Record<ReportPeriod, { label: string; range: string }> = {
    today: { label: "Today (Oct 5, 2026)", range: "2026-10-05" },
    week: { label: "This Week (Past 7 Days)", range: "2026-09-29 to 2026-10-05" },
    month: { label: "This Month (Past 30 Days)", range: "2026-09-05 to 2026-10-05" },
    all: { label: "All Time / To Date", range: "All Historical Activities to Date" },
  };

  const activities: EnrichedCrmActivity[] = [];
  const notes: EnrichedCrmNote[] = [];
  const engagedTargetIds = new Set<string>();

  targets.forEach((target) => {
    const contact = target.contacts[0] || {
      id: "c-fallback",
      name: "Corporate Executive",
      title: "Executive",
      entity: "Public Parent" as const,
      email: "",
      phone: "",
      roleSummary: "",
      receptivityScore: "medium" as const,
    };

    // Filter activities
    target.crm.activities.forEach((act) => {
      if (isDateInPeriod(act.date, period, referenceDateStr)) {
        activities.push({
          id: act.id,
          date: act.date,
          type: act.type,
          summary: act.summary,
          targetId: target.id,
          ticker: target.ticker,
          companyName: target.name,
          subsidiaryName: target.asset.subsidiaryName,
          contactName: contact.name,
          contactTitle: contact.title,
          contactPhone: contact.phone,
          contactEmail: contact.email,
          currentStage: target.crm.stage,
          isToday: act.date === referenceDateStr,
        });
        engagedTargetIds.add(target.id);
      }
    });

    // Filter notes
    target.crm.notes.forEach((note) => {
      if (isDateInPeriod(note.date, period, referenceDateStr)) {
        notes.push({
          id: note.id,
          date: note.date,
          author: note.author,
          text: note.text,
          targetId: target.id,
          ticker: target.ticker,
          companyName: target.name,
        });
        engagedTargetIds.add(target.id);
      }
    });
  });

  // Sort activities newest first
  activities.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.id.localeCompare(a.id);
  });

  // Sort notes newest first
  notes.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.id.localeCompare(a.id);
  });

  // Calculate metrics
  const emailsSent = activities.filter((a) => a.type === "email").length;
  const callsLogged = activities.filter((a) => a.type === "call").length;
  const stageTransitions = activities.filter(
    (a) => a.type === "filing_alert" || a.type === "term_sheet" || a.summary.toLowerCase().includes("stage")
  ).length;

  const engagedTargetsList = targets.filter((t) => engagedTargetIds.has(t.id));
  const totalSubsidiaryRevenueEngaged = engagedTargetsList.reduce(
    (acc, t) => acc + (t.asset.annualRevenue || 0),
    0
  );
  const totalSeniorDebtEngaged = engagedTargetsList.reduce(
    (acc, t) => acc + (t.extractionFeasibility.seniorSecuredDebtAmount || 0),
    0
  );

  const metrics: CrmReportMetrics = {
    totalActivities: activities.length,
    emailsSent,
    callsLogged,
    notesCount: notes.length,
    stageTransitions,
    uniqueTargetsEngaged: engagedTargetIds.size,
    totalSubsidiaryRevenueEngaged,
    totalSeniorDebtEngaged,
    period,
    periodLabel: periodLabels[period].label,
    dateRangeStr: periodLabels[period].range,
  };

  // Build Target Report Rows
  const targetRows: TargetReportRow[] = targets.map((t) => {
    const primaryContact = t.contacts[0];
    const targetActivitiesInPeriod = t.crm.activities.filter((a) =>
      isDateInPeriod(a.date, period, referenceDateStr)
    );
    const latestAct = t.crm.activities[0]?.summary || "No recent activity";

    let statusBadge = "Idle";
    if (targetActivitiesInPeriod.some((a) => a.type === "email" && a.date === referenceDateStr)) {
      statusBadge = "Outreach Sent Today";
    } else if (targetActivitiesInPeriod.some((a) => a.type === "call")) {
      statusBadge = "Called in Period";
    } else if (targetActivitiesInPeriod.length > 0) {
      statusBadge = "Active in Period";
    }

    return {
      targetId: t.id,
      ticker: t.ticker,
      name: t.name,
      subsidiaryName: t.asset.subsidiaryName,
      stage: t.crm.stage,
      stageTitle: STAGE_TITLES[t.crm.stage] || t.crm.stage,
      primaryContact,
      annualRevenue: t.asset.annualRevenue,
      seniorSecuredDebt: t.extractionFeasibility.seniorSecuredDebtAmount,
      activitiesInPeriod: targetActivitiesInPeriod.length,
      lastContactDate: t.crm.lastContactDate || "N/A",
      statusBadge,
      latestActivity: latestAct,
    };
  });

  // Sort target rows: those active in period first
  targetRows.sort((a, b) => {
    if (b.activitiesInPeriod !== a.activitiesInPeriod) {
      return b.activitiesInPeriod - a.activitiesInPeriod;
    }
    return a.ticker.localeCompare(b.ticker);
  });

  return {
    metrics,
    activities,
    targetRows,
    notes,
  };
}

/**
 * Generate formatted GitHub-style Markdown report
 */
export function generateCrmReportMarkdown(
  reportData: CrmReportData,
  generatedBy: string = "Special Situations Deal Desk"
): string {
  const { metrics, activities, targetRows, notes } = reportData;

  let md = "# Asset Liberator • CRM Activity & Audit Report\n\n";
  md += "**Report Timeframe:** " + metrics.periodLabel + "  \n";
  md += "**Date Range:** " + metrics.dateRangeStr + "  \n";
  md += "**Generated At:** 2026-10-05T09:30:00-07:00 | **Generated By:** " + generatedBy + "  \n";
  md += "**System Deployment:** https://asset-liberator.vercel.app  \n\n";
  md += "---\n\n";
  md += "## 1. Executive Performance Metrics\n\n";
  md += "| Metric | Count / Value | Description |\n";
  md += "| :--- | :--- | :--- |\n";
  md += "| **Total Actions Logged** | **" + metrics.totalActivities + "** | All recorded CRM touchpoints in timeframe |\n";
  md += "| **Outreach Emails Dispatched** | **" + metrics.emailsSent + "** | Personalized carve-out proposals sent to CEOs |\n";
  md += "| **Phone Calls & Dispositions** | **" + metrics.callsLogged + "** | Structured calls logged with executive decision makers |\n";
  md += "| **Deal Desk Intelligence Notes** | **" + metrics.notesCount + "** | Internal strategic analysis and restructuring notes |\n";
  md += "| **Active Targets Engaged** | **" + metrics.uniqueTargetsEngaged + " of " + targetRows.length + "** | Unique companies with documented activity in timeframe |\n";
  md += "| **Subsidiary Revenue Touched** | **$" + (metrics.totalSubsidiaryRevenueEngaged / 1000000).toFixed(1) + "M** | Commercial revenue of underlying operating assets in play |\n";
  md += "| **Senior Debt in Resolution** | **$" + (metrics.totalSeniorDebtEngaged / 1000000).toFixed(1) + "M** | First-lien UCC senior debt positions targeted for workout |\n\n";
  md += "---\n\n";
  md += "## 2. Chronological Activity Log (" + activities.length + " Actions)\n\n";

  if (activities.length === 0) {
    md += "*No activities logged for this specific timeframe.*\n\n";
  } else {
    activities.forEach((act, idx) => {
      const typeBadge =
        act.type === "email" ? "📧 [OUTREACH EMAIL]" :
        act.type === "call" ? "📞 [PHONE CALL]" :
        act.type === "term_sheet" ? "💼 [TERM SHEET]" :
        act.type === "meeting" ? "🤝 [EXECUTIVE MEETING]" : "📋 [ALERT]";

      md += "### " + (idx + 1) + ". " + typeBadge + " " + act.ticker + " — " + act.companyName + "\n";
      md += "- **Date:** `" + act.date + "` " + (act.isToday ? "*(TODAY)*" : "") + "\n";
      md += "- **Operating Subsidiary:** **" + act.subsidiaryName + "**\n";
      md += "- **Decision Maker:** **" + act.contactName + "** (" + act.contactTitle + ")\n";
      md += "- **Contact Info:** `" + act.contactPhone + "` | `" + act.contactEmail + "`\n";
      md += "- **Current Pipeline Stage:** `" + (STAGE_TITLES[act.currentStage] || act.currentStage) + "`\n";
      md += "- **Activity Detail:**\n  > " + act.summary + "\n\n";
    });
  }

  md += "---\n\n";
  md += "## 3. Company-by-Company Pipeline Matrix\n\n";
  md += "| Ticker | Company Name | Operating Subsidiary | Primary Contact | Stage | Period Actions | Last Contact |\n";
  md += "| :--- | :--- | :--- | :--- | :--- | :---: | :--- |\n";

  targetRows.forEach((row) => {
    md += "| **" + row.ticker + "** | " + row.name + " | " + row.subsidiaryName + " | " + (row.primaryContact?.name || "N/A") + " (" + (row.primaryContact?.phone || "N/A") + ") | `" + row.stageTitle + "` | **" + row.activitiesInPeriod + "** | `" + row.lastContactDate + "` |\n";
  });

  if (notes.length > 0) {
    md += "\n---\n\n";
    md += "## 4. Deal Desk Notes & Strategic Intelligence (" + notes.length + " Entries)\n\n";
    notes.forEach((note) => {
      md += "- **[" + note.date + "] " + note.ticker + " (" + note.author + "):** " + note.text + "\n";
    });
  }

  md += "\n---\n*Report generated and archived autonomously by Asset Liberator CRM Engine.*\n";

  return md;
}
