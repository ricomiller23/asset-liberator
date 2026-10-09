import { describe, it, expect } from "vitest";
import { withLiveClock } from "../lib/pipeline/clock";
import { deriveClocks } from "../lib/pipeline/model";
import type { Signal } from "../lib/pipeline/types";
import { INITIAL_TARGETS } from "../lib/data/targets";

describe("Live Catalyst Clock & Rule-of-Thumb Suite", () => {
  const NOW = new Date("2026-10-09T12:00:00Z");

  it("labels derived filing clocks with '(rule of thumb)'", () => {
    const signals: Signal[] = [
      { code: "nt_10k", date: "2026-10-01", form: "NT 10-K", url: "https://x" },
      { code: "nt_10q", date: "2026-10-01", form: "NT 10-Q", url: "https://x" },
      { code: "item_301", date: "2026-10-01", form: "8-K", url: "https://x" },
      { code: "item_103", date: "2026-10-01", form: "8-K", url: "https://x" },
      { code: "item_204", date: "2026-10-01", form: "8-K", url: "https://x" },
    ];

    const clocks = deriveClocks(signals);
    expect(clocks.length).toBe(5);

    // NT 10-K +15d
    const nt10k = clocks.find((c) => c.deadline === "2026-10-16")!;
    expect(nt10k).toBeDefined();
    expect(nt10k.basis).toContain("(rule of thumb)");

    // NT 10-Q +5d
    const nt10q = clocks.find((c) => c.deadline === "2026-10-06")!;
    expect(nt10q).toBeDefined();
    expect(nt10q.basis).toContain("(rule of thumb)");

    // Item 3.01 +180d
    const item301 = clocks.find((c) => c.label.includes("Listing cure"))!;
    expect(item301).toBeDefined();
    expect(item301.deadline).toBe("2027-03-30");

    // Item 1.03 +75d
    const item103 = clocks.find((c) => c.label.includes("363 sale"))!;
    expect(item103).toBeDefined();
    expect(item103.deadline).toBe("2026-12-15");

    // Item 2.04 +30d
    const item204 = clocks.find((c) => c.label.includes("Forbearance"))!;
    expect(item204).toBeDefined();
    expect(item204.deadline).toBe("2026-10-31");
  });

  it("never derives a clock from a synthetic or seed signal", () => {
    const seedSignals: Signal[] = [
      { code: "nt_10k", date: "2026-10-01", form: "seed", url: "https://x" },
      { code: "item_204", date: "2026-10-01", form: "seed", url: "https://x" },
    ];
    const clocks = deriveClocks(seedSignals);
    expect(clocks).toEqual([]);
  });

  it("recomputes daysRemaining dynamically from clock at read time", () => {
    const target = INITIAL_TARGETS[0];
    const originalDays = target.forcingEvent.daysRemaining;

    // Moving clock forward by 10 days
    const futureDate = new Date(NOW.getTime() + 10 * 24 * 60 * 60 * 1000);
    const updated = withLiveClock(target, futureDate);

    expect(updated.forcingEvent.daysRemaining).toBe(withLiveClock(target, NOW).forcingEvent.daysRemaining - 10);
  });
});
