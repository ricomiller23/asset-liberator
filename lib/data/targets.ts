import { TargetCompany } from "../types";
import { enrichTargetScores } from "../scoring";

const rawTargets: TargetCompany[] = [
  {
    id: "aero-precision",
    ticker: "AERO",
    name: "Aerovation Dynamics Corp",
    cik: "0001648291",
    exchange: "PINK_LIMITED",
    sector: "Aerospace & Defense",
    industry: "Avionics & Telemetry Systems",
    headquarters: "Melbourne, FL",
    marketCap: 420000,
    stockPrice: 0.0003,
    sharesOutstanding: 1400000000,
    authorizedShares: 5000000000,
    asset: {
      subsidiaryName: "Precision Flight Avionics LLC",
      businessSummary: "FAA-certified military and commercial drone avionics, tactical telemetry modules, and HUD flight displays. Holds active DoD CAGE code and supplier contracts with General Dynamics and Textron.",
      annualRevenue: 14200000,
      grossMarginPct: 44,
      ebitda: 1850000,
      employees: 48,
      facilities: "32,000 sq ft AS9100-certified avionics integration lab in Melbourne, FL",
      patentsCount: 9,
      keyClients: ["Textron Systems", "General Dynamics Land Systems", "Sierra Nevada Corp", "US Navy NAWCAD"],
      ipDetails: "9 registered USPTO patents on frequency-hopping tactical telemetry and ultra-low-latency HUD optical combiners.",
      commercialReadiness: "revenue_generating",
    },
    vehicleDistress: {
      statusSummary: "Parent company paralyzed following PCAOB sanction and resignation of auditor BF Borgers. Delinquent on 10-K for 18 months. $6.8M in toxic floorless convertible notes held by Auctus and Geneva Roth triggering continuous death-spiral dilution.",
      filingStatus: "delinquent_10k",
      auditorStatus: "resigned_item401",
      lastAuditorName: "B.F. Borgers CPA PC",
      lastAuditorCity: "Lakewood, CO",
      lastFilingDate: "2024-11-14",
      secTriggers: [
        "Item 4.01 Auditor Resignation / PCAOB Sanction",
        "Item 2.04 Acceleration of Obligations ($6.8M Default)",
        "Rule 15c2-11 Expert Market Relegation",
        "Share Overhang > 3.4B Shares"
      ],
      toxicDebtBalance: 6800000,
      toxicLenders: ["Auctus Fund LLC", "Geneva Roth Remark Holdings", "EMA Financial"],
      convertibleDiscountPct: 45,
      defaultInterestRatePct: 22,
    },
    extractionFeasibility: {
      recommendedPlaybook: "article_9_foreclosure",
      seniorSecuredDebtAmount: 1800000,
      seniorSecuredHolder: "First Regional Commercial Bank (Special Assets)",
      uccLienJurisdiction: "Florida Secretary of State (File #2023089412)",
      uccLienStatus: "Senior blanket lien on Precision Flight Avionics LLC assets, accounts receivable, and patents.",
      estimatedBuyoutDiscountPct: 47,
      estimatedAcquisitionCost: 950000,
      cleanShellFit: "exceptional",
      rationale: "Bank has placed $1.8M senior note in non-accrual workout status. Purchasing the bank note for $950k gives first-priority right to conduct a private Article 9 foreclosure sale, wiping out $6.8M toxic convertibles and deeding 100% of subsidiary equity into our clean public shell.",
    },
    scores: {
      assetQualityScore: 0,
      vehicleDistressScore: 0,
      extractionFeasibilityScore: 0,
      rollupOpportunityIndex: 0,
    },
    contacts: [
      {
        id: "c-101",
        name: "Col. Thomas Mick Sterling (Ret.)",
        title: "Founder & President",
        entity: "Operating Subsidiary",
        email: "tsterling@precisionflightavionics.com",
        phone: "(321) 724-8819",
        linkedIn: "linkedin.com/in/thomas-sterling-avionics",
        address: "1280 NASA Blvd, Melbourne, FL 32901",
        roleSummary: "Original founder of Precision Flight Avionics before selling to parent in 2021. Frustrated by parent failure; desperate to liberate operating business into clean public vehicle.",
        receptivityScore: "very_high",
      },
      {
        id: "c-102",
        name: "Arthur Pendelton",
        title: "CEO & Chairman",
        entity: "Public Parent",
        email: "apendelton@aerovation-corp.com",
        phone: "(212) 890-4100",
        address: "590 Madison Ave, 21st Fl, New York, NY 10022",
        roleSummary: "Public shell promoter facing personal director liability and toxic lender lawsuits. Eager to settle and walk away from public carcass.",
        receptivityScore: "high",
      },
      {
        id: "c-103",
        name: "Gregory Vance",
        title: "VP, Special Assets & Workouts",
        entity: "Senior Creditor",
        email: "gvance@firstregionalbank.com",
        phone: "(407) 649-2280",
        address: "200 S Orange Ave, Orlando, FL 32801",
        roleSummary: "Manages defaulted $1.8M loan on bank balance sheet. Under pressure by examiners to clear distressed commercial debt before quarter-end.",
        receptivityScore: "very_high",
      },
      {
        id: "c-104",
        name: "David S. Garfinkel, Esq.",
        title: "Restructuring Counsel",
        entity: "Legal Counsel",
        email: "dgarfinkel@fl-restructurelaw.com",
        phone: "(305) 579-0500",
        address: "Miami, FL",
        roleSummary: "Represented Precision Flight Avionics in previous senior debt facility; confirmed UCC-1 perfection and Article 9 carve-out feasibility.",
        receptivityScore: "high",
      }
    ],
    crm: {
      stage: "in_dialogue",
      priority: "critical",
      lastContactDate: "2026-09-24",
      nextFollowUpDate: "2026-09-29",
      notes: [
        {
          id: "n-1",
          date: "2026-09-24",
          author: "Investment Committee",
          text: "Initial call with Founder Mick Sterling. He confirmed Textron and General Dynamics contracts are intact ($14.2M TTM rev). He hates the parent company and is willing to roll his 15% equity into our clean public shell immediately upon Article 9 closing."
        },
        {
          id: "n-2",
          date: "2026-09-22",
          author: "Acquisitions Lead",
          text: "Spoke informally with Gregory Vance at First Regional Bank. Indicated they would entertain an all-cash discounted payoff of $950,000 for the $1.8M note with full assignment of UCC-1 position."
        }
      ],
      activities: [
        {
          id: "a-1",
          date: "2026-09-24",
          type: "call",
          summary: "45-min Zoom with Mick Sterling (Founder) reviewing AS9100 customer roster and backlog."
        },
        {
          id: "a-2",
          date: "2026-09-22",
          type: "call",
          summary: "Preliminary workout note pricing inquiry with First Regional Bank Special Assets."
        }
      ]
    }
  },
  {
    id: "mdxn-therapulse",
    ticker: "MDXN",
    name: "Medixen BioSciences Inc",
    cik: "0001557382",
    exchange: "OTCQB",
    sector: "Healthcare & Life Sciences",
    industry: "Medical Devices & In-Vitro Diagnostics",
    headquarters: "San Diego, CA",
    marketCap: 1100000,
    stockPrice: 0.012,
    sharesOutstanding: 91666666,
    authorizedShares: 500000000,
    asset: {
      subsidiaryName: "TheraPulse Diagnostics Inc",
      businessSummary: "FDA 510(k)-cleared point-of-care cardiac troponin and BNP analyzer instrument with disposable microfluidic test cartridges. Deployed across 240 cardiology practices generating high-margin recurring test reagent sales.",
      annualRevenue: 8900000,
      grossMarginPct: 68,
      ebitda: 1200000,
      employees: 32,
      facilities: "18,500 sq ft ISO-13485 cleanroom & manufacturing facility in Carlsbad, CA",
      patentsCount: 14,
      keyClients: ["Scripps Health Clinics", "Sharp Memorial Cardiology", "Texas Heart Institute Affiliate Network"],
      ipDetails: "14 issued US patents on microfluidic immunoassay cartridges and rapid cardiac biomarker quantification algorithm.",
      commercialReadiness: "fda_cleared",
    },
    vehicleDistress: {
      statusSummary: "Parent company burned $18M on failed Phase 2 oncology trial. Sued by convertible noteholder Streeterville Capital for $4.2M default. Nasdaq delisted parent to OTCQB. PCAOB auditor fee unpaid ($220k), facing Form 10-K delinquency.",
      filingStatus: "delinquent_10q",
      auditorStatus: "unpaid",
      lastAuditorName: "Marcum LLP",
      lastAuditorCity: "New York, NY",
      lastFilingDate: "2025-08-12",
      secTriggers: [
        "Item 3.01 Nasdaq Delisting Notice (Staff Determination)",
        "Item 2.04 Default on $4.2M Streeterville Convertible Note",
        "Item 1.01 Entry into Forbearance Agreement",
        "Form 12b-25 Non-Timely 10-Q"
      ],
      toxicDebtBalance: 4200000,
      toxicLenders: ["Streeterville Capital LLC", "Auctus Fund LLC"],
      convertibleDiscountPct: 35,
      defaultInterestRatePct: 18,
    },
    extractionFeasibility: {
      recommendedPlaybook: "section_363_sale",
      seniorSecuredDebtAmount: 2100000,
      seniorSecuredHolder: "Horizon Technology Credit Fund",
      uccLienJurisdiction: "California Secretary of State (File #U230198442)",
      uccLienStatus: "First priority perfected lien on TheraPulse Diagnostics inventory, equipment, and FDA 510(k) clearances.",
      estimatedBuyoutDiscountPct: 52,
      estimatedAcquisitionCost: 1000000,
      cleanShellFit: "exceptional",
      rationale: "TheraPulse operating assets can be acquired via pre-arranged Section 363 sale or consensual foreclosure through Horizon Technology Credit. Parent board has already authorized exploring strategic divestiture to avoid full corporate liquidation.",
    },
    scores: {
      assetQualityScore: 0,
      vehicleDistressScore: 0,
      extractionFeasibilityScore: 0,
      rollupOpportunityIndex: 0,
    },
    contacts: [
      {
        id: "c-201",
        name: "Dr. Marcus Vance, Ph.D.",
        title: "Founder & Chief Scientific Officer",
        entity: "Operating Subsidiary",
        email: "mvance@therapulsediagnostics.com",
        phone: "(760) 814-3200",
        linkedIn: "linkedin.com/in/marcus-vance-biotech",
        address: "2191 Faraday Ave, Carlsbad, CA 92008",
        roleSummary: "Inventor of 510(k) platform. Wants clinical diagnostics business separated from parent oncology disaster and recapitalized into clean vehicle.",
        receptivityScore: "very_high",
      },
      {
        id: "c-202",
        name: "Bradford Cole",
        title: "Interim CEO & Restructuring Officer",
        entity: "Public Parent",
        email: "bcole@medixen-corp.com",
        phone: "(858) 552-1900",
        address: "San Diego, CA",
        roleSummary: "Retained by board to unwind oncology liabilities and monetize TheraPulse subsidiary to satisfy creditors.",
        receptivityScore: "high",
      },
      {
        id: "c-203",
        name: "Eileen Gallagher",
        title: "Managing Director, Special Credits",
        entity: "Senior Creditor",
        email: "egallagher@horizoncredit.com",
        phone: "(650) 494-6677",
        address: "Menlo Park, CA",
        roleSummary: "Leads Horizon Credit senior note recovery. Open to cash purchase of note or supporting stalking horse 363 bid.",
        receptivityScore: "high",
      }
    ],
    crm: {
      stage: "nda_signed",
      priority: "critical",
      lastContactDate: "2026-09-25",
      nextFollowUpDate: "2026-09-30",
      notes: [
        {
          id: "n-201",
          date: "2026-09-25",
          author: "M&A Counsel",
          text: "Executed bilateral NDA with TheraPulse management and Interim CEO Bradford Cole. Received electronic data room access to FDA 510(k) regulatory correspondence and recurring cartridge sales ledger."
        }
      ],
      activities: [
        {
          id: "a-201",
          date: "2026-09-25",
          type: "meeting",
          summary: "Data room access granted; review of customer contracts and 2026 forecast."
        }
      ]
    }
  },
  {
    id: "cybg-ironkey",
    ticker: "CYBG",
    name: "CyberGuard Telecom Corp",
    cik: "0001479210",
    exchange: "EXPERT_MARKET",
    sector: "Technology & Cybersecurity",
    industry: "Enterprise Zero-Trust SASE Security",
    headquarters: "Reston, VA",
    marketCap: 280000,
    stockPrice: 0.0001,
    sharesOutstanding: 2800000000,
    authorizedShares: 8000000000,
    asset: {
      subsidiaryName: "IronKey Network Security LLC",
      businessSummary: "Cloud-native zero-trust Secure Access Service Edge (SASE) platform providing encrypted endpoint tunnels and identity access for government contractors and financial institutions. Fully deployed SaaS product with zero churn across enterprise client base.",
      annualRevenue: 18500000,
      grossMarginPct: 74,
      ebitda: 2400000,
      employees: 54,
      facilities: "Leased headquarters in Reston, VA tech corridor + cloud AWS GovCloud infrastructure",
      patentsCount: 6,
      keyClients: ["State of Ohio Dept of Admin Services", "First National Bank of Maryland", "Defense Logistics Subcontractors (4 firms)"],
      ipDetails: "6 US patents on zero-knowledge encryption mesh and hardware-attested micro-segmentation.",
      commercialReadiness: "revenue_generating",
    },
    vehicleDistress: {
      statusSummary: "Former parent CEO barred by SEC for undisclosed stock promotions in 2023. Public entity placed on SEC Expert Market; 10-K delinquent since 2023; state corporate status suspended in Nevada for unpaid franchise taxes; 5.2 billion shares in toxic convertible overhang.",
      filingStatus: "suspended_15c211",
      auditorStatus: "resigned_item401",
      lastAuditorName: "RBSM LLP",
      lastAuditorCity: "New York, NY",
      lastFilingDate: "2023-09-30",
      secTriggers: [
        "Rule 15c2-11 Expert Market Trading Suspension",
        "SEC Enforcement Administrative Proceeding",
        "Form 10-K Delinquency > 2 Years",
        "Share Overhang > 5B Shares"
      ],
      toxicDebtBalance: 8500000,
      toxicLenders: ["EMA Financial", "LG Capital", "Power Up Lending"],
      convertibleDiscountPct: 50,
      defaultInterestRatePct: 24,
    },
    extractionFeasibility: {
      recommendedPlaybook: "article_9_foreclosure",
      seniorSecuredDebtAmount: 3200000,
      seniorSecuredHolder: "Crestline Direct Lending Corp",
      uccLienJurisdiction: "Delaware Division of Corporations (File #2022718903)",
      uccLienStatus: "Senior perfected security interest on 100% of IronKey Network Security LLC membership units.",
      estimatedBuyoutDiscountPct: 53,
      estimatedAcquisitionCost: 1500000,
      cleanShellFit: "exceptional",
      rationale: "IronKey Network Security LLC is ring-fenced as a distinct Delaware LLC. Crestline holds a direct pledge of 100% of the LLC membership interest. Acquiring Crestlines defaulted position for $1.5M allows immediate strict foreclosure under UCC 9-620, extinguishing all $8.5M in toxic parent debt and delivering 100% unencumbered software business into our clean public shell.",
    },
    scores: {
      assetQualityScore: 0,
      vehicleDistressScore: 0,
      extractionFeasibilityScore: 0,
      rollupOpportunityIndex: 0,
    },
    contacts: [
      {
        id: "c-301",
        name: "Sarah Lin",
        title: "Managing Director & CTO",
        entity: "Operating Subsidiary",
        email: "slin@ironkey-security.com",
        phone: "(703) 948-2120",
        linkedIn: "linkedin.com/in/sarah-lin-zerotrust",
        address: "12020 Sunrise Valley Dr, Reston, VA 20191",
        roleSummary: "Built the zero-trust software architecture. Operates the business completely autonomously from the defunct public parent and controls all customer relationships.",
        receptivityScore: "very_high",
      },
      {
        id: "c-302",
        name: "Charles Montclair",
        title: "Court-Appointed Custodian / Receiver",
        entity: "Public Parent",
        email: "cmontclair@delaware-fiduciary.com",
        phone: "(302) 658-4400",
        address: "Wilmington, DE",
        roleSummary: "Appointed by Delaware Court of Chancery to oversee corporate asset disposition; desires quick resolution with court-approved asset sale.",
        receptivityScore: "very_high",
      },
      {
        id: "c-303",
        name: "Jason Bradley",
        title: "Managing Director, Distressed Credit",
        entity: "Senior Creditor",
        email: "jbradley@crestlineinvestments.com",
        phone: "(817) 339-7600",
        address: "Fort Worth, TX",
        roleSummary: "Leads workout on the defaulted $3.2M senior credit facility. Anxious to exit non-performing position for clean cash settlement.",
        receptivityScore: "high",
      }
    ],
    crm: {
      stage: "diligence",
      priority: "critical",
      lastContactDate: "2026-09-26",
      nextFollowUpDate: "2026-10-01",
      notes: [
        {
          id: "n-301",
          date: "2026-09-26",
          author: "Lead Deal Partner",
          text: "Confirmed with Receiver Charles Montclair in Delaware: Chancery Court will approve private Article 9 foreclosure sale on 10 days notice without opposition from parent shell creditors."
        }
      ],
      activities: [
        {
          id: "a-301",
          date: "2026-09-26",
          type: "call",
          summary: "Conference call with Crestline Special Credit team regarding assignment of membership interest pledge."
        }
      ]
    }
  },
  {
    id: "gvol-ampcore",
    ticker: "GVOL",
    name: "GreenVolt Industrial Solutions Inc",
    cik: "0001789421",
    exchange: "OTCQB",
    sector: "Clean Energy & Industrials",
    industry: "Commercial Battery Energy Storage (BESS)",
    headquarters: "Reno, NV",
    marketCap: 1650000,
    stockPrice: 0.025,
    sharesOutstanding: 66000000,
    authorizedShares: 350000000,
    asset: {
      subsidiaryName: "AmpCore Battery Systems Corp",
      businessSummary: "Designs and manufactures UL-9540A and UL-1973 certified commercial battery storage enclosures (100kWh to 2MWh) for regional microgrids, solar installers, and EV fleet charging depots. Active backlog of $14.8M in confirmed customer POs.",
      annualRevenue: 11400000,
      grossMarginPct: 38,
      ebitda: 950000,
      employees: 38,
      facilities: "42,000 sq ft manufacturing and assembly facility near Tahoe-Reno Industrial Center",
      patentsCount: 5,
      keyClients: ["Pacific Power & Light Regional Contractors", "SunPeak Commercial Solar", "Nevada Clean Energy Cooperative"],
      ipDetails: "5 patents on liquid-immersion battery cell thermal runaway suppression and dynamic BMS load balancing.",
      commercialReadiness: "commercial_contracts",
    },
    vehicleDistress: {
      statusSummary: "Parent company delisted from Nasdaq in late 2024 following SPAC sponsor legal battle. Choked by $5.4M in variable convertible debentures from EMA Financial and Iliad Research. PCAOB auditor resigned over inventory valuation dispute on abandoned consumer division.",
      filingStatus: "delinquent_10k",
      auditorStatus: "resigned_item401",
      lastAuditorName: "WithumSmith+Brown PC",
      lastAuditorCity: "New York, NY",
      lastFilingDate: "2025-03-31",
      secTriggers: [
        "Item 3.01 Nasdaq Delisting (Rule 5550(a)(2))",
        "Item 4.01 Auditor Resignation",
        "Item 1.01 Notice of Default from Convertible Noteholders",
        "Toxic Ratchet Provision Triggered"
      ],
      toxicDebtBalance: 5400000,
      toxicLenders: ["EMA Financial LLC", "Iliad Research and Trading"],
      convertibleDiscountPct: 40,
      defaultInterestRatePct: 20,
    },
    extractionFeasibility: {
      recommendedPlaybook: "consensual_carveout",
      seniorSecuredDebtAmount: 1400000,
      seniorSecuredHolder: "Western Alliance Bank (Equipment & Asset Finance)",
      uccLienJurisdiction: "Nevada Secretary of State (File #NV2023-49102)",
      uccLienStatus: "Senior blanket lien on Reno machinery, battery cell assembly lines, and inventory.",
      estimatedBuyoutDiscountPct: 35,
      estimatedAcquisitionCost: 910000,
      cleanShellFit: "high",
      rationale: "Management and board recognize public parent is un-financeable. Consensual triangular asset purchase agreement: Western Alliance loan assumed/paid off at $910k cash; parent board receives 5% non-voting equity in clean shell to distribute to common shareholders, leaving all toxic notes behind in GVOL.",
    },
    scores: {
      assetQualityScore: 0,
      vehicleDistressScore: 0,
      extractionFeasibilityScore: 0,
      rollupOpportunityIndex: 0,
    },
    contacts: [
      {
        id: "c-401",
        name: "David Keller",
        title: "Founder & General Manager",
        entity: "Operating Subsidiary",
        email: "dkeller@ampcore-systems.com",
        phone: "(775) 358-9920",
        linkedIn: "linkedin.com/in/david-keller-energy",
        address: "750 USA Pkwy, Sparks, NV 89434",
        roleSummary: "Serial cleantech entrepreneur. Founded AmpCore in 2019. Backlog is solid but cannot secure letters of credit due to parent company default rating.",
        receptivityScore: "very_high",
      },
      {
        id: "c-402",
        name: "Harrison Brooks",
        title: "Chief Executive Officer",
        entity: "Public Parent",
        email: "hbrooks@greenvolt-corp.com",
        phone: "(312) 670-4200",
        address: "Chicago, IL",
        roleSummary: "Former investment banker who took company public via SPAC. Under intense fiduciary pressure from institutional founders to carve out operating asset before foreclosure.",
        receptivityScore: "high",
      },
      {
        id: "c-403",
        name: "Megan O’Reilly",
        title: "Director of Workout & Asset Recovery",
        entity: "Senior Creditor",
        email: "moreilly@westernalliancebank.com",
        phone: "(602) 389-3500",
        address: "Phoenix, AZ",
        roleSummary: "Directs loan recovery on $1.4M equipment note. Prefers structured loan assumption or discounted cash settlement over physical auction of manufacturing machinery.",
        receptivityScore: "high",
      }
    ],
    crm: {
      stage: "term_sheet",
      priority: "high",
      lastContactDate: "2026-09-27",
      nextFollowUpDate: "2026-09-30",
      notes: [
        {
          id: "n-401",
          date: "2026-09-27",
          author: "Investment Committee",
          text: "Submitted non-binding Term Sheet to Parent CEO Harrison Brooks and AmpCore Founder David Keller: $910,000 cash payoff to Western Alliance Bank + $500,000 growth working capital line injected into AmpCore upon closing into clean public shell."
        }
      ],
      activities: [
        {
          id: "a-401",
          date: "2026-09-27",
          type: "term_sheet",
          summary: "Formal non-binding Letter of Intent issued to GreenVolt Board of Directors."
        }
      ]
    }
  },
  {
    id: "apxm-vanguard",
    ticker: "APXM",
    name: "Apex Industrial Metals & Robotics",
    cik: "0001612803",
    exchange: "EXPERT_MARKET",
    sector: "Industrial Automation & Robotics",
    industry: "Automated Robotic Welding & Tooling Cells",
    headquarters: "Detroit, MI",
    marketCap: 390000,
    stockPrice: 0.0002,
    sharesOutstanding: 1950000000,
    authorizedShares: 4000000000,
    asset: {
      subsidiaryName: "Vanguard Robotic Automation LLC",
      businessSummary: "Specialized integrator of automated robotic welding, laser cutting, and vision-guided inspection cells for automotive OEM Tier-1 suppliers (Lear, Magna, Dana) and commercial EV manufacturers.",
      annualRevenue: 16800000,
      grossMarginPct: 36,
      ebitda: 1650000,
      employees: 52,
      facilities: "48,000 sq ft high-bay robotics assembly plant in Auburn Hills, MI",
      patentsCount: 11,
      keyClients: ["Magna International Tier-1", "Lear Corporation", "Dana Incorporated", "PACCAR Commercial Truck"],
      ipDetails: "11 patents on multi-axis robotic coordinate calibration and real-time weld seam ultrasonic defect detection.",
      commercialReadiness: "revenue_generating",
    },
    vehicleDistress: {
      statusSummary: "Public parent immobilized in Expert Market after failure to pay $280k in PCAOB audit fees. Delinquent on SEC filings for 14 months. $7.4M in toxic convertible notes across 4 predatory lenders with judgments filed in NY Supreme Court.",
      filingStatus: "suspended_15c211",
      auditorStatus: "unpaid",
      lastAuditorName: "BDO USA LLP (Resigned)",
      lastAuditorCity: "Troy, MI",
      lastFilingDate: "2024-06-30",
      secTriggers: [
        "Rule 15c2-11 Expert Market Demotion",
        "Auditor Resignation over Unpaid Fees",
        "NY Supreme Court Confession of Judgment ($2.4M)",
        "Share Overhang > 2.5B Shares"
      ],
      toxicDebtBalance: 7400000,
      toxicLenders: ["Geneva Roth", "Auctus Fund", "BHP Capital", "Jefferson Street Capital"],
      convertibleDiscountPct: 45,
      defaultInterestRatePct: 22,
    },
    extractionFeasibility: {
      recommendedPlaybook: "article_9_foreclosure",
      seniorSecuredDebtAmount: 2600000,
      seniorSecuredHolder: "Keystone Capital Partners (Special Credits)",
      uccLienJurisdiction: "Michigan Department of State (File #2022-901844)",
      uccLienStatus: "Senior blanket security interest on all Vanguard Robotic Automation LLC assets, accounts receivable, and equipment.",
      estimatedBuyoutDiscountPct: 50,
      estimatedAcquisitionCost: 1300000,
      cleanShellFit: "exceptional",
      rationale: "Keystone holds undisputed senior security interest. By purchasing Keystones senior position for $1.3M, our clean shell entity can notice an Article 9 UCC foreclosure sale on 10 days statutory notice, wiping out all junior toxic judgments and taking 100% of Vanguard clean of parent liabilities.",
    },
    scores: {
      assetQualityScore: 0,
      vehicleDistressScore: 0,
      extractionFeasibilityScore: 0,
      rollupOpportunityIndex: 0,
    },
    contacts: [
      {
        id: "c-501",
        name: "Robert Bob Chen, P.E.",
        title: "Founder & General Manager",
        entity: "Operating Subsidiary",
        email: "bchen@vanguard-robotics.com",
        phone: "(248) 370-5100",
        linkedIn: "linkedin.com/in/bob-chen-robotics",
        address: "3300 University Dr, Auburn Hills, MI 48326",
        roleSummary: "Veteran automation engineer who built Vanguard into a $16M+ business. Deeply respected by Magna and Lear. Prepared to transition with entire engineering team into clean shell.",
        receptivityScore: "very_high",
      },
      {
        id: "c-502",
        name: "Arthur Klein",
        title: "Managing Partner",
        entity: "Senior Creditor",
        email: "aklein@keystonecapital.com",
        phone: "(312) 899-7100",
        address: "Chicago, IL",
        roleSummary: "Manages Keystone Capital senior loan. Confirmed willingness to execute an absolute assignment of note and UCC security position for $1.3M cash.",
        receptivityScore: "very_high",
      },
      {
        id: "c-503",
        name: "Vincent Moretti, Esq.",
        title: "Securities & Insolvency Counsel",
        entity: "Legal Counsel",
        email: "vmoretti@detroit-lawgroup.com",
        phone: "(313) 965-8000",
        address: "Detroit, MI",
        roleSummary: "Experienced Michigan UCC and commercial insolvency attorney. Has managed multiple Article 9 foreclosures in automotive tooling sector.",
        receptivityScore: "high",
      }
    ],
    crm: {
      stage: "in_dialogue",
      priority: "high",
      lastContactDate: "2026-09-23",
      nextFollowUpDate: "2026-10-02",
      notes: [
        {
          id: "n-501",
          date: "2026-09-23",
          author: "Foreclosure Specialist",
          text: "Reviewed Michigan UCC filing records. Keystone lien is fully perfected with no intervening federal tax liens or mechanics liens. Purchase of Keystone note will give clean title to robotics facility."
        }
      ],
      activities: [
        {
          id: "a-501",
          date: "2026-09-23",
          type: "call",
          summary: "Legal title verification call with Vincent Moretti, Esq."
        }
      ]
    }
  },
  {
    id: "wtch-waterpure",
    ticker: "WTCH",
    name: "WaterTech Clean Holdings Inc",
    cik: "0001598211",
    exchange: "PINK_LIMITED",
    sector: "Environmental Infrastructure",
    industry: "Industrial Water Recycling & Filtration",
    headquarters: "Houston, TX",
    marketCap: 890000,
    stockPrice: 0.008,
    sharesOutstanding: 111250000,
    authorizedShares: 500000000,
    asset: {
      subsidiaryName: "HydroFlow Environmental Solutions LLC",
      businessSummary: "Patented mobile electro-coagulation and ceramic membrane filtration trailers contracted by commercial food processing, petrochemical, and municipal wastewater facilities to treat and recycle industrial process water.",
      annualRevenue: 9800000,
      grossMarginPct: 52,
      ebitda: 1450000,
      employees: 34,
      facilities: "25,000 sq ft fabrication shop & deployment fleet depot in Baytown, TX",
      patentsCount: 7,
      keyClients: ["Tyson Foods Regional Plant", "Valero Refinery Subcontractor", "Harris County MUD #14"],
      ipDetails: "7 patents on electro-chemical flocculation chambers and ceramic self-cleaning membrane arrays.",
      commercialReadiness: "revenue_generating",
    },
    vehicleDistress: {
      statusSummary: "Parent company ran out of working capital after failed mining expansion. Defaulted on $3.8M in convertible notes with Auctus Fund and Streeterville Capital. Board failed to file 2024 10-K; auditor resigned; company facing OTC Pink Limited demotion.",
      filingStatus: "delinquent_10k",
      auditorStatus: "resigned_item401",
      lastAuditorName: "MaloneBailey LLP",
      lastAuditorCity: "Houston, TX",
      lastFilingDate: "2024-09-30",
      secTriggers: [
        "Item 4.01 Auditor Resignation",
        "Item 2.04 Acceleration of Obligations ($3.8M)",
        "Form 12b-25 Non-Timely 10-K",
        "Pink Limited Status"
      ],
      toxicDebtBalance: 3800000,
      toxicLenders: ["Auctus Fund LLC", "Streeterville Capital"],
      convertibleDiscountPct: 40,
      defaultInterestRatePct: 18,
    },
    extractionFeasibility: {
      recommendedPlaybook: "abc_receivership",
      seniorSecuredDebtAmount: 1600000,
      seniorSecuredHolder: "Amegy Bank Commercial Credit",
      uccLienJurisdiction: "Texas Secretary of State (File #2023-881902)",
      uccLienStatus: "Senior perfected lien on all mobile water treatment trailers and accounts receivable.",
      estimatedBuyoutDiscountPct: 45,
      estimatedAcquisitionCost: 880000,
      cleanShellFit: "high",
      rationale: "Operating assets are mobile trailers generating monthly lease & service fees. Assignment for the Benefit of Creditors (ABC) in Texas or purchase of Amegy Bank note allows immediate transfer of trailers into clean shell free of toxic convertible claims.",
    },
    scores: {
      assetQualityScore: 0,
      vehicleDistressScore: 0,
      extractionFeasibilityScore: 0,
      rollupOpportunityIndex: 0,
    },
    contacts: [
      {
        id: "c-601",
        name: "Travis Sterling",
        title: "Founder & Chief Technology Officer",
        entity: "Operating Subsidiary",
        email: "tsterling@hydroflow-env.com",
        phone: "(713) 489-3310",
        linkedIn: "linkedin.com/in/travis-sterling-water",
        address: "Baytown, TX",
        roleSummary: "Inventor of mobile electro-coagulation trailer. Eager to separate operating fleet from public holding company.",
        receptivityScore: "very_high",
      },
      {
        id: "c-602",
        name: "Carlos Mendoza",
        title: "VP, Special Assets Group",
        entity: "Senior Creditor",
        email: "cmendoza@amegybank.com",
        phone: "(713) 232-1100",
        address: "Houston, TX",
        roleSummary: "Handles Amegy Bank non-performing loan portfolio. Has authority to negotiate discounted note payoff.",
        receptivityScore: "high",
      }
    ],
    crm: {
      stage: "outreach_sent",
      priority: "medium",
      lastContactDate: "2026-09-21",
      nextFollowUpDate: "2026-09-29",
      notes: [
        {
          id: "n-601",
          date: "2026-09-21",
          author: "Outreach Lead",
          text: "Sent customized senior note purchase inquiry to Carlos Mendoza at Amegy Bank. Follow-up call scheduled for Tuesday."
        }
      ],
      activities: [
        {
          id: "a-601",
          date: "2026-09-21",
          type: "email",
          summary: "Initial note buyout inquiry delivered to Amegy Bank Special Assets."
        }
      ]
    }
  }
];

export const INITIAL_TARGETS: TargetCompany[] = rawTargets.map(enrichTargetScores);
