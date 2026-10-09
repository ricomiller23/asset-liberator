/**
 * EDGAR ingestion CLI.
 *
 *   SEC_USER_AGENT="your-org you@example.com" pnpm ingest [--days 90] [--max-enrich 150]
 *                                                         [--no-facts] [--no-ex21]
 *                                                         [--efts-pages 5] [--out data/candidates.json]
 *   SEC_USER_AGENT="..." pnpm ingest --probe     # print raw response shapes and parser output
 *
 * SEC_USER_AGENT is required by SEC fair-access policy and is deliberately not defaulted
 * (this repo is public; do not commit contact details).
 */
import fs from "fs";
import path from "path";
import { EFTS_QUERIES, SecClient, dailyIndexUrl, eftsUrl, parseDailyIndex, parseEftsHits, signalsFromIndexRows } from "../lib/pipeline/edgar";
import { runIngest } from "../lib/pipeline/ingest";
import { toIsoDate } from "../lib/pipeline/model";
import type { CandidateStoreFile } from "../lib/pipeline/types";

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : "true";
}
const flag = (name: string) => process.argv.includes(`--${name}`);

async function probe(client: SecClient, now: Date) {
  // Most recent weekday daily index that exists.
  for (let i = 1; i <= 7; i++) {
    const day = toIsoDate(now.getTime() - i * 86400000);
    const text = await client.getTextOrNull(dailyIndexUrl(day));
    if (!text) {
      console.log(`daily index ${day}: 404 (weekend/holiday?)`);
      continue;
    }
    const rows = parseDailyIndex(text);
    const sigs = signalsFromIndexRows(rows);
    console.log(`daily index ${day}: ${text.length} bytes, ${rows.length} rows parsed, ${sigs.length} distress-form signals`);
    console.log(text.split("\n").slice(0, 14).join("\n"));
    break;
  }
  const end = toIsoDate(now.getTime());
  const start = toIsoDate(now.getTime() - 30 * 86400000);
  for (const spec of EFTS_QUERIES.slice(0, 3)) {
    const url = eftsUrl(spec, start, end);
    const text = await client.getTextOrNull(url);
    console.log(`\nefts ${spec.id}: ${url}`);
    if (!text) {
      console.log("  404");
      continue;
    }
    console.log("  raw head:", text.slice(0, 500).replace(/\s+/g, " "));
    const parsed = parseEftsHits(JSON.parse(text));
    console.log(`  parsed ${parsed.hits.length} hits (total ${parsed.total}), skipped ${parsed.skipped}`);
    console.log("  first hit:", JSON.stringify(parsed.hits[0] ?? null));
  }
}

async function main() {
  const userAgent = process.env.SEC_USER_AGENT;
  if (!userAgent) {
    console.error('SEC_USER_AGENT is required, e.g. SEC_USER_AGENT="asset-liberator you@example.com" pnpm ingest');
    process.exit(2);
  }
  const client = new SecClient({ userAgent });
  const now = new Date();

  if (flag("probe")) {
    await probe(client, now);
    return;
  }

  const out = path.resolve(process.cwd(), arg("out", "data/candidates.json")!);
  let existing: CandidateStoreFile = { generatedAt: null, candidates: [] };
  try {
    existing = JSON.parse(fs.readFileSync(out, "utf8")) as CandidateStoreFile;
  } catch {
    /* first run */
  }

  const windowDays = parseInt(arg("days", "90")!, 10);
  const { candidates, stats } = await runIngest(
    client,
    {
      now,
      windowDays,
      maxEnrich: parseInt(arg("max-enrich", "150")!, 10),
      fetchFacts: !flag("no-facts"),
      fetchEx21: !flag("no-ex21"),
      eftsPages: parseInt(arg("efts-pages", "5")!, 10),
      log: (m) => console.log(m),
    },
    existing.candidates
  );

  console.log(JSON.stringify(stats, null, 2));

  // Refuse to overwrite a populated store with an empty result (e.g. SEC blocked us entirely).
  if (candidates.length === 0 && existing.candidates.length > 0) {
    console.error("Ingest produced 0 candidates; keeping the existing store. Check stats.eftsErrors above.");
    process.exit(1);
  }
  if (stats.indexDays === 0 && stats.eftsSignals === 0) {
    console.error("No data retrieved from SEC at all; not writing. Run with --probe to diagnose.");
    process.exit(1);
  }

  const file: CandidateStoreFile = { generatedAt: now.toISOString(), windowDays, candidates };
  fs.writeFileSync(out, JSON.stringify(file, null, 1) + "\n");
  console.log(`Wrote ${candidates.length} candidates to ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
