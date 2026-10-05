import { TargetCompany, CrmStage, CrmNote, CrmActivity, PriorityLevel, ExecutiveContact } from "./types";
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
    const parsed: TargetCompany[] = JSON.parse(raw);
    
    // Safety fallback: if stored array is empty or corrupt, reset to INITIAL_TARGETS
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TARGETS));
      return INITIAL_TARGETS;
    }
    return parsed;
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

export function addTargetCrmNote(targetId: string, noteText: string, author: string = "Deal Desk"): TargetCompany[] {
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

/**
 * Update an existing executive contact on a target company
 */
export function updateTargetContact(targetId: string, updatedContact: ExecutiveContact): TargetCompany[] {
  const current = getStoredTargets();
  const updated = current.map((t) => {
    if (t.id === targetId) {
      const now = new Date().toISOString().split("T")[0];
      const updatedContacts = t.contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c));
      
      const activity: CrmActivity = {
        id: "act-" + Date.now(),
        date: now,
        type: "call",
        summary: `Updated contact dossier: ${updatedContact.name} (${updatedContact.title}) - Phone: ${updatedContact.phone}`,
      };

      return {
        ...t,
        contacts: updatedContacts,
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

/**
 * Add a new executive contact to a target company
 */
export function addTargetContact(
  targetId: string,
  newContact: Omit<ExecutiveContact, "id">,
  setAsPrimary: boolean = false
): TargetCompany[] {
  const current = getStoredTargets();
  const updated = current.map((t) => {
    if (t.id === targetId) {
      const now = new Date().toISOString().split("T")[0];
      const contactWithId: ExecutiveContact = {
        ...newContact,
        id: "contact-" + Date.now(),
      };

      const updatedContacts = setAsPrimary
        ? [contactWithId, ...t.contacts]
        : [...t.contacts, contactWithId];

      const activity: CrmActivity = {
        id: "act-" + Date.now(),
        date: now,
        type: "call",
        summary: `Added new executive contact: ${contactWithId.name} (${contactWithId.title}) - Phone: ${contactWithId.phone}`,
      };

      return {
        ...t,
        contacts: updatedContacts,
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

/**
 * Set a specific contact as the primary contact (moved to position 0)
 */
export function setPrimaryContact(targetId: string, contactId: string): TargetCompany[] {
  const current = getStoredTargets();
  const updated = current.map((t) => {
    if (t.id === targetId) {
      const contact = t.contacts.find((c) => c.id === contactId);
      if (!contact) return t;

      const remaining = t.contacts.filter((c) => c.id !== contactId);
      const updatedContacts = [contact, ...remaining];
      const now = new Date().toISOString().split("T")[0];

      const activity: CrmActivity = {
        id: "act-" + Date.now(),
        date: now,
        type: "filing_alert",
        summary: `Promoted ${contact.name} (${contact.title}) to Primary Decision Maker`,
      };

      return {
        ...t,
        contacts: updatedContacts,
        crm: {
          ...t.crm,
          activities: [activity, ...t.crm.activities],
        },
      };
    }
    return t;
  });
  saveStoredTargets(updated);
  return updated;
}

/**
 * Delete a contact from a target company
 */
export function deleteTargetContact(targetId: string, contactId: string): TargetCompany[] {
  const current = getStoredTargets();
  const updated = current.map((t) => {
    if (t.id === targetId) {
      const targetContact = t.contacts.find((c) => c.id === contactId);
      const updatedContacts = t.contacts.filter((c) => c.id !== contactId);
      const now = new Date().toISOString().split("T")[0];

      const activity: CrmActivity = {
        id: "act-" + Date.now(),
        date: now,
        type: "filing_alert",
        summary: `Removed outdated contact: ${targetContact?.name || contactId}`,
      };

      return {
        ...t,
        contacts: updatedContacts,
        crm: {
          ...t.crm,
          activities: [activity, ...t.crm.activities],
        },
      };
    }
    return t;
  });
  saveStoredTargets(updated);
  return updated;
}

/**
 * Log a structured call with outcome, notes, and optional follow-up
 */
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
  const current = getStoredTargets();
  const updated = current.map((t) => {
    if (t.id === targetId) {
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

      return {
        ...t,
        crm: {
          ...t.crm,
          stage: callDetails.suggestedStage || t.crm.stage,
          lastContactDate: now,
          nextFollowUpDate: callDetails.nextFollowUpDate || t.crm.nextFollowUpDate,
          notes: [note, ...t.crm.notes],
          activities: [activity, ...t.crm.activities],
        },
      };
    }
    return t;
  });
  saveStoredTargets(updated);
  return updated;
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

/**
 * Search across all people (contacts), companies, tickers, and subsidiaries
 */
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
