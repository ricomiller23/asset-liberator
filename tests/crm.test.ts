import { describe, it, expect } from "vitest";
import { updateTargetCrmStage, addTargetCrmNote, logTargetActivity, getStoredTargets } from "../lib/crm";

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
});
