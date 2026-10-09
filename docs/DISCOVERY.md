# Discovery pipeline

The screener no longer depends on a hand-curated list. Candidates come from two places and are scored by one model.

- **Seed records** (`lib/data/targets.ts`): the original 18, kept intact and tagged `seed_unverified`. They conflict with BUILD_REPORT.md in places; discrepancies surface as `dataQualityFlags`.
- **EDGAR ingestion** (`pnpm ingest`): writes `data/candidates.json`. A scheduled GitHub Action runs it weekdays and commits changes, which triggers a Vercel redeploy.

## Running it

    SEC_USER_AGENT="your-org you@example.com" pnpm ingest --probe   # first run: confirm SEC response shapes
    SEC_USER_AGENT="your-org you@example.com" pnpm ingest           # --days 90 --max-enrich 150 by default

Set a repository variable `SEC_USER_AGENT` for the workflow. It is required by SEC fair-access policy and intentionally has no default (the repo is public).

Sources: EDGAR daily form index (NT 10-K/Q, Form 15, Form 25), full-text search (8-K Items 1.03/2.04/3.01/4.01/4.02, going-concern language, strategic-alternatives and asset-sale language), submissions JSON, EX-21 subsidiaries, XBRL companyfacts (revenue, equity).

## Model (`lib/pipeline/model.ts`)

Four graded 0-100 axes (distress, separable value, control point, timing), combined with class-specific weights. Only three must-haves gate the "actionable" bucket: a meaningful distress/seller signal, a separable asset, and an identifiable creditor. Unknowns score as unknown, never as pass/fail.

Classes: distressed_carveout, bankruptcy_sale, motivated_seller, dormant_shell, cross_border.

Clocks derived from filings are **rule-of-thumb** windows (NT extension, ~180d listing cure, ~75d 363 window, ~30d forbearance) and are labelled as such; they are not deadlines read from documents.

## Known limits

- Control point is `unknown` for ingested candidates until someone identifies the secured creditors (UCC, credit agreement). Such candidates cap at "watch" by design.
- Subsidiary-level revenue/EBITDA is not extracted from EDGAR; ingested candidates only have EX-21 names and consolidated revenue/equity.
- EDGAR parsers were written without live sec.gov access; run `--probe` once before trusting a first run.
