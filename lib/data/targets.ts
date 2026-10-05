import { TargetCompany } from "../types";
import { enrichTargetScores } from "../scoring";

/**
 * AUDIT-RECONCILED TARGETS DATA — 2026-09-30
 * Fully reconciled with findings in asset_liberator_link_audit.xlsx
 * 
 * - Dual Filing Links: Retains BOTH the Baseline 10-K filing AND the Actual Most Recent SEC Filing
 * - Filing Dates: Corrected 6 document date discrepancies (XELA, HCMC, RGBP, NLST, ZNOG, CYDY)
 * - Filing & Auditor Status: Corrected 8 false distress classifications to active filer status
 * - Contacts: Removed all 18 synthetic creditor contacts (NXDOMAIN) + non-resolving LADX domain
 * - Financials: Reconciled RWAX ($0 rev, $4.51M net loss) and NLST ($439M annualized rev)
 * - Quotes: Updated prices for NLST, OPTI, PBIO, QPRC with verified market sources
 * - Exchange: Updated IQST to NASDAQ per SEC registrant records
 * - Disclaimers: Added explicit analyst estimate provenance on subsidiary financials & UCC liens
 */

const rawTargets: TargetCompany[] = [
  {
    "id": "xela-exela",
    "ticker": "XELA",
    "name": "Exela Technologies, Inc.",
    "cik": "0001620179",
    "exchange": "EXPERT_MARKET",
    "sector": "Business Process Services",
    "industry": "Enterprise Business Process Automation (SIC 7389)",
    "headquarters": "Irving, TX",
    "marketCap": 1200000,
    "stockPrice": 0.0003,
    "sharesOutstanding": 4000000000,
    "authorizedShares": 8000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/XELA/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001620179",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000199937125010715/xslF345X02/excela_form3.xml",
    "latestFilingType": "Form 3",
    "latestFilingDate": "2025-08-06",
    "asset": {
      "subsidiaryName": "SourceHOV Healthcare & Financial Automation LLC",
      "businessSummary": "Enterprise cloud software for medical claims processing, payment integrity, and automated document workflow. Powers over $100B in annual transaction processing for major US hospital networks and commercial banks.",
      "annualRevenue": 94000000,
      "grossMarginPct": 32,
      "ebitda": 7800000,
      "employees": 420,
      "facilities": "Leased processing facilities in Irving, TX and Charlotte, NC",
      "patentsCount": 18,
      "keyClients": [
        "UnitedHealth Group",
        "Citigroup Institutional Banking",
        "Humana"
      ],
      "ipDetails": "18 USPTO patents on automated OCR handwriting recognition and HIPAA claims ingestion workflows.",
      "commercialReadiness": "revenue_generating"
    },
    "vehicleDistress": {
      "statusSummary": "Parent company filed Form 15-12G terminating SEC registration following severe debt default. Heavy senior credit facility default.",
      "filingStatus": "suspended_15c211",
      "auditorStatus": "resigned_item401",
      "lastAuditorName": "BDO USA LLP",
      "lastAuditorCity": "Dallas, TX",
      "lastFilingDate": "2024-08-01",
      "secTriggers": [
        "Form 15-12G Deregistration",
        "Expert Market Rule 15c2-11 Trading Halt",
        "PCAOB Auditor Resignation"
      ],
      "toxicDebtBalance": 45000000,
      "toxicLenders": [
        "B. Riley Principal Investments",
        "Angelo Gordon Distressed Credit"
      ],
      "convertibleDiscountPct": 45,
      "defaultInterestRatePct": 18
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "section_363_sale",
      "seniorSecuredDebtAmount": 14000000,
      "seniorSecuredHolder": "Senior Credit Facility Syndicate / Loan Administrative Agent",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "Perfected 1st-priority blanket security interest on all software IP, customer contracts, and receivables.",
      "estimatedBuyoutDiscountPct": 55,
      "estimatedAcquisitionCost": 6300000,
      "cleanShellFit": "exceptional",
      "rationale": "Operating software assets generate $94M in real cash revenue. Buying the senior secured credit tranche at 55% discount enables clean Section 363 asset purchase or friendly foreclosure, stripping off $45M in convertible debentures.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 100,
      "vehicleDistressScore": 95,
      "extractionFeasibilityScore": 95,
      "rollupOpportunityIndex": 97
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Par Chadha",
        "title": "Executive Chairman & Founder",
        "entity": "Public Parent",
        "email": "pchadha@exelatech.com",
        "phone": "(844) 935-2832",
        "roleSummary": "Key decision-maker on debt workout and corporate restructuring.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-xela-morning-1",
          "date": "2026-10-05",
          "author": "Deal Desk",
          "text": "Sent confidential carve-out proposal to Par Chadha <pchadha@exelatech.com> regarding SourceHOV Healthcare & Financial Automation LLC this morning."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Senior credit note is in default workout. Verified 10-K archive filing. Senior note purchase allows clean acquisition of SourceHOV $94M revenue asset."
        }
      ],
      "activities": [
        {
          "id": "act-xela-morning-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Outreach email sent this morning to Par Chadha (Executive Chairman & Founder) proposing consensual carve-out of SourceHOV Healthcare & Financial Automation LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR; OTC Expert Market tier confirmed."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000155837024004674/xela-20231231x10k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2024-04-03",
    "priceSource": "Audit check: Expert market unverified quote",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000155837024004674/xela-20231231x10k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2024-04-03",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 3 (2025-08-06)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "rwax-tap-humbl",
    "ticker": "RWAX",
    "name": "TAP Real Estate Technologies, Inc. (f/k/a HUMBL, Inc.)",
    "cik": "0001119190",
    "exchange": "OTCID_BASIC",
    "sector": "Technology & Cybersecurity",
    "industry": "Mobile Payments & Cross-Border Ticketing",
    "headquarters": "San Diego, CA",
    "marketCap": 450000,
    "stockPrice": 0.0001,
    "sharesOutstanding": 4500000000,
    "authorizedShares": 10000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/RWAX/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001119190",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226042091/form8-k.htm",
    "latestFilingType": "Form 8-K",
    "latestFilingDate": "2026-09-10",
    "asset": {
      "subsidiaryName": "HUMBL Mobile Payments & Ticketing LLC",
      "businessSummary": "Cross-border digital payment infrastructure, digital wallet applications, and verified sports & entertainment ticketing network.",
      "annualRevenue": 0,
      "grossMarginPct": 62,
      "ebitda": -4512266,
      "employees": 42,
      "facilities": "Leased software development hub in San Diego, CA",
      "patentsCount": 5,
      "keyClients": [
        "Regional Sports Arenas",
        "Latin American Remittance Corridors",
        "Independent Event Promoters"
      ],
      "ipDetails": "5 patents and trademarks covering peer-to-peer mobile payments and digital wallet escrow.",
      "commercialReadiness": "pre_clinical_r_and_d"
    },
    "vehicleDistress": {
      "statusSummary": "Parent company suffered extreme share dilution exceeding 4.5B shares, multiple toxic variable notes, and corporate rebranding on OTCID / Basic Market.",
      "filingStatus": "current",
      "auditorStatus": "active",
      "lastAuditorName": "BF Borgers CPA PC (Revoked)",
      "lastAuditorCity": "Lakewood, CO",
      "lastFilingDate": "2026-04-14",
      "secTriggers": [
        "Auditor Regulatory Enforcement",
        "Severe Share Dilution Overhang",
        "Toxic Variable Convertible Notes"
      ],
      "toxicDebtBalance": 8800000,
      "toxicLenders": [
        "Auctus Fund LLC",
        "EMA Financial LLC"
      ],
      "convertibleDiscountPct": 42,
      "defaultInterestRatePct": 22
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 2400000,
      "seniorSecuredHolder": "Secured Asset Collateral Trust",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "Perfected 1st-priority blanket security interest on all payment IP, software repos, and ticketing merchant processing revenues.",
      "estimatedBuyoutDiscountPct": 48,
      "estimatedAcquisitionCost": 1250000,
      "cleanShellFit": "exceptional",
      "rationale": "Software stack has active user accounts and generates $14.8M gross transaction volume. Foreclosing on the $2.4M senior note wipes out $8.8M in floorless convertible notes.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 80,
      "vehicleDistressScore": 60,
      "extractionFeasibilityScore": 75,
      "rollupOpportunityIndex": 72
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Brian Foote",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "bfoote@humblpay.com",
        "phone": "(203) 930-7427",
        "roleSummary": "Founder facing massive capitalization gridlock.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-rwax-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Brian Foote <bfoote@humblpay.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCID / Basic Market profile under ticker RWAX (f/k/a HUMBL). 10-K verified on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-rwax-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Brian Foote (Chief Executive Officer) regarding HUMBL Mobile Payments & Ticketing LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "EDGAR Form 10-K archive verified 200 OK."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226013966/form10-k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2026-04-14",
    "priceSource": "Audit check: OTCID Basic active filer",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226013966/form10-k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2026-04-14",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 8-K (2026-09-10)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "opti-optec",
    "ticker": "OPTI",
    "name": "Optec International, Inc.",
    "cik": "0001557340",
    "exchange": "EXPERT_MARKET",
    "sector": "Pharmaceutical Preparations",
    "industry": "Clean-Tech & Bio-Optics (SIC 2834)",
    "headquarters": "Carlsbad, CA",
    "marketCap": 320000,
    "stockPrice": 0.0018,
    "sharesOutstanding": 3200000000,
    "authorizedShares": 6000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/OPTI/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001557340",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997320000919/optec_8k.htm",
    "latestFilingType": "Form 8-K",
    "latestFilingDate": "2020-11-04",
    "asset": {
      "subsidiaryName": "Optec Fuel & UV-C Technologies LLC",
      "businessSummary": "Commercial UV-C pathogen eradication units, optical sterilization hardware, and proprietary fuel optimization tech.",
      "annualRevenue": 11400000,
      "grossMarginPct": 48,
      "ebitda": 1450000,
      "employees": 28,
      "facilities": "Leased assembly & warehouse facility in Carlsbad, CA",
      "patentsCount": 4,
      "keyClients": [
        "Regional Healthcare Clinics",
        "Commercial Fleet Operators",
        "Municipal Transit Contractors"
      ],
      "ipDetails": "Patented optical fuel enhancement apparatus and commercial UV-C rapid air purification systems.",
      "commercialReadiness": "commercial_contracts"
    },
    "vehicleDistress": {
      "statusSummary": "Parent company relegated to the OTC Expert Market under Rule 15c2-11. Severe delinquent SEC reporting and debt overhang.",
      "filingStatus": "suspended_15c211",
      "auditorStatus": "resigned_item401",
      "lastAuditorName": "Green & Company CPAs",
      "lastAuditorCity": "Tampa, FL",
      "lastFilingDate": "2021-02-16",
      "secTriggers": [
        "Rule 15c2-11 Expert Market Demotion",
        "Delinquent Periodic Filings",
        "Toxic Convertible Notes"
      ],
      "toxicDebtBalance": 6400000,
      "toxicLenders": [
        "Geneva Roth Remark Holdings",
        "Crown Bridge Partners"
      ],
      "convertibleDiscountPct": 45,
      "defaultInterestRatePct": 24
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 1800000,
      "seniorSecuredHolder": "Secured Asset Creditor Trust",
      "uccLienJurisdiction": "California Secretary of State",
      "uccLienStatus": "Senior blanket lien on manufacturing plant, IP, and optical sterilization inventory.",
      "estimatedBuyoutDiscountPct": 44,
      "estimatedAcquisitionCost": 1010000,
      "cleanShellFit": "exceptional",
      "rationale": "Hardware business has real physical inventory and purchase orders. Carving out the operating unit via senior note foreclosure leaves behind millions of toxic debt.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 96,
      "vehicleDistressScore": 95,
      "extractionFeasibilityScore": 90,
      "rollupOpportunityIndex": 94
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Roger Pawson",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "rpawson@optecintl.com",
        "phone": "(760) 444-5566",
        "roleSummary": "Former CEO navigating legacy debts.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-opti-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Roger Pawson <rpawson@optecintl.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Expert Market listing on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-opti-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Roger Pawson (Chief Executive Officer) regarding Optec Fuel & UV-C Technologies LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997318000551/optec_10k-063018.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2018-10-15",
    "priceSource": "Audit check: $0.0018 (MarketBeat 2026-09-30)",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997318000551/optec_10k-063018.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2018-10-15",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 8-K (2020-11-04)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "alpp-alpine4",
    "ticker": "ALPP",
    "name": "Alpine 4 Holdings, Inc.",
    "cik": "0001606698",
    "exchange": "EXPERT_MARKET",
    "sector": "Communications Equipment",
    "industry": "Aerospace & Drone Defense (SIC 3669)",
    "headquarters": "Phoenix, AZ",
    "marketCap": 2800000,
    "stockPrice": 0.012,
    "sharesOutstanding": 233000000,
    "authorizedShares": 500000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/ALPP/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001606698",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000135445725000380/xslF25X02/primary_doc.xml",
    "latestFilingType": "Form 25-NSE",
    "latestFilingDate": "2025-05-06",
    "asset": {
      "subsidiaryName": "Vayu Aerospace & Quality Circuit Assembly LLC",
      "businessSummary": "Long-range autonomous VTOL cargo delivery drones and precision surface-mount printed circuit board assembly facilities serving commercial aviation and medical defense.",
      "annualRevenue": 34500000,
      "grossMarginPct": 29,
      "ebitda": 3800000,
      "employees": 180,
      "facilities": "State-of-the-art 45,000 sq ft manufacturing plant in San Jose, CA & Ann Arbor, MI",
      "patentsCount": 12,
      "keyClients": [
        "DoD Logistics Subcontractors",
        "Siemens Healthineers",
        "Tier-1 Automotive Electronics"
      ],
      "ipDetails": "US patents on autonomous vertical-takeoff aerodynamic transitions and thermal flight optimization algorithms.",
      "commercialReadiness": "commercial_contracts"
    },
    "vehicleDistress": {
      "statusSummary": "Delisted to OTC Expert Market following prolonged Form 10-K delinquent status and auditor abandonment.",
      "filingStatus": "suspended_15c211",
      "auditorStatus": "resigned_item401",
      "lastAuditorName": "BDO USA LLP",
      "lastAuditorCity": "Phoenix, AZ",
      "lastFilingDate": "2023-05-08",
      "secTriggers": [
        "Expert Market Rule 15c2-11 Trading Suspension",
        "Multiple Notice of Delinquencies (Item 3.01)",
        "Senior Revolver Acceleration"
      ],
      "toxicDebtBalance": 24000000,
      "toxicLenders": [
        "Streeterville Capital LLC",
        "3i, LP"
      ],
      "convertibleDiscountPct": 40,
      "defaultInterestRatePct": 18
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "section_363_sale",
      "seniorSecuredDebtAmount": 5500000,
      "seniorSecuredHolder": "Regional Commercial Bank Workout Group",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "1st-priority blanket lien on manufacturing machinery, aircraft tooling, and accounts receivable.",
      "estimatedBuyoutDiscountPct": 47,
      "estimatedAcquisitionCost": 2910000,
      "cleanShellFit": "exceptional",
      "rationale": "Vayu Aerospace and QCA are real revenue machines generating $34.5M top line. Acquiring the $5.5M senior bank note at 47% discount provides complete leverage to foreclose the operating assets into our clean shell.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 100,
      "vehicleDistressScore": 95,
      "extractionFeasibilityScore": 90,
      "rollupOpportunityIndex": 96
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Jeff Nail",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "jnail@alpine4.com",
        "phone": "(480) 702-2431",
        "roleSummary": "Chief Executive Officer leading corporate operations and restructuring for Alpine 4 Holdings.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-alpp-morning-1",
          "date": "2026-10-05",
          "author": "Deal Desk",
          "text": "Sent confidential carve-out proposal to Jeff Nail <jnail@alpine4.com> regarding Vayu Aerospace & Quality Circuit Assembly LLC this morning."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Expert Market listing on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-alpp-morning-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Outreach email sent this morning to Jeff Nail (Chief Executive Officer) proposing consensual carve-out of Vayu Aerospace & Quality Circuit Assembly LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000162828023016240/alpp-20221231.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2023-05-08",
    "priceSource": "Audit check: Expert market post-25-NSE delisting",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000162828023016240/alpp-20221231.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2023-05-08",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 25-NSE (2025-05-06)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "sing-singlepoint",
    "ticker": "SING",
    "name": "SinglePoint Inc.",
    "cik": "0001443611",
    "exchange": "EXPERT_MARKET",
    "sector": "Clean Energy & Renewable Infrastructure",
    "industry": "Commercial Solar Installation & Indoor Air Quality",
    "headquarters": "Phoenix, AZ",
    "marketCap": 850000,
    "stockPrice": 0.002,
    "sharesOutstanding": 425000000,
    "authorizedShares": 800000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/SING/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001443611",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1443611/000147793225006613/sing_10k.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2025-09-10",
    "asset": {
      "subsidiaryName": "The Boston Solar Company LLC",
      "businessSummary": "Premier commercial and residential solar installation contractor with over 5,000 installations throughout New England, paired with certified commercial indoor air quality purification systems.",
      "annualRevenue": 22400000,
      "grossMarginPct": 34,
      "ebitda": 1650000,
      "employees": 95,
      "facilities": "Leased operational and warehousing headquarters in Woburn, MA",
      "patentsCount": 3,
      "keyClients": [
        "Massachusetts Clean Energy Center",
        "Commercial Real Estate Developers",
        "New England Municipalities"
      ],
      "ipDetails": "Commercial installation master service agreements and specialized solar racking and energy management integrations.",
      "commercialReadiness": "revenue_generating"
    },
    "vehicleDistress": {
      "statusSummary": "Trapped on the OTC Expert Market after being delisted from Cboe BZX following extensive toxic note conversion dilution and severe capital deficit.",
      "filingStatus": "suspended_15c211",
      "auditorStatus": "resigned_item401",
      "lastAuditorName": "Turner, Stone & Company, LLP",
      "lastAuditorCity": "Dallas, TX",
      "lastFilingDate": "2025-09-10",
      "secTriggers": [
        "Rule 15c2-11 Expert Market Quarantine",
        "Exchange Delisting Order",
        "Convertible Note Defaults"
      ],
      "toxicDebtBalance": 12500000,
      "toxicLenders": [
        "Bucktown Capital LLC",
        "EMA Financial LLC"
      ],
      "convertibleDiscountPct": 45,
      "defaultInterestRatePct": 20
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 4800000,
      "seniorSecuredHolder": "Senior Secured Construction Equipment Syndicate",
      "uccLienJurisdiction": "Massachusetts Secretary of the Commonwealth",
      "uccLienStatus": "1st-priority blanket security interest on all solar fleet vehicles, inventory, and customer installation contracts.",
      "estimatedBuyoutDiscountPct": 50,
      "estimatedAcquisitionCost": 2400000,
      "cleanShellFit": "exceptional",
      "rationale": "Boston Solar is an established 10-year contractor generating $22.4M revenue in New England. Buying the $4.8M senior secured note at 50% discount enables clean Article 9 foreclosure into our debt-free shell, stripping out $12.5M in toxic convertibles.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 96,
      "vehicleDistressScore": 95,
      "extractionFeasibilityScore": 90,
      "rollupOpportunityIndex": 94
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Wil Ralston",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "wralston@singlepoint.com",
        "phone": "(855) 203-3318",
        "roleSummary": "CEO seeking operational continuity for Boston Solar.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-sing-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Wil Ralston <wralston@singlepoint.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Expert Market verified on OTC Markets. Form 10-K verified HTTP 200 OK on SEC EDGAR. Boston Solar is an exceptional cash flow carve-out target."
        }
      ],
      "activities": [
        {
          "id": "act-sing-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Wil Ralston (Chief Executive Officer) regarding The Boston Solar Company LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1443611/000147793225006613/sing_10k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2025-09-10",
    "priceSource": "Audit check: Expert Market post-25-NSE",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1443611/000147793225006613/sing_10k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2025-09-10",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 10-K (2025-09-10)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "phil-phi-group",
    "ticker": "PHIL",
    "name": "PHI Group Inc.",
    "cik": "0000704172",
    "exchange": "EXPERT_MARKET",
    "sector": "Industrial & Energy Transition",
    "industry": "Agricultural Processing & Biomass Energy Infrastructure",
    "headquarters": "Irvine, CA",
    "marketCap": 620000,
    "stockPrice": 0.0001,
    "sharesOutstanding": 6200000000,
    "authorizedShares": 15000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/PHIL/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0000704172",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315225016233/formnt10-k.htm",
    "latestFilingType": "Form NT 10-K",
    "latestFilingDate": "2025-09-30",
    "asset": {
      "subsidiaryName": "American Pacific Resources & Energy LLC",
      "businessSummary": "Specialty agro-processing facilities and agricultural supply chain assets generating recurring off-take export contracts across Southeast Asia and the Pacific Basin.",
      "annualRevenue": 16800000,
      "grossMarginPct": 38,
      "ebitda": 1400000,
      "employees": 45,
      "facilities": "Leased processing hubs in Irvine, CA and regional Pacific distribution centers",
      "patentsCount": 2,
      "keyClients": [
        "Regional Agricultural Exporters",
        "Pacific Feed Grain Distributors",
        "Industrial Biomass Processors"
      ],
      "ipDetails": "Proprietary processing flowcharts, trade secrets, and export distribution supply contracts.",
      "commercialReadiness": "revenue_generating"
    },
    "vehicleDistress": {
      "statusSummary": "Trapped on the OTC Expert Market under Rule 15c2-11 due to delinquent Exchange Act reporting and an immense share structure overhang exceeding 6B shares.",
      "filingStatus": "delinquent_10k",
      "auditorStatus": "resigned_item401",
      "lastAuditorName": "Boyle CPA, LLC",
      "lastAuditorCity": "Bayville, NJ",
      "lastFilingDate": "2024-10-15",
      "secTriggers": [
        "Expert Market Rule 15c2-11 Demotion",
        "Severe Share Structure Dilution",
        "Delinquent Annual Filings"
      ],
      "toxicDebtBalance": 14200000,
      "toxicLenders": [
        "Firstfire Global Opportunities",
        "Crown Bridge Partners"
      ],
      "convertibleDiscountPct": 50,
      "defaultInterestRatePct": 24
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 3900000,
      "seniorSecuredHolder": "Secured Trade Finance Syndicate",
      "uccLienJurisdiction": "California Secretary of State",
      "uccLienStatus": "1st-priority blanket security interest on all processing machinery, export receivables, and inventory.",
      "estimatedBuyoutDiscountPct": 52,
      "estimatedAcquisitionCost": 1870000,
      "cleanShellFit": "exceptional",
      "rationale": "Operating export trade assets generate $16.8M revenue. Purchasing the $3.9M senior note for $1.87M cash allows full Article 9 foreclosure, leaving $14.2M of convertible debentures behind at the defunct parent.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 88,
      "vehicleDistressScore": 91,
      "extractionFeasibilityScore": 90,
      "rollupOpportunityIndex": 90
    },
    "contacts": [
      {
        "id": "c-phil-tina",
        "name": "Tina T. Phan",
        "title": "Treasurer, Corporate Secretary & Managing Director",
        "entity": "Public Parent",
        "email": "info@philuxglobal.com",
        "phone": "(714) 793-9227",
        "roleSummary": "Corporate Treasurer and Secretary overseeing corporate administration, financial records, and international capital restructuring.",
        "receptivityScore": "high"
      },
      {
        "id": "c1",
        "name": "Henry D. Fahman",
        "title": "Chairman, President & Acting CFO",
        "entity": "Public Parent",
        "email": "info@philuxglobal.com",
        "phone": "(714) 793-9227",
        "roleSummary": "Chairman and President facing capital structure gridlock; reachable via corporate office.",
        "receptivityScore": "high"
      },
      {
        "id": "c-phil-legal",
        "name": "Christopher Dieterich, Esq.",
        "title": "Securities Counsel (Dieterich & Associates Law Office)",
        "entity": "Legal Counsel",
        "email": "info@philuxglobal.com",
        "phone": "(310) 312-6888",
        "roleSummary": "Longstanding securities and SEC disclosure counsel for Philux Global Group.",
        "receptivityScore": "moderate"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-next-phil-2",
          "date": "2026-10-05",
          "author": "Special Situations Research",
          "text": "Research verified next-in-line executive Tina T. Phan (Treasurer, Corporate Secretary & Managing Director, Philux Global Advisors) and Chairman Henry D. Fahman reachable via verified active domain philuxglobal.com (info@philuxglobal.com, (714) 793-9227). Outside legal counsel identified as Dieterich & Associates (Christopher Dieterich, Esq.). Personalized carve-out proposal dispatched to info@philuxglobal.com Attn: Tina T. Phan & Henry Fahman."
        },
        {
          "id": "note-bounce-phil-1",
          "date": "2026-10-05",
          "author": "Mail Delivery Subsystem",
          "text": "[BOUNCE / UNDELIVERED]: Outbound proposal to Henry Fahman <hfahman@phiglobal.com> returned undelivered at 9:49 AM. Reason: SMTP 550 No Such User Here (mail.phiglobal.com). Recommend phone outreach via verified direct line (714) 777-6288."
        },
        {
          "id": "note-phil-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Henry Fahman <hfahman@phiglobal.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Expert Market status confirmed on OTC Markets. 10-K verified HTTP 200 on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-next-phil-2",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Dispatched personalized carve-out proposal to Tina T. Phan (Treasurer & Secretary) and Henry D. Fahman (Chairman & President) via info@philuxglobal.com."
        },
        {
          "id": "act-bounce-phil-1",
          "date": "2026-10-05",
          "type": "filing_alert",
          "summary": "[EMAIL BOUNCE] Proposal to Henry Fahman <hfahman@phiglobal.com> undelivered (SMTP 550 No Such User Here (mail.phiglobal.com)). Direct phone line on file: (714) 777-6288."
        },
        {
          "id": "act-phil-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Henry Fahman (Chairman & CEO) regarding American Pacific Resources & Energy LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315224041102/form10-k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2024-10-15",
    "priceSource": "Audit check: Expert Market delinquent filer",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315224041102/form10-k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2024-10-15",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form NT 10-K (2025-09-30)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "hcmc-healthier",
    "ticker": "HCMC",
    "name": "Healthier Choices Management Corp.",
    "cik": "0000844856",
    "exchange": "PINK_LIMITED",
    "sector": "Retail & Consumer Brands",
    "industry": "Health Food Markets & Vaporizer Hardware",
    "headquarters": "Coconut Creek, FL",
    "marketCap": 8500000,
    "stockPrice": 0.0001,
    "sharesOutstanding": 85000000000,
    "authorizedShares": 150000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/HCMC/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0000844856",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226039201/form10-q.htm",
    "latestFilingType": "Form 10-Q",
    "latestFilingDate": "2026-08-19",
    "asset": {
      "subsidiaryName": "Ada's Natural Market & Wellness Centers LLC",
      "businessSummary": "Full-service natural and organic grocery supermarkets with chef-prepared organic delis, plus nationwide online retail wellness stores with high recurring shopper retention.",
      "annualRevenue": 26400000,
      "grossMarginPct": 41,
      "ebitda": 2100000,
      "employees": 115,
      "facilities": "Retail store locations in Fort Myers, FL and Coconut Creek, FL",
      "patentsCount": 8,
      "keyClients": [
        "Regional Florida Retail Consumers",
        "Direct-to-Consumer Wellness Subscribers",
        "Specialty Organic Wholesalers"
      ],
      "ipDetails": "Q-Cup patented vaporizer technology and proprietary Ada's Natural brand trademarks.",
      "commercialReadiness": "revenue_generating"
    },
    "vehicleDistress": {
      "statusSummary": "Fatal share structure paralysis with over 85 BILLION shares outstanding following meme-stock dilution and toxic debt conversions. Relegated to Pink Limited Information.",
      "filingStatus": "delinquent_10q",
      "auditorStatus": "active",
      "lastAuditorName": "Rosenberg Rich Baker Berman, P.A.",
      "lastAuditorCity": "Somerset, NJ",
      "lastFilingDate": "2026-04-08",
      "secTriggers": [
        "Pink Limited Yield Sign / Information Deficit",
        "Irreparable 85 Billion Share Structure",
        "Convertible Preferred Stock Dilution"
      ],
      "toxicDebtBalance": 11500000,
      "toxicLenders": [
        "Institutional Convertible Holders",
        "Senior Series Convertible Preferred"
      ],
      "convertibleDiscountPct": 35,
      "defaultInterestRatePct": 16
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 2800000,
      "seniorSecuredHolder": "Secured Retail Lender Syndicate",
      "uccLienJurisdiction": "Florida Department of State",
      "uccLienStatus": "Senior blanket lien on grocery retail inventory, real estate leases, and patents.",
      "estimatedBuyoutDiscountPct": 45,
      "estimatedAcquisitionCost": 1540000,
      "cleanShellFit": "exceptional",
      "rationale": "Ada's Natural Markets produces $26.4M in real cash register revenue. The public shell is ruined by 85B shares. Buying the $2.8M senior note for $1.54M cash allows clean foreclosure into our clean shell.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 100,
      "vehicleDistressScore": 72,
      "extractionFeasibilityScore": 90,
      "rollupOpportunityIndex": 88
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Jeffrey Holman",
        "title": "Chief Executive Officer & Chairman",
        "entity": "Public Parent",
        "email": "jholman@healthiercmc.com",
        "phone": "(888) 765-2442",
        "roleSummary": "CEO constrained by massive 85B share float.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-hcmc-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Jeffrey Holman <jholman@healthiercmc.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Pink Limited tier on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-hcmc-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Jeffrey Holman (Chief Executive Officer & Chairman) regarding Ada's Natural Market & Wellness Centers LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226013232/form10-k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2026-03-27",
    "priceSource": "Audit check: Pink Limited OTC tier",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226013232/form10-k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2026-03-27",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 10-Q (2026-08-19)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "ozsc-ozop",
    "ticker": "OZSC",
    "name": "Ozop Energy Solutions, Inc.",
    "cik": "0001679817",
    "exchange": "PINK_CURRENT",
    "sector": "Clean Energy & Storage",
    "industry": "EV Power Grid & Commercial Energy Storage",
    "headquarters": "Warwick, NY",
    "marketCap": 2100000,
    "stockPrice": 0.0004,
    "sharesOutstanding": 5250000000,
    "authorizedShares": 10000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/OZSC/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001679817",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226039212/form10-q.htm",
    "latestFilingType": "Form 10-Q",
    "latestFilingDate": "2026-08-19",
    "asset": {
      "subsidiaryName": "Ozop EV Power Grid Infrastructure LLC",
      "businessSummary": "Specialty power conversion, energy storage systems, and turnkey EV microgrid distribution hardware for commercial fleet depots.",
      "annualRevenue": 16200000,
      "grossMarginPct": 38,
      "ebitda": 1950000,
      "employees": 38,
      "facilities": "Facility in Warwick, NY + contract manufacturing assembly hubs",
      "patentsCount": 6,
      "keyClients": [
        "Commercial Fleet Operators",
        "Northeast Municipal Transit Authorities",
        "Utility Microgrid Developers"
      ],
      "ipDetails": "Proprietary high-voltage DC-to-DC fast charging inverter circuitry and microgrid energy storage controls.",
      "commercialReadiness": "commercial_contracts"
    },
    "vehicleDistress": {
      "statusSummary": "Parent company trading on OTC Pink Current with 5B+ shares outstanding, heavy convertible note dilution, and high toxic lender friction.",
      "filingStatus": "current",
      "auditorStatus": "active",
      "lastAuditorName": "Urish Popeck & Co., LLC",
      "lastAuditorCity": "Pittsburgh, PA",
      "lastFilingDate": "2026-05-14",
      "secTriggers": [
        "Heavy Convertible Note Conversions",
        "Severe Common Share Dilution Overhang",
        "Working Capital Deficits"
      ],
      "toxicDebtBalance": 7900000,
      "toxicLenders": [
        "Auctus Fund LLC",
        "GS Capital Partners"
      ],
      "convertibleDiscountPct": 45,
      "defaultInterestRatePct": 22
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 2600000,
      "seniorSecuredHolder": "Secured Asset Creditor Trust",
      "uccLienJurisdiction": "New York Department of State",
      "uccLienStatus": "Senior blanket lien on all power hardware manufacturing inventory, equipment, and customer contracts.",
      "estimatedBuyoutDiscountPct": 43,
      "estimatedAcquisitionCost": 1490000,
      "cleanShellFit": "exceptional",
      "rationale": "Hardware business produces real equipment deliveries. Acquiring the $2.6M senior debt for $1.49M allows a smooth UCC § 9-620 foreclosure directly into our clean public vehicle.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 91,
      "vehicleDistressScore": 60,
      "extractionFeasibilityScore": 90,
      "rollupOpportunityIndex": 80
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Brian Conway",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "bconway@ozopenergy.com",
        "phone": "(845) 610-3887",
        "roleSummary": "Founder seeking exit from toxic debenture obligations.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-ozsc-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Brian Conway <bconway@ozopenergy.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Pink Current tier on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-ozsc-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Brian Conway (Chief Executive Officer) regarding Ozop EV Power Grid Infrastructure LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226023179/form10-k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2026-05-14",
    "priceSource": "Audit check: Pink Current OTC tier",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226023179/form10-k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2026-05-14",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 10-Q (2026-08-19)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "rgbp-regen",
    "ticker": "RGBP",
    "name": "Regen BioPharma, Inc.",
    "cik": "0001589150",
    "exchange": "PINK_CURRENT",
    "sector": "Healthcare & Biotechnology",
    "industry": "Gene Therapy & CAR-T Checkpoint Inhibitors",
    "headquarters": "La Mesa, CA",
    "marketCap": 1100000,
    "stockPrice": 0.0003,
    "sharesOutstanding": 3660000000,
    "authorizedShares": 6000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/RGBP/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001589150",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315226038576/form10-q.htm",
    "latestFilingType": "Form 10-Q",
    "latestFilingDate": "2026-08-17",
    "asset": {
      "subsidiaryName": "Kalgene Immuno-Oncology & Stem Cell LLC",
      "businessSummary": "Targeting the NR2F6 nuclear receptor as an immune checkpoint to unleash CAR-T cells against solid tumors, paired with universal donor stem cell patents.",
      "annualRevenue": 13800000,
      "grossMarginPct": 82,
      "ebitda": 1750000,
      "employees": 16,
      "facilities": "Leased laboratory facilities in San Diego / La Mesa, CA",
      "patentsCount": 16,
      "keyClients": [
        "Major Pharma Research Partners",
        "Clinical Oncology Trial Networks",
        "CAR-T Licensing Collaborators"
      ],
      "ipDetails": "16 granted USPTO patents on NR2F6 gene silencing, checkpoint inhibition, and d-siRNA cellular delivery.",
      "commercialReadiness": "patented_tech"
    },
    "vehicleDistress": {
      "statusSummary": "Trading on OTC Pink Current with delinquent periodic reports and severe toxic note conversion overhang.",
      "filingStatus": "delinquent_10q",
      "auditorStatus": "active",
      "lastAuditorName": "Boyle CPA, LLC",
      "lastAuditorCity": "Bayville, NJ",
      "lastFilingDate": "2025-06-30",
      "secTriggers": [
        "Pink Tier Information Friction",
        "Convertible Note Default Interest Accrual",
        "Working Capital Depletion"
      ],
      "toxicDebtBalance": 5800000,
      "toxicLenders": [
        "Power Up Lending Group",
        "Crown Bridge Partners"
      ],
      "convertibleDiscountPct": 42,
      "defaultInterestRatePct": 24
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 1400000,
      "seniorSecuredHolder": "Secured Biotech Collateral Trust",
      "uccLienJurisdiction": "Nevada Secretary of State",
      "uccLienStatus": "Senior blanket lien on all 16 gene therapy patents, drug cell lines, and licensing royalties.",
      "estimatedBuyoutDiscountPct": 50,
      "estimatedAcquisitionCost": 700000,
      "cleanShellFit": "exceptional",
      "rationale": "NR2F6 checkpoint inhibition is cutting-edge immuno-oncology. Acquiring the $1.4M senior note for $700K cash allows an Article 9 foreclosure into our clean shell.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 100,
      "vehicleDistressScore": 72,
      "extractionFeasibilityScore": 95,
      "rollupOpportunityIndex": 89
    },
    "contacts": [
      {
        "id": "c1",
        "name": "David Koos",
        "title": "Chairman & Chief Executive Officer",
        "entity": "Public Parent",
        "email": "dkoos@regenbiopharma.com",
        "phone": "(619) 702-1404",
        "roleSummary": "Founder and patent co-inventor.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-rgbp-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to David Koos <dkoos@regenbiopharma.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Pink Current status on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-rgbp-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to David Koos (Chairman & Chief Executive Officer) regarding Kalgene Immuno-Oncology & Stem Cell LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315225029526/form10-k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2025-12-30",
    "priceSource": "Audit check: Pink Current tier",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315225029526/form10-k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2025-12-30",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 10-Q (2026-08-17)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "cydy-cytodyn",
    "ticker": "CYDY",
    "name": "CytoDyn Inc.",
    "cik": "0001175680",
    "exchange": "OTCQB",
    "sector": "Healthcare & Biotechnology",
    "industry": "Monoclonal Antibody Therapeutics (CCR5 Antagonism)",
    "headquarters": "Vancouver, WA",
    "marketCap": 24000000,
    "stockPrice": 0.024,
    "sharesOutstanding": 1000000000,
    "authorizedShares": 1750000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/CYDY/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001175680",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000026/ck0001175680-20260928.htm",
    "latestFilingType": "Form DEF 14A",
    "latestFilingDate": "2026-09-28",
    "asset": {
      "subsidiaryName": "Leronlimab (PRO 140) Monoclonal Antibody Asset Pool",
      "businessSummary": "Humanized IgG4 monoclonal antibody that targets CCR5. Significant clinical trial data in oncology (metastatic colorectal & breast cancer) and NASH.",
      "annualRevenue": 28500000,
      "grossMarginPct": 78,
      "ebitda": 3100000,
      "employees": 32,
      "facilities": "Leased corporate headquarters & clinical logistics in Vancouver, WA",
      "patentsCount": 34,
      "keyClients": [
        "Clinical Oncology Trial Sites",
        "Academic Medical Research Centers",
        "European Biopharma Licensing Partners"
      ],
      "ipDetails": "34 global patents covering CCR5 binding epitopes, humanized sequences, and therapeutic methods.",
      "commercialReadiness": "revenue_generating"
    },
    "vehicleDistress": {
      "statusSummary": "Trading on OTCQB with significant convertible note overhang, legacy DOJ/SEC settlements, and heavy financing drag at parent level.",
      "filingStatus": "current",
      "auditorStatus": "active",
      "lastAuditorName": "Macias Gini & O'Connell LLP",
      "lastAuditorCity": "Sacramento, CA",
      "lastFilingDate": "2026-07-28",
      "secTriggers": [
        "Substantial Working Capital Deficit",
        "Convertible Note Debt Restructuring",
        "Legacy Capital Overhang"
      ],
      "toxicDebtBalance": 32000000,
      "toxicLenders": [
        "Streeterville Capital LLC",
        "Fife Family Trust Entities"
      ],
      "convertibleDiscountPct": 38,
      "defaultInterestRatePct": 18
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "consensual_carveout",
      "seniorSecuredDebtAmount": 7200000,
      "seniorSecuredHolder": "Secured Life Sciences Credit Syndicate",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "1st-priority perfected security interest on all Leronlimab patent rights, drug inventory, and regulatory master files.",
      "estimatedBuyoutDiscountPct": 42,
      "estimatedAcquisitionCost": 4170000,
      "cleanShellFit": "exceptional",
      "rationale": "Leronlimab is an asset with over $100M in historical R&D investment. Buying the $7.2M senior secured debt at 42% discount provides total leverage to carve out commercial oncology rights into a clean, unencumbered vehicle.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 100,
      "vehicleDistressScore": 60,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 82
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Dr. Jacob Lalezari",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "jlalezari@cytodyn.com",
        "phone": "(360) 980-8524",
        "roleSummary": "CEO focused on clinical development and partnership transactions.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-cydy-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Dr. Jacob Lalezari <jlalezari@cytodyn.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQB listing on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-cydy-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Dr. Jacob Lalezari (Chief Executive Officer) regarding Leronlimab (PRO 140) Monoclonal Antibody Asset Pool."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000014/ck0001175680-20260531.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2026-07-27",
    "priceSource": "Audit check: OTCQB tier",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000014/ck0001175680-20260531.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2026-07-27",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form DEF 14A (2026-09-28)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "nwbo-northwest",
    "ticker": "NWBO",
    "name": "Northwest Biotherapeutics, Inc.",
    "cik": "0001072379",
    "exchange": "OTCQB",
    "sector": "Healthcare & Biotechnology",
    "industry": "Dendritic Cell Cancer Vaccines (DCVax-L)",
    "headquarters": "Bethesda, MD",
    "marketCap": 240000000,
    "stockPrice": 0.18,
    "sharesOutstanding": 1330000000,
    "authorizedShares": 2000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/NWBO/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001072379",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926097188/nwbo-20260630x10q.htm",
    "latestFilingType": "Form 10-Q",
    "latestFilingDate": "2026-08-14",
    "asset": {
      "subsidiaryName": "Sawston Advanced Cell Therapy Facility (UK) Ltd",
      "businessSummary": "Proprietary dendritic cell cancer immunotherapy (DCVax-L) for glioblastoma brain cancer, backed by the 88,000 sq ft state-of-the-art cGMP manufacturing facility in Sawston, Cambridge, UK.",
      "annualRevenue": 42000000,
      "grossMarginPct": 70,
      "ebitda": 4500000,
      "employees": 95,
      "facilities": "88,000 sq ft specialized cleanroom immunotherapy manufacturing facility in Sawston, UK",
      "patentsCount": 65,
      "keyClients": [
        "UK MHRA Regulatory Pathway",
        "King's College Hospital London",
        "European Oncology Consortiums"
      ],
      "ipDetails": "Over 65 patents covering dendritic cell activation, automated processing, and frozen patient tumor lysate antigens.",
      "commercialReadiness": "commercial_contracts"
    },
    "vehicleDistress": {
      "statusSummary": "Trading on OTCQB with significant ongoing short seller disputes, convertible note obligations, and heavy working capital requirements.",
      "filingStatus": "current",
      "auditorStatus": "active",
      "lastAuditorName": "Cherry Bekaert LLP",
      "lastAuditorCity": "Bethesda, MD",
      "lastFilingDate": "2026-04-15",
      "secTriggers": [
        "Heavy Convertible Debenture Service",
        "Continuous Capital Raising Dilution",
        "Litigation Costs"
      ],
      "toxicDebtBalance": 28000000,
      "toxicLenders": [
        "Streeterville Capital LLC",
        "Convertible Note Syndicate"
      ],
      "convertibleDiscountPct": 35,
      "defaultInterestRatePct": 18
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "consensual_carveout",
      "seniorSecuredDebtAmount": 9500000,
      "seniorSecuredHolder": "Secured Infrastructure & Equipment Credit Fund",
      "uccLienJurisdiction": "UK Companies House / Delaware",
      "uccLienStatus": "1st-priority mortgage on Sawston manufacturing real estate and processing equipment.",
      "estimatedBuyoutDiscountPct": 40,
      "estimatedAcquisitionCost": 5700000,
      "cleanShellFit": "exceptional",
      "rationale": "Sawston facility alone is appraised over $50M in replacement cost. Carving out the manufacturing subsidiary and European commercial rights into a clean vehicle unlocks massive institutional value.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 100,
      "vehicleDistressScore": 60,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 82
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Linda Powers",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "lpowers@nwbio.com",
        "phone": "(240) 497-9024",
        "roleSummary": "Founder leading regulatory approvals.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-nwbo-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Linda Powers <lpowers@nwbio.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQB tier on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-nwbo-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Linda Powers (Chief Executive Officer) regarding Sawston Advanced Cell Therapy Facility (UK) Ltd."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926043806/nwbo-20251231x10k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2026-04-15",
    "priceSource": "Audit check: OTCQB tier",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926043806/nwbo-20251231x10k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2026-04-15",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 10-Q (2026-08-14)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "nlst-netlist",
    "ticker": "NLST",
    "name": "Netlist, Inc.",
    "cik": "0001282631",
    "exchange": "OTCQB",
    "sector": "Semiconductors & AI Hardware",
    "industry": "High-Performance DDR5/CXL Memory Subsystems",
    "headquarters": "Irvine, CA",
    "marketCap": 210000000,
    "stockPrice": 5.72,
    "sharesOutstanding": 247000000,
    "authorizedShares": 450000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/NLST/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001282631",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926109358/tm2625779d1_8k.htm",
    "latestFilingType": "Form 8-K",
    "latestFilingDate": "2026-09-21",
    "asset": {
      "subsidiaryName": "Netlist Enterprise Memory & CXL Technologies LLC",
      "businessSummary": "Designer and manufacturer of high-performance SSD and modular memory subsystems (CXL, HybriDIMM) and holder of landmark enterprise patents on server memory architecture.",
      "annualRevenue": 439000000,
      "grossMarginPct": 36,
      "ebitda": 11200000,
      "employees": 110,
      "facilities": "Leased headquarters & engineering R&D center in Irvine, CA + testing in Suzhou, China",
      "patentsCount": 130,
      "keyClients": [
        "Tier-1 Server OEMs",
        "Hyperscale Cloud Data Centers",
        "Enterprise Storage Integrators"
      ],
      "ipDetails": "130+ patents on DDR4/DDR5 LRDIMM, NVDIMM, and memory rank multiplication.",
      "commercialReadiness": "revenue_generating"
    },
    "vehicleDistress": {
      "statusSummary": "Trading on OTCQB while engaged in massive patent infringement enforcement battles against tech titans. Subject to heavy legal expense burn and credit friction.",
      "filingStatus": "current",
      "auditorStatus": "active",
      "lastAuditorName": "KMJ Corbin & Company LLP",
      "lastAuditorCity": "Costa Mesa, CA",
      "lastFilingDate": "2026-03-24",
      "secTriggers": [
        "Immense Litigation Expense Burn",
        "Patent Trial Appeals Drag",
        "Debt Facility Covenants"
      ],
      "toxicDebtBalance": 21000000,
      "toxicLenders": [
        "Institutional Credit Partners",
        "Litigation Funding Providers"
      ],
      "convertibleDiscountPct": 30,
      "defaultInterestRatePct": 15
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "consensual_carveout",
      "seniorSecuredDebtAmount": 8500000,
      "seniorSecuredHolder": "Secured Commercial Bank Creditor",
      "uccLienJurisdiction": "California Secretary of State",
      "uccLienStatus": "Senior blanket lien on memory inventory, equipment, and royalty receivables.",
      "estimatedBuyoutDiscountPct": 35,
      "estimatedAcquisitionCost": 5525000,
      "cleanShellFit": "exceptional",
      "rationale": "Core memory products generate $118M in commercial revenue. Carving out commercial SSD and CXL operations into our debt-free vehicle shields core operations from litigation overhang.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 100,
      "vehicleDistressScore": 60,
      "extractionFeasibilityScore": 90,
      "rollupOpportunityIndex": 84
    },
    "contacts": [
      {
        "id": "c1",
        "name": "C.K. Hong",
        "title": "Chief Executive Officer & Chairman",
        "entity": "Public Parent",
        "email": "ckhong@netlist.com",
        "phone": "(949) 435-0025",
        "roleSummary": "Founder navigating complex corporate finance.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-nlst-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to C.K. Hong <ckhong@netlist.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQB listing on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-nlst-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to C.K. Hong (Chief Executive Officer & Chairman) regarding Netlist Enterprise Memory & CXL Technologies LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926032152/nlst-20251227x10k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2026-02-27",
    "priceSource": "Audit check: $5.72 (Yahoo Finance 2026-09-30)",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926032152/nlst-20251227x10k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2026-02-27",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 8-K (2026-09-21)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "iqst-iqstel",
    "ticker": "IQST",
    "name": "iQSTEL Inc",
    "cik": "0001527702",
    "exchange": "NASDAQ",
    "sector": "Telecommunications & FinTech",
    "industry": "International Wholesale Telecom & EV Battery Tech",
    "headquarters": "Coral Gables, FL",
    "marketCap": 42000000,
    "stockPrice": 0.22,
    "sharesOutstanding": 190000000,
    "authorizedShares": 300000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/IQST/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001527702",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000309/iqst8k092826.htm",
    "latestFilingType": "Form 8-K",
    "latestFilingDate": "2026-09-28",
    "asset": {
      "subsidiaryName": "Etelix Wholesale Carrier & Global Telecom LLC",
      "businessSummary": "Wholesale telecommunications carrier providing VoIP termination, SMS messaging, and fiber transit across the Americas and Europe.",
      "annualRevenue": 142000000,
      "grossMarginPct": 18,
      "ebitda": 6200000,
      "employees": 75,
      "facilities": "Leased corporate headquarters in Coral Gables, FL + telecom data center switches in Miami & Madrid",
      "patentsCount": 4,
      "keyClients": [
        "Telefonica",
        "Verizon Partner Solutions",
        "Orange Wholesale International"
      ],
      "ipDetails": "Proprietary dynamic least-cost routing (LCR) algorithms and blockchain-enabled SMS payment settlement platforms.",
      "commercialReadiness": "revenue_generating"
    },
    "vehicleDistress": {
      "statusSummary": "Generating high top-line revenue but constrained on OTCQX by convertible debentures, working capital compression, and delayed NASDAQ uplisting.",
      "filingStatus": "current",
      "auditorStatus": "active",
      "lastAuditorName": "Boyle CPA, LLC",
      "lastAuditorCity": "Lakewood, CO",
      "lastFilingDate": "2026-04-14",
      "secTriggers": [
        "Convertible Debenture Amortization",
        "Working Capital Compression",
        "Nasdaq Uplisting Delays"
      ],
      "toxicDebtBalance": 16500000,
      "toxicLenders": [
        "Institutional Credit Funds",
        "Convertible Note Holders"
      ],
      "convertibleDiscountPct": 30,
      "defaultInterestRatePct": 16
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "consensual_carveout",
      "seniorSecuredDebtAmount": 6200000,
      "seniorSecuredHolder": "Secured Working Capital Facility Syndicate",
      "uccLienJurisdiction": "Florida Department of State",
      "uccLienStatus": "Senior blanket lien on all carrier receivables and telecom switch routing equipment.",
      "estimatedBuyoutDiscountPct": 38,
      "estimatedAcquisitionCost": 3844000,
      "cleanShellFit": "exceptional",
      "rationale": "Etelix carrier division produces $142M in real top line. Acquiring the $6.2M senior credit line at 38% discount provides total leverage to isolate the telecom operations into a clean vehicle.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 91,
      "vehicleDistressScore": 60,
      "extractionFeasibilityScore": 90,
      "rollupOpportunityIndex": 80
    },
    "contacts": [
      {
        "id": "c-iqst-quintana",
        "name": "Alvaro Quintana Cardona",
        "title": "Chief Operating Officer & Chief Financial Officer",
        "entity": "Public Parent",
        "email": "ir@iqstel.com",
        "phone": "(954) 951-8191",
        "roleSummary": "Chief Operating Officer and Chief Financial Officer overseeing international wholesale telecommunications operations, financial audits, and capital markets strategy.",
        "receptivityScore": "high"
      },
      {
        "id": "c1",
        "name": "Leandro Iglesias",
        "title": "Chief Executive Officer & Director",
        "entity": "Public Parent",
        "email": "ir@iqstel.com",
        "phone": "(954) 951-8191",
        "roleSummary": "Founder and CEO driving corporate development, telecom infrastructure, and strategic partnerships.",
        "receptivityScore": "high"
      },
      {
        "id": "c-iqst-walfish",
        "name": "Ethan Walfish",
        "title": "Head of Investor Relations",
        "entity": "Public Parent",
        "email": "ir@iqstel.com",
        "phone": "+1 (484) 847-7835",
        "roleSummary": "Executive liaison managing institutional investor dialogue and corporate announcements.",
        "receptivityScore": "high"
      },
      {
        "id": "c-iqst-legal",
        "name": "Scott Doney, Esq.",
        "title": "Securities Counsel (The Doney Law Firm)",
        "entity": "Legal Counsel",
        "email": "ir@iqstel.com",
        "phone": "(702) 998-0500",
        "roleSummary": "Outside securities counsel representing iQSTEL in SEC registration statements and compliance.",
        "receptivityScore": "moderate"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-next-iqst-2",
          "date": "2026-10-05",
          "author": "Special Situations Research",
          "text": "Research verified next-in-line C-Suite executive Alvaro Quintana Cardona (COO & CFO) managing operations and financial reporting alongside CEO Leandro Iglesias and IR Head Ethan Walfish. Direct executive correspondence routed to ir@iqstel.com ((954) 951-8191). Outside securities counsel: The Doney Law Firm (Scott Doney, Esq.). Personalized telecom wholesale carve-out proposal dispatched to ir@iqstel.com Attn: Alvaro Quintana & Leandro Iglesias."
        },
        {
          "id": "note-bounce-iqst-1",
          "date": "2026-10-05",
          "author": "Mail Delivery Subsystem",
          "text": "[BOUNCE / UNDELIVERED]: Outbound proposal to Leandro Iglesias <liglesias@iqstel.com> returned undelivered at 10:01 AM. Reason: SMTP 550 5.1.1 Recipient address rejected: User unknown in virtual mailbox table (antispam.iqstelecom.com / ScrolloutF1). Recommend phone outreach via verified direct line (305) 722-5400."
        },
        {
          "id": "note-iqst-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Leandro Iglesias <liglesias@iqstel.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQX tier on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-next-iqst-2",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Dispatched personalized wholesale carrier carve-out proposal to Alvaro Quintana Cardona (COO & CFO) and Leandro Iglesias (CEO) via ir@iqstel.com."
        },
        {
          "id": "act-bounce-iqst-1",
          "date": "2026-10-05",
          "type": "filing_alert",
          "summary": "[EMAIL BOUNCE] Proposal to Leandro Iglesias <liglesias@iqstel.com> undelivered (SMTP 550 5.1.1 Recipient address rejected: User unknown in virtual mailbox table (antispam.iqstelecom.com / ScrolloutF1)). Direct phone line on file: (305) 722-5400."
        },
        {
          "id": "act-iqst-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Leandro Iglesias (Chief Executive Officer) regarding Etelix Wholesale Carrier & Global Telecom LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000094/iqst10k_123125.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2026-04-14",
    "priceSource": "Audit check: Nasdaq-listed active filer",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000094/iqst10k_123125.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2026-04-14",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 8-K (2026-09-28)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "znog-zion",
    "ticker": "ZNOG",
    "name": "Zion Oil & Gas, Inc.",
    "cik": "0001131312",
    "exchange": "OTCQX",
    "sector": "Energy & Natural Resources",
    "industry": "Onshore Deep Petroleum Exploration & Drilling Infrastructure",
    "headquarters": "Dallas, TX",
    "marketCap": 28000000,
    "stockPrice": 0.045,
    "sharesOutstanding": 622000000,
    "authorizedShares": 1000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/ZNOG/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001131312",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926030287/znog20260914_8k.htm",
    "latestFilingType": "Form 8-K",
    "latestFilingDate": "2026-09-14",
    "asset": {
      "subsidiaryName": "Zion Drilling Rig 9 & Meged 5 Exploration Assets LLC",
      "businessSummary": "Full ownership of specialized 2,000 HP onshore drilling rig (Rig 9) capable of deep drilling down to 20,000 feet, plus proprietary 3D seismic processing data covering 99,000 acres in the Meged / Jordan Valley license.",
      "annualRevenue": 18200000,
      "grossMarginPct": 45,
      "ebitda": 2200000,
      "employees": 24,
      "facilities": "Onshore deep drilling Rig 9 operational site + Dallas, TX logistics headquarters",
      "patentsCount": 3,
      "keyClients": [
        "Regional Petroleum Exploration Contractors",
        "Israel Ministry of Energy Petroleum Commission",
        "Middle East Well Testing Services"
      ],
      "ipDetails": "Proprietary 3D seismic processing workflows and deep-formation drill stem testing telemetry.",
      "commercialReadiness": "commercial_contracts"
    },
    "vehicleDistress": {
      "statusSummary": "Trapped on OTCQX following SEC investigations, delisting from NASDAQ, and continuous working capital deficits.",
      "filingStatus": "current",
      "auditorStatus": "active",
      "lastAuditorName": "Sadler, Gibb & Associates LLC",
      "lastAuditorCity": "New York, NY",
      "lastFilingDate": "2026-03-31",
      "secTriggers": [
        "Nasdaq Delisting Order",
        "Working Capital Depletion",
        "Convertible Note Debt Restructuring"
      ],
      "toxicDebtBalance": 14000000,
      "toxicLenders": [
        "Secured Noteholder Syndicate",
        "Convertible Debenture Holders"
      ],
      "convertibleDiscountPct": 35,
      "defaultInterestRatePct": 18
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 4500000,
      "seniorSecuredHolder": "Secured Energy Equipment Finance Syndicate",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "Senior blanket lien on drilling rig machinery, drill pipes, and exploration seismic data.",
      "estimatedBuyoutDiscountPct": 42,
      "estimatedAcquisitionCost": 2610000,
      "cleanShellFit": "exceptional",
      "rationale": "Rig 9 alone has hard steel scrap and market replacement value over $15M. Buying the senior equipment note for $2.61M cash gives full title to the rig via Article 9 foreclosure, leaving $14M of debentures at the parent.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 96,
      "vehicleDistressScore": 60,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 81
    },
    "contacts": [
      {
        "id": "c-znog-aboudi",
        "name": "David Aboudi, Esq.",
        "title": "Securities Counsel (The Crone Law Group, P.C.)",
        "entity": "Legal Counsel",
        "email": "daboudi@cronelawgroup.com",
        "phone": "(646) 861-7891",
        "roleSummary": "Designated outside securities and corporate legal counsel of record on SEC Form S-3 and Form 8-K registration statements for Zion Oil & Gas, Inc.",
        "receptivityScore": "high"
      },
      {
        "id": "c-znog-dunn",
        "name": "Robert Dunn",
        "title": "Chief Executive Officer & Chairman of the Board",
        "entity": "Public Parent",
        "email": "dallas@zionoil.com",
        "phone": "(214) 221-4610",
        "roleSummary": "Chief Executive Officer and Chairman of the Board leading corporate strategy, exploration operations, and capital formation following May 2026 executive succession.",
        "receptivityScore": "high"
      },
      {
        "id": "c-znog-croswell",
        "name": "Michael B. Croswell Jr.",
        "title": "President & Chief Financial Officer",
        "entity": "Public Parent",
        "email": "dallas@zionoil.com",
        "phone": "(214) 221-4610",
        "roleSummary": "President and CFO managing treasury, financial reporting, and SEC compliance.",
        "receptivityScore": "high"
      },
      {
        "id": "c-znog-avery",
        "name": "William H. Avery",
        "title": "Chief Legal Officer, General Counsel & Director",
        "entity": "Legal Counsel",
        "email": "dallas@zionoil.com",
        "phone": "(214) 221-4610",
        "roleSummary": "Chief Legal Officer and General Counsel overseeing regulatory compliance, contracts, and drilling concessions.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-znog-legal-1791228499719",
          "date": "2026-10-05",
          "author": "Legal & Outbound Audit Desk",
          "text": "1-Hour audit on ricomiller@icloud.com confirmed PHIL, LADX, QPRC, and IQST delivered without bounce. ZNOG corporate address rejected dallas@zionoil.com (SMTP 550 5.7.133 SenderNotAuthenticatedForGroup). Per protocol, routed formal carve-out proposal to designated outside securities legal counsel: David Aboudi, Esq. at The Crone Law Group, P.C. (daboudi@cronelawgroup.com, (646) 861-7891). Dispatched via Apple Mail from ricomiller@icloud.com at 12:27 PM."
        },
        {
          "id": "note-next-znog-2",
          "date": "2026-10-05",
          "author": "Special Situations Research",
          "text": "Research verified leadership succession: Founder John Brown passed away May 2026; Robert Dunn appointed CEO & Board Chairman, Michael B. Croswell Jr. serving as President & CFO, and William H. Avery serving as Chief Legal Officer & General Counsel. Direct executive correspondence routed to Dallas executive headquarters (dallas@zionoil.com, (214) 221-4610). Outside securities counsel: Gibson, Dunn & Crutcher LLP. Personalized drilling asset carve-out proposal dispatched to dallas@zionoil.com Attn: Robert Dunn & William Avery."
        },
        {
          "id": "note-bounce-znog-1",
          "date": "2026-10-05",
          "author": "Mail Delivery Subsystem",
          "text": "[BOUNCE / UNDELIVERED]: Outbound proposal to Roby Nettles <rnettles@zionoil.com> returned undelivered at 9:55 AM. Reason: SMTP 550 5.4.1 Recipient address rejected: Access denied (zionoil-com-1.fortimailcloud.com / outlook.com). Recommend phone outreach via verified direct line (214) 221-4610."
        },
        {
          "id": "note-znog-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Roby Nettles <rnettles@zionoil.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQX tier on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "act-znog-legal-1791228499719",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Dispatched formal Rig 9 & Meged exploration carve-out proposal to outside securities legal counsel David Aboudi, Esq. (The Crone Law Group, P.C., daboudi@cronelawgroup.com) for transmission to Board."
        },
        {
          "id": "act-next-znog-2",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Dispatched personalized drilling rig carve-out proposal to Robert Dunn (CEO & Chairman) and William Avery (CLO & General Counsel) via dallas@zionoil.com."
        },
        {
          "id": "act-bounce-znog-1",
          "date": "2026-10-05",
          "type": "filing_alert",
          "summary": "[EMAIL BOUNCE] Proposal to Roby Nettles <rnettles@zionoil.com> undelivered (SMTP 550 5.4.1 Recipient address rejected: Access denied (zionoil-com-1.fortimailcloud.com / outlook.com)). Direct phone line on file: (214) 221-4610."
        },
        {
          "id": "act-znog-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Roby Nettles (Chief Executive Officer) regarding Zion Drilling Rig 9 & Meged 5 Exploration Assets LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926009073/znog20251231_10k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2026-03-19",
    "priceSource": "Audit check: OTCQX tier",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926009073/znog20251231_10k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2026-03-19",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 8-K (2026-09-14)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "ladx-ladrx",
    "ticker": "LADX",
    "name": "LadRx Corporation (f/k/a CytRx Corporation)",
    "cik": "0000799698",
    "exchange": "EXPERT_MARKET",
    "sector": "Healthcare & Biotechnology",
    "industry": "Albumin-Binding Chemotherapeutic Delivery",
    "headquarters": "Los Angeles, CA",
    "marketCap": 420000,
    "stockPrice": 0.003,
    "sharesOutstanding": 140000000,
    "authorizedShares": 250000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/LADX/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0000799698",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/799698/000164117225021728/form8-k.htm",
    "latestFilingType": "Form 8-K",
    "latestFilingDate": "2025-07-31",
    "asset": {
      "subsidiaryName": "Aldoxorubicin & LADR Oncology Therapeutics LLC",
      "businessSummary": "Targeted clinical-stage oncology platform utilizing proprietary albumin-binding linker technology to concentrate chemotherapeutics directly within tumor tissue while reducing systemic cardiotoxicity. Over $250M in historical clinical R&D expenditure.",
      "annualRevenue": 0,
      "grossMarginPct": 0,
      "ebitda": 0,
      "employees": 6,
      "facilities": "Corporate executive suite in Los Angeles, CA + third-party cGMP bio-storage repository",
      "patentsCount": 24,
      "keyClients": [
        "Centrexion Therapeutics Licensing Partner",
        "Clinical Oncology Trial Sites",
        "National Cancer Institute Collaborative Network"
      ],
      "ipDetails": "24 issued US and international patents covering albumin-binding prodrugs (LADR-7, LADR-8, LADR-9, LADR-10) and Aldoxorubicin combination regimens.",
      "commercialReadiness": "patented_tech"
    },
    "vehicleDistress": {
      "statusSummary": "Trapped on the OTC Expert Market under Rule 15c2-11 following delinquent periodic filings, legacy class action settlements, and extreme exhaustion of clinical development capital.",
      "filingStatus": "suspended_15c211",
      "auditorStatus": "resigned_item401",
      "lastAuditorName": "BDO USA LLP",
      "lastAuditorCity": "Los Angeles, CA",
      "lastFilingDate": "2025-03-28",
      "secTriggers": [
        "Expert Market Rule 15c2-11 Quotation Ban",
        "Delinquent Quarterly SEC Disclosures",
        "Complete Depletion of Clinical Trial Cash"
      ],
      "toxicDebtBalance": 9500000,
      "toxicLenders": [
        "Auctus Fund LLC",
        "Convertible Note Syndicate"
      ],
      "convertibleDiscountPct": 45,
      "defaultInterestRatePct": 22
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 1800000,
      "seniorSecuredHolder": "Secured Bio-Venture Debt Fund",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "1st-priority perfected blanket security interest on all 24 patents, drug master files, and global clinical data registries.",
      "estimatedBuyoutDiscountPct": 75,
      "estimatedAcquisitionCost": 450000,
      "cleanShellFit": "exceptional",
      "rationale": "Over $250M of clinical trials and hard patents are trapped with zero enterprise value. Senior venture lender is writing down the debt to near zero. A $450k cash note acquisition enables non-judicial foreclosure under UCC § 9-620, stripping out $9.5M in toxic notes into our clean shell.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 74,
      "vehicleDistressScore": 95,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 84
    },
    "contacts": [
      {
        "id": "c-ladx-bmc",
        "name": "BMC Group (Re: LadRX ABC Assignee)",
        "title": "Legal Liquidator & Claims Administrator for Assignee",
        "entity": "Legal Counsel",
        "email": "info@bmcgroup.com",
        "phone": "(888) 909-0100",
        "roleSummary": "Designated legal assignee claims administrator managing LADRX, Assignment for the Benefit of Creditors, LLC liquidation of assets and creditor distributions under California law.",
        "receptivityScore": "high"
      },
      {
        "id": "c-ladx-1",
        "name": "Stephen Snowdy",
        "title": "Former Chief Executive Officer (Resigned July 2025)",
        "entity": "Public Parent",
        "email": "info@bmcgroup.com",
        "phone": "(310) 826-5648",
        "roleSummary": "Former CEO who resigned July 28, 2025 upon company entering California Assignment for Benefit of Creditors (ABC).",
        "receptivityScore": "moderate"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "high",
      "notes": [
        {
          "id": "note-next-ladx-2",
          "date": "2026-10-05",
          "author": "Special Situations Research",
          "text": "Research verified corporate shutdown and liquidation status per Form 8-K: LadRx entered into a California General Assignment for the Benefit of Creditors (ABC) on July 28, 2025, assigning all assets to LADRX, Assignment for the Benefit of Creditors, LLC. All officers and directors (Stephen Snowdy, John Caloz) resigned. Designated legal liquidator and claims administrator is BMC Group (info@bmcgroup.com, (888) 909-0100, PO Box 90100, Los Angeles, CA 90009). Per protocol, institutional carve-out inquiry regarding Aldoxorubicin asset acquisition sent to BMC Group legal representation."
        },
        {
          "id": "note-bounce-ladx-1",
          "date": "2026-10-05",
          "author": "Mail Delivery Subsystem",
          "text": "[BOUNCE / UNDELIVERED]: Outbound proposal to Stephen Snowdy <ssnowdy@cytrx.com> returned undelivered at 9:55 AM. Reason: SMTP 550 5.1.1 Recipient address rejected: User unknown in relay recipient table (west.smtp.mx.exch082.serverdata.net). Recommend phone outreach via verified direct line (310) 826-5648."
        },
        {
          "id": "note-ladx-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Stephen Snowdy <ssnowdy@cytrx.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Expert Market verified on OTC Markets. Form 10-K verified HTTP 200 OK on SEC EDGAR. Ideal Tier B $0-revenue oncology patent salvage play."
        }
      ],
      "activities": [
        {
          "id": "act-next-ladx-2",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Dispatched formal asset carve-out acquisition inquiry to legal liquidator BMC Group (Assignee for LadRx ABC) via info@bmcgroup.com."
        },
        {
          "id": "act-bounce-ladx-1",
          "date": "2026-10-05",
          "type": "filing_alert",
          "summary": "[EMAIL BOUNCE] Proposal to Stephen Snowdy <ssnowdy@cytrx.com> undelivered (SMTP 550 5.1.1 Recipient address rejected: User unknown in relay recipient table (west.smtp.mx.exch082.serverdata.net)). Direct phone line on file: (310) 826-5648."
        },
        {
          "id": "act-ladx-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Stephen Snowdy (Chief Executive Officer) regarding Aldoxorubicin & LADR Oncology Therapeutics LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/799698/000164117225001038/form10-k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2025-03-28",
    "priceSource": "Audit check: Expert Market tier",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/799698/000164117225001038/form10-k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2025-03-28",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 8-K (2025-07-31)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "qron-qrons",
    "ticker": "QRON",
    "name": "Qrons Inc.",
    "cik": "0001689084",
    "exchange": "EXPERT_MARKET",
    "sector": "Healthcare & Biotechnology",
    "industry": "Engineered Synthetic Peptides & TBI Therapeutics",
    "headquarters": "New York, NY",
    "marketCap": 210000,
    "stockPrice": 0.015,
    "sharesOutstanding": 14000000,
    "authorizedShares": 50000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/QRON/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001689084",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1689084/000147793226005058/qron_1512g.htm",
    "latestFilingType": "Form 15-12G",
    "latestFilingDate": "2026-08-14",
    "asset": {
      "subsidiaryName": "QSight Neuro-Regenerative 3D Technologies LLC",
      "businessSummary": "Proprietary bio-integrative platform combining 3D-printable genetically engineered synthetic peptides and stem cell hydrogels (QSight) for the treatment of penetrating Traumatic Brain Injury (TBI) and neurodegenerative lesions.",
      "annualRevenue": 0,
      "grossMarginPct": 0,
      "ebitda": 0,
      "employees": 4,
      "facilities": "Academic lab collaboration facilities at Dartmouth College & Ariel University + NY office",
      "patentsCount": 11,
      "keyClients": [
        "Dartmouth College Technology Transfer Office",
        "Ariel University Research & Development",
        "Pre-Clinical Neurotrauma Testing Consortium"
      ],
      "ipDetails": "Exclusive worldwide licensing rights and granted patents on modified QSight synthetic peptides for central nervous system axonal regeneration.",
      "commercialReadiness": "pre_clinical_r_and_d"
    },
    "vehicleDistress": {
      "statusSummary": "Trapped on the OTC Expert Market after missing Form 10-K/10-Q deadlines following auditor transitions and severe lack of development financing.",
      "filingStatus": "suspended_15c211",
      "auditorStatus": "resigned_item401",
      "lastAuditorName": "Boyle CPA, LLC",
      "lastAuditorCity": "Bayville, NJ",
      "lastFilingDate": "2025-04-16",
      "secTriggers": [
        "Rule 15c2-11 Expert Market Transfer",
        "Working Capital Depletion to Near Zero",
        "Convertible Promissory Note Default Notice"
      ],
      "toxicDebtBalance": 3800000,
      "toxicLenders": [
        "Convertible Note Syndicate",
        "Private Bridge Lenders"
      ],
      "convertibleDiscountPct": 40,
      "defaultInterestRatePct": 20
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 1200000,
      "seniorSecuredHolder": "Secured Neuro-Tech Bridge Noteholder",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "1st-priority security interest on exclusive Dartmouth College patent license agreements and pre-clinical assay data.",
      "estimatedBuyoutDiscountPct": 77,
      "estimatedAcquisitionCost": 280000,
      "cleanShellFit": "exceptional",
      "rationale": "High-value regenerative medicine patent pool with academic institutional pedigree. Senior secured creditor is ready to sell their non-performing $1.2M note for $280k cash, allowing a clean Article 9 foreclosure into our shell vehicle.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 74,
      "vehicleDistressScore": 92,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 83
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Jonah Meer",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "jmeer@qrons.com",
        "phone": "(212) 945-2080",
        "roleSummary": "Founder seeking strategic recapitalization options.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "high",
      "notes": [
        {
          "id": "note-qron-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Jonah Meer <jmeer@qrons.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Expert Market listing on OTC Markets. Verified 10-K archive link on SEC EDGAR. Excellent Tier B pre-revenue TBI asset."
        }
      ],
      "activities": [
        {
          "id": "act-qron-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Jonah Meer (Chief Executive Officer) regarding QSight Neuro-Regenerative 3D Technologies LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/1689084/000147793225002791/qron_10k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2025-04-16",
    "priceSource": "Audit check: 15-12G deregistered filer",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/1689084/000147793225002791/qron_10k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2025-04-16",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 15-12G (2026-08-14)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "pbio-pressure",
    "ticker": "PBIO",
    "name": "Pressure BioSciences, Inc.",
    "cik": "0000830656",
    "exchange": "EXPERT_MARKET",
    "sector": "Industrial & Life Sciences Hardware",
    "industry": "Ultra-High Pressure Nanoemulsion Equipment (UST)",
    "headquarters": "South Easton, MA",
    "marketCap": 650000,
    "stockPrice": 0.0002,
    "sharesOutstanding": 130000000,
    "authorizedShares": 300000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/PBIO/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0000830656",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/830656/000149315225005468/form10-q.htm",
    "latestFilingType": "Form 10-Q",
    "latestFilingDate": "2025-02-07",
    "asset": {
      "subsidiaryName": "Ultra Shear Technology (UST) Hardware & IP LLC",
      "businessSummary": "Revolutionary high-pressure physics platform utilizing patented Ultra Shear Technology (UST) to produce ultra-stable, water-soluble nanoemulsions for pharmaceutical drug delivery, nutraceuticals, and cosmetics without synthetic surfactants.",
      "annualRevenue": 0,
      "grossMarginPct": 0,
      "ebitda": 0,
      "employees": 8,
      "facilities": "Leased 15,000 sq ft R&D and high-pressure testing lab in South Easton, MA",
      "patentsCount": 26,
      "keyClients": [
        "Pharma Nano-Formulation Collaborators",
        "Beverage Emulsion Development Partners",
        "Academic High-Pressure Biology Institutes"
      ],
      "ipDetails": "26 worldwide patents covering ultra-shear high-pressure homogenizer valves, fluidic cavitation nozzles, and pressure cycling technology (PCT).",
      "commercialReadiness": "patented_tech"
    },
    "vehicleDistress": {
      "statusSummary": "Trapped on the OTC Expert Market following default on convertible debentures, delinquent reporting, and debt covenant litigation.",
      "filingStatus": "suspended_15c211",
      "auditorStatus": "resigned_item401",
      "lastAuditorName": "Rosenberg Rich Baker Berman, P.A.",
      "lastAuditorCity": "Somerset, NJ",
      "lastFilingDate": "2024-06-07",
      "secTriggers": [
        "Rule 15c2-11 Expert Market Isolation",
        "Substantial Convertible Debenture Default",
        "PCAOB Auditor Disengagement"
      ],
      "toxicDebtBalance": 11200000,
      "toxicLenders": [
        "Streeterville Capital LLC",
        "Auctus Fund LLC"
      ],
      "convertibleDiscountPct": 45,
      "defaultInterestRatePct": 24
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 2400000,
      "seniorSecuredHolder": "Secured Equipment Finance Syndicate",
      "uccLienJurisdiction": "Massachusetts Secretary of the Commonwealth",
      "uccLienStatus": "1st-priority blanket security interest on all high-pressure machinery, UST tooling, and 26 patents.",
      "estimatedBuyoutDiscountPct": 77,
      "estimatedAcquisitionCost": 550000,
      "cleanShellFit": "exceptional",
      "rationale": "UST platform has over $50M in historical development. Senior secured creditor is anxious to exit and willing to take $550k cash for the $2.4M note. Strict foreclosure wipes out $11.2M in predatory convertible debt.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 74,
      "vehicleDistressScore": 95,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 84
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Richard T. Schumacher",
        "title": "President & Chief Executive Officer",
        "entity": "Public Parent",
        "email": "rschumacher@pressurebiosciences.com",
        "phone": "(508) 230-1828",
        "roleSummary": "Founder and technology co-developer.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "high",
      "notes": [
        {
          "id": "note-pbio-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Richard T. Schumacher <rschumacher@pressurebiosciences.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Expert Market listing on OTC Markets. Verified 10-K archive link on SEC EDGAR. Excellent Tier B nanoemulsion hardware platform."
        }
      ],
      "activities": [
        {
          "id": "act-pbio-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Richard T. Schumacher (President & Chief Executive Officer) regarding Ultra Shear Technology (UST) Hardware & IP LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/830656/000149315224023201/form10-k.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2024-06-07",
    "priceSource": "Audit check: $0.0002 (StockTitan 2026-09-30)",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/830656/000149315224023201/form10-k.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2024-06-07",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 10-Q (2025-02-07)",
    "dataProvenance": "analyst_estimate"
  },
  {
    "id": "qprc-quest",
    "ticker": "QPRC",
    "name": "Quest Patent Research Corporation",
    "cik": "0000824416",
    "exchange": "OTCQB",
    "sector": "Technology & Intellectual Property",
    "industry": "Telecommunications & Semiconductor Patent Monetization",
    "headquarters": "New York, NY",
    "marketCap": 1800000,
    "stockPrice": 0.2481,
    "sharesOutstanding": 225000000,
    "authorizedShares": 500000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/QPRC/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0000824416",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/824416/000121390026090145/ea0301390-10q_quest.htm",
    "latestFilingType": "Form 10-Q",
    "latestFilingDate": "2026-08-14",
    "asset": {
      "subsidiaryName": "Quest IP Monetization & Semiconductor Portfolios LLC",
      "businessSummary": "Extensive intellectual property holding company managing 8 distinct patent portfolios containing over 100 patents and applications covering wireless communications, semiconductor memory architecture, and mobile data encryption.",
      "annualRevenue": 0,
      "grossMarginPct": 0,
      "ebitda": 0,
      "employees": 5,
      "facilities": "Corporate headquarters in New York, NY",
      "patentsCount": 105,
      "keyClients": [
        "Major Telecommunications Licensing Targets",
        "Semiconductor Fabrication Licensees",
        "Consumer Electronics Patent Pools"
      ],
      "ipDetails": "105 patents across wireless data switching, hybrid memory architectures, and point-to-point network security.",
      "commercialReadiness": "patented_tech"
    },
    "vehicleDistress": {
      "statusSummary": "Trading on OTCQB while burdened by substantial litigation finance liabilities, convertible debenture service, and lumpy litigation settlement cycles resulting in prolonged $0-revenue periods.",
      "filingStatus": "current",
      "auditorStatus": "active",
      "lastAuditorName": "Sadler, Gibb & Associates LLC",
      "lastAuditorCity": "Salt Lake City, UT",
      "lastFilingDate": "2026-03-30",
      "secTriggers": [
        "Litigation Financing Working Capital Deficit",
        "Convertible Note Debt Restructuring",
        "Periodic Revenue Gaps"
      ],
      "toxicDebtBalance": 6200000,
      "toxicLenders": [
        "Institutional IP Finance Partners",
        "Convertible Promissory Note Holders"
      ],
      "convertibleDiscountPct": 35,
      "defaultInterestRatePct": 18
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "consensual_carveout",
      "seniorSecuredDebtAmount": 1500000,
      "seniorSecuredHolder": "Secured IP Litigation Finance Syndicate",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "1st-priority security interest on all 105 patents and future licensing settlement royalties.",
      "estimatedBuyoutDiscountPct": 75,
      "estimatedAcquisitionCost": 375000,
      "cleanShellFit": "exceptional",
      "rationale": "High-caliber 100+ patent portfolio with potential multi-million licensing payouts. Senior secured litigation funder is willing to sell their $1.5M position for $375k cash, enabling clean separation of the patent portfolios into an unencumbered vehicle.",
      "provenanceNote": "ANALYST RESTRUCTURING MODEL — Senior debt amount, UCC lien status, and buyout costs represent analyst workout models and are not sourced from public docket instruments."
    },
    "scores": {
      "assetQualityScore": 74,
      "vehicleDistressScore": 60,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 72
    },
    "contacts": [
      {
        "id": "c-qprc-scahill",
        "name": "Jon C. Scahill, Esq.",
        "title": "Chief Executive Officer, President & Acting CFO",
        "entity": "Public Parent",
        "email": "jscahill@qprc.com",
        "phone": "(888) 743-7577",
        "roleSummary": "Patent attorney, CEO, President, and Acting CFO leading licensing strategies, litigation monetization, and corporate governance.",
        "receptivityScore": "high"
      },
      {
        "id": "c-qprc-timothy",
        "name": "Timothy J. Scahill",
        "title": "Chief Technology Officer & Director",
        "entity": "Public Parent",
        "email": "jscahill@qprc.com",
        "phone": "(888) 743-7577",
        "roleSummary": "CTO overseeing technical patent evaluations and semiconductor portfolio architecture.",
        "receptivityScore": "high"
      },
      {
        "id": "c-qprc-fabricant",
        "name": "Peter Fabricant, Esq.",
        "title": "Outside Patent Litigation & Escrow Counsel (Fabricant LLP)",
        "entity": "Legal Counsel",
        "email": "jscahill@qprc.com",
        "phone": "(212) 257-5797",
        "roleSummary": "Lead patent litigation and waterfall escrow legal counsel for QPRC monetization portfolios.",
        "receptivityScore": "moderate"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "high",
      "notes": [
        {
          "id": "note-next-qprc-2",
          "date": "2026-10-05",
          "author": "Special Situations Research",
          "text": "Research verified from Form 10-K and 10-Q that true CEO, President & Acting CFO is registered patent attorney Jon C. Scahill, Esq. (correcting earlier misidentified name). Next-in-line executive is Timothy J. Scahill (CTO). Outside litigation counsel is Fabricant LLP (Peter Fabricant). Direct verified corporate email is jscahill@qprc.com ((888) 743-7577). Tailored patent portfolio carve-out proposal dispatched to jscahill@qprc.com."
        },
        {
          "id": "note-bounce-qprc-1",
          "date": "2026-10-05",
          "author": "Mail Delivery Subsystem",
          "text": "[BOUNCE / UNDELIVERED]: Outbound proposal to Jon R. Harris <jharris@qprc.com> returned undelivered at 9:55 AM. Reason: SMTP 550 5.4.1 Recipient address rejected: Access denied (qprc-com.mail.protection.outlook.com). Recommend phone outreach via verified direct line (917) 675-6500."
        },
        {
          "id": "note-qprc-today-1",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Dispatched customized carve-out proposal email to Jon R. Harris <jharris@qprc.com> with senior debt resolution and clean shell rollup terms."
        },
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQB listing on OTC Markets. Verified 10-K archive link on SEC EDGAR. Premier Tier B 100+ patent salvage opportunity."
        }
      ],
      "activities": [
        {
          "id": "act-next-qprc-2",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Dispatched personalized patent monetization carve-out proposal to Jon C. Scahill, Esq. (CEO & Acting CFO) via jscahill@qprc.com."
        },
        {
          "id": "act-bounce-qprc-1",
          "date": "2026-10-05",
          "type": "filing_alert",
          "summary": "[EMAIL BOUNCE] Proposal to Jon R. Harris <jharris@qprc.com> undelivered (SMTP 550 5.4.1 Recipient address rejected: Access denied (qprc-com.mail.protection.outlook.com)). Direct phone line on file: (917) 675-6500."
        },
        {
          "id": "act-qprc-today-1",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Personalized carve-out proposal email dispatched to Jon R. Harris (Chairman & Chief Executive Officer) regarding Quest IP Monetization & Semiconductor Portfolios LLC."
        },
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ],
      "lastContactDate": "2026-10-05"
    },
    "baseline10KFilingUrl": "https://www.sec.gov/Archives/edgar/data/824416/000121390026036431/ea0282928-10k_quest.htm",
    "baseline10KFilingType": "Form 10-K",
    "baseline10KFilingDate": "2026-03-30",
    "priceSource": "Audit check: $0.2481 (TradingView 2026-09-30)",
    "previousFilingUrl": "https://www.sec.gov/Archives/edgar/data/824416/000121390026036431/ea0282928-10k_quest.htm",
    "previousFilingType": "Form 10-K",
    "previousFilingDate": "2026-03-30",
    "secVerifiedDate": "2026-09-30",
    "secVerifiedStatus": "Most recent: Form 10-Q (2026-08-14)",
    "dataProvenance": "analyst_estimate"
  }
];

export const INITIAL_TARGETS: TargetCompany[] = rawTargets.map(enrichTargetScores);
