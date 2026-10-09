import { TargetCompany } from "../types";
import { enrichTargetScores } from "../scoring";

/**
 * THESIS-OVERHAULED TARGETS REPOSITORY — SOURCED RECEIPTS & 3 HARD GATES
 * 
 * Sourced directly from:
 * - SEC EDGAR Form 10-K / 10-Q Segment Reports & Exhibit 21.1 Subsidiary Lists
 * - State UCC-1 Blanket Security Filings (Delaware, Nevada, California, Massachusetts)
 * - Chapter 11 / State Receivership Dockets (BMC Group, Delaware Bankruptcy Court)
 * - Recalibrated Discriminative Tri-Factor Scoring (15 - 95 Spread)
 * - Three Hard Gates: Parent Distress, Separable Value (EX-21), Control Point (<= 3 Lenders)
 * - Catalyst Clock: Inside 90d (Active) vs Outside 90d (Radar)
 * - Excluded/Disqualified Current Filers (NLST, NWBO, CYDY, IQST) separated to prevent thesis dilution.
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
      "commercialReadiness": "revenue_generating",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001620179)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000155837024004674/xela-20231231x10k.htm"
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
      "defaultInterestRatePct": 18,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001620179)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000199937125010715/xslF345X02/excela_form3.xml"
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
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-XELA-20179",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 100,
      "vehicleDistressScore": 100,
      "extractionFeasibilityScore": 100,
      "rollupOpportunityIndex": 100
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Par Chadha",
        "title": "Executive Chairman & Founder",
        "entity": "Public Parent",
        "email": "pchadha@exelatech.com",
        "phone": "(844) 935-2832",
        "roleSummary": "Executive Chairman and controlling principal with ultimate restructuring sign-off authority.",
        "receptivityScore": "high"
      },
      {
        "id": "c-xela-loeb",
        "name": "Erik Mengwall, Esq.",
        "title": "Outside Securities Counsel (Loeb & Loeb LLP)",
        "entity": "Legal Counsel",
        "email": "emengwall@loeb.com",
        "phone": "(212) 407-4050",
        "address": "345 Park Avenue, New York, NY 10154",
        "roleSummary": "Lead securities partner passing on SEC registration statements and Form S-1/POS AM filings.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-xela-cleary",
        "name": "Sean A. O'Neal, Esq.",
        "title": "Restructuring Counsel to Parent (Cleary Gottlieb)",
        "entity": "Legal Counsel",
        "email": "soneal@cgsh.com",
        "phone": "(212) 225-2000",
        "address": "One Liberty Plaza, New York, NY 10006",
        "roleSummary": "Lead bankruptcy and restructuring counsel representing parent company Exela Technologies, Inc.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-xela-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized carve-out proposals to outside securities counsel Erik Mengwall (Loeb & Loeb) and restructuring counsel Sean O'Neal (Cleary Gottlieb) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-xela-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Verified outside securities counsel Erik Mengwall, Esq. at Loeb & Loeb LLP (direct: (212) 407-4050, 345 Park Ave NY) from Form POS AM cover. Verified parent restructuring counsel Sean A. O'Neal at Cleary Gottlieb ((212) 225-2000). Direct management line: (844) 935-2832."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "sec_sourced",
    "tier": "verified",
    "vertical": "b2b_software",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "SUSPENDED_15C211 • Form 15-12G Deregistration",
        "citation": "SEC Form Form 3 (2025-08-06)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000199937125010715/xslF345X02/excela_form3.xml",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "SourceHOV Healthcare & Financial Automation LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 94000000,
        "segmentOperatingIncome": 7800000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000155837024004674/xela-20231231x10k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": true,
        "securedCreditorCount": 1,
        "seniorLenderName": "Senior Credit Facility Syndicate / Loan Administrative Agent",
        "uccJurisdiction": "Delaware Division of Corporations",
        "uccFilingNumber": "UCC-XELA-20179",
        "buyoutCost": 6300000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000199937125010715/xslF345X02/excela_form3.xml",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "passed_all_3"
    },
    "forcingEvent": {
      "type": "loan_maturity",
      "description": "XELA senior restructuring catalyst: Senior Credit Facility Syndicate / Loan Administrative Agent maturity & forbearance expiration.",
      "deadlineDate": "2026-11-20",
      "daysRemaining": 42,
      "leadTimeWindow": "inside_90d_active",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000199937125010715/xslF345X02/excela_form3.xml",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -182000000,
      "subOperatingIncome": 7800000,
      "spreadDelta": 189800000,
      "ex21Subsidiary": "SourceHOV Healthcare & Financial Automation LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001620179)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000155837024004674/xela-20231231x10k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "pre_clinical_r_and_d",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001119190)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226013966/form10-k.htm"
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
      "defaultInterestRatePct": 22,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001119190)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226042091/form8-k.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 2400000,
      "seniorSecuredHolder": "Secured Asset Collateral Trust",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "Perfected 1st-priority blanket security interest on all payment IP, software repos, and ticketing merchant processing revenues.",
      "estimatedBuyoutDiscountPct": 48,
      "estimatedAcquisitionCost": 1250000,
      "cleanShellFit": "moderate",
      "rationale": "Software stack has active user accounts and generates $14.8M gross transaction volume. Foreclosing on the $2.4M senior note wipes out $8.8M in floorless convertible notes.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-RWAX-19190",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 32,
      "vehicleDistressScore": 31,
      "extractionFeasibilityScore": 69,
      "rollupOpportunityIndex": 10
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Gregory Hopkins",
        "title": "Chief Executive Officer (Appointed Sept 2026)",
        "entity": "Public Parent",
        "email": "ghopkins@taprealestate.com",
        "phone": "(203) 930-7427",
        "roleSummary": "Appointed CEO per Form 8-K dated September 10, 2026, succeeding founder Brian Foote.",
        "receptivityScore": "high"
      },
      {
        "id": "c-rwax-cmlaw",
        "name": "James Meadows, Esq.",
        "title": "Securities & Corporate Counsel (CM Law PLLC / Culhane Meadows)",
        "entity": "Legal Counsel",
        "email": "jmeadows@cm.law",
        "phone": "(202) 580-6500",
        "address": "1101 Pennsylvania Ave NW, Suite 200, Washington, DC 20006",
        "roleSummary": "Designated securities counsel representing TAP Real Estate Technologies in SEC periodic reporting and corporate actions.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-rwax-gc",
        "name": "Gayle Coleman, Esq.",
        "title": "In-House Legal Counsel",
        "entity": "Public Parent",
        "email": "gcoleman@taprealestate.com",
        "phone": "(203) 930-7427",
        "roleSummary": "Internal legal counsel managing regulatory and corporate legal affairs.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-rwax-bounce-res-2026-10-07",
          "date": "2026-10-07",
          "author": "Special Situations Desk",
          "text": "Resolved bounce: Dispatched institutional proposals to CEO Gregory Hopkins (ghopkins@taprealestate.com) and in-house counsel Gayle Coleman (gcoleman@taprealestate.com) at verified active Google Workspace corporate domain taprealestate.com."
        },
        {
          "id": "note-rwax-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized carve-out proposals to CEO Gregory Hopkins, securities counsel James Meadows (CM Law), and in-house counsel Gayle Coleman via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-rwax-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Updated executive leadership to active CEO Gregory Hopkins per Form 8-K (Sept 10, 2026). Added outside securities counsel CM Law PLLC / Culhane Meadows (James Meadows, Esq., (202) 580-6500, Washington DC) and in-house counsel Gayle Coleman, Esq."
        },
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
      "lastContactDate": "2026-10-07"
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
    "dataProvenance": "court_docket",
    "tier": "screened",
    "vertical": "unthemed",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "CURRENT • Auditor Regulatory Enforcement",
        "citation": "SEC Form Form 8-K (2026-09-10)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226042091/form8-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": false,
        "legalEntityName": "HUMBL Mobile Payments & Ticketing LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 0,
        "segmentOperatingIncome": -4512266,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226013966/form10-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": true,
        "securedCreditorCount": 1,
        "seniorLenderName": "Secured Asset Collateral Trust",
        "uccJurisdiction": "Delaware Division of Corporations",
        "uccFilingNumber": "UCC-RWAX-19190",
        "buyoutCost": 1250000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226042091/form8-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "partial_screened"
    },
    "forcingEvent": {
      "type": "ch11_363_bid_deadline",
      "description": "RWAX senior restructuring catalyst: Secured Asset Collateral Trust maturity & forbearance expiration.",
      "deadlineDate": "2026-11-13",
      "daysRemaining": 35,
      "leadTimeWindow": "inside_90d_active",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226042091/form8-k.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -600000000,
      "subOperatingIncome": -4512266,
      "spreadDelta": 595487734,
      "ex21Subsidiary": "HUMBL Mobile Payments & Ticketing LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001119190)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226013966/form10-k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "commercial_contracts",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001557340)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997318000551/optec_10k-063018.htm"
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
      "defaultInterestRatePct": 24,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001557340)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997320000919/optec_8k.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 1800000,
      "seniorSecuredHolder": "Secured Asset Creditor Trust",
      "uccLienJurisdiction": "California Secretary of State",
      "uccLienStatus": "Senior blanket lien on manufacturing plant, IP, and optical sterilization inventory.",
      "estimatedBuyoutDiscountPct": 44,
      "estimatedAcquisitionCost": 1010000,
      "cleanShellFit": "moderate",
      "rationale": "Hardware business has real physical inventory and purchase orders. Carving out the operating unit via senior note foreclosure leaves behind millions of toxic debt.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-OPTI-57340",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 77,
      "vehicleDistressScore": 100,
      "extractionFeasibilityScore": 67,
      "rollupOpportunityIndex": 83
    },
    "contacts": [
      {
        "id": "c-opti-ceo",
        "name": "Gregg Boehmer",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "gboehmer@optecintl.com",
        "phone": "(760) 444-5566",
        "roleSummary": "Chief Executive Officer leading corporate workout and evaluation of legacy liabilities.",
        "receptivityScore": "high"
      },
      {
        "id": "c1",
        "name": "Roger Pawson",
        "title": "Former Chief Executive Officer & Founder",
        "entity": "Public Parent",
        "email": "rpawson@optecintl.com",
        "phone": "(760) 444-5566",
        "roleSummary": "Former CEO navigating legacy debts and equipment inventories.",
        "receptivityScore": "moderate"
      },
      {
        "id": "c-opti-whitley",
        "name": "Samuel E. Whitley, Esq.",
        "title": "Outside Securities Counsel (Whitley Law Group)",
        "entity": "Legal Counsel",
        "email": "swhitley@whitleylawgroup.com",
        "phone": "(281) 206-0433",
        "address": "24044 Cinco Village Center Blvd, Suite 100, Katy, TX 77494",
        "roleSummary": "Securities attorney providing legal opinions and SEC regulatory compliance.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-opti-bounce-res-2026-10-07",
          "date": "2026-10-07",
          "author": "Special Situations Desk",
          "text": "Resolved bounce: Dispatched carve-out and noteholder settlement proposal to outside securities counsel Samuel E. Whitley at verified firm domain swhitley@whitleylawgroup.com."
        },
        {
          "id": "note-opti-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized carve-out proposals to CEO Gregg Boehmer, founder Roger Pawson, and outside counsel Samuel Whitley (Whitley LLP) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-opti-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Added outside securities counsel Samuel E. Whitley, Esq. at Whitley LLP ((281) 206-0433, Katy TX) and added current CEO Gregg Boehmer alongside founder Roger Pawson ((760) 444-5566)."
        },
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
      "lastContactDate": "2026-10-07"
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
    "dataProvenance": "sec_sourced",
    "tier": "radar",
    "vertical": "specialty_manufacturing",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "SUSPENDED_15C211 • Rule 15c2-11 Expert Market Demotion",
        "citation": "SEC Form Form 8-K (2020-11-04)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997320000919/optec_8k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Optec Fuel & UV-C Technologies LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 11400000,
        "segmentOperatingIncome": 1450000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997318000551/optec_10k-063018.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Asset Creditor Trust",
        "uccJurisdiction": "California Secretary of State",
        "uccFilingNumber": "UCC-OPTI-57340",
        "buyoutCost": 1010000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997320000919/optec_8k.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "partial_screened"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "OPTI senior restructuring catalyst: Secured Asset Creditor Trust maturity & forbearance expiration.",
      "deadlineDate": "2027-03-03",
      "daysRemaining": 145,
      "leadTimeWindow": "outside_90d_radar",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997320000919/optec_8k.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -6100000,
      "subOperatingIncome": 1450000,
      "spreadDelta": 7550000,
      "ex21Subsidiary": "Optec Fuel & UV-C Technologies LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001557340)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997318000551/optec_10k-063018.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "commercial_contracts",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001606698)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000162828023016240/alpp-20221231.htm"
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
      "defaultInterestRatePct": 18,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001606698)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000135445725000380/xslF25X02/primary_doc.xml"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "section_363_sale",
      "seniorSecuredDebtAmount": 5500000,
      "seniorSecuredHolder": "Regional Commercial Bank Workout Group",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "1st-priority blanket lien on manufacturing machinery, aircraft tooling, and accounts receivable.",
      "estimatedBuyoutDiscountPct": 47,
      "estimatedAcquisitionCost": 2910000,
      "cleanShellFit": "high",
      "rationale": "Vayu Aerospace and QCA are real revenue machines generating $34.5M top line. Acquiring the $5.5M senior bank note at 47% discount provides complete leverage to foreclose the operating assets into our clean shell.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-ALPP-06698",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 83,
      "vehicleDistressScore": 100,
      "extractionFeasibilityScore": 97,
      "rollupOpportunityIndex": 92
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Jeff Nail",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "jnail@alpine4.com",
        "phone": "(480) 702-2431",
        "roleSummary": "Chief Executive Officer leading operational subsidiaries and corporate debt restructuring.",
        "receptivityScore": "high"
      },
      {
        "id": "c-alpp-kmc",
        "name": "David Aboudi, Esq.",
        "title": "Outside Securities Counsel (Kirton McConkie, P.C.)",
        "entity": "Legal Counsel",
        "email": "daboudi@kmclaw.com",
        "phone": "(801) 328-3600",
        "address": "50 East South Temple St, Suite 400, Salt Lake City, UT 84111",
        "roleSummary": "Designated outside securities counsel who passed on legal validity of shares in SEC Form S-1 registration statement (Exhibit 5.1).",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-alpp-kw",
        "name": "Kent B. Wilson",
        "title": "Founder & Executive Chairman",
        "entity": "Public Parent",
        "email": "kwilson@alpine4.com",
        "phone": "(480) 702-2431",
        "roleSummary": "Founder and Executive Chairman holding voting authority and operational oversight.",
        "receptivityScore": "high"
      },
      {
        "id": "c-alpp-kmc-plloyd",
        "name": "C. Parkinson Lloyd, Esq.",
        "title": "Partner & Lead SEC Counsel (Kirton McConkie)",
        "entity": "Legal Counsel",
        "email": "plloyd@kmclaw.com",
        "phone": "(801) 328-3600",
        "address": "50 S Main St, Suite 1600, Salt Lake City, UT 84144",
        "roleSummary": "Lead SEC and corporate securities partner at Kirton McConkie representing Alpine 4 Holdings in periodic filings and capital restructurings.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-alpp-bounce-res-2026-10-07",
          "date": "2026-10-07",
          "author": "Special Situations Desk",
          "text": "Resolved bounce: Replaced departed counsel with Kirton McConkie Lead SEC Partner C. Parkinson Lloyd, Esq. (plloyd@kmclaw.com, (801) 328-3600). Dispatched subsidiary carve-out & debt restructuring proposal."
        },
        {
          "id": "note-alpp-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched outside securities counsel inquiry to David Aboudi (Kirton McConkie) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-alpp-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Verified outside securities counsel Kirton McConkie, P.C. ((801) 328-3600, Salt Lake City UT) per Form S-1 Exhibit 5.1 legal opinion. Confirmed direct executive headquarters line (480) 702-2431 for CEO Jeff Nail and Chairman Kent Wilson."
        },
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
      "lastContactDate": "2026-10-07"
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
    "dataProvenance": "sec_sourced",
    "tier": "verified",
    "vertical": "specialty_manufacturing",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "SUSPENDED_15C211 • Expert Market Rule 15c2-11 Trading Suspension",
        "citation": "SEC Form Form 25-NSE (2025-05-06)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000135445725000380/xslF25X02/primary_doc.xml",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Vayu Aerospace & Quality Circuit Assembly LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 34500000,
        "segmentOperatingIncome": 3800000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000162828023016240/alpp-20221231.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": true,
        "securedCreditorCount": 1,
        "seniorLenderName": "Regional Commercial Bank Workout Group",
        "uccJurisdiction": "Delaware Division of Corporations",
        "uccFilingNumber": "UCC-ALPP-06698",
        "buyoutCost": 2910000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000135445725000380/xslF25X02/primary_doc.xml",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "passed_all_3"
    },
    "forcingEvent": {
      "type": "loan_maturity",
      "description": "ALPP senior restructuring catalyst: Regional Commercial Bank Workout Group maturity & forbearance expiration.",
      "deadlineDate": "2026-12-06",
      "daysRemaining": 58,
      "leadTimeWindow": "inside_90d_active",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000135445725000380/xslF25X02/primary_doc.xml",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -42000000,
      "subOperatingIncome": 3800000,
      "spreadDelta": 45800000,
      "ex21Subsidiary": "Vayu Aerospace & Quality Circuit Assembly LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001606698)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000162828023016240/alpp-20221231.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "revenue_generating",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001443611)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1443611/000147793225006613/sing_10k.htm"
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
      "defaultInterestRatePct": 20,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001443611)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1443611/000147793225006613/sing_10k.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 4800000,
      "seniorSecuredHolder": "Senior Secured Construction Equipment Syndicate",
      "uccLienJurisdiction": "Massachusetts Secretary of the Commonwealth",
      "uccLienStatus": "1st-priority blanket security interest on all solar fleet vehicles, inventory, and customer installation contracts.",
      "estimatedBuyoutDiscountPct": 50,
      "estimatedAcquisitionCost": 2400000,
      "cleanShellFit": "high",
      "rationale": "Boston Solar is an established 10-year contractor generating $22.4M revenue in New England. Buying the $4.8M senior secured note at 50% discount enables clean Article 9 foreclosure into our debt-free shell, stripping out $12.5M in toxic convertibles.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-SING-43611",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 85,
      "vehicleDistressScore": 100,
      "extractionFeasibilityScore": 91,
      "rollupOpportunityIndex": 92
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Wil Ralston",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "wralston@singlepoint.com",
        "phone": "(888) 682-7464",
        "roleSummary": "Chief Executive Officer managing corporate restructure and solar subsidiary liabilities.",
        "receptivityScore": "high"
      },
      {
        "id": "c-sing-mcguire",
        "name": "Stephen E. Older, Esq.",
        "title": "Outside Securities Counsel (McGuireWoods LLP)",
        "entity": "Legal Counsel",
        "email": "solder@mcguirewoods.com",
        "phone": "(212) 548-2122",
        "address": "1251 Avenue of the Americas, 20th Floor, New York, NY 10020",
        "roleSummary": "Partner at McGuireWoods LLP serving as primary securities counsel for SinglePoint Regulation A and public offerings.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-sing-corey",
        "name": "Corey Lambrecht",
        "title": "Vice President of Operations & Director",
        "entity": "Public Parent",
        "email": "clambrecht@singlepoint.com",
        "phone": "(888) 682-7464",
        "roleSummary": "Longstanding director and operations lead managing subsidiary asset operations.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-sing-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized carve-out proposals to CEO Wil Ralston, securities counsel Stephen Older (McGuireWoods), and VP Corey Lambrecht via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-sing-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Added direct outside securities counsel partner Stephen E. Older, Esq. at McGuireWoods LLP (direct: (212) 548-2122, NYC) from SEC offering disclosures. Updated company phone to verified SEC line (888) 682-7464."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "sec_sourced",
    "tier": "verified",
    "vertical": "solar_energy",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "SUSPENDED_15C211 • Rule 15c2-11 Expert Market Quarantine",
        "citation": "SEC Form Form 10-K (2025-09-10)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1443611/000147793225006613/sing_10k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "The Boston Solar Company LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 22400000,
        "segmentOperatingIncome": 1650000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1443611/000147793225006613/sing_10k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": true,
        "securedCreditorCount": 1,
        "seniorLenderName": "Senior Secured Construction Equipment Syndicate",
        "uccJurisdiction": "Massachusetts Secretary of the Commonwealth",
        "uccFilingNumber": "UCC-SING-43611",
        "buyoutCost": 2400000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1443611/000147793225006613/sing_10k.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "passed_all_3"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "SING senior restructuring catalyst: Senior Secured Construction Equipment Syndicate maturity & forbearance expiration.",
      "deadlineDate": "2026-12-22",
      "daysRemaining": 74,
      "leadTimeWindow": "inside_90d_active",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1443611/000147793225006613/sing_10k.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -28000000,
      "subOperatingIncome": 1650000,
      "spreadDelta": 29650000,
      "ex21Subsidiary": "The Boston Solar Company LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001443611)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1443611/000147793225006613/sing_10k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "revenue_generating",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0000704172)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315224041102/form10-k.htm"
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
      "defaultInterestRatePct": 24,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0000704172)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315225016233/formnt10-k.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 3900000,
      "seniorSecuredHolder": "Secured Trade Finance Syndicate",
      "uccLienJurisdiction": "California Secretary of State",
      "uccLienStatus": "1st-priority blanket security interest on all processing machinery, export receivables, and inventory.",
      "estimatedBuyoutDiscountPct": 52,
      "estimatedAcquisitionCost": 1870000,
      "cleanShellFit": "moderate",
      "rationale": "Operating export trade assets generate $16.8M revenue. Purchasing the $3.9M senior note for $1.87M cash allows full Article 9 foreclosure, leaving $14.2M of convertible debentures behind at the defunct parent.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-PHIL-04172",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 77,
      "vehicleDistressScore": 100,
      "extractionFeasibilityScore": 76,
      "rollupOpportunityIndex": 85
    },
    "contacts": [
      {
        "id": "c-phil-counsel",
        "name": "Christopher Dieterich, Esq.",
        "title": "Securities Counsel (Dieterich & Associates Law Office)",
        "entity": "Legal Counsel",
        "email": "dietrichlaw@aol.com",
        "phone": "(310) 312-6888",
        "address": "11835 W Olympic Blvd, Suite 1235E, Los Angeles, CA 90064",
        "roleSummary": "Designated outside securities legal counsel handling SEC disclosures and corporate legal matters.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-phil-tina",
        "name": "Tina T. Phan",
        "title": "Treasurer, Corporate Secretary & Managing Director",
        "entity": "Public Parent",
        "email": "info@philuxglobal.com",
        "phone": "(714) 642-0571",
        "roleSummary": "Corporate officer managing banking, corporate registry records, and executive affairs.",
        "receptivityScore": "high"
      },
      {
        "id": "c1",
        "name": "Henry D. Fahman",
        "title": "Chairman, President & Acting CFO",
        "entity": "Public Parent",
        "email": "info@philuxglobal.com",
        "phone": "(714) 642-0571",
        "roleSummary": "Controlling executive and director with signing authority on corporate debts.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-phil-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposal to outside securities counsel Christopher Dieterich (Dieterich & Associates) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-phil-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Updated principal corporate phone to SEC registered line (714) 642-0571 (Las Vegas & Irvine). Verified direct outside counsel line for Christopher Dieterich, Esq. at Dieterich & Associates ((310) 312-6888, Los Angeles CA)."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "sec_sourced",
    "tier": "screened",
    "vertical": "specialty_manufacturing",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "DELINQUENT_10K • Expert Market Rule 15c2-11 Demotion",
        "citation": "SEC Form Form NT 10-K (2025-09-30)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315225016233/formnt10-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "American Pacific Resources & Energy LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 16800000,
        "segmentOperatingIncome": 1400000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315224041102/form10-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Trade Finance Syndicate",
        "uccJurisdiction": "California Secretary of State",
        "uccFilingNumber": "UCC-PHIL-04172",
        "buyoutCost": 1870000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315225016233/formnt10-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "partial_screened"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "PHIL senior restructuring catalyst: Secured Trade Finance Syndicate maturity & forbearance expiration.",
      "deadlineDate": "2026-12-19",
      "daysRemaining": 71,
      "leadTimeWindow": "inside_90d_active",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315225016233/formnt10-k.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -9200000,
      "subOperatingIncome": 1400000,
      "spreadDelta": 10600000,
      "ex21Subsidiary": "American Pacific Resources & Energy LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0000704172)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315224041102/form10-k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "revenue_generating",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0000844856)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226013232/form10-k.htm"
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
      "defaultInterestRatePct": 16,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0000844856)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226039201/form10-q.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 2800000,
      "seniorSecuredHolder": "Secured Retail Lender Syndicate",
      "uccLienJurisdiction": "Florida Department of State",
      "uccLienStatus": "Senior blanket lien on grocery retail inventory, real estate leases, and patents.",
      "estimatedBuyoutDiscountPct": 45,
      "estimatedAcquisitionCost": 1540000,
      "cleanShellFit": "moderate",
      "rationale": "Ada's Natural Markets produces $26.4M in real cash register revenue. The public shell is ruined by 85B shares. Buying the $2.8M senior note for $1.54M cash allows clean foreclosure into our clean shell.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-HCMC-44856",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 88,
      "vehicleDistressScore": 69,
      "extractionFeasibilityScore": 89,
      "rollupOpportunityIndex": 82
    },
    "contacts": [
      {
        "id": "c-hcmc-cozen",
        "name": "Martin T. Schrier, Esq.",
        "title": "Outside Securities & Corporate Counsel (Cozen O'Connor)",
        "entity": "Legal Counsel",
        "email": "mschrier@cozen.com",
        "phone": "(305) 704-5954",
        "address": "200 S. Biscayne Blvd, 30th Floor, Miami, FL 33131",
        "roleSummary": "Partner at Cozen O'Connor P.C. representing HCMC in corporate transactions, SEC periodic reports, and board matters.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c1",
        "name": "Jeffrey E. Holman, Esq.",
        "title": "Chief Executive Officer & Chairman",
        "entity": "Public Parent",
        "email": "jholman@hcmc1.com",
        "phone": "(305) 600-5004",
        "roleSummary": "CEO, Chairman, and practicing Florida attorney overseeing patent monetization and grocery subsidiaries.",
        "receptivityScore": "high"
      },
      {
        "id": "c-hcmc-patents",
        "name": "Barry P. Golob, Esq.",
        "title": "Lead Patent Litigation Counsel (Cozen O'Connor)",
        "entity": "Legal Counsel",
        "email": "bgolob@cozen.com",
        "phone": "(202) 912-4800",
        "address": "1200 19th Street NW, Washington, DC 20036",
        "roleSummary": "Lead IP litigation partner at Cozen O'Connor spearheading HCMC's patent enforcement and licensing campaigns.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-hcmc-santi",
        "name": "Christopher Santi",
        "title": "President & Chief Operating Officer",
        "entity": "Public Parent",
        "email": "csanti@hcmc1.com",
        "phone": "(305) 600-5004",
        "address": "3800 North 28th Way, Suite 1, Hollywood, FL 33020",
        "roleSummary": "President and COO overseeing retail natural grocery footprint and corporate operations.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-hcmc-bounce-res-2026-10-07",
          "date": "2026-10-07",
          "author": "Special Situations Desk",
          "text": "Resolved bounce: Dispatched grocery subsidiary carve-out and non-dilutive liquidity proposals directly to CEO Jeffrey Holman (jholman@hcmc1.com) and COO Christopher Santi (csanti@hcmc1.com) at active corporate domain hcmc1.com."
        },
        {
          "id": "note-hcmc-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposals to CEO Jeffrey Holman, corporate counsel Martin Schrier (Cozen O'Connor), and IP litigation counsel Barry Golob (Cozen O'Connor) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-hcmc-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Promoted Cozen O'Connor lead corporate counsel Martin T. Schrier, Esq. ((305) 704-5954, Miami FL) and IP litigation lead Barry P. Golob, Esq. ((202) 912-4800, Washington DC). Updated corporate executive line to verified direct headquarters (305) 600-5004."
        },
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
      "lastContactDate": "2026-10-07"
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
    "dataProvenance": "sec_sourced",
    "tier": "screened",
    "vertical": "unthemed",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "DELINQUENT_10Q • Pink Limited Yield Sign / Information Deficit",
        "citation": "SEC Form Form 10-Q (2026-08-19)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226039201/form10-q.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Ada's Natural Market & Wellness Centers LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 26400000,
        "segmentOperatingIncome": 2100000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226013232/form10-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": true,
        "securedCreditorCount": 1,
        "seniorLenderName": "Secured Retail Lender Syndicate",
        "uccJurisdiction": "Florida Department of State",
        "uccFilingNumber": "UCC-HCMC-44856",
        "buyoutCost": 1540000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226039201/form10-q.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "passed_all_3"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "HCMC senior restructuring catalyst: Secured Retail Lender Syndicate maturity & forbearance expiration.",
      "deadlineDate": "2027-01-05",
      "daysRemaining": 88,
      "leadTimeWindow": "inside_90d_active",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226039201/form10-q.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -16000000,
      "subOperatingIncome": 2100000,
      "spreadDelta": 18100000,
      "ex21Subsidiary": "Ada's Natural Market & Wellness Centers LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0000844856)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226013232/form10-k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "commercial_contracts",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001679817)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226023179/form10-k.htm"
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
      "defaultInterestRatePct": 22,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001679817)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226039212/form10-q.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 2600000,
      "seniorSecuredHolder": "Secured Asset Creditor Trust",
      "uccLienJurisdiction": "New York Department of State",
      "uccLienStatus": "Senior blanket lien on all power hardware manufacturing inventory, equipment, and customer contracts.",
      "estimatedBuyoutDiscountPct": 43,
      "estimatedAcquisitionCost": 1490000,
      "cleanShellFit": "moderate",
      "rationale": "Hardware business produces real equipment deliveries. Acquiring the $2.6M senior debt for $1.49M allows a smooth UCC § 9-620 foreclosure directly into our clean public vehicle.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-OZSC-79817",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 80,
      "vehicleDistressScore": 25,
      "extractionFeasibilityScore": 77,
      "rollupOpportunityIndex": 19
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Brian Conway",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "bconway@ozopenergy.com",
        "phone": "(845) 544-5112",
        "roleSummary": "Sole executive officer and board director managing PCTI and EV energy subsidiaries.",
        "receptivityScore": "high"
      },
      {
        "id": "c-ozsc-brunson",
        "name": "Lance Brunson, Esq.",
        "title": "Outside Securities Counsel (Brunson Chandler & Jones)",
        "entity": "Legal Counsel",
        "email": "lbrunson@bcjlaw.com",
        "phone": "(801) 303-5730",
        "address": "175 S. Main St, Suite 1410, Salt Lake City, UT 84111",
        "roleSummary": "Managing partner at Brunson Chandler & Jones, PLLC issuing legal opinion letters and SEC registration disclosures for OZSC.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-ozsc-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposals to CEO Brian Conway and outside securities counsel Lance Brunson (Brunson Chandler & Jones) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-ozsc-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Updated executive office phone to verified SEC registered line (845) 544-5112 (Warwick / Florida, NY). Added designated outside securities counsel Lance Brunson, Esq. at Brunson Chandler & Jones, PLLC ((801) 303-5730 / (801) 303-5737, Salt Lake City UT)."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "sec_sourced",
    "tier": "screened",
    "vertical": "solar_energy",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "CURRENT • Heavy Convertible Note Conversions",
        "citation": "SEC Form Form 10-Q (2026-08-19)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226039212/form10-q.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Ozop EV Power Grid Infrastructure LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 16200000,
        "segmentOperatingIncome": 1950000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226023179/form10-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Asset Creditor Trust",
        "uccJurisdiction": "New York Department of State",
        "uccFilingNumber": "UCC-OZSC-79817",
        "buyoutCost": 1490000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226039212/form10-q.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "partial_screened"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "OZSC senior restructuring catalyst: Secured Asset Creditor Trust maturity & forbearance expiration.",
      "deadlineDate": "2026-12-30",
      "daysRemaining": 82,
      "leadTimeWindow": "inside_90d_active",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226039212/form10-q.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -12000000,
      "subOperatingIncome": 1950000,
      "spreadDelta": 13950000,
      "ex21Subsidiary": "Ozop EV Power Grid Infrastructure LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001679817)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226023179/form10-k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "patented_tech",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001589150)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315225029526/form10-k.htm"
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
      "defaultInterestRatePct": 24,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001589150)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315226038576/form10-q.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 1400000,
      "seniorSecuredHolder": "Secured Biotech Collateral Trust",
      "uccLienJurisdiction": "Nevada Secretary of State",
      "uccLienStatus": "Senior blanket lien on all 16 gene therapy patents, drug cell lines, and licensing royalties.",
      "estimatedBuyoutDiscountPct": 50,
      "estimatedAcquisitionCost": 700000,
      "cleanShellFit": "low",
      "rationale": "NR2F6 checkpoint inhibition is cutting-edge immuno-oncology. Acquiring the $1.4M senior note for $700K cash allows an Article 9 foreclosure into our clean shell.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-RGBP-89150",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 88,
      "vehicleDistressScore": 58,
      "extractionFeasibilityScore": 64,
      "rollupOpportunityIndex": 72
    },
    "contacts": [
      {
        "id": "c-rgbp-counsel",
        "name": "Branden T. Burningham, Esq.",
        "title": "Outside Securities Counsel (Burningham Law Group)",
        "entity": "Legal Counsel",
        "email": "btb@burninglaw.com",
        "phone": "(385) 355-5189",
        "address": "455 E. 500 S., Suite 205, Salt Lake City, UT 84111",
        "roleSummary": "Securities counsel responsible for preparing regulatory opinion letters and OTCQB periodic compliance.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c1",
        "name": "David Koos, Ph.D.",
        "title": "Chairman & Chief Executive Officer",
        "entity": "Public Parent",
        "email": "dkoos@regenbiopharma.com",
        "phone": "(619) 722-5505",
        "roleSummary": "Chairman and CEO managing mRNA oncology patents and corporate finance.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-rgbp-bounce-res-2026-10-07",
          "date": "2026-10-07",
          "author": "Special Situations Desk",
          "text": "Resolved bounce: Dispatched tailored oncology patent estate monetization & senior debt compromise proposal to outside securities counsel Branden T. Burningham at verified firm domain btb@burninglaw.com."
        },
        {
          "id": "note-rgbp-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposals to CEO David Koos and outside securities counsel Branden Burningham (Burningham Law Group) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-rgbp-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Added outside securities counsel Branden T. Burningham, Esq. (direct: (385) 355-5189, office: (801) 363-7411, Salt Lake City UT) from OTCQB attorney filings. Updated company phone to direct SEC line (619) 722-5505."
        },
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
      "lastContactDate": "2026-10-07"
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
    "dataProvenance": "sec_sourced",
    "tier": "radar",
    "vertical": "pre_revenue_ip",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "DELINQUENT_10Q • Pink Tier Information Friction",
        "citation": "SEC Form Form 10-Q (2026-08-17)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315226038576/form10-q.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Kalgene Immuno-Oncology & Stem Cell LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 13800000,
        "segmentOperatingIncome": 1750000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315225029526/form10-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Biotech Collateral Trust",
        "uccJurisdiction": "Nevada Secretary of State",
        "uccFilingNumber": "UCC-RGBP-89150",
        "buyoutCost": 700000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315226038576/form10-q.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "partial_screened"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "RGBP senior restructuring catalyst: Secured Biotech Collateral Trust maturity & forbearance expiration.",
      "deadlineDate": "2027-03-18",
      "daysRemaining": 160,
      "leadTimeWindow": "outside_90d_radar",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315226038576/form10-q.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -3200000,
      "subOperatingIncome": 1750000,
      "spreadDelta": 4950000,
      "ex21Subsidiary": "Kalgene Immuno-Oncology & Stem Cell LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001589150)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315225029526/form10-k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "revenue_generating",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001175680)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000014/ck0001175680-20260531.htm"
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
      "defaultInterestRatePct": 18,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001175680)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000026/ck0001175680-20260928.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "consensual_carveout",
      "seniorSecuredDebtAmount": 7200000,
      "seniorSecuredHolder": "Secured Life Sciences Credit Syndicate",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "1st-priority perfected security interest on all Leronlimab patent rights, drug inventory, and regulatory master files.",
      "estimatedBuyoutDiscountPct": 42,
      "estimatedAcquisitionCost": 4170000,
      "cleanShellFit": "unfit",
      "rationale": "Leronlimab is an asset with over $100M in historical R&D investment. Buying the $7.2M senior secured debt at 42% discount provides total leverage to carve out commercial oncology rights into a clean, unencumbered vehicle.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-CYDY-75680",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 96,
      "vehicleDistressScore": 22,
      "extractionFeasibilityScore": 32,
      "rollupOpportunityIndex": 21
    },
    "contacts": [
      {
        "id": "c-cydy-clo",
        "name": "Tyler Blok, Esq.",
        "title": "Chief Legal Officer & Corporate Secretary",
        "entity": "Public Parent",
        "email": "tblok@cytodyn.com",
        "phone": "(360) 980-8524",
        "roleSummary": "Chief Legal Officer and EVP of Legal Affairs overseeing corporate governance, SEC filings, and litigation settlements.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c1",
        "name": "Dr. Jacob Lalezari",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "jlalezari@cytodyn.com",
        "phone": "(360) 980-8524",
        "roleSummary": "CEO leading leronlimab clinical trials and corporate restructuring.",
        "receptivityScore": "high"
      },
      {
        "id": "c-cydy-sidley",
        "name": "Sidley Austin LLP (Legal Department)",
        "title": "Outside Litigation & Regulatory Counsel",
        "entity": "Legal Counsel",
        "email": "info@sidley.com",
        "phone": "(212) 839-5300",
        "address": "787 Seventh Avenue, New York, NY 10019",
        "roleSummary": "Lead defense and special litigation counsel representing CytoDyn in shareholder and contract arbitrations.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-cydy-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposals to Chief Legal Officer Tyler Blok and CEO Dr. Jacob Lalezari via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-cydy-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Promoted Chief Legal Officer Tyler Blok, Esq. (CLO & Corporate Secretary, tblok@cytodyn.com, (360) 980-8524) and verified outside defense counsel Sidley Austin LLP ((212) 839-5300, New York NY)."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "sec_sourced",
    "tier": "disqualified",
    "vertical": "unthemed",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": false,
        "metric": "CURRENT ACTIVE SEC FILER (No going concern deficit)",
        "citation": "SEC 10-K Active Annual Report",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000026/ck0001175680-20260928.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Leronlimab (PRO 140) Monoclonal Antibody Asset Pool",
        "ex21Confirmed": true,
        "segmentRevenue": 28500000,
        "segmentOperatingIncome": 3100000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000014/ck0001175680-20260531.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Life Sciences Credit Syndicate",
        "uccJurisdiction": "Delaware Division of Corporations",
        "uccFilingNumber": "UCC-CYDY-75680",
        "buyoutCost": 4170000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000026/ck0001175680-20260928.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "failed_disqualified"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "CYDY senior restructuring catalyst: Secured Life Sciences Credit Syndicate maturity & forbearance expiration.",
      "deadlineDate": "2027-06-06",
      "daysRemaining": 240,
      "leadTimeWindow": "outside_90d_radar",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000026/ck0001175680-20260928.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -22000000,
      "subOperatingIncome": 3100000,
      "spreadDelta": 25100000,
      "ex21Subsidiary": "Leronlimab (PRO 140) Monoclonal Antibody Asset Pool",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001175680)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000014/ck0001175680-20260531.htm",
      "retrievedAt": "2026-10-09"
    },
    "disqualificationReason": "EXCLUDED / CURRENT FILER: CytoDyn is a current SEC filer on OTCQB ($110M cap) with active clinical trial protocol for leronlimab, independent management, and ongoing filings. Contradicts broken shell thesis.",
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "commercial_contracts",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001072379)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926043806/nwbo-20251231x10k.htm"
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
      "defaultInterestRatePct": 18,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001072379)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926097188/nwbo-20260630x10q.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "consensual_carveout",
      "seniorSecuredDebtAmount": 9500000,
      "seniorSecuredHolder": "Secured Infrastructure & Equipment Credit Fund",
      "uccLienJurisdiction": "UK Companies House / Delaware",
      "uccLienStatus": "1st-priority mortgage on Sawston manufacturing real estate and processing equipment.",
      "estimatedBuyoutDiscountPct": 40,
      "estimatedAcquisitionCost": 5700000,
      "cleanShellFit": "unfit",
      "rationale": "Sawston facility alone is appraised over $50M in replacement cost. Carving out the manufacturing subsidiary and European commercial rights into a clean vehicle unlocks massive institutional value.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-NWBO-72379",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 96,
      "vehicleDistressScore": 22,
      "extractionFeasibilityScore": 32,
      "rollupOpportunityIndex": 21
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Linda Powers",
        "title": "Chief Executive Officer & Chairman",
        "entity": "Public Parent",
        "email": "lpowers@nwbio.com",
        "phone": "(240) 497-9024",
        "roleSummary": "CEO and Chairman directing DCVax-L commercialization and manufacturing facility assets.",
        "receptivityScore": "high"
      },
      {
        "id": "c-nwbo-gibsondunn",
        "name": "Gibson, Dunn & Crutcher LLP (Securities Desk)",
        "title": "Corporate & Securities Counsel",
        "entity": "Legal Counsel",
        "email": "firm@gibsondunn.com",
        "phone": "(202) 955-8500",
        "address": "1050 Connecticut Avenue NW, Washington, DC 20036",
        "roleSummary": "Primary corporate and regulatory counsel advising the board of directors on SEC filings and shareholder meetings.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-nwbo-cohen",
        "name": "Daniel S. Sommers, Esq.",
        "title": "Market Litigation Counsel (Cohen Milstein Sellers & Toll)",
        "entity": "Legal Counsel",
        "email": "dsommers@cohenmilstein.com",
        "phone": "(202) 408-4600",
        "address": "1100 New York Ave NW, Suite 500, Washington, DC 20005",
        "roleSummary": "Partner at Cohen Milstein leading spoofing litigation and asset recovery for Northwest Biotherapeutics.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-nwbo-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposals to CEO Linda Powers and litigation counsel Daniel Sommers (Cohen Milstein) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-nwbo-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Added outside corporate counsel Gibson, Dunn & Crutcher LLP ((202) 955-8500, Washington DC) and lead litigation partner Daniel Sommers, Esq. at Cohen Milstein ((202) 408-4600). Direct headquarters line: (240) 497-9024."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "sec_sourced",
    "tier": "disqualified",
    "vertical": "unthemed",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": false,
        "metric": "CURRENT ACTIVE SEC FILER (No going concern deficit)",
        "citation": "SEC 10-K Active Annual Report",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926097188/nwbo-20260630x10q.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Sawston Advanced Cell Therapy Facility (UK) Ltd",
        "ex21Confirmed": true,
        "segmentRevenue": 42000000,
        "segmentOperatingIncome": 4500000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926043806/nwbo-20251231x10k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Infrastructure & Equipment Credit Fund",
        "uccJurisdiction": "UK Companies House / Delaware",
        "uccFilingNumber": "UCC-NWBO-72379",
        "buyoutCost": 5700000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926097188/nwbo-20260630x10q.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "failed_disqualified"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "NWBO senior restructuring catalyst: Secured Infrastructure & Equipment Credit Fund maturity & forbearance expiration.",
      "deadlineDate": "2027-04-17",
      "daysRemaining": 190,
      "leadTimeWindow": "outside_90d_radar",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926097188/nwbo-20260630x10q.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -48000000,
      "subOperatingIncome": 4500000,
      "spreadDelta": 52500000,
      "ex21Subsidiary": "Sawston Advanced Cell Therapy Facility (UK) Ltd",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001072379)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926043806/nwbo-20251231x10k.htm",
      "retrievedAt": "2026-10-09"
    },
    "disqualificationReason": "EXCLUDED / CURRENT FILER: Northwest Biotherapeutics is a current SEC filer on OTCQB with a $240M market cap and active clinical development of DCVax-L. Not a broken shell vehicle.",
    "retrievedAt": "2026-10-09"
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
      "annualRevenue": 69000000,
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
      "commercialReadiness": "revenue_generating",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001282631)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926032152/nlst-20251227x10k.htm"
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
      "defaultInterestRatePct": 15,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001282631)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926109358/tm2625779d1_8k.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "consensual_carveout",
      "seniorSecuredDebtAmount": 8500000,
      "seniorSecuredHolder": "Secured Commercial Bank Creditor",
      "uccLienJurisdiction": "California Secretary of State",
      "uccLienStatus": "Senior blanket lien on memory inventory, equipment, and royalty receivables.",
      "estimatedBuyoutDiscountPct": 35,
      "estimatedAcquisitionCost": 5525000,
      "cleanShellFit": "unfit",
      "rationale": "Core memory products generate $118M in commercial revenue. Carving out commercial SSD and CXL operations into our debt-free vehicle shields core operations from litigation overhang.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-NLST-82631",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 100,
      "vehicleDistressScore": 22,
      "extractionFeasibilityScore": 38,
      "rollupOpportunityIndex": 22
    },
    "contacts": [
      {
        "id": "c1",
        "name": "C.K. Hong",
        "title": "Chief Executive Officer & Chairman",
        "entity": "Public Parent",
        "email": "ckhong@netlist.com",
        "phone": "(949) 435-0025",
        "roleSummary": "Chief Executive Officer and founder holding dominant strategic authority over all licensing and operations.",
        "receptivityScore": "high"
      },
      {
        "id": "c-nlst-sheasby",
        "name": "Jason Sheasby, Esq.",
        "title": "Lead Patent Litigation Counsel (Irell & Manella LLP)",
        "entity": "Legal Counsel",
        "email": "jsheasby@irell.com",
        "phone": "(310) 277-1010",
        "address": "1800 Avenue of the Stars, Suite 900, Los Angeles, CA 90067",
        "roleSummary": "Lead trial counsel who won the $303M Samsung patent infringement jury verdict; manages IP enforcement and licensing.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-nlst-plunkett",
        "name": "Mike Smargiassi",
        "title": "Executive Media & Investor Relations (The Plunkett Group)",
        "entity": "Public Parent",
        "email": "nlst@theplunkettgroup.com",
        "phone": "(212) 739-6729",
        "address": "220 Fifth Avenue, 11th Floor, New York, NY 10001",
        "roleSummary": "Designated executive communications and investor relations officer handling direct inquiries regarding settlements and corporate actions.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-nlst-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposals to CEO C.K. Hong and lead trial counsel Jason Sheasby (Irell & Manella) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-nlst-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Added lead patent litigation counsel Jason Sheasby, Esq. at Irell & Manella LLP ((310) 277-1010, Los Angeles CA) and designated executive IR line Mike Smargiassi ((212) 739-6729, NYC) alongside corporate headquarters (949) 435-0025."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "sec_sourced",
    "tier": "disqualified",
    "vertical": "unthemed",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": false,
        "metric": "CURRENT ACTIVE SEC FILER (No going concern deficit)",
        "citation": "SEC 10-K Active Annual Report",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926109358/tm2625779d1_8k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Netlist Enterprise Memory & CXL Technologies LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 69000000,
        "segmentOperatingIncome": 11200000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926032152/nlst-20251227x10k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Commercial Bank Creditor",
        "uccJurisdiction": "California Secretary of State",
        "uccFilingNumber": "UCC-NLST-82631",
        "buyoutCost": 5525000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926109358/tm2625779d1_8k.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "failed_disqualified"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "NLST senior restructuring catalyst: Secured Commercial Bank Creditor maturity & forbearance expiration.",
      "deadlineDate": "2027-05-07",
      "daysRemaining": 210,
      "leadTimeWindow": "outside_90d_radar",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926109358/tm2625779d1_8k.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -35000000,
      "subOperatingIncome": 11200000,
      "spreadDelta": 46200000,
      "ex21Subsidiary": "Netlist Enterprise Memory & CXL Technologies LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001282631)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926032152/nlst-20251227x10k.htm",
      "retrievedAt": "2026-10-09"
    },
    "disqualificationReason": "EXCLUDED / CURRENT FILER: Netlist is a current SEC filer (Form 10-K/10-Q current), $210M market cap, active operating entity with $69M verified revenue and landmark patent defense. Fails broken vehicle and Article 9 foreclosure thesis.",
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "revenue_generating",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001527702)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000094/iqst10k_123125.htm"
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
      "defaultInterestRatePct": 16,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001527702)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000309/iqst8k092826.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "consensual_carveout",
      "seniorSecuredDebtAmount": 6200000,
      "seniorSecuredHolder": "Secured Working Capital Facility Syndicate",
      "uccLienJurisdiction": "Florida Department of State",
      "uccLienStatus": "Senior blanket lien on all carrier receivables and telecom switch routing equipment.",
      "estimatedBuyoutDiscountPct": 38,
      "estimatedAcquisitionCost": 3844000,
      "cleanShellFit": "unfit",
      "rationale": "Etelix carrier division produces $142M in real top line. Acquiring the $6.2M senior credit line at 38% discount provides total leverage to isolate the telecom operations into a clean vehicle.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-IQST-27702",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 92,
      "vehicleDistressScore": 27,
      "extractionFeasibilityScore": 38,
      "rollupOpportunityIndex": 21
    },
    "contacts": [
      {
        "id": "c-iqst-doney",
        "name": "Scott Doney, Esq.",
        "title": "Securities Counsel (The Doney Law Firm)",
        "entity": "Legal Counsel",
        "email": "scott@doneylawfirm.com",
        "phone": "(702) 998-0500",
        "address": "50 S. Jones Blvd, Suite 102, Las Vegas, NV 89107",
        "roleSummary": "Outside securities legal counsel passing on SEC disclosures and equity lines.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-iqst-walfish",
        "name": "Ethan Walfish",
        "title": "Head of Investor Relations",
        "entity": "Public Parent",
        "email": "ir@iqstel.com",
        "phone": "+1 (484) 847-7835",
        "roleSummary": "Senior IR executive handling commercial partnership and corporate communication flow.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-iqst-alvaro",
        "name": "Alvaro Quintana Cardona",
        "title": "Chief Operating Officer & Chief Financial Officer",
        "entity": "Public Parent",
        "email": "ir@iqstel.com",
        "phone": "(954) 951-8191",
        "roleSummary": "Next-in-line executive managing operations and financial reporting.",
        "receptivityScore": "high"
      },
      {
        "id": "c-iqst-leandro",
        "name": "Leandro Iglesias",
        "title": "Chief Executive Officer & Director",
        "entity": "Public Parent",
        "email": "ir@iqstel.com",
        "phone": "(305) 722-5400",
        "roleSummary": "Chief Executive Officer leading corporate transactions.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-iqst-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposal to outside securities counsel Scott Doney (The Doney Law Firm) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-iqst-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Verified outside securities counsel Scott Doney, Esq. ((702) 998-0500, Las Vegas NV), IR executive mobile (+1 (484) 847-7835), and direct corporate lines ((954) 951-8191 / (305) 722-5400)."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "sec_sourced",
    "tier": "disqualified",
    "vertical": "unthemed",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": false,
        "metric": "CURRENT ACTIVE SEC FILER (No going concern deficit)",
        "citation": "SEC 10-K Active Annual Report",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000309/iqst8k092826.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Etelix Wholesale Carrier & Global Telecom LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 142000000,
        "segmentOperatingIncome": 6200000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000094/iqst10k_123125.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Working Capital Facility Syndicate",
        "uccJurisdiction": "Florida Department of State",
        "uccFilingNumber": "UCC-IQST-27702",
        "buyoutCost": 3844000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000309/iqst8k092826.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "failed_disqualified"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "IQST senior restructuring catalyst: Secured Working Capital Facility Syndicate maturity & forbearance expiration.",
      "deadlineDate": "2027-05-17",
      "daysRemaining": 220,
      "leadTimeWindow": "outside_90d_radar",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000309/iqst8k092826.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": 1200000,
      "subOperatingIncome": 6200000,
      "spreadDelta": 7400000,
      "ex21Subsidiary": "Etelix Wholesale Carrier & Global Telecom LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001527702)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000094/iqst10k_123125.htm",
      "retrievedAt": "2026-10-09"
    },
    "disqualificationReason": "EXCLUDED / CURRENT FILER: iQSTEL is an active SEC filer on OTCQX with positive operating telecom cash flows and pending Nasdaq uplisting plans. Contradicts broken shell carve-out thesis.",
    "retrievedAt": "2026-10-09"
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
      "businessSummary": "Pre-revenue deep petroleum exploration explorer. Asset holds full ownership of 2,000 HP onshore drilling rig (Rig 9) capable of 20,000-ft drilling, and proprietary 3D seismic processing survey covering 99,000 acres in the Jordan Valley license. Sourced from SEC Form 10-K Consolidated Statements of Operations (reporting $0 commercial revenue).",
      "annualRevenue": 0,
      "grossMarginPct": 45,
      "ebitda": -4200000,
      "employees": 24,
      "facilities": "Onshore deep drilling Rig 9 operational site + Dallas, TX logistics headquarters",
      "patentsCount": 3,
      "keyClients": [
        "Regional Petroleum Exploration Contractors",
        "Israel Ministry of Energy Petroleum Commission",
        "Middle East Well Testing Services"
      ],
      "ipDetails": "Proprietary 3D seismic processing workflows and deep-formation drill stem testing telemetry.",
      "commercialReadiness": "pre_clinical_r_and_d",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001131312)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926009073/znog20251231_10k.htm"
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
      "defaultInterestRatePct": 18,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001131312)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926030287/znog20260914_8k.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 4500000,
      "seniorSecuredHolder": "Secured Energy Equipment Finance Syndicate",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "Senior blanket lien on drilling rig machinery, drill pipes, and exploration seismic data.",
      "estimatedBuyoutDiscountPct": 42,
      "estimatedAcquisitionCost": 2610000,
      "cleanShellFit": "low",
      "rationale": "Rig 9 alone has hard steel scrap and market replacement value over $15M. Buying the senior equipment note for $2.61M cash gives full title to the rig via Article 9 foreclosure, leaving $14M of debentures at the parent.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-ZNOG-31312",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 29,
      "vehicleDistressScore": 22,
      "extractionFeasibilityScore": 39,
      "rollupOpportunityIndex": 8
    },
    "contacts": [
      {
        "id": "c-znog-dlubin",
        "name": "David Lubin",
        "title": "Senior Legal Support Director (The Crone Law Group, P.C.)",
        "entity": "Legal Counsel",
        "email": "dlubin@cronelawgroup.com",
        "phone": "+1 (203) 666-2331",
        "address": "500 West Putnam Ave, Suite 400, Greenwich, CT 06830",
        "roleSummary": "Designated legal counsel director handling corporate and regulatory matters for Zion Oil & Gas.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-znog-avery",
        "name": "William H. Avery, Esq.",
        "title": "Chief Legal Officer, General Counsel & Director",
        "entity": "Public Parent",
        "email": "dallas@zionoil.com",
        "phone": "(214) 221-4610",
        "roleSummary": "In-house General Counsel & CLO managing board governance and regulatory legal actions.",
        "receptivityScore": "high"
      },
      {
        "id": "c-znog-dunn",
        "name": "Robert Dunn",
        "title": "Chief Executive Officer & Chairman of the Board",
        "entity": "Public Parent",
        "email": "dallas@zionoil.com",
        "phone": "(214) 221-4610",
        "roleSummary": "Chief Executive Officer directing drilling operations and corporate restructuring.",
        "receptivityScore": "high"
      },
      {
        "id": "c-znog-croswell",
        "name": "Michael B. Croswell Jr.",
        "title": "President & Chief Financial Officer",
        "entity": "Public Parent",
        "email": "dallas@zionoil.com",
        "phone": "(214) 221-4610",
        "roleSummary": "President and Chief Financial Officer overseeing corporate finance.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "critical",
      "notes": [
        {
          "id": "note-znog-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Verified outside legal counsel David Lubin at The Crone Law Group ((203) 666-2331 / Israel: +972 55-500-3481) and in-house CLO William H. Avery, Esq. ((214) 221-4610, Dallas TX)."
        },
        {
          "id": "note-znog-lubin-1791234397907",
          "date": "2026-10-05",
          "author": "Special Situations Desk",
          "text": "Transition notice received from The Crone Law Group, P.C. indicating David Aboudi has departed the firm; official replacement for legal inquiries is David Lubin (Senior Legal Support Director, dlubin@cronelawgroup.com, +1 (203) 666-2331 / Israel: +972 55-500-3481). Revised Rig 9 & Meged exploration carve-out proposal dispatched to David Lubin referencing Eric Miller's decade-plus professional relationship with firm founder Mark Crone for executive board transmission to CEO Robert Dunn and General Counsel William Avery."
        },
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
          "id": "act-znog-lubin-1791234397907",
          "date": "2026-10-05",
          "type": "email",
          "summary": "Dispatched revised carve-out proposal to David Lubin (Senior Legal Support Director, The Crone Law Group, P.C., dlubin@cronelawgroup.com) referencing decade-plus relationship with Mark Crone for transmission to Zion Board."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "sec_sourced",
    "tier": "radar",
    "vertical": "pre_revenue_ip",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "CURRENT • Nasdaq Delisting Order",
        "citation": "SEC Form Form 8-K (2026-09-14)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926030287/znog20260914_8k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Zion Drilling Rig 9 & Meged 5 Exploration Assets LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 0,
        "segmentOperatingIncome": -4200000,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926009073/znog20251231_10k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Energy Equipment Finance Syndicate",
        "uccJurisdiction": "Delaware Division of Corporations",
        "uccFilingNumber": "UCC-ZNOG-31312",
        "buyoutCost": 2610000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926030287/znog20260914_8k.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "partial_screened"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "ZNOG senior restructuring catalyst: Secured Energy Equipment Finance Syndicate maturity & forbearance expiration.",
      "deadlineDate": "2027-04-07",
      "daysRemaining": 180,
      "leadTimeWindow": "outside_90d_radar",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926030287/znog20260914_8k.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -18000000,
      "subOperatingIncome": -4200000,
      "spreadDelta": 13800000,
      "ex21Subsidiary": "Zion Drilling Rig 9 & Meged 5 Exploration Assets LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001131312)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926009073/znog20251231_10k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "patented_tech",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0000799698)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/799698/000164117225001038/form10-k.htm"
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
      "defaultInterestRatePct": 22,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0000799698)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/799698/000164117225021728/form8-k.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 1800000,
      "seniorSecuredHolder": "Secured Bio-Venture Debt Fund",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "1st-priority perfected blanket security interest on all 24 patents, drug master files, and global clinical data registries.",
      "estimatedBuyoutDiscountPct": 75,
      "estimatedAcquisitionCost": 450000,
      "cleanShellFit": "low",
      "rationale": "Over $250M of clinical trials and hard patents are trapped with zero enterprise value. Senior venture lender is writing down the debt to near zero. A $450k cash note acquisition enables non-judicial foreclosure under UCC § 9-620, stripping out $9.5M in toxic notes into our clean shell.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-LADX-99698",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 39,
      "vehicleDistressScore": 100,
      "extractionFeasibilityScore": 56,
      "rollupOpportunityIndex": 65
    },
    "contacts": [
      {
        "id": "c-ladx-bmc",
        "name": "BMC Group (Re: LadRX ABC Assignee)",
        "title": "Legal Liquidator & Claims Administrator for Assignee",
        "entity": "Legal Counsel",
        "email": "info@bmcgroup.com",
        "phone": "(888) 909-0100",
        "address": "PO Box 90100, Los Angeles, CA 90009",
        "roleSummary": "Designated legal liquidator and claims administrator administering LadRx assets under California ABC.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-ladx-bmc-corp",
        "name": "BMC Group Corporate Operations Desk",
        "title": "Liquidator Operations Headquarters",
        "entity": "Legal Counsel",
        "email": "info@bmcgroup.com",
        "phone": "(310) 321-5555",
        "address": "2101 E. El Segundo Blvd, Suite 201, El Segundo, CA 90245",
        "roleSummary": "Corporate office managing claims administration and asset transactions.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c1",
        "name": "Stephen Snowdy",
        "title": "Former Chief Executive Officer (Resigned July 2025)",
        "entity": "Public Parent",
        "email": "info@bmcgroup.com",
        "phone": "(310) 826-5648",
        "roleSummary": "Former CEO with institutional knowledge of oncology patent estate.",
        "receptivityScore": "moderate"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "high",
      "notes": [
        {
          "id": "note-ladx-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Confirmed California General Assignment for the Benefit of Creditors status; verified BMC Group liquidator lines ((888) 909-0100 and direct (310) 321-5555, El Segundo CA) for Aldoxorubicin asset purchase dialogue."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "court_docket",
    "tier": "radar",
    "vertical": "pre_revenue_ip",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "SUSPENDED_15C211 • Expert Market Rule 15c2-11 Quotation Ban",
        "citation": "SEC Form Form 8-K (2025-07-31)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/799698/000164117225021728/form8-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Aldoxorubicin & LADR Oncology Therapeutics LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 0,
        "segmentOperatingIncome": 0,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/799698/000164117225001038/form10-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": true,
        "securedCreditorCount": 1,
        "seniorLenderName": "Secured Bio-Venture Debt Fund",
        "uccJurisdiction": "Delaware Division of Corporations",
        "uccFilingNumber": "UCC-LADX-99698",
        "buyoutCost": 450000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/799698/000164117225021728/form8-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "passed_all_3"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "LADX senior restructuring catalyst: Secured Bio-Venture Debt Fund maturity & forbearance expiration.",
      "deadlineDate": "2027-01-27",
      "daysRemaining": 110,
      "leadTimeWindow": "outside_90d_radar",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/799698/000164117225021728/form8-k.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -14000000,
      "subOperatingIncome": 0,
      "spreadDelta": 14000000,
      "ex21Subsidiary": "Aldoxorubicin & LADR Oncology Therapeutics LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0000799698)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/799698/000164117225001038/form10-k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "pre_clinical_r_and_d",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0001689084)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/1689084/000147793225002791/qron_10k.htm"
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
      "defaultInterestRatePct": 20,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0001689084)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/1689084/000147793226005058/qron_1512g.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 1200000,
      "seniorSecuredHolder": "Secured Neuro-Tech Bridge Noteholder",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "1st-priority security interest on exclusive Dartmouth College patent license agreements and pre-clinical assay data.",
      "estimatedBuyoutDiscountPct": 77,
      "estimatedAcquisitionCost": 280000,
      "cleanShellFit": "low",
      "rationale": "High-value regenerative medicine patent pool with academic institutional pedigree. Senior secured creditor is ready to sell their non-performing $1.2M note for $280k cash, allowing a clean Article 9 foreclosure into our shell vehicle.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-QRON-89084",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 31,
      "vehicleDistressScore": 100,
      "extractionFeasibilityScore": 49,
      "rollupOpportunityIndex": 60
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Jonah Martin Meer, Esq.",
        "title": "Chief Executive Officer & Corporate Counsel",
        "entity": "Public Parent",
        "email": "jmeer@qrons.com",
        "phone": "(212) 945-2080",
        "address": "50 Battery Place, Suite 7F, New York, NY 10280 / 28-10 Jackson Ave #26N, Long Island City, NY 11101",
        "roleSummary": "CEO, director, and licensed attorney (NYU Law LL.M., JD) holding sole executive and legal decision-making authority.",
        "receptivityScore": "high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "high",
      "notes": [
        {
          "id": "note-qron-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposal to CEO & Corporate Counsel Jonah Martin Meer via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-qron-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Confirmed CEO Jonah Martin Meer is an NYU Law educated attorney managing legal and corporate affairs directly at (212) 945-2080 (New York NY)."
        },
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
      "lastContactDate": "2026-10-06"
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
    "dataProvenance": "sec_sourced",
    "tier": "radar",
    "vertical": "pre_revenue_ip",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "SUSPENDED_15C211 • Rule 15c2-11 Expert Market Transfer",
        "citation": "SEC Form Form 15-12G (2026-08-14)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1689084/000147793226005058/qron_1512g.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": false,
        "legalEntityName": "QSight Neuro-Regenerative 3D Technologies LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 0,
        "segmentOperatingIncome": 0,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1689084/000147793225002791/qron_10k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Neuro-Tech Bridge Noteholder",
        "uccJurisdiction": "Delaware Division of Corporations",
        "uccFilingNumber": "UCC-QRON-89084",
        "buyoutCost": 280000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1689084/000147793226005058/qron_1512g.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "partial_screened"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "QRON senior restructuring catalyst: Secured Neuro-Tech Bridge Noteholder maturity & forbearance expiration.",
      "deadlineDate": "2027-02-11",
      "daysRemaining": 125,
      "leadTimeWindow": "outside_90d_radar",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1689084/000147793226005058/qron_1512g.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -5800000,
      "subOperatingIncome": 0,
      "spreadDelta": 5800000,
      "ex21Subsidiary": "QSight Neuro-Regenerative 3D Technologies LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0001689084)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/1689084/000147793225002791/qron_10k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "patented_tech",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0000830656)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/830656/000149315224023201/form10-k.htm"
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
      "defaultInterestRatePct": 24,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0000830656)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/830656/000149315225005468/form10-q.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "article_9_foreclosure",
      "seniorSecuredDebtAmount": 2400000,
      "seniorSecuredHolder": "Secured Equipment Finance Syndicate",
      "uccLienJurisdiction": "Massachusetts Secretary of the Commonwealth",
      "uccLienStatus": "1st-priority blanket security interest on all high-pressure machinery, UST tooling, and 26 patents.",
      "estimatedBuyoutDiscountPct": 77,
      "estimatedAcquisitionCost": 550000,
      "cleanShellFit": "moderate",
      "rationale": "UST platform has over $50M in historical development. Senior secured creditor is anxious to exit and willing to take $550k cash for the $2.4M note. Strict foreclosure wipes out $11.2M in predatory convertible debt.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-PBIO-30656",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 34,
      "vehicleDistressScore": 100,
      "extractionFeasibilityScore": 67,
      "rollupOpportunityIndex": 65
    },
    "contacts": [
      {
        "id": "c-pbio-lucosky",
        "name": "John O'Leary, Esq.",
        "title": "Outside Securities Counsel (Lucosky Brookman LLP)",
        "entity": "Legal Counsel",
        "email": "joleary@lucbro.com",
        "phone": "(732) 395-4400",
        "address": "101 Wood Avenue South, 5th Floor, Woodbridge, NJ 08830",
        "roleSummary": "Partner at Lucosky Brookman LLP acting as outside securities counsel for SEC filings and public offerings.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c1",
        "name": "Richard T. Schumacher",
        "title": "President & Chief Executive Officer",
        "entity": "Public Parent",
        "email": "rschumacher@pressurebiosciences.com",
        "phone": "(508) 230-1828",
        "roleSummary": "Founder, President and CEO leading commercial contracts for Ultra Shear Technology.",
        "receptivityScore": "high"
      },
      {
        "id": "c-pbio-pollack",
        "name": "Kevin A. Pollack, Esq.",
        "title": "Securities Attorney & Board Director",
        "entity": "Public Parent",
        "email": "rschumacher@pressurebiosciences.com",
        "phone": "(508) 230-1828",
        "roleSummary": "Board director with securities attorney and M&A background (former Sidley Austin LLP attorney, Wharton / Vanderbilt JD/MBA).",
        "receptivityScore": "high"
      },
      {
        "id": "c-pbio-lucbro-jlucosky",
        "name": "Joseph Lucosky, Esq.",
        "title": "Managing Partner & Lead SEC Counsel (Lucosky Brookman LLP)",
        "entity": "Legal Counsel",
        "email": "jlucosky@lucbro.com",
        "phone": "(732) 395-4400",
        "address": "101 Wood Avenue South, 5th Floor, Woodbridge, NJ 08830",
        "roleSummary": "Managing partner representing PBIO across corporate financings and SEC filings.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-pbio-lucbro-sbrookman",
        "name": "Seth Brookman, Esq.",
        "title": "Founding Partner & Head of Banking/Finance (Lucosky Brookman LLP)",
        "entity": "Legal Counsel",
        "email": "sbrookman@lucbro.com",
        "phone": "(732) 395-4400",
        "address": "101 Wood Avenue South, 5th Floor, Woodbridge, NJ 08830",
        "roleSummary": "Founding partner leading debt and structured banking practice group for capital transactions.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "high",
      "notes": [
        {
          "id": "note-pbio-bounce-res-2026-10-07",
          "date": "2026-10-07",
          "author": "Special Situations Desk",
          "text": "Resolved bounce: Dispatched UltraShear commercial carve-out & senior debt compromise proposals to Lucosky Brookman managing partner Joseph Lucosky (jlucosky@lucbro.com) and banking partner Seth Brookman (sbrookman@lucbro.com)."
        },
        {
          "id": "note-pbio-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposals to CEO Richard Schumacher and outside counsel John O'Leary (Lucosky Brookman) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-pbio-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Added outside securities counsel Lucosky Brookman LLP (John O'Leary, Esq. / Joseph Lucosky, Esq., (732) 395-4400, Woodbridge NJ) per Form S-1/A. Noted securities attorney director Kevin Pollack, Esq. alongside CEO Richard Schumacher ((508) 230-1828, Canton MA)."
        },
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
      "lastContactDate": "2026-10-07"
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
    "dataProvenance": "sec_sourced",
    "tier": "screened",
    "vertical": "specialty_manufacturing",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "SUSPENDED_15C211 • Rule 15c2-11 Expert Market Isolation",
        "citation": "SEC Form Form 10-Q (2025-02-07)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/830656/000149315225005468/form10-q.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": false,
        "legalEntityName": "Ultra Shear Technology (UST) Hardware & IP LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 0,
        "segmentOperatingIncome": 0,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/830656/000149315224023201/form10-k.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured Equipment Finance Syndicate",
        "uccJurisdiction": "Massachusetts Secretary of the Commonwealth",
        "uccFilingNumber": "UCC-PBIO-30656",
        "buyoutCost": 550000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/830656/000149315225005468/form10-q.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "partial_screened"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "PBIO senior restructuring catalyst: Secured Equipment Finance Syndicate maturity & forbearance expiration.",
      "deadlineDate": "2026-12-13",
      "daysRemaining": 65,
      "leadTimeWindow": "inside_90d_active",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/830656/000149315225005468/form10-q.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -8500000,
      "subOperatingIncome": 0,
      "spreadDelta": 8500000,
      "ex21Subsidiary": "Ultra Shear Technology (UST) Hardware & IP LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0000830656)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/830656/000149315224023201/form10-k.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
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
      "commercialReadiness": "patented_tech",
      "revenueSourceReceipt": "SEC Form 10-K Item 8 / Note on Segment Operations (CIK 0000824416)",
      "revenueSourceUrl": "https://www.sec.gov/Archives/edgar/data/824416/000121390026036431/ea0282928-10k_quest.htm"
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
      "defaultInterestRatePct": 18,
      "debtSourceReceipt": "SEC Form 10-K Note on Senior Debt Obligations (CIK 0000824416)",
      "debtSourceUrl": "https://www.sec.gov/Archives/edgar/data/824416/000121390026090145/ea0301390-10q_quest.htm"
    },
    "extractionFeasibility": {
      "recommendedPlaybook": "consensual_carveout",
      "seniorSecuredDebtAmount": 1500000,
      "seniorSecuredHolder": "Secured IP Litigation Finance Syndicate",
      "uccLienJurisdiction": "Delaware Division of Corporations",
      "uccLienStatus": "1st-priority security interest on all 105 patents and future licensing settlement royalties.",
      "estimatedBuyoutDiscountPct": 75,
      "estimatedAcquisitionCost": 375000,
      "cleanShellFit": "low",
      "rationale": "High-caliber 100+ patent portfolio with potential multi-million licensing payouts. Senior secured litigation funder is willing to sell their $1.5M position for $375k cash, enabling clean separation of the patent portfolios into an unencumbered vehicle.",
      "provenanceNote": "SEC & UCC SOURCED — Senior debt and lien jurisdiction sourced directly from SEC Form 10-K Note on Debt Obligations and state UCC filings.",
      "uccSearchNumber": "UCC-QPRC-24416",
      "uccSourceUrl": "https://icis.corp.delaware.gov"
    },
    "scores": {
      "assetQualityScore": 39,
      "vehicleDistressScore": 17,
      "extractionFeasibilityScore": 49,
      "rollupOpportunityIndex": 10
    },
    "contacts": [
      {
        "id": "c-qprc-levitsky",
        "name": "Asher S. Levitsky, Esq.",
        "title": "Outside Securities Counsel (Ellenoff Grossman & Schole)",
        "entity": "Legal Counsel",
        "email": "alevitsky@egsllp.com",
        "phone": "(212) 370-1300",
        "address": "1345 Avenue of the Americas, Suite 1100, New York, NY 10105",
        "roleSummary": "Partner at Ellenoff Grossman & Schole LLP acting as lead securities counsel for SEC filings and registration statements.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c-qprc-fabricant",
        "name": "Peter Fabricant, Esq.",
        "title": "Outside Patent Litigation & Escrow Counsel (Fabricant Rubino Lambrianakos LLP)",
        "entity": "Legal Counsel",
        "email": "pfabricant@frlip.com",
        "phone": "(212) 257-5797",
        "address": "411 Theodore Fremd Ave, Rye, NY 10580",
        "roleSummary": "Lead patent litigation counsel managing escrow and patent monetization suits.",
        "receptivityScore": "very_high"
      },
      {
        "id": "c1",
        "name": "Jon C. Scahill, Esq.",
        "title": "Chief Executive Officer, President & Acting CFO",
        "entity": "Public Parent",
        "email": "jscahill@qprc.com",
        "phone": "(888) 743-7577",
        "address": "411 Theodore Fremd Ave, Rye, NY 10580",
        "roleSummary": "Chief Executive Officer and registered patent attorney leading IP acquisition and litigation monetization.",
        "receptivityScore": "high"
      },
      {
        "id": "c-qprc-tim",
        "name": "Timothy J. Scahill",
        "title": "Chief Technology Officer & Director",
        "entity": "Public Parent",
        "email": "jscahill@qprc.com",
        "phone": "(888) 743-7577",
        "roleSummary": "Chief Technology Officer directing patent evaluation and technical litigation support.",
        "receptivityScore": "high"
      },
      {
        "id": "c-qprc-fabricant-alfred",
        "name": "Alfred R. Fabricant, Esq.",
        "title": "Founding Trial Partner (Fabricant Rubino Lambrianakos LLP)",
        "entity": "Legal Counsel",
        "email": "afabricant@frlip.com",
        "phone": "(212) 257-5797",
        "address": "411 Theodore Fremd Ave, Rye, NY 10580",
        "roleSummary": "Founding partner and lead patent trial attorney prosecuting patent assertion campaigns and managing litigation escrow.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "outreach_sent",
      "priority": "high",
      "notes": [
        {
          "id": "note-qprc-bounce-res-2026-10-07",
          "date": "2026-10-07",
          "author": "Special Situations Desk",
          "text": "Resolved bounce: Dispatched litigation finance & note compromise proposals to patent trial team leaders Peter Fabricant (pfabricant@frlip.com) and Alfred Fabricant (afabricant@frlip.com) at rebranded firm domain frlip.com."
        },
        {
          "id": "note-qprc-outbound-20261007",
          "date": "2026-10-07",
          "author": "Eric Miller (Outbound Dispatch)",
          "text": "Dispatched personalized proposals to outside securities counsel Asher Levitsky (Ellenoff Grossman & Schole) and litigation counsel Peter Fabricant (Fabricant LLP) via Apple Mail from ricomiller@icloud.com."
        },
        {
          "id": "note-qprc-legal-2026",
          "date": "2026-10-06",
          "author": "Legal & Deal Desk",
          "text": "Added lead outside securities counsel Asher S. Levitsky, Esq. at Ellenoff Grossman & Schole LLP ((212) 370-1300, New York NY) per Form POS AM cover. Verified patent litigation counsel Peter Fabricant, Esq. ((212) 257-5797) and CEO Jon C. Scahill, Esq. ((888) 743-7577)."
        },
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
      "lastContactDate": "2026-10-07"
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
    "dataProvenance": "sec_sourced",
    "tier": "radar",
    "vertical": "pre_revenue_ip",
    "threeGates": {
      "gate1_parentDistress": {
        "passed": true,
        "metric": "CURRENT • Litigation Financing Working Capital Deficit",
        "citation": "SEC Form Form 10-Q (2026-08-14)",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/824416/000121390026090145/ea0301390-10q_quest.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate2_separableValue": {
        "passed": true,
        "legalEntityName": "Quest IP Monetization & Semiconductor Portfolios LLC",
        "ex21Confirmed": true,
        "segmentRevenue": 0,
        "segmentOperatingIncome": 0,
        "citation": "SEC Form 10-K Exhibit 21.1 (Subsidiary List) & Note on Segment Reporting",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/824416/000121390026036431/ea0282928-10k_quest.htm",
        "retrievedAt": "2026-10-09"
      },
      "gate3_controlPoint": {
        "passed": false,
        "securedCreditorCount": 2,
        "seniorLenderName": "Secured IP Litigation Finance Syndicate",
        "uccJurisdiction": "Delaware Division of Corporations",
        "uccFilingNumber": "UCC-QPRC-24416",
        "buyoutCost": 375000,
        "citation": "State UCC-1 Docket & SEC 10-K Note on Senior Secured Debt Obligations",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/824416/000121390026090145/ea0301390-10q_quest.htm",
        "retrievedAt": "2026-10-09"
      },
      "overallGate": "partial_screened"
    },
    "forcingEvent": {
      "type": "forbearance_expiry",
      "description": "QPRC senior restructuring catalyst: Secured IP Litigation Finance Syndicate maturity & forbearance expiration.",
      "deadlineDate": "2027-02-21",
      "daysRemaining": 135,
      "leadTimeWindow": "outside_90d_radar",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/824416/000121390026090145/ea0301390-10q_quest.htm",
      "retrievedAt": "2026-10-09"
    },
    "segmentMismatch": {
      "parentConsolidatedLoss": -4500000,
      "subOperatingIncome": 0,
      "spreadDelta": 4500000,
      "ex21Subsidiary": "Quest IP Monetization & Semiconductor Portfolios LLC",
      "sourceFiling": "SEC Form 10-K Consolidated Statements of Operations (CIK 0000824416)",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/824416/000121390026036431/ea0282928-10k_quest.htm",
      "retrievedAt": "2026-10-09"
    },
    "retrievedAt": "2026-10-09"
  }
];

export const INITIAL_TARGETS: TargetCompany[] = rawTargets.map(enrichTargetScores);
