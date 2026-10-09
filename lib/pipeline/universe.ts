import type { TargetCompany } from "../types";
import { mergeSignals } from "./ingest";
import { scoreCandidate } from "./model";
import { seedToCandidate } from "./seed";
import type { Candidate, CandidateStoreFile, ScoredCandidate } from "./types";

/**
 * The unified universe = adapted seed records + ingested EDGAR candidates, merged by CIK
 * and scored with the graded model. Seeds are never dropped; when an ingested candidate
 * shares a CIK with a seed, its signals are attached to the seed record.
 */
export function buildUniverse(seeds: TargetCompany[], store: CandidateStoreFile, now: Date = new Date()): ScoredCandidate[] {
  const byCik = new Map<string, Candidate>();

  for (const s of seeds) {
    const c = seedToCandidate(s);
    byCik.set(c.cik, c);
  }

  for (const ing of store.candidates) {
    const seed = byCik.get(ing.cik);
    if (seed) {
      byCik.set(ing.cik, {
        ...seed,
        signals: mergeSignals(seed.signals, ing.signals, now),
        separable: {
          ...seed.separable,
          ex21Count: Math.max(seed.separable.ex21Count, ing.separable.ex21Count),
          entities: Array.from(new Set([...seed.separable.entities, ...ing.separable.entities])),
          consolidatedRevenue: ing.separable.consolidatedRevenue ?? seed.separable.consolidatedRevenue,
          consolidatedEquity: ing.separable.consolidatedEquity ?? seed.separable.consolidatedEquity,
        },
        dataQualityFlags: [...seed.dataQualityFlags, "edgar_signals_attached"],
      });
    } else {
      byCik.set(ing.cik, ing);
    }
  }

  return [...byCik.values()].map((c) => scoreCandidate(c, now));
}
