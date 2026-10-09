import { describe, it, expect } from "vitest";
import { SecClient } from "../lib/pipeline/edgar";
import { mergeSignals, runIngest } from "../lib/pipeline/ingest";
import { scoreCandidate } from "../lib/pipeline/model";
import type { Candidate, Signal } from "../lib/pipeline/types";

const NOW = new Date("2026-10-09T12:00:00Z");

const idxRow = (form: string, name: string, cik: string, date: string, file: string) =>
  `${form.padEnd(12)}${name.padEnd(62)}${cik.padEnd(12)}${date.padEnd(12)}${file}`;

const INDEX_1008 = [
  "Form Type   Company Name   CIK   Date Filed   File Name",
  "-".repeat(100),
  idxRow("NT 10-K", "BROKEN PARENT INC", "111", "20261008", "edgar/data/111/0000111-26-000010.txt"),
  idxRow("15-12G", "GONE SHELL CORP", "222", "20261008", "edgar/data/222/0000222-26-000011.txt"),
].join("\n");

const EFTS_204 = {
  hits: {
    total: { value: 1 },
    hits: [
      {
        _id: "0000111-26-000020:k.htm",
        _source: { ciks: ["0000000111"], display_names: ["BROKEN PARENT INC  (BRKN)  (CIK 0000000111)"], file_date: "2026-10-02", form: "8-K", adsh: "0000111-26-000020", items: ["2.04"], sics: ["3559"], inc_states: ["DE"] },
      },
    ],
  },
};

const SUBMISSIONS_111 = {
  name: "BROKEN PARENT INC",
  tickers: ["BRKN"],
  exchanges: ["OTC"],
  sic: "3559",
  stateOfIncorporation: "DE",
  filings: {
    recent: {
      form: ["10-K", "8-K"],
      filingDate: ["2026-04-01", "2026-10-02"],
      accessionNumber: ["0000111-26-000002", "0000111-26-000020"],
      primaryDocument: ["k.htm", "e.htm"],
      items: ["", "2.04"],
    },
  },
};

const EX21 = "<table><tr><td>Profitable Sub LLC</td><td>DE</td></tr><tr><td>Another Sub Inc.</td><td>TX</td></tr></table>";

const FACTS_111 = {
  facts: { "us-gaap": { StockholdersEquity: { units: { USD: [{ end: "2026-06-30", val: -9_000_000, form: "10-Q", fp: "Q2" }] } }, Revenues: { units: { USD: [{ end: "2025-12-31", val: 60_000_000, form: "10-K", fp: "FY" }] } } } },
};

function fakeFetch(opts: { eftsFails?: boolean } = {}): typeof fetch {
  return (async (url: string) => {
    const u = String(url);
    const json = (o: unknown) => new Response(JSON.stringify(o), { status: 200 });
    if (u.includes("daily-index")) return u.includes("form.20261008.idx") ? new Response(INDEX_1008, { status: 200 }) : new Response("", { status: 404 });
    if (u.startsWith("https://efts.sec.gov")) {
      if (opts.eftsFails) return new Response("nope", { status: 400 });
      return json(decodeURIComponent(u).includes("Triggering Events") ? EFTS_204 : { hits: { total: { value: 0 }, hits: [] } });
    }
    if (u.includes("submissions/CIK0000000111")) return json(SUBMISSIONS_111);
    if (u.includes("submissions/CIK0000000222")) return json({ name: "GONE SHELL CORP", tickers: [], exchanges: [], sic: "6770", stateOfIncorporation: "NV", filings: { recent: { form: [], filingDate: [], accessionNumber: [] } } });
    if (u.endsWith("/index.json")) return json({ directory: { item: [{ name: "ex21.htm" }] } });
    if (u.endsWith("/ex21.htm")) return new Response(EX21, { status: 200 });
    if (u.includes("companyfacts/CIK0000000111")) return json(FACTS_111);
    if (u.includes("companyfacts")) return new Response("", { status: 404 });
    return new Response("", { status: 404 });
  }) as unknown as typeof fetch;
}

const client = (f: typeof fetch) => new SecClient({ userAgent: "test t@example.com", fetchImpl: f, sleep: async () => {}, maxRetries: 0 });

const baseOpts = { now: NOW, windowDays: 7, maxEnrich: 10, fetchFacts: true, fetchEx21: true, eftsPages: 1 };

describe("runIngest (against a fake SEC)", () => {
  it("joins index + full-text + submissions + EX-21 + XBRL into one candidate per CIK", async () => {
    const { candidates, stats } = await runIngest(client(fakeFetch()), baseOpts);
    const broken = candidates.find((c) => c.cik === "111")!;
    expect(broken).toBeDefined();
    expect(broken.ticker).toBe("BRKN");
    expect(broken.source).toBe("edgar");
    expect(broken.provenance).toBe("edgar_derived");
    expect(broken.signals.map((s) => s.code).sort()).toEqual(["equity_deficit", "item_204", "nt_10k"]);
    expect(broken.separable.entities).toEqual(["Profitable Sub LLC", "Another Sub Inc."]);
    expect(broken.separable.consolidatedRevenue).toBe(60_000_000);
    expect(broken.class).toBe("distressed_carveout");
    expect(stats.enriched).toBe(2);
    expect(stats.indexDays).toBeGreaterThan(0);
    expect(stats.ciksSeen).toBe(2);
  });

  it("classifies a SIC 6770 Form 15 filer as a dormant shell", async () => {
    const { candidates } = await runIngest(client(fakeFetch()), baseOpts);
    expect(candidates.find((c) => c.cik === "222")!.class).toBe("dormant_shell");
  });

  it("does not auto-promote: unknown creditor structure keeps a strong lead out of 'actionable'", async () => {
    const { candidates } = await runIngest(client(fakeFetch()), baseOpts);
    const s = scoreCandidate(candidates.find((c) => c.cik === "111")!, NOW);
    expect(s.mustHaves.separableAsset).toBe(true);
    expect(s.mustHaves.identifiableCreditor).toBe(false);
    expect(s.bucket).not.toBe("actionable");
  });

  it("respects the enrichment budget", async () => {
    const { stats } = await runIngest(client(fakeFetch()), { ...baseOpts, maxEnrich: 1 });
    expect(stats.enriched).toBe(1);
  });

  it("records full-text failures but still returns index-derived candidates", async () => {
    const { candidates, stats } = await runIngest(client(fakeFetch({ eftsFails: true })), baseOpts);
    expect(stats.eftsErrors.length).toBeGreaterThan(0);
    expect(candidates.find((c) => c.cik === "111")!.signals.some((s) => s.code === "nt_10k")).toBe(true);
  });

  it("carries forward previously seen candidates and keeps their enriched data", async () => {
    const older: Candidate = {
      id: "edgar-333",
      cik: "333",
      name: "OLD LEAD CO",
      class: "distressed_carveout",
      source: "edgar",
      provenance: "edgar_derived",
      signals: [{ code: "nt_10k", date: "2026-08-01", form: "NT 10-K", url: "https://x", accession: "a" }],
      separable: { entities: ["Kept Sub LLC"], ex21Count: 1, hasIp: false },
      control: { structure: "single_holder", securedHolders: 1 },
      clocks: [],
      firstSeen: "2026-08-02",
      lastUpdated: "2026-08-02",
      dataQualityFlags: [],
    };
    const { candidates } = await runIngest(client(fakeFetch()), baseOpts, [older]);
    const kept = candidates.find((c) => c.cik === "333")!;
    expect(kept.separable.entities).toEqual(["Kept Sub LLC"]);
    expect(kept.control.structure).toBe("single_holder");
    expect(kept.firstSeen).toBe("2026-08-02");
  });
});

describe("mergeSignals", () => {
  const s = (code: Signal["code"], date: string, accession: string): Signal => ({ code, date, form: "t", url: "u", accession });
  it("dedupes by code+accession and drops signals older than two years", () => {
    const merged = mergeSignals([s("nt_10k", "2026-09-01", "a"), s("nt_10k", "2023-01-01", "old")], [s("nt_10k", "2026-09-01", "a"), s("item_204", "2026-09-02", "b")], NOW);
    expect(merged.map((x) => `${x.code}:${x.accession}`).sort()).toEqual(["item_204:b", "nt_10k:a"]);
  });
});
