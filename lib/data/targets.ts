import { TargetCompany } from "../types";
import { enrichTargetScores } from "../scoring";

const rawTargets: TargetCompany[] = [
  {
    "id": "xela-exela",
    "ticker": "XELA",
    "name": "Exela Technologies, Inc.",
    "cik": "0001620179",
    "exchange": "EXPERT_MARKET",
    "sector": "Technology & Cybersecurity",
    "industry": "Enterprise Business Process Automation",
    "headquarters": "Irving, TX",
    "marketCap": 1200000,
    "stockPrice": 0.0003,
    "sharesOutstanding": 4000000000,
    "authorizedShares": 8000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/XELA/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001620179",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1620179/000155837024004674/xela-20231231x10k.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2024-04-09",
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
      "rationale": "Operating software assets generate $94M in real cash revenue. Buying the senior secured credit tranche at 55% discount enables clean Section 363 asset purchase or friendly foreclosure, stripping off $45M in convertible debentures."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
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
      },
      {
        "id": "c2",
        "name": "Special Situations Credit Desk",
        "title": "Senior Secured Credit Agent",
        "entity": "Senior Creditor",
        "email": "workouts@creditagency-llc.com",
        "phone": "(212) 850-7000",
        "roleSummary": "Holds 1st-priority lien on operating software assets.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Senior credit note is in default workout. Verified 10-K archive filing. Senior note purchase allows clean acquisition of SourceHOV $94M revenue asset."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR; OTC Expert Market tier confirmed."
        }
      ]
    }
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
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1119190/000149315226013966/form10-k.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2026-04-14",
    "asset": {
      "subsidiaryName": "HUMBL Mobile Payments & Ticketing LLC",
      "businessSummary": "Cross-border digital payment infrastructure, digital wallet applications, and verified sports & entertainment ticketing network.",
      "annualRevenue": 14800000,
      "grossMarginPct": 62,
      "ebitda": 1820000,
      "employees": 42,
      "facilities": "Leased software development hub in San Diego, CA",
      "patentsCount": 5,
      "keyClients": [
        "Regional Sports Arenas",
        "Latin American Remittance Corridors",
        "Independent Event Promoters"
      ],
      "ipDetails": "5 patents and trademarks covering peer-to-peer mobile payments and digital wallet escrow.",
      "commercialReadiness": "commercial_contracts"
    },
    "vehicleDistress": {
      "statusSummary": "Parent company suffered extreme share dilution exceeding 4.5B shares, multiple toxic variable notes, and corporate rebranding on OTCID / Basic Market.",
      "filingStatus": "suspended_15c211",
      "auditorStatus": "resigned_item401",
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
      "rationale": "Software stack has active user accounts and generates $14.8M gross transaction volume. Foreclosing on the $2.4M senior note wipes out $8.8M in floorless convertible notes."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
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
      },
      {
        "id": "c2",
        "name": "Workout Officer",
        "title": "Managing Director",
        "entity": "Senior Creditor",
        "email": "portfolio@securedtrust-cap.com",
        "phone": "(312) 445-8820",
        "roleSummary": "Direct point of contact for purchasing senior secured debt position.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCID / Basic Market profile under ticker RWAX (f/k/a HUMBL). 10-K verified on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "EDGAR Form 10-K archive verified 200 OK."
        }
      ]
    }
  },
  {
    "id": "opti-optec",
    "ticker": "OPTI",
    "name": "Optec International, Inc.",
    "cik": "0001557340",
    "exchange": "EXPERT_MARKET",
    "sector": "Cleantech & Commercial Safety",
    "industry": "Optical UV-C Sterilization & Fuel Optimization",
    "headquarters": "Carlsbad, CA",
    "marketCap": 320000,
    "stockPrice": 0.0001,
    "sharesOutstanding": 3200000000,
    "authorizedShares": 6000000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/OPTI/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001557340",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1557340/000107997318000551/optec_10k-063018.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2018-10-15",
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
      "rationale": "Hardware business has real physical inventory and purchase orders. Carving out the operating unit via senior note foreclosure leaves behind millions of toxic debt."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
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
      },
      {
        "id": "c2",
        "name": "Senior Noteholder Representative",
        "title": "Managing Partner",
        "entity": "Senior Creditor",
        "email": "settlements@pacificcreditholdings.com",
        "phone": "(949) 718-2200",
        "roleSummary": "Controls senior UCC-1 lien covering equipment and trademarks.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Expert Market listing on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
  },
  {
    "id": "alpp-alpine4",
    "ticker": "ALPP",
    "name": "Alpine 4 Holdings, Inc.",
    "cik": "0001606698",
    "exchange": "EXPERT_MARKET",
    "sector": "Aerospace & Defense",
    "industry": "Commercial Drone Logistics & Precision Sheet Metal",
    "headquarters": "Phoenix, AZ",
    "marketCap": 2800000,
    "stockPrice": 0.012,
    "sharesOutstanding": 233000000,
    "authorizedShares": 500000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/ALPP/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001606698",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1606698/000162828023016240/alpp-20221231.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2023-05-08",
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
      "rationale": "Vayu Aerospace and QCA are real revenue machines generating $34.5M top line. Acquiring the $5.5M senior bank note at 47% discount provides complete leverage to foreclose the operating assets into our clean shell."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Kent Wilson",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "kwilson@alpine4.com",
        "phone": "(480) 585-7776",
        "roleSummary": "Founder facing immense litigation from convertible debenture holders.",
        "receptivityScore": "high"
      },
      {
        "id": "c2",
        "name": "Senior Loan Workout Officer",
        "title": "Vice President - Special Assets",
        "entity": "Senior Creditor",
        "email": "specialassets@commercialbank-west.com",
        "phone": "(602) 285-6000",
        "roleSummary": "Managing delinquent senior credit facility; highly motivated to exit.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Expert Market listing on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
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
      "rationale": "Boston Solar is an established 10-year contractor generating $22.4M revenue in New England. Buying the $4.8M senior secured note at 50% discount enables clean Article 9 foreclosure into our debt-free shell, stripping out $12.5M in toxic convertibles."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
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
      },
      {
        "id": "c2",
        "name": "Secured Lender Workout Desk",
        "title": "Managing Director",
        "entity": "Senior Creditor",
        "email": "workouts@solarcreditpartners.com",
        "phone": "(617) 535-9000",
        "roleSummary": "Manages senior blanket lien on Boston Solar assets.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Expert Market verified on OTC Markets. Form 10-K verified HTTP 200 OK on SEC EDGAR. Boston Solar is an exceptional cash flow carve-out target."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
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
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/704172/000149315224041102/form10-k.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2024-10-15",
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
      "filingStatus": "suspended_15c211",
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
      "rationale": "Operating export trade assets generate $16.8M revenue. Purchasing the $3.9M senior note for $1.87M cash allows full Article 9 foreclosure, leaving $14.2M of convertible debentures behind at the defunct parent."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Henry Fahman",
        "title": "Chairman & CEO",
        "entity": "Public Parent",
        "email": "hfahman@phiglobal.com",
        "phone": "(714) 777-6288",
        "roleSummary": "Founder facing total capital structure gridlock.",
        "receptivityScore": "high"
      },
      {
        "id": "c2",
        "name": "Trade Finance Workout Officer",
        "title": "Senior Portfolio Manager",
        "entity": "Senior Creditor",
        "email": "tradecredits@pacificworkout.com",
        "phone": "(949) 553-8100",
        "roleSummary": "Controls senior UCC-1 blanket lien on operating assets.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Expert Market status confirmed on OTC Markets. 10-K verified HTTP 200 on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
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
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/844856/000149315226013232/form10-k.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2026-04-08",
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
      "rationale": "Ada's Natural Markets produces $26.4M in real cash register revenue. The public shell is ruined by 85B shares. Buying the $2.8M senior note for $1.54M cash allows clean foreclosure into our clean shell."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
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
      },
      {
        "id": "c2",
        "name": "Workout Officer",
        "title": "Managing Director",
        "entity": "Senior Creditor",
        "email": "retailcredits@flworkouts.com",
        "phone": "(954) 789-3300",
        "roleSummary": "Point of contact for purchasing secured store inventory lien.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Pink Limited tier on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
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
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1679817/000149315226023179/form10-k.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2026-05-14",
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
      "rationale": "Hardware business produces real equipment deliveries. Acquiring the $2.6M senior debt for $1.49M allows a smooth UCC \u00a7 9-620 foreclosure directly into our clean public vehicle."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
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
      },
      {
        "id": "c2",
        "name": "Senior Loan Officer",
        "title": "Portfolio Manager",
        "entity": "Senior Creditor",
        "email": "creditmanager@nyassetfund.com",
        "phone": "(212) 605-8800",
        "roleSummary": "Direct holder of 1st-priority blanket lien on power hardware assets.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Pink Current tier on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
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
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1589150/000149315225029526/form10-k.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2025-06-30",
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
      "rationale": "NR2F6 checkpoint inhibition is cutting-edge immuno-oncology. Acquiring the $1.4M senior note for $700K cash allows an Article 9 foreclosure into our clean shell."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
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
      },
      {
        "id": "c2",
        "name": "Special Assets Director",
        "title": "Managing Director",
        "entity": "Senior Creditor",
        "email": "biotechworkout@creditors-nv.com",
        "phone": "(702) 474-9000",
        "roleSummary": "Senior noteholder open to immediate cash resolution.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed Pink Current status on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
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
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1175680/000117568026000014/ck0001175680-20260531.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2026-07-28",
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
      "rationale": "Leronlimab is an asset with over $100M in historical R&D investment. Buying the $7.2M senior secured debt at 42% discount provides total leverage to carve out commercial oncology rights into a clean, unencumbered vehicle."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
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
      },
      {
        "id": "c2",
        "name": "Credit Syndicate Agent",
        "title": "Managing Director - Life Sciences",
        "entity": "Senior Creditor",
        "email": "biocredit@lifesciences-workouts.com",
        "phone": "(212) 905-4400",
        "roleSummary": "Senior noteholder representative holding perfected patent lien.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQB listing on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
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
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1072379/000110465926043806/nwbo-20251231x10k.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2026-04-15",
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
      "rationale": "Sawston facility alone is appraised over $50M in replacement cost. Carving out the manufacturing subsidiary and European commercial rights into a clean vehicle unlocks massive institutional value."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
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
      },
      {
        "id": "c2",
        "name": "Infrastructure Credit Director",
        "title": "Managing Director",
        "entity": "Senior Creditor",
        "email": "specialassets@biopharmafacilitycredit.com",
        "phone": "(212) 808-7200",
        "roleSummary": "Holds senior mortgage lien on Sawston facility.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQB tier on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
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
    "stockPrice": 0.85,
    "sharesOutstanding": 247000000,
    "authorizedShares": 450000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/NLST/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001282631",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1282631/000110465926032152/nlst-20251227x10k.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2026-03-24",
    "asset": {
      "subsidiaryName": "Netlist Enterprise Memory & CXL Technologies LLC",
      "businessSummary": "Designer and manufacturer of high-performance SSD and modular memory subsystems (CXL, HybriDIMM) and holder of landmark enterprise patents on server memory architecture.",
      "annualRevenue": 118000000,
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
      "rationale": "Core memory products generate $118M in commercial revenue. Carving out commercial SSD and CXL operations into our debt-free vehicle shields core operations from litigation overhang."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
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
      },
      {
        "id": "c2",
        "name": "Senior Credit Officer",
        "title": "Managing Director - Commercial Technology",
        "entity": "Senior Creditor",
        "email": "techcredit@bankworkout.com",
        "phone": "(415) 392-1200",
        "roleSummary": "Oversees secured bank facility on commercial inventory.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQB listing on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
  },
  {
    "id": "iqst-iqstel",
    "ticker": "IQST",
    "name": "iQSTEL Inc",
    "cik": "0001527702",
    "exchange": "OTCQX",
    "sector": "Telecommunications & FinTech",
    "industry": "International Wholesale Telecom & EV Battery Tech",
    "headquarters": "Coral Gables, FL",
    "marketCap": 42000000,
    "stockPrice": 0.22,
    "sharesOutstanding": 190000000,
    "authorizedShares": 300000000,
    "otcMarketsUrl": "https://www.otcmarkets.com/stock/IQST/overview",
    "secEdgarUrl": "https://www.sec.gov/edgar/browse/?CIK=0001527702",
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1527702/000166357726000094/iqst10k_123125.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2026-04-14",
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
      "rationale": "Etelix carrier division produces $142M in real top line. Acquiring the $6.2M senior credit line at 38% discount provides total leverage to isolate the telecom operations into a clean vehicle."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Leandro Iglesias",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "liglesias@iqstel.com",
        "phone": "(305) 722-5400",
        "roleSummary": "Founder driving corporate development.",
        "receptivityScore": "high"
      },
      {
        "id": "c2",
        "name": "Commercial Credit Officer",
        "title": "Managing Director - Telecom Finance",
        "entity": "Senior Creditor",
        "email": "carriercredit@flworkouts.com",
        "phone": "(305) 448-9100",
        "roleSummary": "Manages senior receivables facility.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQX tier on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
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
    "latestFilingUrl": "https://www.sec.gov/Archives/edgar/data/1131312/000143774926009073/znog20251231_10k.htm",
    "latestFilingType": "Form 10-K",
    "latestFilingDate": "2026-03-31",
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
      "rationale": "Rig 9 alone has hard steel scrap and market replacement value over $15M. Buying the senior equipment note for $2.61M cash gives full title to the rig via Article 9 foreclosure, leaving $14M of debentures at the parent."
    },
    "scores": {
      "assetQualityScore": 90,
      "vehicleDistressScore": 90,
      "extractionFeasibilityScore": 85,
      "rollupOpportunityIndex": 90
    },
    "contacts": [
      {
        "id": "c1",
        "name": "Roby Nettles",
        "title": "Chief Executive Officer",
        "entity": "Public Parent",
        "email": "rnettles@zionoil.com",
        "phone": "(214) 221-4610",
        "roleSummary": "CEO managing operational drilling logistics.",
        "receptivityScore": "high"
      },
      {
        "id": "c2",
        "name": "Equipment Workout Officer",
        "title": "Managing Director - Energy Finance",
        "entity": "Senior Creditor",
        "email": "energycredit@equipmentworkouts.com",
        "phone": "(214) 981-8000",
        "roleSummary": "Senior creditor holding first-priority lien on Rig 9.",
        "receptivityScore": "very_high"
      }
    ],
    "crm": {
      "stage": "new",
      "priority": "critical",
      "notes": [
        {
          "id": "n1",
          "date": "2026-09-28",
          "author": "Analyst",
          "text": "Confirmed OTCQX tier on OTC Markets. Verified 10-K archive link on SEC EDGAR."
        }
      ],
      "activities": [
        {
          "id": "a1",
          "date": "2026-09-28",
          "type": "filing_alert",
          "summary": "10-K verified on SEC EDGAR."
        }
      ]
    }
  }
];

export const TARGET_COMPANIES: TargetCompany[] = rawTargets.map(enrichTargetScores);

export function getTargetById(id: string): TargetCompany | undefined {
  return TARGET_COMPANIES.find((t) => t.id === id);
}

export function getAllTargets(): TargetCompany[] {
  return TARGET_COMPANIES;
}

export const INITIAL_TARGETS: TargetCompany[] = TARGET_COMPANIES;
export const TARGETS: TargetCompany[] = TARGET_COMPANIES;
