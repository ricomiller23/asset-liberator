import {
  EFTS_QUERIES,
  RawSignal,
  SecClient,
  dailyIndexUrl,
  findEx21File,
  padCik,
  parseDailyIndex,
  parseEx21,
  parseSubmissions,
  runEftsQuery,
  signalsFromIndexRows,
  stripCik,
  summarizeFacts,
} from "./edgar";
import { addDays, classify, distressScore, parseDate, scoreCandidate, sellerScore, toIsoDate } from "./model";
import type { Candidate, Signal } from "./types";

export interface IngestOptions {
  now: Date;
  windowDays: number;
  maxEnrich: number;
  fetchFacts: boolean;
  fetchEx21: boolean;
  eftsPages: number;
  /** keep at most this many candidates in the store */
  maxStore?: number;
  log?: (msg: string) => void;
}

export interface IngestStats {
  indexDays: number;
  indexSignals: number;
  eftsSignals: number;
  eftsSkipped: number;
  eftsErrors: string[];
  ciksSeen: number;
  enriched: number;
  enrichErrors: number;
  candidates: number;
}

interface CikBucket {
  cik: string;
  name: string;
  ticker?: string;
  sic?: string;
  incState?: string;
  signals: Signal[];
}

const SIGNAL_RETENTION_DAYS = 730;

function signalKey(s: Signal): string {
  return `${s.code}|${s.accession ?? s.date}`;
}

export function mergeSignals(a: Signal[], b: Signal[], now: Date): Signal[] {
  const cutoff = addDays(toIsoDate(now.getTime()), -SIGNAL_RETENTION_DAYS);
  const map = new Map<string, Signal>();
  for (const s of [...a, ...b]) {
    if (s.date < cutoff) continue;
    map.set(signalKey(s), s);
  }
  return [...map.values()].sort((x, y) => y.date.localeCompare(x.date));
}

function businessDays(now: Date, windowDays: number): string[] {
  const days: string[] = [];
  for (let i = 1; i <= windowDays; i++) {
    const d = new Date(now.getTime() - i * 86400000);
    const dow = d.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    days.push(toIsoDate(d.getTime()));
  }
  return days;
}

function chunks(now: Date, windowDays: number, size = 30): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  const end = toIsoDate(now.getTime());
  let cursorEnd = parseDate(end);
  const startLimit = cursorEnd - windowDays * 86400000;
  while (cursorEnd > startLimit) {
    const cursorStart = Math.max(startLimit, cursorEnd - size * 86400000);
    out.push([toIsoDate(cursorStart), toIsoDate(cursorEnd)]);
    cursorEnd = cursorStart;
  }
  return out;
}

export async function collectSignals(client: SecClient, opts: IngestOptions, stats: IngestStats): Promise<RawSignal[]> {
  const log = opts.log ?? (() => {});
  const raw: RawSignal[] = [];

  for (const day of businessDays(opts.now, opts.windowDays)) {
    try {
      const text = await client.getTextOrNull(dailyIndexUrl(day));
      if (!text) continue;
      const sigs = signalsFromIndexRows(parseDailyIndex(text));
      raw.push(...sigs);
      stats.indexDays++;
      stats.indexSignals += sigs.length;
    } catch (err) {
      stats.eftsErrors.push(`index ${day}: ${(err as Error).message}`);
    }
  }
  log(`daily index: ${stats.indexDays} days, ${stats.indexSignals} signals`);

  for (const spec of EFTS_QUERIES) {
    for (const [start, end] of chunks(opts.now, opts.windowDays)) {
      try {
        const r = await runEftsQuery(client, spec, start, end, opts.eftsPages);
        raw.push(...r.signals);
        stats.eftsSignals += r.signals.length;
        stats.eftsSkipped += r.skipped;
      } catch (err) {
        stats.eftsErrors.push(`efts ${spec.id} ${start}..${end}: ${(err as Error).message}`);
      }
    }
    log(`efts ${spec.id}: running total ${stats.eftsSignals}`);
  }
  return raw;
}

function groupByCik(raw: RawSignal[]): Map<string, CikBucket> {
  const map = new Map<string, CikBucket>();
  for (const r of raw) {
    const cik = stripCik(r.cik);
    let b = map.get(cik);
    if (!b) {
      b = { cik, name: r.company, signals: [] };
      map.set(cik, b);
    }
    if (!b.name && r.company) b.name = r.company;
    if (r.ticker && !b.ticker) b.ticker = r.ticker;
    if (r.sic && !b.sic) b.sic = r.sic;
    if (r.incState && !b.incState) b.incState = r.incState;
    b.signals.push(r.signal);
  }
  return map;
}

export async function runIngest(
  client: SecClient,
  opts: IngestOptions,
  existing: Candidate[] = []
): Promise<{ candidates: Candidate[]; stats: IngestStats }> {
  const log = opts.log ?? (() => {});
  const stats: IngestStats = {
    indexDays: 0,
    indexSignals: 0,
    eftsSignals: 0,
    eftsSkipped: 0,
    eftsErrors: [],
    ciksSeen: 0,
    enriched: 0,
    enrichErrors: 0,
    candidates: 0,
  };
  const today = toIsoDate(opts.now.getTime());
  const sinceDate = addDays(today, -opts.windowDays);

  const raw = await collectSignals(client, opts, stats);
  const buckets = groupByCik(raw);
  stats.ciksSeen = buckets.size;

  // Rank by preliminary signal strength so the enrichment budget goes to the best leads.
  const ranked = [...buckets.values()].sort((a, b) => {
    const sa = Math.max(distressScore(a.signals, opts.now), sellerScore(a.signals, opts.now));
    const sb = Math.max(distressScore(b.signals, opts.now), sellerScore(b.signals, opts.now));
    return sb - sa;
  });

  const existingByCik = new Map(existing.map((c) => [c.cik, c]));
  const out: Candidate[] = [];
  let enrichedCount = 0;

  for (const b of ranked) {
    const prev = existingByCik.get(b.cik);
    let signals = mergeSignals(prev?.signals ?? [], b.signals, opts.now);
    let name = b.name || prev?.name || `CIK ${b.cik}`;
    let ticker = b.ticker ?? prev?.ticker;
    let exchange = prev?.exchange;
    let sic = b.sic ?? prev?.sic;
    let incState = b.incState ?? prev?.incState;
    let separable = prev?.separable ?? { entities: [], ex21Count: 0, hasIp: false };

    if (enrichedCount < opts.maxEnrich) {
      enrichedCount++;
      try {
        const sub = await client.getJson<unknown>(`https://data.sec.gov/submissions/CIK${padCik(b.cik)}.json`);
        if (sub) {
          const meta = parseSubmissions(sub, b.cik, sinceDate);
          name = meta.name || name;
          ticker = meta.tickers[0] ?? ticker;
          exchange = meta.exchanges[0] ?? exchange;
          sic = meta.sic ?? sic;
          incState = meta.incState ?? incState;
          signals = mergeSignals(signals, meta.signals, opts.now);

          let entities = separable.entities;
          let evidenceUrl = separable.evidenceUrl;
          if (opts.fetchEx21 && meta.latest10K) {
            const base = `https://www.sec.gov/Archives/edgar/data/${b.cik}/${meta.latest10K.accession.replace(/-/g, "")}`;
            const idx = await client.getJson<unknown>(`${base}/index.json`);
            const file = idx ? findEx21File(idx) : undefined;
            if (file) {
              const html = await client.getTextOrNull(`${base}/${file}`);
              if (html) {
                entities = parseEx21(html).slice(0, 60);
                evidenceUrl = `${base}/${file}`;
              }
            }
          }

          let consolidatedRevenue = separable.consolidatedRevenue;
          let consolidatedEquity = separable.consolidatedEquity;
          if (opts.fetchFacts) {
            const facts = await client.getJson<unknown>(`https://data.sec.gov/api/xbrl/companyfacts/CIK${padCik(b.cik)}.json`);
            if (facts) {
              const f = summarizeFacts(facts);
              consolidatedRevenue = f.revenue ?? consolidatedRevenue;
              consolidatedEquity = f.equity ?? consolidatedEquity;
              if (f.equity !== undefined && f.equity < 0 && f.equityEnd) {
                signals = mergeSignals(
                  signals,
                  [
                    {
                      code: "equity_deficit",
                      date: f.equityEnd,
                      form: "XBRL",
                      url: `https://data.sec.gov/api/xbrl/companyfacts/CIK${padCik(b.cik)}.json`,
                      detail: `Stockholders' equity $${(f.equity / 1e6).toFixed(1)}M at ${f.equityEnd}`,
                    },
                  ],
                  opts.now
                );
              }
            }
          }
          separable = {
            ...separable,
            entities,
            ex21Count: entities.length,
            evidenceUrl,
            consolidatedRevenue,
            consolidatedEquity,
          };
          stats.enriched++;
        }
      } catch (err) {
        stats.enrichErrors++;
        log(`enrich ${b.cik} failed: ${(err as Error).message}`);
      }
    }

    const cls = classify(signals, { sic, incState, exchange, consolidatedRevenue: separable.consolidatedRevenue, entityCount: separable.entities.length }, opts.now);
    out.push({
      id: `edgar-${b.cik}`,
      cik: b.cik,
      ticker,
      name,
      exchange,
      sic,
      incState,
      class: cls,
      source: "edgar",
      provenance: "edgar_derived",
      signals,
      separable,
      control: prev?.control ?? { structure: "unknown", securedHolders: null },
      clocks: [],
      firstSeen: prev?.firstSeen ?? today,
      lastUpdated: today,
      dataQualityFlags: [],
    });
  }

  // Candidates seen before but not in this window's results are carried forward, aged by recency decay.
  const seen = new Set(out.map((c) => c.cik));
  for (const c of existing) {
    if (seen.has(c.cik)) continue;
    const signals = mergeSignals(c.signals, [], opts.now);
    if (signals.length) out.push({ ...c, signals });
  }

  const max = opts.maxStore ?? 2000;
  const final = out
    .map((c) => ({ c, p: scoreCandidate(c, opts.now).scores.priority }))
    .sort((a, b) => b.p - a.p)
    .slice(0, max)
    .map((x) => x.c);
  stats.candidates = final.length;
  return { candidates: final, stats };
}
