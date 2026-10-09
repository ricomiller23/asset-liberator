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

  it("has valid contact details for every target company with registered executives", () => {
    const targets = getStoredTargets().filter((t) => t.contacts.length > 0);
    expect(targets.length).toBeGreaterThanOrEqual(18);
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

  it("verifies Alpine 4 Holdings (ALPP) contact is Jeff Nail and searchable", () => {
    const targets = getStoredTargets();
    const alpp = targets.find((t) => t.ticker === "ALPP");
    expect(alpp).toBeDefined();
    expect(alpp?.contacts[0].name).toBe("Jeff Nail");
    expect(alpp?.contacts[0].phone).toBe("(480) 702-2431");
    expect(alpp?.contacts[0].email).toBe("jnail@alpine4.com");

    const searchNail = searchTargetsAndContacts("Jeff Nail", targets);
    expect(searchNail.contacts.some((c) => c.target.ticker === "ALPP")).toBe(true);

    const searchPhone = searchTargetsAndContacts("702-2431", targets);
    expect(searchPhone.contacts.some((c) => c.target.ticker === "ALPP")).toBe(true);
  });

  it("verifies the 5 bounced targets have delivery failure notes recorded", () => {
    const targets = getStoredTargets();
    const bounceTickers = ["PHIL", "ZNOG", "LADX", "QPRC", "IQST"];

    bounceTickers.forEach((ticker) => {
      const target = targets.find((t) => t.ticker === ticker);
      expect(target).toBeDefined();
      const hasBounceNote = target?.crm.notes.some((n) => n.text.includes("[BOUNCE / UNDELIVERED]"));
      expect(hasBounceNote).toBe(true);
    });
  });
  it("verifies outside securities counsel or legal departments are registered for all key targets", () => {
    const targets = getStoredTargets();
    
    // Check XELA Loeb & Loeb
    const xela = targets.find((t) => t.ticker === "XELA");
    expect(xela?.contacts.some((c) => c.name.includes("Erik Mengwall") && c.phone === "(212) 407-4050")).toBe(true);

    // Check HCMC Cozen O'Connor
    const hcmc = targets.find((t) => t.ticker === "HCMC");
    expect(hcmc?.contacts.some((c) => c.name.includes("Martin T. Schrier") && c.phone === "(305) 704-5954")).toBe(true);

    // Check SING McGuireWoods
    const sing = targets.find((t) => t.ticker === "SING");
    expect(sing?.contacts.some((c) => c.name.includes("Stephen E. Older") && c.phone === "(212) 548-2122")).toBe(true);

    // Check QPRC Ellenoff Grossman
    const qprc = targets.find((t) => t.ticker === "QPRC");
    expect(qprc?.contacts.some((c) => c.name.includes("Asher S. Levitsky") && c.phone === "(212) 370-1300")).toBe(true);

    // Check PBIO Lucosky Brookman
    const pbio = targets.find((t) => t.ticker === "PBIO");
    expect(pbio?.contacts.some((c) => c.name.includes("John O'Leary") && c.phone === "(732) 395-4400")).toBe(true);

    // Check OZSC Brunson Chandler
    const ozsc = targets.find((t) => t.ticker === "OZSC");
    expect(ozsc?.contacts.some((c) => c.name.includes("Lance Brunson") && c.phone === "(801) 303-5730")).toBe(true);

    // Check RGBP Burningham Law Group
    const rgbp = targets.find((t) => t.ticker === "RGBP");
    expect(rgbp?.contacts.some((c) => c.name.includes("Branden T. Burningham") && c.phone === "(385) 355-5189")).toBe(true);

    // Check RWAX CM Law PLLC
    const rwax = targets.find((t) => t.ticker === "RWAX");
    expect(rwax?.contacts.some((c) => c.name.includes("James Meadows") && c.phone === "(202) 580-6500")).toBe(true);

    // Check ALPP Kirton McConkie
    const alpp = targets.find((t) => t.ticker === "ALPP");
    expect(alpp?.contacts.some((c) => c.name.includes("David Aboudi") && c.phone === "(801) 328-3600")).toBe(true);
  });
});
