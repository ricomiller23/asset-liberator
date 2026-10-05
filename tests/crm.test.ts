import { describe, it, expect, beforeEach } from "vitest";
import { 
  getStoredTargets, 
  updateTargetCrmStage, 
  addTargetCrmNote, 
  logTargetActivity,
  updateTargetContact,
  addTargetContact,
  setPrimaryContact,
  deleteTargetContact,
  logCallActivity,
  searchTargetsAndContacts
} from "../lib/crm";

describe("CRM Pipeline State Management Suite", () => {
  it("loads default targets when storage is uninitialized", () => {
    const targets = getStoredTargets();
    expect(targets.length).toBeGreaterThan(0);
    expect(targets[0].contacts.length).toBeGreaterThan(0);
  });

  it("has valid contact details for every target company", () => {
    const targets = getStoredTargets();
    targets.forEach((t) => {
      expect(t.contacts.length).toBeGreaterThan(0);
      t.contacts.forEach((c) => {
        expect(c.name).toBeTruthy();
        expect(c.email).toContain("@");
        expect(c.phone).toBeTruthy();
        expect(c.title).toBeTruthy();
      });
    });
  });

  it("updates an existing contact person name and phone number", () => {
    const targets = getStoredTargets();
    const target = targets[0];
    const contact = target.contacts[0];

    const updatedContact = {
      ...contact,
      name: "Jane Doe (New CEO)",
      phone: "(949) 555-0199",
      title: "Interim Chief Executive Officer",
    };

    const result = updateTargetContact(target.id, updatedContact);
    const updatedTarget = result.find((t) => t.id === target.id);
    const targetContact = updatedTarget?.contacts.find((c) => c.id === contact.id);

    expect(targetContact?.name).toBe("Jane Doe (New CEO)");
    expect(targetContact?.phone).toBe("(949) 555-0199");
    expect(targetContact?.title).toBe("Interim Chief Executive Officer");
  });

  it("adds a new contact and allows setting them as primary", () => {
    const targets = getStoredTargets();
    const target = targets[0];

    const newContact = {
      name: "Robert Vance",
      title: "Court-Appointed Receiver",
      entity: "Legal Counsel" as const,
      email: "rvance@restructuringlaw.com",
      phone: "(212) 555-9876",
      roleSummary: "Special receiver managing corporate assets.",
      receptivityScore: "very_high" as const,
    };

    const result = addTargetContact(target.id, newContact, true);
    const updatedTarget = result.find((t) => t.id === target.id);
    expect(updatedTarget?.contacts[0].name).toBe("Robert Vance");
    expect(updatedTarget?.contacts[0].phone).toBe("(212) 555-9876");
  });

  it("logs a structured call outcome and updates notes & activities", () => {
    const targets = getStoredTargets();
    const target = targets[0];

    const result = logCallActivity(target.id, {
      contactName: "Stephen Snowdy",
      outcome: "Connected - Meaningful Dialogue",
      notes: "Discussed Article 9 debt purchase. Interested in clean shell recap.",
      nextFollowUpDate: "2026-10-12",
      suggestedStage: "in_dialogue",
    });

    const updatedTarget = result.find((t) => t.id === target.id);
    expect(updatedTarget?.crm.stage).toBe("in_dialogue");
    expect(updatedTarget?.crm.nextFollowUpDate).toBe("2026-10-12");
    expect(updatedTarget?.crm.notes[0].text).toContain("Stephen Snowdy");
    expect(updatedTarget?.crm.activities[0].summary).toContain("[CALL LOGGED]");
  });

  it("searches across people, companies, and tickers from anywhere", () => {
    const targets = getStoredTargets();
    
    // Search by ticker
    const tickerSearch = searchTargetsAndContacts("NLST", targets);
    expect(tickerSearch.companies.some((c) => c.target.ticker === "NLST")).toBe(true);

    // Search by person name
    const firstContactName = targets[0].contacts[0].name.split(" ")[0];
    const personSearch = searchTargetsAndContacts(firstContactName, targets);
    expect(personSearch.contacts.length).toBeGreaterThan(0);
    expect(personSearch.contacts[0].contact.name).toContain(firstContactName);

    // Search by phone digits
    const phoneSample = targets[0].contacts[0].phone.replace(/[^0-9]/g, "").slice(0, 5);
    const phoneSearch = searchTargetsAndContacts(phoneSample, targets);
    expect(phoneSearch.contacts.length).toBeGreaterThan(0);
  });
});
