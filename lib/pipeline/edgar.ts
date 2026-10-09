import type { Signal, SignalCode } from "./types";

/**
 * Minimal SEC EDGAR client + pure parsers.
 *
 * SEC fair-access rules: declare a User-Agent with contact info and stay under
 * 10 requests/second. The client throttles to `rps` (default 8) and retries 429/5xx
 * with exponential backoff.
 *
 * NOTE: the response shapes parsed here (daily form index, efts full-text search,
 * submissions JSON, companyfacts) follow SEC's published/observed formats but were
 * written without live access to sec.gov. Run `pnpm ingest --probe` once to confirm
 * them against live responses; parsers are defensive and report skips in stats.
 */

export interface SecClientOptions {
  userAgent: string;
  fetchImpl?: typeof fetch;
  rps?: number;
  maxRetries?: number;
  sleep?: (ms: number) => Promise<void>;
}

export class SecClient {
  private readonly userAgent: string;
  private readonly fetchImpl: typeof fetch;
  private readonly minIntervalMs: number;
  private readonly maxRetries: number;
  private readonly sleep: (ms: number) => Promise<void>;
  private nextSlot = 0;

  constructor(opts: SecClientOptions) {
    if (!opts.userAgent || !opts.userAgent.trim()) {
      throw new Error("SEC requires a descriptive User-Agent with contact info (set SEC_USER_AGENT).");
    }
    this.userAgent = opts.userAgent;
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.minIntervalMs = 1000 / (opts.rps ?? 8);
    this.maxRetries = opts.maxRetries ?? 4;
    this.sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    const wait = Math.max(0, this.nextSlot - now);
    this.nextSlot = Math.max(now, this.nextSlot) + this.minIntervalMs;
    if (wait > 0) await this.sleep(wait);
  }

  /** Returns response text, or null on 404. Throws after retries on other failures. */
  async getTextOrNull(url: string): Promise<string | null> {
    let lastErr: unknown;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      await this.throttle();
      try {
        const res = await this.fetchImpl(url, {
          headers: { "User-Agent": this.userAgent, "Accept-Encoding": "gzip, deflate", Accept: "*/*" },
        });
        if (res.status === 404) return null;
        if (res.status === 429 || res.status >= 500) {
          lastErr = new Error(`HTTP ${res.status} for ${url}`);
          await this.sleep(1000 * Math.pow(2, attempt));
          continue;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        return await res.text();
      } catch (err) {
        lastErr = err;
        if (attempt === this.maxRetries) break;
        await this.sleep(1000 * Math.pow(2, attempt));
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
  }

  async getText(url: string): Promise<string> {
    const t = await this.getTextOrNull(url);
    if (t === null) throw new Error(`HTTP 404 for ${url}`);
    return t;
  }

  async getJson<T>(url: string): Promise<T | null> {
    const t = await this.getTextOrNull(url);
    return t === null ? null : (JSON.parse(t) as T);
  }
}

export function padCik(cik: string): string {
  return String(cik).replace(/^0+/, "").padStart(10, "0");
}

export function stripCik(cik: string): string {
  return String(cik).replace(/^0+/, "") || "0";
}

/* ------------------------------------------------------------------ */
/* Daily form index  ->  NT 10-K / NT 10-Q / Form 15 / Form 25 signals */
/* ------------------------------------------------------------------ */

export interface IndexRow {
  form: string;
  company: string;
  cik: string;
  date: string; // YYYY-MM-DD
  file: string; // edgar/data/... path
}

const INDEX_ROW = /^(\S(?:.*?\S)?)\s{2,}(\S.*?)\s{2,}(\d{1,10})\s+(\d{8}|\d{4}-\d{2}-\d{2})\s+(edgar\/data\/\S+)$/;

export function parseDailyIndex(text: string): IndexRow[] {
  const rows: IndexRow[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = INDEX_ROW.exec(line.trimEnd());
    if (!m) continue;
    const raw = m[4];
    const date = raw.includes("-") ? raw : `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
    rows.push({ form: m[1].trim(), company: m[2].trim(), cik: stripCik(m[3]), date, file: m[5] });
  }
  return rows;
}

const FORM_TO_SIGNAL: Record<string, { code: SignalCode; detail: string }> = {
  "NT 10-K": { code: "nt_10k", detail: "Notification of late 10-K" },
  "NT 10-K/A": { code: "nt_10k", detail: "Amended notification of late 10-K" },
  "NT 10-Q": { code: "nt_10q", detail: "Notification of late 10-Q" },
  "NT 10-Q/A": { code: "nt_10q", detail: "Amended notification of late 10-Q" },
  "15-12G": { code: "form_15", detail: "Form 15: termination of registration (12g)" },
  "15-12B": { code: "form_15", detail: "Form 15: termination of registration (12b)" },
  "15-15D": { code: "form_15", detail: "Form 15: suspension of 15(d) reporting" },
  "25": { code: "form_25", detail: "Form 25: delisting / deregistration of a class (also filed on mergers)" },
  "25-NSE": { code: "form_25", detail: "Form 25-NSE: exchange removal of securities from listing" },
};

export function dailyIndexUrl(date: string): string {
  const [y, m, d] = date.split("-");
  const q = Math.ceil(Number(m) / 3);
  return `https://www.sec.gov/Archives/edgar/daily-index/${y}/QTR${q}/form.${y}${m}${d}.idx`;
}

export function filingUrlFromIndexPath(file: string): string {
  return `https://www.sec.gov/Archives/${file}`;
}

export interface RawSignal {
  cik: string;
  company: string;
  ticker?: string;
  sic?: string;
  incState?: string;
  signal: Signal;
}

export function signalsFromIndexRows(rows: IndexRow[]): RawSignal[] {
  const out: RawSignal[] = [];
  for (const r of rows) {
    const map = FORM_TO_SIGNAL[r.form];
    if (!map) continue;
    const accession = /\/(\d{10}-\d{2}-\d{6})\.txt$/.exec(r.file)?.[1];
    out.push({
      cik: r.cik,
      company: r.company,
      signal: { code: map.code, date: r.date, form: r.form, accession, url: filingUrlFromIndexPath(r.file), detail: map.detail },
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Full-text search (efts)  ->  8-K item / going concern / strategic   */
/* ------------------------------------------------------------------ */

export interface EftsQuerySpec {
  id: string;
  q: string;
  forms: string[];
  /** 8-K item number that must appear in `items` if the hit lists items. */
  item?: string;
  code: SignalCode;
  detail: string;
}

export const EFTS_QUERIES: EftsQuerySpec[] = [
  { id: "204", q: '"Triggering Events That Accelerate or Increase a Direct Financial Obligation"', forms: ["8-K"], item: "2.04", code: "item_204", detail: "Item 2.04: obligation accelerated / default" },
  { id: "301", q: '"Notice of Delisting or Failure to Satisfy a Continued Listing Rule or Standard"', forms: ["8-K"], item: "3.01", code: "item_301", detail: "Item 3.01: listing deficiency / delisting notice" },
  { id: "401", q: '"Changes in Registrant\'s Certifying Accountant"', forms: ["8-K"], item: "4.01", code: "item_401", detail: "Item 4.01: auditor change" },
  { id: "402", q: '"Non-Reliance on Previously Issued Financial Statements"', forms: ["8-K"], item: "4.02", code: "item_402", detail: "Item 4.02: non-reliance on prior financials" },
  { id: "103", q: '"Bankruptcy or Receivership"', forms: ["8-K"], item: "1.03", code: "item_103", detail: "Item 1.03: bankruptcy / receivership" },
  { id: "gc", q: '"substantial doubt" "going concern"', forms: ["10-K"], code: "going_concern", detail: "10-K text references going-concern doubt" },
  { id: "strat", q: '"strategic alternatives"', forms: ["8-K"], code: "strategic_review", detail: "8-K references a strategic-alternatives review" },
  { id: "sale", q: '"definitive agreement" "sale of substantially all"', forms: ["8-K"], code: "asset_sale", detail: "8-K references sale of substantially all assets" },
];

export interface FilingHit {
  cik: string;
  name: string;
  ticker?: string;
  form: string;
  fileDate: string;
  accession: string;
  items: string[];
  url: string;
  sic?: string;
  incState?: string;
}

interface EftsResponse {
  hits?: {
    total?: { value?: number };
    hits?: Array<{
      _id?: string;
      _source?: {
        ciks?: string[];
        display_names?: string[];
        file_date?: string;
        form?: string;
        root_form?: string;
        adsh?: string;
        items?: string[];
        sics?: string[];
        inc_states?: string[];
      };
    }>;
  };
}

const DISPLAY_NAME = /^(.*?)\s*(?:\(([A-Z0-9][A-Z0-9, .\-]*)\))?\s*\(CIK (\d+)\)\s*$/;

export function parseEftsHits(json: unknown): { hits: FilingHit[]; total: number; skipped: number } {
  const data = json as EftsResponse;
  const raw = data?.hits?.hits ?? [];
  const hits: FilingHit[] = [];
  let skipped = 0;
  for (const h of raw) {
    const s = h._source;
    const adsh = s?.adsh ?? h._id?.split(":")[0];
    const fileDate = s?.file_date;
    const display = s?.display_names?.[0];
    const cikRaw = s?.ciks?.[0];
    if (!s || !adsh || !fileDate || !cikRaw) {
      skipped++;
      continue;
    }
    const m = display ? DISPLAY_NAME.exec(display) : null;
    const ticker = m?.[2]?.split(",")[0]?.trim() || undefined;
    const cik = stripCik(cikRaw);
    const docName = h._id?.split(":")[1];
    const accNoDash = adsh.replace(/-/g, "");
    hits.push({
      cik,
      name: (m?.[1] ?? display ?? "").trim(),
      ticker,
      form: s.form ?? s.root_form ?? "",
      fileDate,
      accession: adsh,
      items: s.items ?? [],
      url: docName
        ? `https://www.sec.gov/Archives/edgar/data/${cik}/${accNoDash}/${docName}`
        : `https://www.sec.gov/Archives/edgar/data/${cik}/${accNoDash}/`,
      sic: s.sics?.[0],
      incState: s.inc_states?.[0],
    });
  }
  return { hits, total: data?.hits?.total?.value ?? hits.length, skipped };
}

export function eftsUrl(spec: EftsQuerySpec, start: string, end: string, from = 0): string {
  const params = new URLSearchParams({
    q: spec.q,
    dateRange: "custom",
    startdt: start,
    enddt: end,
    forms: spec.forms.join(","),
    from: String(from),
  });
  return `https://efts.sec.gov/LATEST/search-index?${params.toString()}`;
}

/** Applies the item check: when a hit lists items, the expected item must be among them. */
export function signalsFromHits(spec: EftsQuerySpec, hits: FilingHit[]): RawSignal[] {
  const out: RawSignal[] = [];
  for (const h of hits) {
    if (spec.item && h.items.length > 0 && !h.items.includes(spec.item)) continue;
    out.push({
      cik: h.cik,
      company: h.name,
      ticker: h.ticker,
      sic: h.sic,
      incState: h.incState,
      signal: { code: spec.code, date: h.fileDate, form: h.form, accession: h.accession, url: h.url, detail: spec.detail },
    });
  }
  return out;
}

export async function runEftsQuery(
  client: SecClient,
  spec: EftsQuerySpec,
  start: string,
  end: string,
  maxPages = 5
): Promise<{ signals: RawSignal[]; skipped: number; total: number }> {
  const signals: RawSignal[] = [];
  let skipped = 0;
  let total = 0;
  for (let page = 0; page < maxPages; page++) {
    const json = await client.getJson<unknown>(eftsUrl(spec, start, end, page * 100));
    if (!json) break;
    const parsed = parseEftsHits(json);
    total = parsed.total;
    skipped += parsed.skipped;
    signals.push(...signalsFromHits(spec, parsed.hits));
    if (parsed.hits.length < 100 || (page + 1) * 100 >= parsed.total) break;
  }
  return { signals, skipped, total };
}

/* ------------------------------------------------------------------ */
/* Submissions JSON  ->  metadata + free 8-K item signals per CIK      */
/* ------------------------------------------------------------------ */

export interface SubmissionsMeta {
  name: string;
  tickers: string[];
  exchanges: string[];
  sic?: string;
  incState?: string;
  signals: Signal[];
  latest10K?: { accession: string; filingDate: string; primaryDocument?: string };
}

interface SubmissionsJson {
  name?: string;
  tickers?: string[];
  exchanges?: string[];
  sic?: string;
  stateOfIncorporation?: string;
  filings?: {
    recent?: {
      form?: string[];
      filingDate?: string[];
      accessionNumber?: string[];
      primaryDocument?: string[];
      items?: string[];
    };
  };
}

const ITEM_TO_SIGNAL: Record<string, { code: SignalCode; detail: string }> = {
  "1.03": { code: "item_103", detail: "Item 1.03: bankruptcy / receivership" },
  "2.04": { code: "item_204", detail: "Item 2.04: obligation accelerated / default" },
  "3.01": { code: "item_301", detail: "Item 3.01: listing deficiency / delisting notice" },
  "4.01": { code: "item_401", detail: "Item 4.01: auditor change" },
  "4.02": { code: "item_402", detail: "Item 4.02: non-reliance on prior financials" },
};

export function parseSubmissions(json: unknown, cik: string, sinceDate: string): SubmissionsMeta {
  const j = json as SubmissionsJson;
  const r = j?.filings?.recent;
  const signals: Signal[] = [];
  let latest10K: SubmissionsMeta["latest10K"];
  const n = r?.form?.length ?? 0;
  for (let i = 0; i < n; i++) {
    const form = r!.form![i];
    const date = r!.filingDate?.[i];
    const acc = r!.accessionNumber?.[i];
    if (!date || !acc) continue;
    if (form === "10-K" && (!latest10K || date > latest10K.filingDate)) {
      latest10K = { accession: acc, filingDate: date, primaryDocument: r!.primaryDocument?.[i] };
    }
    if (date < sinceDate) continue;
    const url = `https://www.sec.gov/Archives/edgar/data/${stripCik(cik)}/${acc.replace(/-/g, "")}/${r!.primaryDocument?.[i] ?? ""}`;
    const formMap = FORM_TO_SIGNAL[form];
    if (formMap) signals.push({ code: formMap.code, date, form, accession: acc, url, detail: formMap.detail });
    if (form === "8-K" || form === "8-K/A") {
      const items = (r!.items?.[i] ?? "").split(",").map((x) => x.trim()).filter(Boolean);
      for (const it of items) {
        const m = ITEM_TO_SIGNAL[it];
        if (m) signals.push({ code: m.code, date, form, accession: acc, url, detail: m.detail });
      }
    }
  }
  return {
    name: j?.name ?? "",
    tickers: j?.tickers ?? [],
    exchanges: j?.exchanges ?? [],
    sic: j?.sic,
    incState: j?.stateOfIncorporation,
    signals,
    latest10K,
  };
}

/* ------------------------------------------------------------------ */
/* EX-21 subsidiaries                                                   */
/* ------------------------------------------------------------------ */

const ENTITY_SUFFIX =
  /\b(inc\.?|incorporated|llc|l\.l\.c\.?|ltd\.?|limited|corp\.?|corporation|co\.|company|gmbh|s\.a\.?|s\.a\.s\.?|s\.r\.l\.?|b\.v\.?|n\.v\.?|ag|lp|l\.p\.?|llp|plc|pty|pte|oy|ab|a\/s|s\.p\.a\.?|kk|k\.k\.?|sdn bhd)\s*$/i;

export function parseEx21(raw: string): string[] {
  const text = raw
    .replace(/<\/(td|th|tr|p|div|li)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8217;|&rsquo;/gi, "'");
  const names = new Set<string>();
  for (const lineRaw of text.split(/\r?\n/)) {
    const line = lineRaw.replace(/\s+/g, " ").trim().replace(/[,;:]+$/, "");
    if (line.length < 3 || line.length > 120) continue;
    if (/subsidiar|exhibit|jurisdiction|name of|state or other|organization/i.test(line)) continue;
    if (!ENTITY_SUFFIX.test(line)) continue;
    names.add(line);
  }
  return [...names];
}

export function findEx21File(indexJson: unknown): string | undefined {
  const items = (indexJson as { directory?: { item?: Array<{ name?: string }> } })?.directory?.item ?? [];
  const names = items.map((i) => i.name ?? "");
  return names.find((n) => /ex-?21/i.test(n) && /\.(htm|html|txt)$/i.test(n));
}

/* ------------------------------------------------------------------ */
/* XBRL companyfacts  ->  consolidated revenue + equity                 */
/* ------------------------------------------------------------------ */

export interface FactsSummary {
  revenue?: number;
  revenueEnd?: string;
  equity?: number;
  equityEnd?: string;
}

interface FactEntry {
  end?: string;
  val?: number;
  form?: string;
  fp?: string;
}
type FactsJson = { facts?: Record<string, Record<string, { units?: Record<string, FactEntry[]> }>> };

const REVENUE_TAGS = ["Revenues", "RevenueFromContractWithCustomerExcludingAssessedTax", "SalesRevenueNet", "RevenueFromContractWithCustomerIncludingAssessedTax"];
const EQUITY_TAGS = ["StockholdersEquity", "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest"];

function latest(entries: FactEntry[] | undefined, pred: (e: FactEntry) => boolean): FactEntry | undefined {
  return (entries ?? []).filter((e) => e.end && typeof e.val === "number" && pred(e)).sort((a, b) => (b.end as string).localeCompare(a.end as string))[0];
}

export function summarizeFacts(json: unknown): FactsSummary {
  const gaap = (json as FactsJson)?.facts?.["us-gaap"] ?? {};
  const out: FactsSummary = {};
  for (const tag of REVENUE_TAGS) {
    const e = latest(gaap[tag]?.units?.USD, (x) => x.form === "10-K" && x.fp === "FY");
    if (e && (!out.revenueEnd || (e.end as string) > out.revenueEnd)) {
      out.revenue = e.val;
      out.revenueEnd = e.end;
    }
  }
  for (const tag of EQUITY_TAGS) {
    const e = latest(gaap[tag]?.units?.USD, () => true);
    if (e && (!out.equityEnd || (e.end as string) > out.equityEnd)) {
      out.equity = e.val;
      out.equityEnd = e.end;
    }
  }
  return out;
}
