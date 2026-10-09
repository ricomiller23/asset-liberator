import type { TargetCompany } from "../types";
import { normalizeCik, seedToCandidate } from "./seed";
import { mergeSignals } from "./ingest";
import { scoreCandidate } from "./model";
import { candidateToTargetCompany } from "./adapter";
import type { Candidate, CandidateStoreFile, ScoredCandidate } from "./types";

/**
 * Deduplicates seeds and ingested TargetCompany records by CIK with leading zeros stripped.
 * The seed wins, but append the ingested signals to the seed's vehicleDistress.secTriggers.
 */
export function mergeSeedAndIngestedTargets(
  seeds: TargetCompany[],
  ingested: TargetCompany[]
): TargetCompany[] {
  const byCik = new Map<string, TargetCompany>();

  // 1. Seed records take priority
  for (const s of seeds) {
    const norm = normalizeCik(s.cik);
    byCik.set(norm, { ...s });
  }

  // 2. Ingested records added or attached
  for (const ing of ingested) {
    const norm = normalizeCik(ing.cik);
    if (!norm) {
      // Non-SEC records without CIK (e.g. Canadian ca-tsx-*)
      byCik.set(ing.id, { ...ing });
      continue;
    }

    const existingSeed = byCik.get(norm);
    if (existingSeed) {
      // Seed wins, but append ingested triggers/signals
      const mergedTriggers = Array.from(
        new Set([...existingSeed.vehicleDistress.secTriggers, ...(ing.vehicleDistress.secTriggers || [])])
      );
      const mergedSignals = Array.from(
        new Set([...(existingSeed.signals || []), ...(ing.signals || [])])
      );
      byCik.set(norm, {
        ...existingSeed,
        vehicleDistress: {
          ...existingSeed.vehicleDistress,
          secTriggers: mergedTriggers,
        },
        signals: mergedSignals,
      });
    } else {
      byCik.set(norm, { ...ing });
    }
  }

  return [...byCik.values()];
}

/**
 * Build unified universe from candidate store
 */
export function buildUniverse(
  seeds: TargetCompany[],
  store: { candidates: Candidate[] },
  now: Date = new Date()
): ScoredCandidate[] {
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
