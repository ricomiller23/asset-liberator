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
  const byKey = new Map<string, TargetCompany>();

  // 1. Seed records take priority
  for (const s of seeds) {
    const norm = normalizeCik(s.cik);
    const key = norm ? `cik-${norm}` : s.id;
    byKey.set(key, { ...s });
  }

  // 2. Ingested records added or attached
  for (const ing of ingested) {
    const norm = normalizeCik(ing.cik);
    const key = norm ? `cik-${norm}` : ing.id;

    const existingSeed = byKey.get(key);
    if (existingSeed) {
      // Seed wins, but append ingested triggers/signals
      const mergedTriggers = Array.from(
        new Set([...existingSeed.vehicleDistress.secTriggers, ...(ing.vehicleDistress.secTriggers || [])])
      );
      const mergedSignals = Array.from(
        new Set([...(existingSeed.signals || []), ...(ing.signals || [])])
      );
      byKey.set(key, {
        ...existingSeed,
        vehicleDistress: {
          ...existingSeed.vehicleDistress,
          secTriggers: mergedTriggers,
        },
        signals: mergedSignals,
      });
    } else {
      byKey.set(key, { ...ing });
    }
  }

  return [...byKey.values()];
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
    const key = c.cik || c.id;
    byCik.set(key, c);
  }

  for (const ing of store.candidates) {
    const key = ing.cik || ing.id;
    const seed = byCik.get(key);
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
