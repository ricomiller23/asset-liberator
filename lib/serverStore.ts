import fs from "fs";
import path from "path";
import { TargetCompany, CrmStage, PriorityLevel, ExecutiveContact, CrmActivity, CrmNote } from "./types";
import { INITIAL_TARGETS } from "./data/targets";
import { mergeSeedAndIngestedTargets } from "./pipeline/universe";
import { withLiveClock } from "./pipeline/clock";

const TMP_FILE = "/tmp/asset_liberator_targets_store.json";
const INGESTED_DATA_PATH = path.resolve(process.cwd(), "data/ingested-targets.json");

// Global in-memory cache across serverless warm invocations
declare global {
  var __asset_liberator_targets: TargetCompany[] | undefined;
}

/**
 * Loads ingested records from data/ingested-targets.json statically from server code only.
 */
function loadIngestedTargets(): TargetCompany[] {
  try {
    if (fs.existsSync(INGESTED_DATA_PATH)) {
      const raw = fs.readFileSync(INGESTED_DATA_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.targets)) {
        return parsed.targets as TargetCompany[];
      }
    }
  } catch (err) {
    console.warn("Failed to load data/ingested-targets.json, using seed-only targets:", err);
  }
  return [];
}

/**
 * Returns seeds plus ingested records.
 * Dedupe by CIK with leading zeros stripped. The seed wins, but append the
 * ingested signals to the seed's vehicleDistress.secTriggers.
 */
export function getServerTargets(): TargetCompany[] {
  const now = new Date();

  // If in-memory cache is present and has targets, return with live clocks
  if (globalThis.__asset_liberator_targets && Array.isArray(globalThis.__asset_liberator_targets) && globalThis.__asset_liberator_targets.length > 0) {
    return globalThis.__asset_liberator_targets.map((t) => withLiveClock(t, now));
  }

  // Check /tmp cache for any server mutations
  let tmpTargets: TargetCompany[] | null = null;
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        tmpTargets = parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read server store file:", err);
  }

  const ingested = loadIngestedTargets();
  const mergedBase = mergeSeedAndIngestedTargets(INITIAL_TARGETS, ingested);

  if (tmpTargets && tmpTargets.length > 0) {
    // Overlay server modifications
    const updated = mergedBase.map((base) => {
      const match = tmpTargets!.find((p) => p.id === base.id || (p.ticker && p.ticker.toUpperCase() === base.ticker.toUpperCase()));
      if (match) {
        return {
          ...base,
          contacts: match.contacts && match.contacts.length > 0 ? match.contacts : base.contacts,
          crm: match.crm || base.crm,
        };
      }
      return base;
    });
    globalThis.__asset_liberator_targets = updated;
    return updated.map((t) => withLiveClock(t, now));
  }

  globalThis.__asset_liberator_targets = mergedBase;
  return mergedBase.map((t) => withLiveClock(t, now));
}

export function saveServerTargets(targets: TargetCompany[]): void {
  globalThis.__asset_liberator_targets = targets;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(targets, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist server store file", err);
  }
}

export function updateServerTargetContact(targetId: string, updatedContact: ExecutiveContact): TargetCompany[] {
  const targets = getServerTargets();
  const now = new Date().toISOString().split("T")[0];

  const updated = targets.map((t) => {
    if (t.id === targetId || t.ticker.toUpperCase() === targetId.toUpperCase()) {
      const exists = t.contacts.some((c) => c.id === updatedContact.id);
      let newContacts: ExecutiveContact[];

      if (exists) {
        newContacts = t.contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c));
      } else {
        newContacts = [updatedContact, ...t.contacts.slice(1)];
      }

      const activity: CrmActivity = {
        id: "act-" + Date.now(),
        date: now,
        type: "call",
        summary: `Updated contact: ${updatedContact.name} (${updatedContact.title}) - Phone: ${updatedContact.phone}`,
      };

      return {
        ...t,
        contacts: newContacts,
        crm: {
          ...t.crm,
          lastContactDate: now,
          activities: [activity, ...t.crm.activities],
        },
      };
    }
    return t;
  });

  saveServerTargets(updated);
  return updated;
}

export function addServerTargetContact(
  targetId: string,
  newContact: Omit<ExecutiveContact, "id">,
  setAsPrimary: boolean = false
): TargetCompany[] {
  const targets = getServerTargets();
  const now = new Date().toISOString().split("T")[0];

  const contactWithId: ExecutiveContact = {
    ...newContact,
    id: "contact-" + Date.now(),
  };

  const updated = targets.map((t) => {
    if (t.id === targetId || t.ticker.toUpperCase() === targetId.toUpperCase()) {
      const updatedContacts = setAsPrimary
        ? [contactWithId, ...t.contacts]
        : [...t.contacts, contactWithId];

      const activity: CrmActivity = {
        id: "act-" + Date.now(),
        date: now,
        type: "call",
        summary: `Added new contact: ${contactWithId.name} (${contactWithId.title}) - Phone: ${contactWithId.phone}`,
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

  saveServerTargets(updated);
  return updated;
}

export function setServerPrimaryContact(targetId: string, contactId: string): TargetCompany[] {
  const targets = getServerTargets();
  const now = new Date().toISOString().split("T")[0];

  const updated = targets.map((t) => {
    if (t.id === targetId || t.ticker.toUpperCase() === targetId.toUpperCase()) {
      const contact = t.contacts.find((c) => c.id === contactId);
      if (!contact) return t;

      const remaining = t.contacts.filter((c) => c.id !== contactId);
      return {
        ...t,
        contacts: [contact, ...remaining],
        crm: {
          ...t.crm,
          activities: [
            {
              id: "act-" + Date.now(),
              date: now,
              type: "filing_alert" as const,
              summary: `Promoted ${contact.name} (${contact.title}) to Primary Decision Maker`,
            },
            ...t.crm.activities,
          ],
        },
      };
    }
    return t;
  });

  saveServerTargets(updated);
  return updated;
}

export function logServerCallActivity(
  targetId: string,
  callDetails: {
    contactName: string;
    outcome: string;
    notes: string;
    nextFollowUpDate?: string;
    suggestedStage?: CrmStage;
  }
): TargetCompany[] {
  const targets = getServerTargets();
  const now = new Date().toISOString().split("T")[0];

  const updated = targets.map((t) => {
    if (t.id === targetId || t.ticker.toUpperCase() === targetId.toUpperCase()) {
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

  saveServerTargets(updated);
  return updated;
}

export function updateServerStage(targetId: string, stage: CrmStage, priority?: PriorityLevel): TargetCompany[] {
  const targets = getServerTargets();
  const now = new Date().toISOString().split("T")[0];

  const updated = targets.map((t) => {
    if (t.id === targetId || t.ticker.toUpperCase() === targetId.toUpperCase()) {
      return {
        ...t,
        crm: {
          ...t.crm,
          stage,
          priority: priority || t.crm.priority,
          lastContactDate: now,
          activities: [
            {
              id: "act-" + Date.now(),
              date: now,
              type: "filing_alert" as const,
              summary: `Pipeline stage moved to: ${stage.toUpperCase().replace("_", " ")}`,
            },
            ...t.crm.activities,
          ],
        },
      };
    }
    return t;
  });

  saveServerTargets(updated);
  return updated;
}

export function addServerNote(targetId: string, noteText: string, author: string = "Deal Desk"): TargetCompany[] {
  const targets = getServerTargets();
  const now = new Date().toISOString().split("T")[0];

  const updated = targets.map((t) => {
    if (t.id === targetId || t.ticker.toUpperCase() === targetId.toUpperCase()) {
      return {
        ...t,
        crm: {
          ...t.crm,
          notes: [
            {
              id: "note-" + Date.now(),
              date: now,
              author,
              text: noteText,
            },
            ...t.crm.notes,
          ],
        },
      };
    }
    return t;
  });

  saveServerTargets(updated);
  return updated;
}

export function logServerActivity(
  targetId: string,
  type: CrmActivity["type"],
  summary: string
): TargetCompany[] {
  const targets = getServerTargets();
  const now = new Date().toISOString().split("T")[0];

  const updated = targets.map((t) => {
    if (t.id === targetId || t.ticker.toUpperCase() === targetId.toUpperCase()) {
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

  saveServerTargets(updated);
  return updated;
}

export function logServerOutreach(
  targetId: string,
  contactName: string,
  summary: string
): TargetCompany[] {
  const targets = getServerTargets();
  const now = new Date().toISOString().split("T")[0];

  const updated = targets.map((t) => {
    if (t.id === targetId || t.ticker.toUpperCase() === targetId.toUpperCase()) {
      const activity: CrmActivity = {
        id: "act-" + Date.now(),
        date: now,
        type: "email",
        summary,
      };
      return {
        ...t,
        crm: {
          ...t.crm,
          stage: "outreach_sent" as const,
          lastContactDate: now,
          activities: [activity, ...t.crm.activities],
        },
      };
    }
    return t;
  });

  saveServerTargets(updated);
  return updated;
}
