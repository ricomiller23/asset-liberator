import { TargetCompany, CrmStage, CrmNote, CrmActivity, PriorityLevel } from "./types";
import { INITIAL_TARGETS } from "./data/targets";

const STORAGE_KEY = "asset_liberator_targets_v1";

export function getStoredTargets(): TargetCompany[] {
  if (typeof window === "undefined") {
    return INITIAL_TARGETS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TARGETS));
      return INITIAL_TARGETS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load targets from localStorage", err);
    return INITIAL_TARGETS;
  }
}

export function saveStoredTargets(targets: TargetCompany[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(targets));
  } catch (err) {
    console.error("Failed to save targets to localStorage", err);
  }
}

export function updateTargetCrmStage(targetId: string, stage: CrmStage, priority?: PriorityLevel): TargetCompany[] {
  const current = getStoredTargets();
  const updated = current.map((t) => {
    if (t.id === targetId) {
      const now = new Date().toISOString().split("T")[0];
      const activity: CrmActivity = {
        id: "act-" + Date.now(),
        date: now,
        type: "filing_alert",
        summary: `Pipeline stage updated to: ${stage.toUpperCase().replace("_", " ")}`,
      };
      return {
        ...t,
        crm: {
          ...t.crm,
          stage,
          priority: priority || t.crm.priority,
          lastContactDate: now,
          activities: [activity, ...t.crm.activities],
        },
      };
    }
    return t;
  });
  saveStoredTargets(updated);
  return updated;
}

export function addTargetCrmNote(targetId: string, noteText: string, author: string = "Deal Team"): TargetCompany[] {
  const current = getStoredTargets();
  const updated = current.map((t) => {
    if (t.id === targetId) {
      const now = new Date().toISOString().split("T")[0];
      const note: CrmNote = {
        id: "note-" + Date.now(),
        date: now,
        author,
        text: noteText,
      };
      return {
        ...t,
        crm: {
          ...t.crm,
          notes: [note, ...t.crm.notes],
        },
      };
    }
    return t;
  });
  saveStoredTargets(updated);
  return updated;
}

export function logTargetActivity(
  targetId: string,
  type: CrmActivity["type"],
  summary: string
): TargetCompany[] {
  const current = getStoredTargets();
  const updated = current.map((t) => {
    if (t.id === targetId) {
      const now = new Date().toISOString().split("T")[0];
      const activity: CrmActivity = {
        id: "act-" + Date.now(),
        date: now,
        type,
        summary,
      };
      return {
        ...t,
        crm: {
          ...t.crm,
          lastContactDate: now,
          activities: [activity, ...t.crm.activities],
        },
      };
    }
    return t;
  });
  saveStoredTargets(updated);
  return updated;
}
