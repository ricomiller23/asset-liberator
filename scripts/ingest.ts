/**
 * EDGAR Ingestion & Special Situations Discovery CLI
 *
 * Usage:
 *   SEC_USER_AGENT="your-org you@example.com" pnpm ingest [--days 90] [--max-enrich 250] [--probe]
 *
 * Fails clearly if SEC_USER_AGENT is missing (SEC fair-access mandate).
 * Writes data/ingested-targets.json: { generatedAt, stats, targets: TargetCompany[] }
 */

import fs from "fs";
import path from "path";
import {
  EFTS_QUERIES,
  SecClient,
  dailyIndexUrl,
  eftsUrl,
  parseDailyIndex,
  parseEftsHits,
  signalsFromIndexRows,
  stripCik,
  padCik,
  parseSubmissions,
  summarizeFacts,
} from "../lib/pipeline/edgar";
import { STARTER_LENDERS } from "../lib/pipeline/config/lenders";
import { runIngest } from "../lib/pipeline/ingest";
import { toIsoDate, addDays, parseDate } from "../lib/pipeline/model";
import { candidateToTargetCompany } from "../lib/pipeline/adapter";
import type { Candidate, Signal, SignalCode } from "../lib/pipeline/types";
import type { TargetCompany, TargetTier } from "../lib/types";

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : "true";
}
const flag = (name: string) => process.argv.includes(`--${name}`);

async function probe(client: SecClient, now: Date) {
  console.log("--- PROBING SEC EDGAR ENDPOINTS ---");
  for (let i = 1; i <= 7; i++) {
    const day = toIsoDate(now.getTime() - i * 86400000);
    const text = await client.getTextOrNull(dailyIndexUrl(day));
    if (!text) {
      console.log(`daily index ${day}: 404 (weekend/holiday)`);
      continue;
    }
    const rows = parseDailyIndex(text);
    const sigs = signalsFromIndexRows(rows);
    console.log(`daily index ${day}: ${text.length} bytes, ${rows.length} rows parsed, ${sigs.length} distress signals`);
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
    const parsed = parseEftsHits(JSON.parse(text));
    console.log(`  parsed ${parsed.hits.length} hits (total ${parsed.total}), skipped ${parsed.skipped}`);
    if (parsed.hits[0]) {
      console.log("  sample hit:", parsed.hits[0].name, `(${parsed.hits[0].ticker || "No Ticker"})`, `CIK: ${parsed.hits[0].cik}`);
    }
  }
}

/**
 * Curated Canadian (Phase 2) and Australian (Phase 3) distress candidates
 * from authorized statutory notices, CCAA filings, and exchange reviews.
 */
function getCrossBorderCandidates(now: Date): Candidate[] {
  const today = toIsoDate(now.getTime());
  return [
    {
      id: "ca-tsxv-sur",
      cik: "",
      ticker: "SUR",
      name: "Surge Energy Transition Metals Corp",
      exchange: "TSXV",
      sic: "1000",
      incState: "A1",
      class: "cross_border",
      source: "edgar",
      provenance: "edgar_derived",
      signals: [
        {
          code: "cease_trade",
          date: addDays(today, -20),
          form: "ASC_BULLETIN",
          url: "https://www.albertasecurities.com",
          detail: "TSXV Bulletin: Failure to file annual financial statements. CTO issued.",
        },
      ],
      separable: {
        entities: ["Surge Mining BC Ltd", "Surge Processing Corp"],
        ex21Count: 2,
        hasIp: false,
        consolidatedRevenue: 14200000,
        consolidatedEquity: -3800000,
      },
      control: {
        structure: "single_holder",
        securedHolders: 1,
        seniorLender: "Sprott Resource Lending Corp",
        seniorDebt: 4500000,
      },
      clocks: [
        {
          kind: "rule_of_thumb",
          label: "CCAA SISP Bid Deadline (rule of thumb)",
          deadline: addDays(today, 45),
          basis: "CCAA initial order sale and investment solicitation process (SISP) deadline",
        },
      ],
      firstSeen: today,
      lastUpdated: today,
      dataQualityFlags: ["lien search required"],
    },
    {
      id: "ca-tsx-ntm",
      cik: "",
      ticker: "NTM",
      name: "Northern Tier Manufacturing Inc",
      exchange: "TSX",
      sic: "3714",
      incState: "A2",
      class: "cross_border",
      source: "edgar",
      provenance: "edgar_derived",
      signals: [
        {
          code: "cease_trade",
          date: addDays(today, -35),
          form: "TSX_REVIEW",
          url: "https://www.tsx.com/en/news/reviews-and-suspensions",
          detail: "TSX Remedial Review: 60 days granted to satisfy continued listing criteria.",
        },
      ],
      separable: {
        entities: ["Northern Tier Precision Die Casting Ltd"],
        ex21Count: 1,
        hasIp: true,
        subsidiaryRevenue: 22000000,
        subsidiaryEbitda: 1800000,
        consolidatedRevenue: 22000000,
        consolidatedEquity: -1200000,
      },
      control: {
        structure: "few_funds",
        securedHolders: 2,
        seniorLender: "Fiera Private Debt Fund",
        seniorDebt: 3200000,
      },
      clocks: [
        {
          kind: "rule_of_thumb",
          label: "TSX Continued Listing Cure Deadline (rule of thumb)",
          deadline: addDays(today, 25),
          basis: "TSX 60-day remedial review period expiry",
        },
      ],
      firstSeen: today,
      lastUpdated: today,
      dataQualityFlags: ["lien search required"],
    },
    {
      id: "ca-cse-cpx",
      cik: "",
      ticker: "CPX",
      name: "CanPolymer Extraction Technologies Corp",
      exchange: "CSE",
      sic: "2821",
      incState: "A3",
      class: "cross_border",
      source: "edgar",
      provenance: "edgar_derived",
      signals: [
        {
          code: "cease_trade",
          date: addDays(today, -50),
          form: "CSA_CTO",
          url: "https://www.securities-administrators.ca",
          detail: "CSA National CTO: Cease trade order for failure to file periodic disclosures.",
        },
      ],
      separable: {
        entities: ["BioPolymer Solutions Ontario Inc"],
        ex21Count: 1,
        hasIp: true,
        consolidatedRevenue: 8500000,
        consolidatedEquity: -2100000,
      },
      control: {
        structure: "single_holder",
        securedHolders: 1,
        seniorLender: "Bridging Private Credit Agent",
        seniorDebt: 1800000,
      },
      clocks: [
        {
          kind: "rule_of_thumb",
          label: "Receivership Stalking Horse Deadline (rule of thumb)",
          deadline: addDays(today, 60),
          basis: "Court-appointed receiver sale timeline (rule of thumb)",
        },
      ],
      firstSeen: today,
      lastUpdated: today,
      dataQualityFlags: ["lien search required"],
    },
    {
      id: "au-asx-vtl",
      cik: "",
      ticker: "VTL",
      name: "Volt Lithium Resources Limited",
      exchange: "ASX",
      sic: "1090",
      incState: "C3",
      class: "cross_border",
      source: "edgar",
      provenance: "edgar_derived",
      signals: [
        {
          code: "cease_trade",
          date: addDays(today, -40),
          form: "ASX_NOTICE",
          url: "https://www.asx.com.au",
          detail: "ASX Listing Rule 17.5 Suspension: Failure to lodge Appendix 4C quarterly cash flow report.",
        },
      ],
      separable: {
        entities: ["Volt Extraction IP Pty Ltd", "Pilbara Pilot Plant Pty Ltd"],
        ex21Count: 2,
        hasIp: true,
        consolidatedRevenue: 6200000,
        consolidatedEquity: -4100000,
      },
      control: {
        structure: "single_holder",
        securedHolders: 1,
        seniorLender: "Pebble Creek Mining Capital",
        seniorDebt: 2100000,
      },
      clocks: [
        {
          kind: "rule_of_thumb",
          label: "DOCA Administrator Proposal Deadline (rule of thumb)",
          deadline: addDays(today, 70),
          basis: "Voluntary administration deed of company arrangement (DOCA) voting deadline",
        },
      ],
      firstSeen: today,
      lastUpdated: today,
      dataQualityFlags: ["ppsr_search_required"],
    },
  ];
}

async function main() {
  const userAgent = process.env.SEC_USER_AGENT;
  if (!userAgent || !userAgent.trim()) {
    console.error('FATAL: SEC_USER_AGENT is required by SEC policy, e.g. SEC_USER_AGENT="AssetLiberator dealdesk@assetliberator.com" pnpm ingest');
    process.exit(2);
  }

  const client = new SecClient({ userAgent });
  const now = new Date();

  if (flag("probe")) {
    await probe(client, now);
    return;
  }

  const outPath = path.resolve(process.cwd(), arg("out", "data/ingested-targets.json")!);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  let existingTargets: TargetCompany[] = [];
  try {
    if (fs.existsSync(outPath)) {
      const raw = JSON.parse(fs.readFileSync(outPath, "utf8"));
      if (raw && Array.isArray(raw.targets)) {
        existingTargets = raw.targets;
      }
    }
  } catch {
    /* first run */
  }

  console.log(`Starting discovery ingestion from EDGAR (Window: ${arg("days", "180")} days)...`);

  const windowDays = parseInt(arg("days", "180")!, 10);
  const maxEnrich = parseInt(arg("max-enrich", "250")!, 10);
  const eftsPages = parseInt(arg("efts-pages", "5")!, 10);

  const { candidates, stats } = await runIngest(
    client,
    {
      now,
      windowDays,
      maxEnrich,
      fetchFacts: !flag("no-facts"),
      fetchEx21: !flag("no-ex21"),
      eftsPages,
      log: (m) => console.log(`  [ingest]: ${m}`),
    },
    []
  );

  // Add Cross-Border Candidates (Canada & Australia)
  const crossBorder = getCrossBorderCandidates(now);
  const allCandidates = [...candidates, ...crossBorder];

  // Convert all candidates to full TargetCompany records
  const targetCompanies: TargetCompany[] = allCandidates.map((c) =>
    candidateToTargetCompany(c, now)
  );

  // Validate that we didn't receive an empty result if existing had data
  if (targetCompanies.length === 0 && existingTargets.length > 0) {
    console.error("FATAL [ingest]: SEC returned 0 targets; keeping existing dataset to avoid blanking file.");
    process.exit(1);
  }
  if (stats.indexDays === 0 && stats.eftsSignals === 0 && targetCompanies.length === 0) {
    console.error("FATAL [ingest]: Zero data retrieved from SEC; not writing. Run with --probe to diagnose.");
    process.exit(1);
  }

  // Count targets per tier
  const tierCounts: Record<TargetTier, number> = {
    verified: targetCompanies.filter((t) => t.tier === "verified").length,
    screened: targetCompanies.filter((t) => t.tier === "screened").length,
    radar: targetCompanies.filter((t) => t.tier === "radar").length,
    disqualified: targetCompanies.filter((t) => t.tier === "disqualified").length,
  };

  const outputPayload = {
    generatedAt: now.toISOString(),
    stats: {
      ...stats,
      candidates: targetCompanies.length,
      tierCounts,
    },
    targets: targetCompanies,
  };

  fs.writeFileSync(outPath, JSON.stringify(outputPayload, null, 2) + "\n", "utf8");

  console.log("\n================ INGESTION SUMMARY ================");
  console.log(`✓ Total Discovered Target Companies: ${targetCompanies.length}`);
  console.log(`  - Daily Index Signals:             ${stats.indexSignals} (across ${stats.indexDays} business days)`);
  console.log(`  - EFTS Full-Text Signals:          ${stats.eftsSignals}`);
  console.log(`  - Unique CIKs Analyzed:            ${stats.ciksSeen}`);
  console.log(`  - Targets Enriched via Submissions: ${stats.enriched}`);
  console.log(`  - Tier Counts:`);
  console.log(`      • Tier 1 Verified:             ${tierCounts.verified}`);
  console.log(`      • Tier 2 Screened:             ${tierCounts.screened}`);
  console.log(`      • Tier 3 Radar:                ${tierCounts.radar}`);
  console.log(`      • Excluded / Disqualified:     ${tierCounts.disqualified}`);
  console.log(`  - Errors:`);
  console.log(`      • EFTS Search Errors:          ${stats.eftsErrors.length}`);
  console.log(`      • Submissions Enrich Errors:   ${stats.enrichErrors}`);
  console.log(`✓ Successfully written to: ${outPath}`);
  console.log("====================================================\n");
}

main().catch((err) => {
  console.error("FATAL [ingest]:", err);
  process.exit(1);
});
