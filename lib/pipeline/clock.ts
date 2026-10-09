import type { TargetCompany } from "../types";
import { daysUntil } from "./model";

/**
 * Seed records store `daysRemaining` as a snapshot taken when the data was generated,
 * so it never decays. Recompute it from `deadlineDate` at read time instead.
 */
export function withLiveClock(t: TargetCompany, now: Date = new Date()): TargetCompany {
  const fe = t.forcingEvent;
  if (!fe?.deadlineDate) return t;
  const daysRemaining = daysUntil(fe.deadlineDate, now);
  return {
    ...t,
    forcingEvent: {
      ...fe,
      daysRemaining,
      leadTimeWindow: daysRemaining <= 90 ? "inside_90d_active" : "outside_90d_radar",
    },
  };
}
