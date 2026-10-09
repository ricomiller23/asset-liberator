import { TargetCompany, CrmStage, CrmNote, CrmActivity, PriorityLevel, ExecutiveContact } from "./types";
import { INITIAL_TARGETS } from "./data/targets";

const OVERLAY_STORAGE_KEY = "asset_liberator_crm_overlay_v1";
const LEGACY_STORAGE_KEY = "asset_liberator_targets_v5";

export type CrmTargetOverlay = {
  contacts: ExecutiveContact[];
  crm: TargetCompany["crm"];
};

export type CrmOverlayMap = Record<string, CrmTargetOverlay>;

let memoryOverlay: CrmOverlayMap = {};

export function resetMemoryOverlay(): void {
  memoryOverlay = {};
}

/**
 * Reads CRM overlay from localStorage (or memory in Node environment).
 * Handles automatic migration from legacy asset_liberator_targets_v5 if present.
 */
export function getCrmOverlay(): CrmOverlayMap {
  if (typeof window === "undefined") {
    return memoryOverlay;
  }
  try {
    const raw = localStorage.getItem(OVERLAY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as CrmOverlayMap;
    }

    // Check for legacy storage format to migrate existing user edits
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      try {
        const legacyParsed = JSON.parse(legacyRaw);
        if (Array.isArray(legacyParsed)) {
          const migrated: CrmOverlayMap = {};
          for (const item of legacyParsed) {
            if (item && item.id) {
              migrated[item.id] = {
                contacts: item.contacts || [],
                crm: item.crm,
              };
            }
          }
          localStorage.setItem(OVERLAY_STORAGE_KEY, JSON.stringify(migrated));
          localStorage.removeItem(LEGACY_STORAGE_KEY);
          return migrated;
        }
      } catch (e) {
        console.warn("Failed to migrate legacy CRM storage", e);
      }
    }
  } catch (err) {
    console.error("Failed to load CRM overlay from localStorage", err);
  }
  return {};
}

/**
 * Saves CRM overlay to localStorage (only storing modified contacts & CRM metadata).
 */
export function saveCrmOverlay(overlay: CrmOverlayMap): void {
  if (typeof window === "undefined") {
    memoryOverlay = overlay;
    return;
  }
  try {
    localStorage.setItem(OVERLAY_STORAGE_KEY, JSON.stringify(overlay));
  } catch (err) {
    console.error("Failed to save CRM overlay to localStorage", err);
  }
}

/**
 * Merges CRM overlay onto any array of TargetCompany records.
 */
export function applyCrmOverlay(targets: TargetCompany[], overlay?: CrmOverlayMap): TargetCompany[] {
  const map = overlay || getCrmOverlay();
  if (!map || Object.keys(map).length === 0) return targets;

  return targets.map((t) => {
    const entry = map[t.id] || (t.ticker ? map[t.ticker.toUpperCase()] : undefined);
    if (!entry) return t;

    return {
      ...t,
      contacts: entry.contacts !== undefined ? entry.contacts : t.contacts,
      crm: entry.crm ? { ...t.crm, ...entry.crm } : t.crm,
    };
  });
}

/**
 * Backwards-compatible getStoredTargets: returns base targets merged with CRM overlay.
 */
export function getStoredTargets(baseTargets?: TargetCompany[]): TargetCompany[] {
  const base = baseTargets || INITIAL_TARGETS;
  return applyCrmOverlay(base);
}

/**
 * Backwards-compatible saveStoredTargets: extracts overlay and stores only overlay.
 */
export function saveStoredTargets(targets: TargetCompany[]): void {
  const overlay = getCrmOverlay();
  for (const t of targets) {
    overlay[t.id] = {
      contacts: t.contacts,
      crm: t.crm,
    };
  }
  saveCrmOverlay(overlay);
}

// Background sync to server API
function syncToServer(payload: any) {
  if (typeof window === "undefined") return;
  fetch("/api/crm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((err) => console.warn("CRM background server sync non-blocking error:", err));
}

function getOrCreateTargetOverlay(targetId: string): CrmTargetOverlay {
  const overlay = getCrmOverlay();
  if (overlay[targetId]) return overlay[targetId];

  // Check INITIAL_TARGETS for seed baseline
  const seed = INITIAL_TARGETS.find(
    (s) => s.id === targetId || s.ticker.toUpperCase() === targetId.toUpperCase()
  );
  if (seed) {
    return {
      contacts: [...seed.contacts],
      crm: { ...seed.crm },
    };
  }

  return {
    contacts: [],
    crm: {
      stage: "new",
      priority: "medium",
      notes: [],
      activities: [],
    },
  };
}

export function updateTargetCrmStage(targetId: string, stage: CrmStage, priority?: PriorityLevel): TargetCompany[] {
  const overlay = getCrmOverlay();
  const current = getOrCreateTargetOverlay(targetId);
  const now = new Date().toISOString().split("T")[0];

  const activity: CrmActivity = {
    id: "act-" + Date.now(),
    date: now,
    type: "filing_alert",
    summary: `Pipeline stage updated to: ${stage.toUpperCase().replace("_", " ")}`,
  };

  overlay[targetId] = {
    ...current,
    crm: {
      ...current.crm,
      stage,
      priority: priority || current.crm.priority,
      lastContactDate: now,
      activities: [activity, ...(current.crm.activities || [])],
    },
  };

  saveCrmOverlay(overlay);
  syncToServer({ action: "update_stage", targetId, stage, priority });
  return getStoredTargets();
}

export function addTargetCrmNote(targetId: string, noteText: string, author: string = "Deal Desk"): TargetCompany[] {
  const overlay = getCrmOverlay();
  const current = getOrCreateTargetOverlay(targetId);
  const now = new Date().toISOString().split("T")[0];

  const note: CrmNote = {
    id: "note-" + Date.now(),
    date: now,
    author,
    text: noteText,
  };

  overlay[targetId] = {
    ...current,
    crm: {
      ...current.crm,
      notes: [note, ...(current.crm.notes || [])],
    },
  };

  saveCrmOverlay(overlay);
  syncToServer({ action: "add_note", targetId, noteText, author });
  return getStoredTargets();
}

export function logTargetActivity(
  targetId: string,
  type: CrmActivity["type"],
  summary: string
): TargetCompany[] {
  const overlay = getCrmOverlay();
  const current = getOrCreateTargetOverlay(targetId);
  const now = new Date().toISOString().split("T")[0];

  const activity: CrmActivity = {
    id: "act-" + Date.now(),
    date: now,
    type,
    summary,
  };

  overlay[targetId] = {
    ...current,
    crm: {
      ...current.crm,
      lastContactDate: now,
      activities: [activity, ...(current.crm.activities || [])],
    },
  };

  saveCrmOverlay(overlay);
  syncToServer({ action: "log_activity", targetId, type, summary });
  return getStoredTargets();
}

export function updateTargetContact(targetId: string, updatedContact: ExecutiveContact): TargetCompany[] {
  const overlay = getCrmOverlay();
  const current = getOrCreateTargetOverlay(targetId);
  const now = new Date().toISOString().split("T")[0];

  const exists = current.contacts.some((c) => c.id === updatedContact.id);
  const newContacts = exists
    ? current.contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    : [updatedContact, ...current.contacts];

  const activity: CrmActivity = {
    id: "act-" + Date.now(),
    date: now,
    type: "call",
    summary: `Updated contact: ${updatedContact.name} (${updatedContact.title}) - Phone: ${updatedContact.phone}`,
  };

  overlay[targetId] = {
    contacts: newContacts,
    crm: {
      ...current.crm,
      lastContactDate: now,
      activities: [activity, ...(current.crm.activities || [])],
    },
  };

  saveCrmOverlay(overlay);
  syncToServer({ action: "update_contact", targetId, contact: updatedContact });
  return getStoredTargets();
}

export function addTargetContact(
  targetId: string,
  newContact: Omit<ExecutiveContact, "id">,
  setAsPrimary: boolean = false
): TargetCompany[] {
  const overlay = getCrmOverlay();
  const current = getOrCreateTargetOverlay(targetId);
  const now = new Date().toISOString().split("T")[0];

  const contactWithId: ExecutiveContact = {
    ...newContact,
    id: "contact-" + Date.now(),
  };

  const updatedContacts = setAsPrimary
    ? [contactWithId, ...current.contacts]
    : [...current.contacts, contactWithId];

  const activity: CrmActivity = {
    id: "act-" + Date.now(),
    date: now,
    type: "call",
    summary: `Added new executive contact: ${contactWithId.name} (${contactWithId.title}) - Phone: ${contactWithId.phone}`,
  };

  overlay[targetId] = {
    contacts: updatedContacts,
    crm: {
      ...current.crm,
      lastContactDate: now,
      activities: [activity, ...(current.crm.activities || [])],
    },
  };

  saveCrmOverlay(overlay);
  syncToServer({ action: "add_contact", targetId, contact: newContact, setAsPrimary });
  return getStoredTargets();
}

export function setPrimaryContact(targetId: string, contactId: string): TargetCompany[] {
  const overlay = getCrmOverlay();
  const current = getOrCreateTargetOverlay(targetId);
  const now = new Date().toISOString().split("T")[0];

  const contact = current.contacts.find((c) => c.id === contactId);
  if (!contact) return getStoredTargets();

  const remaining = current.contacts.filter((c) => c.id !== contactId);
  const updatedContacts = [contact, ...remaining];

  const activity: CrmActivity = {
    id: "act-" + Date.now(),
    date: now,
    type: "filing_alert",
    summary: `Promoted ${contact.name} (${contact.title}) to Primary Decision Maker`,
  };

  overlay[targetId] = {
    contacts: updatedContacts,
    crm: {
      ...current.crm,
      activities: [activity, ...(current.crm.activities || [])],
    },
  };

  saveCrmOverlay(overlay);
  syncToServer({ action: "set_primary_contact", targetId, contactId });
  return getStoredTargets();
}

export function deleteTargetContact(targetId: string, contactId: string): TargetCompany[] {
  const overlay = getCrmOverlay();
  const current = getOrCreateTargetOverlay(targetId);
  const now = new Date().toISOString().split("T")[0];

  const targetContact = current.contacts.find((c) => c.id === contactId);
  const updatedContacts = current.contacts.filter((c) => c.id !== contactId);

  const activity: CrmActivity = {
    id: "act-" + Date.now(),
    date: now,
    type: "filing_alert",
    summary: `Removed outdated contact: ${targetContact?.name || contactId}`,
  };

  overlay[targetId] = {
    contacts: updatedContacts,
    crm: {
      ...current.crm,
      activities: [activity, ...(current.crm.activities || [])],
    },
  };

  saveCrmOverlay(overlay);
  return getStoredTargets();
}

export function logCallActivity(
  targetId: string,
  callDetails: {
    contactName: string;
    outcome: string;
    notes: string;
    nextFollowUpDate?: string;
    suggestedStage?: CrmStage;
  }
): TargetCompany[] {
  const overlay = getCrmOverlay();
  const current = getOrCreateTargetOverlay(targetId);
  const now = new Date().toISOString().split("T")[0];

  const activitySummary = `[CALL LOGGED] Spoke with ${callDetails.contactName} | Outcome: ${callDetails.outcome} | Notes: ${callDetails.notes}${
    callDetails.nextFollowUpDate ? ` | Next follow-up: ${callDetails.nextFollowUpDate}` : ""
  }`;

  const activity: CrmActivity = {
    id: "act-" + Date.now(),
    date: now,
    type: "call",
    summary: activitySummary,
  };

  const note: CrmNote = {
    id: "note-" + Date.now(),
    date: now,
    author: "Call Log",
    text: `${callDetails.contactName} (${callDetails.outcome}): ${callDetails.notes}`,
  };

  overlay[targetId] = {
    ...current,
    crm: {
      ...current.crm,
      stage: callDetails.suggestedStage || current.crm.stage,
      lastContactDate: now,
      nextFollowUpDate: callDetails.nextFollowUpDate || current.crm.nextFollowUpDate,
      notes: [note, ...(current.crm.notes || [])],
      activities: [activity, ...(current.crm.activities || [])],
    },
  };

  saveCrmOverlay(overlay);
  syncToServer({ action: "log_call", targetId, callDetails });
  return getStoredTargets();
}

export interface GlobalSearchResult {
  contacts: Array<{
    target: TargetCompany;
    contact: ExecutiveContact;
    matchField: string;
  }>;
  companies: Array<{
    target: TargetCompany;
    matchField: string;
  }>;
}

export function searchTargetsAndContacts(query: string, targets: TargetCompany[]): GlobalSearchResult {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return { contacts: [], companies: [] };

  const matchedContacts: GlobalSearchResult["contacts"] = [];
  const matchedCompanies: GlobalSearchResult["companies"] = [];
  const cleanDigits = cleanQ.replace(/[^0-9]/g, "");

  for (const t of targets) {
    let companyMatched = false;
    let compMatchField = "";

    if (t.ticker.toLowerCase().includes(cleanQ)) {
      companyMatched = true;
      compMatchField = `Ticker: ${t.ticker}`;
    } else if (t.name.toLowerCase().includes(cleanQ)) {
      companyMatched = true;
      compMatchField = `Company: ${t.name}`;
    } else if (t.asset.subsidiaryName.toLowerCase().includes(cleanQ)) {
      companyMatched = true;
      compMatchField = `Subsidiary: ${t.asset.subsidiaryName}`;
    } else if (t.sector.toLowerCase().includes(cleanQ)) {
      companyMatched = true;
      compMatchField = `Sector: ${t.sector}`;
    }

    if (companyMatched) {
      matchedCompanies.push({ target: t, matchField: compMatchField });
    }

    for (const c of t.contacts) {
      let contactMatched = false;
      let contactMatchField = "";

      if (c.name.toLowerCase().includes(cleanQ)) {
        contactMatched = true;
        contactMatchField = `Name: ${c.name}`;
      } else if (cleanDigits.length >= 3 && c.phone.replace(/[^0-9]/g, "").includes(cleanDigits)) {
        contactMatched = true;
        contactMatchField = `Phone: ${c.phone}`;
      } else if (c.email.toLowerCase().includes(cleanQ)) {
        contactMatched = true;
        contactMatchField = `Email: ${c.email}`;
      } else if (c.title.toLowerCase().includes(cleanQ)) {
        contactMatched = true;
        contactMatchField = `Title: ${c.title}`;
      } else if (c.roleSummary && c.roleSummary.toLowerCase().includes(cleanQ)) {
        contactMatched = true;
        contactMatchField = `Role: ${c.roleSummary}`;
      }

      if (contactMatched) {
        matchedContacts.push({ target: t, contact: c, matchField: contactMatchField });
      }
    }
  }

  return { contacts: matchedContacts, companies: matchedCompanies };
}
