import { describe, it, expect } from "vitest";
import {
  EFTS_QUERIES,
  SecClient,
  dailyIndexUrl,
  eftsUrl,
  findEx21File,
  parseDailyIndex,
  parseEftsHits,
  parseEx21,
  parseSubmissions,
  signalsFromHits,
  signalsFromIndexRows,
  summarizeFacts,
} from "../lib/pipeline/edgar";

const row = (form: string, name: string, cik: string, date: string, file: string) =>
  `${form.padEnd(12)}${name.padEnd(62)}${cik.padEnd(12)}${date.padEnd(12)}${file}`;

const INDEX = [
  "Form Type   Company Name                                                  CIK         Date Filed  File Name",
  "-".repeat(120),
  row("NT 10-K", "ACME HOLDINGS INC", "1234567", "20261008", "edgar/data/1234567/0001234567-26-000012.txt"),
  row("15-12G", "DEAD SHELL CORP", "7654321", "20261008", "edgar/data/7654321/0007654321-26-000003.txt"),
  row("8-K", "NORMAL CO", "111", "20261008", "edgar/data/111/0000111-26-000001.txt"),
  row("10-K", "ANOTHER CO", "222", "20261008", "edgar/data/222/0000222-26-000002.txt"),
  row("NT 10-Q", "LATE & CO LLC", "333", "20261008", "edgar/data/333/0000333-26-000004.txt"),
].join("\n");

describe("daily form index", () => {
  it("parses rows, normalises dates, and maps only distress forms to signals", () => {
    const rows = parseDailyIndex(INDEX);
    expect(rows).toHaveLength(5);
    expect(rows[0]).toMatchObject({ form: "NT 10-K", company: "ACME HOLDINGS INC", cik: "1234567", date: "2026-10-08" });
    const sigs = signalsFromIndexRows(rows);
    expect(sigs.map((s) => s.signal.code).sort()).toEqual(["form_15", "nt_10k", "nt_10q"]);
    const nt = sigs.find((s) => s.signal.code === "nt_10k")!;
    expect(nt.signal.accession).toBe("0001234567-26-000012");
    expect(nt.signal.url).toBe("https://www.sec.gov/Archives/edgar/data/1234567/0001234567-26-000012.txt");
  });

  it("builds the quarterly daily-index URL", () => {
    expect(dailyIndexUrl("2026-10-08")).toBe("https://www.sec.gov/Archives/edgar/daily-index/2026/QTR4/form.20261008.idx");
    expect(dailyIndexUrl("2026-02-03")).toBe("https://www.sec.gov/Archives/edgar/daily-index/2026/QTR1/form.20260203.idx");
  });
});

describe("efts full-text search", () => {
  const json = {
    hits: {
      total: { value: 3 },
      hits: [
        {
          _id: "0001193125-26-123456:d8k.htm",
          _source: { ciks: ["0001620179"], display_names: ["EXELA TECHNOLOGIES, INC.  (XELA)  (CIK 0001620179)"], file_date: "2026-10-02", form: "8-K", adsh: "0001193125-26-123456", items: ["2.04", "9.01"], sics: ["7374"], inc_states: ["DE"] },
        },
        {
          _id: "0000999-26-000001:x.htm",
          _source: { ciks: ["0000000999"], display_names: ["NO TICKER HOLDINGS LLC  (CIK 0000000999)"], file_date: "2026-10-03", form: "8-K", adsh: "0000999-26-000001", items: ["5.02"] },
        },
        { _id: "bad", _source: { file_date: "2026-10-03" } },
      ],
    },
  };

  it("parses names, tickers and URLs, and counts malformed hits as skipped", () => {
    const p = parseEftsHits(json);
    expect(p.total).toBe(3);
    expect(p.skipped).toBe(1);
    expect(p.hits[0]).toMatchObject({ cik: "1620179", name: "EXELA TECHNOLOGIES, INC.", ticker: "XELA", items: ["2.04", "9.01"], incState: "DE" });
    expect(p.hits[0].url).toBe("https://www.sec.gov/Archives/edgar/data/1620179/000119312526123456/d8k.htm");
    expect(p.hits[1].ticker).toBeUndefined();
    expect(p.hits[1].name).toBe("NO TICKER HOLDINGS LLC");
  });

  it("applies the 8-K item check only when items are listed", () => {
    const spec = EFTS_QUERIES.find((q) => q.id === "204")!;
    const p = parseEftsHits(json);
    const sigs = signalsFromHits(spec, p.hits);
    expect(sigs).toHaveLength(1);
    expect(sigs[0].cik).toBe("1620179");
    const noItems = signalsFromHits(spec, [{ ...p.hits[1], items: [] }]);
    expect(noItems).toHaveLength(1);
  });

  it("survives an empty or unexpected response", () => {
    expect(parseEftsHits({}).hits).toEqual([]);
    expect(parseEftsHits(null).hits).toEqual([]);
  });

  it("encodes the query", () => {
    const url = eftsUrl(EFTS_QUERIES[0], "2026-09-01", "2026-10-01", 100);
    expect(url).toContain("startdt=2026-09-01");
    expect(url).toContain("forms=8-K");
    expect(url).toContain("from=100");
  });
});

describe("submissions", () => {
  const sub = {
    name: "ACME HOLDINGS INC",
    tickers: ["ACME"],
    exchanges: ["OTC"],
    sic: "3728",
    stateOfIncorporation: "NV",
    filings: {
      recent: {
        form: ["8-K", "10-K", "NT 10-K", "8-K", "10-K"],
        filingDate: ["2026-09-20", "2026-04-01", "2026-09-29", "2025-01-02", "2025-03-30"],
        accessionNumber: ["0001-26-000005", "0001-26-000002", "0001-26-000006", "0001-25-000001", "0001-25-000002"],
        primaryDocument: ["a.htm", "k.htm", "nt.htm", "old.htm", "oldk.htm"],
        items: ["2.04,9.01", "", "", "3.01", ""],
      },
    },
  };

  it("extracts 8-K item signals inside the window and the latest 10-K", () => {
    const m = parseSubmissions(sub, "0000001", "2026-07-01");
    expect(m.name).toBe("ACME HOLDINGS INC");
    expect(m.tickers).toEqual(["ACME"]);
    expect(m.incState).toBe("NV");
    expect(m.signals.map((s) => s.code).sort()).toEqual(["item_204", "nt_10k"]);
    expect(m.latest10K).toMatchObject({ accession: "0001-26-000002", filingDate: "2026-04-01" });
  });
});

describe("EX-21", () => {
  const html = `<html><body><table>
    <tr><td>Exhibit 21.1</td></tr>
    <tr><td>Subsidiaries of the Registrant</td></tr>
    <tr><td>Name of Subsidiary</td><td>State or Other Jurisdiction</td></tr>
    <tr><td>SourceHOV Healthcare, Inc.</td><td>Delaware</td></tr>
    <tr><td>Exela Holdings LLC</td><td>Delaware</td></tr>
    <tr><td>BancTec Limited</td><td>United Kingdom</td></tr>
    <tr><td>Delaware</td></tr>
    </table></body></html>`;

  it("extracts entity names and ignores headers and jurisdictions", () => {
    const names = parseEx21(html);
    expect(names).toContain("SourceHOV Healthcare, Inc.");
    expect(names).toContain("Exela Holdings LLC");
    expect(names).toContain("BancTec Limited");
    expect(names).not.toContain("Delaware");
    expect(names.some((n) => /subsidiaries of/i.test(n))).toBe(false);
  });

  it("finds the EX-21 file in a filing index", () => {
    const idx = { directory: { item: [{ name: "0001-26-000002.txt" }, { name: "ex21-1.htm" }, { name: "ex31.htm" }] } };
    expect(findEx21File(idx)).toBe("ex21-1.htm");
    expect(findEx21File({})).toBeUndefined();
  });
});

describe("XBRL facts", () => {
  it("summarises latest FY revenue and equity", () => {
    const facts = {
      facts: {
        "us-gaap": {
          Revenues: { units: { USD: [{ end: "2024-12-31", val: 50, form: "10-K", fp: "FY" }, { end: "2025-12-31", val: 80, form: "10-K", fp: "FY" }] } },
          StockholdersEquity: { units: { USD: [{ end: "2026-06-30", val: -12_000_000, form: "10-Q", fp: "Q2" }] } },
        },
      },
    };
    expect(summarizeFacts(facts)).toMatchObject({ revenue: 80, revenueEnd: "2025-12-31", equity: -12_000_000 });
    expect(summarizeFacts({})).toEqual({});
  });
});

describe("SecClient", () => {
  const instant = async () => {};

  it("requires a user agent", () => {
    expect(() => new SecClient({ userAgent: "" })).toThrow(/User-Agent/);
  });

  it("sends the user agent, returns null on 404, and retries 503s with backoff", async () => {
    const calls: Array<{ url: string; ua?: string }> = [];
    const sleeps: number[] = [];
    let n = 0;
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      calls.push({ url, ua: (init?.headers as Record<string, string>)["User-Agent"] });
      if (url.endsWith("/missing")) return new Response("", { status: 404 });
      n++;
      if (n < 3) return new Response("busy", { status: 503 });
      return new Response('{"ok":true}', { status: 200 });
    }) as unknown as typeof fetch;

    const client = new SecClient({ userAgent: "test ua@example.com", fetchImpl, sleep: async (ms) => void sleeps.push(ms) });
    expect(await client.getJson("https://x/missing")).toBeNull();
    expect(await client.getJson<{ ok: boolean }>("https://x/data")).toEqual({ ok: true });
    expect(calls.every((c) => c.ua === "test ua@example.com")).toBe(true);
    expect(sleeps.filter((s) => s >= 1000)).toEqual([1000, 2000]);
  });

  it("throws after exhausting retries", async () => {
    const fetchImpl = (async () => new Response("", { status: 500 })) as unknown as typeof fetch;
    const client = new SecClient({ userAgent: "t", fetchImpl, sleep: instant, maxRetries: 2 });
    await expect(client.getText("https://x/y")).rejects.toThrow(/HTTP 500/);
  });

  it("throttles request starts", async () => {
    const sleeps: number[] = [];
    const fetchImpl = (async () => new Response("{}", { status: 200 })) as unknown as typeof fetch;
    const client = new SecClient({ userAgent: "t", fetchImpl, rps: 10, sleep: async (ms) => void sleeps.push(ms) });
    await Promise.all([client.getText("https://x/1"), client.getText("https://x/2"), client.getText("https://x/3")]);
    expect(sleeps.length).toBeGreaterThanOrEqual(2);
  });
});
