import { describe, it, expect } from "vitest";
import { INITIAL_TARGETS } from "../lib/data/targets";
import { 
  buildCrmReport, 
  generateCrmReportMarkdown, 
  isDateInPeriod 
} from "../lib/crmReport";

describe("CRM Report & Activity Analytics Engine Suite", () => {
  it("filters date periods correctly relative to reference date", () => {
    const today = "2026-10-05";
    expect(isDateInPeriod("2026-10-05", "today", today)).toBe(true);
    expect(isDateInPeriod("2026-10-04", "today", today)).toBe(false);

    expect(isDateInPeriod("2026-10-01", "week", today)).toBe(true);
    expect(isDateInPeriod("2026-09-20", "week", today)).toBe(false);

    expect(isDateInPeriod("2026-09-28", "month", today)).toBe(true);
    expect(isDateInPeriod("2026-08-01", "month", today)).toBe(false);

    expect(isDateInPeriod("2020-01-01", "all", today)).toBe(true);
  });

  it("builds 'today' report capturing all 18 targets engaged with emails dispatched", () => {
    const report = buildCrmReport(INITIAL_TARGETS, "today", "2026-10-05");
    expect(report.metrics.period).toBe("today");
    expect(report.metrics.totalActivities).toBeGreaterThanOrEqual(18);
    expect(report.metrics.emailsSent).toBe(18);
    expect(report.metrics.uniqueTargetsEngaged).toBe(18);

    // Verify Exela and Alpine 4 are present and marked sent
    const xela = report.targetRows.find((r) => r.ticker === "XELA");
    const alpp = report.targetRows.find((r) => r.ticker === "ALPP");
    expect(xela).toBeDefined();
    expect(alpp).toBeDefined();
    expect(xela?.activitiesInPeriod).toBeGreaterThanOrEqual(1);
    expect(alpp?.activitiesInPeriod).toBeGreaterThanOrEqual(1);

    // Verify Jeff Nail on ALPP
    expect(alpp?.primaryContact.name).toBe("Jeff Nail");
    expect(alpp?.primaryContact.phone).toBe("(480) 702-2431");
  });

  it("builds 'week' report aggregating 7-day activities", () => {
    const report = buildCrmReport(INITIAL_TARGETS, "week", "2026-10-05");
    expect(report.metrics.period).toBe("week");
    expect(report.metrics.totalActivities).toBeGreaterThanOrEqual(18);
    expect(report.targetRows.length).toBe(18);
  });

  it("builds 'month' report aggregating 30-day activities", () => {
    const report = buildCrmReport(INITIAL_TARGETS, "month", "2026-10-05");
    expect(report.metrics.period).toBe("month");
    expect(report.metrics.totalActivities).toBeGreaterThanOrEqual(18);
  });

  it("builds 'all' time report capturing entire historical audit trail", () => {
    const report = buildCrmReport(INITIAL_TARGETS, "all", "2026-10-05");
    expect(report.metrics.period).toBe("all");
    expect(report.metrics.totalActivities).toBeGreaterThanOrEqual(36);
  });

  it("generates structured GitHub markdown report with metrics and matrix", () => {
    const report = buildCrmReport(INITIAL_TARGETS, "today", "2026-10-05");
    const md = generateCrmReportMarkdown(report);

    expect(md).toContain("# Asset Liberator • CRM Activity & Audit Report");
    expect(md).toContain("Total Actions Logged");
    expect(md).toContain("Outreach Emails Dispatched");
    expect(md).toContain("ALPP");
    expect(md).toContain("Jeff Nail");
    expect(md).toContain("XELA");
  });
});
