const fs = require('fs');
const path = require('path');

const targetsFilePath = path.join(__dirname, '../lib/data/targets.ts');
let content = fs.readFileSync(targetsFilePath, 'utf8');

// We will construct the enriched target updates
const ENRICHED_DATA = {
  "XELA": {
    contacts: [
      {
        id: "c1",
        name: "Par Chadha",
        title: "Executive Chairman & Founder",
        entity: "Public Parent",
        email: "pchadha@exelatech.com",
        phone: "(844) 935-2832",
        roleSummary: "Executive Chairman and controlling principal with ultimate restructuring sign-off authority.",
        receptivityScore: "high"
      },
      {
        id: "c-xela-loeb",
        name: "Erik Mengwall, Esq.",
        title: "Outside Securities Counsel (Loeb & Loeb LLP)",
        entity: "Legal Counsel",
        email: "emengwall@loeb.com",
        phone: "(212) 407-4050",
        address: "345 Park Avenue, New York, NY 10154",
        roleSummary: "Lead securities partner passing on SEC registration statements and Form S-1/POS AM filings.",
        receptivityScore: "very_high"
      },
      {
        id: "c-xela-cleary",
        name: "Sean A. O'Neal, Esq.",
        title: "Restructuring Counsel to Parent (Cleary Gottlieb)",
        entity: "Legal Counsel",
        email: "soneal@cgsh.com",
        phone: "(212) 225-2000",
        address: "One Liberty Plaza, New York, NY 10006",
        roleSummary: "Lead bankruptcy and restructuring counsel representing parent company Exela Technologies, Inc.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-xela-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Verified outside securities counsel Erik Mengwall, Esq. at Loeb & Loeb LLP (direct: (212) 407-4050, 345 Park Ave NY) from Form POS AM cover. Verified parent restructuring counsel Sean A. O'Neal at Cleary Gottlieb ((212) 225-2000). Direct management line: (844) 935-2832."
    }
  },

  "RWAX": {
    contacts: [
      {
        id: "c1",
        name: "Gregory Hopkins",
        title: "Chief Executive Officer (Appointed Sept 2026)",
        entity: "Public Parent",
        email: "ghopkins@taptechnologies.io",
        phone: "(203) 930-7427",
        roleSummary: "Appointed CEO per Form 8-K dated September 10, 2026, succeeding founder Brian Foote.",
        receptivityScore: "high"
      },
      {
        id: "c-rwax-cmlaw",
        name: "James Meadows, Esq.",
        title: "Securities & Corporate Counsel (CM Law PLLC / Culhane Meadows)",
        entity: "Legal Counsel",
        email: "jmeadows@cm.law",
        phone: "(202) 580-6500",
        address: "1101 Pennsylvania Ave NW, Suite 200, Washington, DC 20006",
        roleSummary: "Designated securities counsel representing TAP Real Estate Technologies in SEC periodic reporting and corporate actions.",
        receptivityScore: "very_high"
      },
      {
        id: "c-rwax-gc",
        name: "Gayle Coleman, Esq.",
        title: "In-House Legal Counsel",
        entity: "Public Parent",
        email: "gcoleman@taptechnologies.io",
        phone: "(203) 930-7427",
        roleSummary: "Internal legal counsel managing regulatory and corporate legal affairs.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-rwax-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Updated executive leadership to active CEO Gregory Hopkins per Form 8-K (Sept 10, 2026). Added outside securities counsel CM Law PLLC / Culhane Meadows (James Meadows, Esq., (202) 580-6500, Washington DC) and in-house counsel Gayle Coleman, Esq."
    }
  },

  "OPTI": {
    contacts: [
      {
        id: "c-opti-ceo",
        name: "Gregg Boehmer",
        title: "Chief Executive Officer",
        entity: "Public Parent",
        email: "gboehmer@optecintl.com",
        phone: "(760) 444-5566",
        roleSummary: "Chief Executive Officer leading corporate workout and evaluation of legacy liabilities.",
        receptivityScore: "high"
      },
      {
        id: "c1",
        name: "Roger Pawson",
        title: "Former Chief Executive Officer & Founder",
        entity: "Public Parent",
        email: "rpawson@optecintl.com",
        phone: "(760) 444-5566",
        roleSummary: "Former CEO navigating legacy debts and equipment inventories.",
        receptivityScore: "moderate"
      },
      {
        id: "c-opti-puzzo",
        name: "Thomas E. Puzzo, Esq.",
        title: "Securities Counsel (Law Offices of Thomas E. Puzzo, PLLC)",
        entity: "Legal Counsel",
        email: "tpuzzo@puzzolaw.com",
        phone: "(281) 206-0433",
        address: "24044 Cinco Village Center Blvd, Suite 100, Katy, TX 77494",
        roleSummary: "Securities attorney providing legal opinions and SEC regulatory compliance.",
        receptivityScore: "very_high"
      }
    ],
    note: {
      id: "note-opti-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Added outside securities counsel Thomas E. Puzzo, Esq. at Law Offices of Thomas E. Puzzo, PLLC ((281) 206-0433, Katy TX) and added current CEO Gregg Boehmer alongside founder Roger Pawson ((760) 444-5566)."
    }
  },

  "ALPP": {
    contacts: [
      {
        id: "c1",
        name: "Jeff Nail",
        title: "Chief Executive Officer",
        entity: "Public Parent",
        email: "jnail@alpine4.com",
        phone: "(480) 702-2431",
        roleSummary: "Chief Executive Officer leading operational subsidiaries and corporate debt restructuring.",
        receptivityScore: "high"
      },
      {
        id: "c-alpp-kmc",
        name: "David Aboudi, Esq.",
        title: "Outside Securities Counsel (Kirton McConkie, P.C.)",
        entity: "Legal Counsel",
        email: "daboudi@kmclaw.com",
        phone: "(801) 328-3600",
        address: "50 East South Temple St, Suite 400, Salt Lake City, UT 84111",
        roleSummary: "Designated outside securities counsel who passed on legal validity of shares in SEC Form S-1 registration statement (Exhibit 5.1).",
        receptivityScore: "very_high"
      },
      {
        id: "c-alpp-kw",
        name: "Kent B. Wilson",
        title: "Founder & Executive Chairman",
        entity: "Public Parent",
        email: "kwilson@alpine4.com",
        phone: "(480) 702-2431",
        roleSummary: "Founder and Executive Chairman holding voting authority and operational oversight.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-alpp-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Verified outside securities counsel Kirton McConkie, P.C. ((801) 328-3600, Salt Lake City UT) per Form S-1 Exhibit 5.1 legal opinion. Confirmed direct executive headquarters line (480) 702-2431 for CEO Jeff Nail and Chairman Kent Wilson."
    }
  },

  "SING": {
    contacts: [
      {
        id: "c1",
        name: "Wil Ralston",
        title: "Chief Executive Officer",
        entity: "Public Parent",
        email: "wralston@singlepoint.com",
        phone: "(888) 682-7464",
        roleSummary: "Chief Executive Officer managing corporate restructure and solar subsidiary liabilities.",
        receptivityScore: "high"
      },
      {
        id: "c-sing-mcguire",
        name: "Stephen E. Older, Esq.",
        title: "Outside Securities Counsel (McGuireWoods LLP)",
        entity: "Legal Counsel",
        email: "solder@mcguirewoods.com",
        phone: "(212) 548-2122",
        address: "1251 Avenue of the Americas, 20th Floor, New York, NY 10020",
        roleSummary: "Partner at McGuireWoods LLP serving as primary securities counsel for SinglePoint Regulation A and public offerings.",
        receptivityScore: "very_high"
      },
      {
        id: "c-sing-corey",
        name: "Corey Lambrecht",
        title: "Vice President of Operations & Director",
        entity: "Public Parent",
        email: "clambrecht@singlepoint.com",
        phone: "(888) 682-7464",
        roleSummary: "Longstanding director and operations lead managing subsidiary asset operations.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-sing-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Added direct outside securities counsel partner Stephen E. Older, Esq. at McGuireWoods LLP (direct: (212) 548-2122, NYC) from SEC offering disclosures. Updated company phone to verified SEC line (888) 682-7464."
    }
  },

  "PHIL": {
    contacts: [
      {
        id: "c-phil-counsel",
        name: "Christopher Dieterich, Esq.",
        title: "Securities Counsel (Dieterich & Associates Law Office)",
        entity: "Legal Counsel",
        email: "dietrichlaw@aol.com",
        phone: "(310) 312-6888",
        address: "11835 W Olympic Blvd, Suite 1235E, Los Angeles, CA 90064",
        roleSummary: "Designated outside securities legal counsel handling SEC disclosures and corporate legal matters.",
        receptivityScore: "very_high"
      },
      {
        id: "c-phil-tina",
        name: "Tina T. Phan",
        title: "Treasurer, Corporate Secretary & Managing Director",
        entity: "Public Parent",
        email: "info@philuxglobal.com",
        phone: "(714) 642-0571",
        roleSummary: "Corporate officer managing banking, corporate registry records, and executive affairs.",
        receptivityScore: "high"
      },
      {
        id: "c1",
        name: "Henry D. Fahman",
        title: "Chairman, President & Acting CFO",
        entity: "Public Parent",
        email: "info@philuxglobal.com",
        phone: "(714) 642-0571",
        roleSummary: "Controlling executive and director with signing authority on corporate debts.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-phil-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Updated principal corporate phone to SEC registered line (714) 642-0571 (Las Vegas & Irvine). Verified direct outside counsel line for Christopher Dieterich, Esq. at Dieterich & Associates ((310) 312-6888, Los Angeles CA)."
    }
  },

  "HCMC": {
    contacts: [
      {
        id: "c-hcmc-cozen",
        name: "Martin T. Schrier, Esq.",
        title: "Outside Securities & Corporate Counsel (Cozen O'Connor)",
        entity: "Legal Counsel",
        email: "mschrier@cozen.com",
        phone: "(305) 704-5954",
        address: "200 S. Biscayne Blvd, 30th Floor, Miami, FL 33131",
        roleSummary: "Partner at Cozen O'Connor P.C. representing HCMC in corporate transactions, SEC periodic reports, and board matters.",
        receptivityScore: "very_high"
      },
      {
        id: "c1",
        name: "Jeffrey E. Holman, Esq.",
        title: "Chief Executive Officer & Chairman",
        entity: "Public Parent",
        email: "jholman@healthiercmc.com",
        phone: "(305) 600-5004",
        roleSummary: "CEO, Chairman, and practicing Florida attorney overseeing patent monetization and grocery subsidiaries.",
        receptivityScore: "high"
      },
      {
        id: "c-hcmc-patents",
        name: "Barry P. Golob, Esq.",
        title: "Lead Patent Litigation Counsel (Cozen O'Connor)",
        entity: "Legal Counsel",
        email: "bgolob@cozen.com",
        phone: "(202) 912-4800",
        address: "1200 19th Street NW, Washington, DC 20036",
        roleSummary: "Lead IP litigation partner at Cozen O'Connor spearheading HCMC's patent enforcement and licensing campaigns.",
        receptivityScore: "very_high"
      }
    ],
    note: {
      id: "note-hcmc-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Promoted Cozen O'Connor lead corporate counsel Martin T. Schrier, Esq. ((305) 704-5954, Miami FL) and IP litigation lead Barry P. Golob, Esq. ((202) 912-4800, Washington DC). Updated corporate executive line to verified direct headquarters (305) 600-5004."
    }
  },

  "OZSC": {
    contacts: [
      {
        id: "c1",
        name: "Brian Conway",
        title: "Chief Executive Officer",
        entity: "Public Parent",
        email: "bconway@ozopenergy.com",
        phone: "(845) 544-5112",
        roleSummary: "Sole executive officer and board director managing PCTI and EV energy subsidiaries.",
        receptivityScore: "high"
      },
      {
        id: "c-ozsc-brunson",
        name: "Lance Brunson, Esq.",
        title: "Outside Securities Counsel (Brunson Chandler & Jones)",
        entity: "Legal Counsel",
        email: "lbrunson@bcjlaw.com",
        phone: "(801) 303-5730",
        address: "175 S. Main St, Suite 1410, Salt Lake City, UT 84111",
        roleSummary: "Managing partner at Brunson Chandler & Jones, PLLC issuing legal opinion letters and SEC registration disclosures for OZSC.",
        receptivityScore: "very_high"
      }
    ],
    note: {
      id: "note-ozsc-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Updated executive office phone to verified SEC registered line (845) 544-5112 (Warwick / Florida, NY). Added designated outside securities counsel Lance Brunson, Esq. at Brunson Chandler & Jones, PLLC ((801) 303-5730 / (801) 303-5737, Salt Lake City UT)."
    }
  },

  "RGBP": {
    contacts: [
      {
        id: "c-rgbp-counsel",
        name: "Branden T. Burningham, Esq.",
        title: "Outside Securities Counsel (Burningham Law Group)",
        entity: "Legal Counsel",
        email: "bburningham@burninghamlawgroup.com",
        phone: "(385) 355-5189",
        address: "455 E. 500 S., Suite 205, Salt Lake City, UT 84111",
        roleSummary: "Securities counsel responsible for preparing regulatory opinion letters and OTCQB periodic compliance.",
        receptivityScore: "very_high"
      },
      {
        id: "c1",
        name: "David Koos, Ph.D.",
        title: "Chairman & Chief Executive Officer",
        entity: "Public Parent",
        email: "dkoos@regenbiopharma.com",
        phone: "(619) 722-5505",
        roleSummary: "Chairman and CEO managing mRNA oncology patents and corporate finance.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-rgbp-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Added outside securities counsel Branden T. Burningham, Esq. (direct: (385) 355-5189, office: (801) 363-7411, Salt Lake City UT) from OTCQB attorney filings. Updated company phone to direct SEC line (619) 722-5505."
    }
  },

  "CYDY": {
    contacts: [
      {
        id: "c-cydy-clo",
        name: "Tyler Blok, Esq.",
        title: "Chief Legal Officer & Corporate Secretary",
        entity: "Public Parent",
        email: "tblok@cytodyn.com",
        phone: "(360) 980-8524",
        roleSummary: "Chief Legal Officer and EVP of Legal Affairs overseeing corporate governance, SEC filings, and litigation settlements.",
        receptivityScore: "very_high"
      },
      {
        id: "c1",
        name: "Dr. Jacob Lalezari",
        title: "Chief Executive Officer",
        entity: "Public Parent",
        email: "jlalezari@cytodyn.com",
        phone: "(360) 980-8524",
        roleSummary: "CEO leading leronlimab clinical trials and corporate restructuring.",
        receptivityScore: "high"
      },
      {
        id: "c-cydy-sidley",
        name: "Sidley Austin LLP (Legal Department)",
        title: "Outside Litigation & Regulatory Counsel",
        entity: "Legal Counsel",
        email: "info@sidley.com",
        phone: "(212) 839-5300",
        address: "787 Seventh Avenue, New York, NY 10019",
        roleSummary: "Lead defense and special litigation counsel representing CytoDyn in shareholder and contract arbitrations.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-cydy-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Promoted Chief Legal Officer Tyler Blok, Esq. (CLO & Corporate Secretary, tblok@cytodyn.com, (360) 980-8524) and verified outside defense counsel Sidley Austin LLP ((212) 839-5300, New York NY)."
    }
  },

  "NWBO": {
    contacts: [
      {
        id: "c1",
        name: "Linda Powers",
        title: "Chief Executive Officer & Chairman",
        entity: "Public Parent",
        email: "lpowers@nwbio.com",
        phone: "(240) 497-9024",
        roleSummary: "CEO and Chairman directing DCVax-L commercialization and manufacturing facility assets.",
        receptivityScore: "high"
      },
      {
        id: "c-nwbo-lw",
        name: "Latham & Watkins LLP (Securities Desk)",
        title: "Corporate & Securities Counsel",
        entity: "Legal Counsel",
        email: "richard.trobman@lw.com",
        phone: "(202) 955-8500",
        address: "1050 Connecticut Avenue NW, Washington, DC 20036",
        roleSummary: "Primary corporate and regulatory counsel advising the board of directors on SEC filings and shareholder meetings.",
        receptivityScore: "very_high"
      },
      {
        id: "c-nwbo-cohen",
        name: "Daniel S. Sommers, Esq.",
        title: "Market Litigation Counsel (Cohen Milstein Sellers & Toll)",
        entity: "Legal Counsel",
        email: "dsommers@cohenmilstein.com",
        phone: "(202) 408-4600",
        address: "1100 New York Ave NW, Suite 500, Washington, DC 20005",
        roleSummary: "Partner at Cohen Milstein leading spoofing litigation and asset recovery for Northwest Biotherapeutics.",
        receptivityScore: "very_high"
      }
    ],
    note: {
      id: "note-nwbo-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Added outside corporate counsel Latham & Watkins LLP ((202) 955-8500, Washington DC) and lead litigation partner Daniel Sommers, Esq. at Cohen Milstein ((202) 408-4600). Direct headquarters line: (240) 497-9024."
    }
  },

  "NLST": {
    contacts: [
      {
        id: "c1",
        name: "C.K. Hong",
        title: "Chief Executive Officer & Chairman",
        entity: "Public Parent",
        email: "ckhong@netlist.com",
        phone: "(949) 435-0025",
        roleSummary: "Chief Executive Officer and founder holding dominant strategic authority over all licensing and operations.",
        receptivityScore: "high"
      },
      {
        id: "c-nlst-sheasby",
        name: "Jason Sheasby, Esq.",
        title: "Lead Patent Litigation Counsel (Irell & Manella LLP)",
        entity: "Legal Counsel",
        email: "jsheasby@irell.com",
        phone: "(310) 277-1010",
        address: "1800 Avenue of the Stars, Suite 900, Los Angeles, CA 90067",
        roleSummary: "Lead trial counsel who won the $303M Samsung patent infringement jury verdict; manages IP enforcement and licensing.",
        receptivityScore: "very_high"
      },
      {
        id: "c-nlst-plunkett",
        name: "Mike Smargiassi",
        title: "Executive Media & Investor Relations (The Plunkett Group)",
        entity: "Public Parent",
        email: "nlst@theplunkettgroup.com",
        phone: "(212) 739-6729",
        address: "220 Fifth Avenue, 11th Floor, New York, NY 10001",
        roleSummary: "Designated executive communications and investor relations officer handling direct inquiries regarding settlements and corporate actions.",
        receptivityScore: "very_high"
      }
    ],
    note: {
      id: "note-nlst-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Added lead patent litigation counsel Jason Sheasby, Esq. at Irell & Manella LLP ((310) 277-1010, Los Angeles CA) and designated executive IR line Mike Smargiassi ((212) 739-6729, NYC) alongside corporate headquarters (949) 435-0025."
    }
  },

  "IQST": {
    contacts: [
      {
        id: "c-iqst-doney",
        name: "Scott Doney, Esq.",
        title: "Securities Counsel (The Doney Law Firm)",
        entity: "Legal Counsel",
        email: "scott@doneylawfirm.com",
        phone: "(702) 998-0500",
        address: "50 S. Jones Blvd, Suite 102, Las Vegas, NV 89107",
        roleSummary: "Outside securities legal counsel passing on SEC disclosures and equity lines.",
        receptivityScore: "very_high"
      },
      {
        id: "c-iqst-walfish",
        name: "Ethan Walfish",
        title: "Head of Investor Relations",
        entity: "Public Parent",
        email: "ir@iqstel.com",
        phone: "+1 (484) 847-7835",
        roleSummary: "Senior IR executive handling commercial partnership and corporate communication flow.",
        receptivityScore: "very_high"
      },
      {
        id: "c-iqst-alvaro",
        name: "Alvaro Quintana Cardona",
        title: "Chief Operating Officer & Chief Financial Officer",
        entity: "Public Parent",
        email: "ir@iqstel.com",
        phone: "(954) 951-8191",
        roleSummary: "Next-in-line executive managing operations and financial reporting.",
        receptivityScore: "high"
      },
      {
        id: "c-iqst-leandro",
        name: "Leandro Iglesias",
        title: "Chief Executive Officer & Director",
        entity: "Public Parent",
        email: "ir@iqstel.com",
        phone: "(305) 722-5400",
        roleSummary: "Chief Executive Officer leading corporate transactions.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-iqst-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Verified outside securities counsel Scott Doney, Esq. ((702) 998-0500, Las Vegas NV), IR executive mobile (+1 (484) 847-7835), and direct corporate lines ((954) 951-8191 / (305) 722-5400)."
    }
  },

  "ZNOG": {
    contacts: [
      {
        id: "c-znog-dlubin",
        name: "David Lubin",
        title: "Senior Legal Support Director (The Crone Law Group, P.C.)",
        entity: "Legal Counsel",
        email: "dlubin@cronelawgroup.com",
        phone: "+1 (203) 666-2331",
        address: "500 West Putnam Ave, Suite 400, Greenwich, CT 06830",
        roleSummary: "Designated legal counsel director handling corporate and regulatory matters for Zion Oil & Gas.",
        receptivityScore: "very_high"
      },
      {
        id: "c-znog-avery",
        name: "William H. Avery, Esq.",
        title: "Chief Legal Officer, General Counsel & Director",
        entity: "Public Parent",
        email: "dallas@zionoil.com",
        phone: "(214) 221-4610",
        roleSummary: "In-house General Counsel & CLO managing board governance and regulatory legal actions.",
        receptivityScore: "high"
      },
      {
        id: "c-znog-dunn",
        name: "Robert Dunn",
        title: "Chief Executive Officer & Chairman of the Board",
        entity: "Public Parent",
        email: "dallas@zionoil.com",
        phone: "(214) 221-4610",
        roleSummary: "Chief Executive Officer directing drilling operations and corporate restructuring.",
        receptivityScore: "high"
      },
      {
        id: "c-znog-croswell",
        name: "Michael B. Croswell Jr.",
        title: "President & Chief Financial Officer",
        entity: "Public Parent",
        email: "dallas@zionoil.com",
        phone: "(214) 221-4610",
        roleSummary: "President and Chief Financial Officer overseeing corporate finance.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-znog-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Verified outside legal counsel David Lubin at The Crone Law Group ((203) 666-2331 / Israel: +972 55-500-3481) and in-house CLO William H. Avery, Esq. ((214) 221-4610, Dallas TX)."
    }
  },

  "LADX": {
    contacts: [
      {
        id: "c-ladx-bmc",
        name: "BMC Group (Re: LadRX ABC Assignee)",
        title: "Legal Liquidator & Claims Administrator for Assignee",
        entity: "Legal Counsel",
        email: "info@bmcgroup.com",
        phone: "(888) 909-0100",
        address: "PO Box 90100, Los Angeles, CA 90009",
        roleSummary: "Designated legal liquidator and claims administrator administering LadRx assets under California ABC.",
        receptivityScore: "very_high"
      },
      {
        id: "c-ladx-bmc-corp",
        name: "BMC Group Corporate Operations Desk",
        title: "Liquidator Operations Headquarters",
        entity: "Legal Counsel",
        email: "info@bmcgroup.com",
        phone: "(310) 321-5555",
        address: "2101 E. El Segundo Blvd, Suite 201, El Segundo, CA 90245",
        roleSummary: "Corporate office managing claims administration and asset transactions.",
        receptivityScore: "very_high"
      },
      {
        id: "c1",
        name: "Stephen Snowdy",
        title: "Former Chief Executive Officer (Resigned July 2025)",
        entity: "Public Parent",
        email: "info@bmcgroup.com",
        phone: "(310) 826-5648",
        roleSummary: "Former CEO with institutional knowledge of oncology patent estate.",
        receptivityScore: "moderate"
      }
    ],
    note: {
      id: "note-ladx-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Confirmed California General Assignment for the Benefit of Creditors status; verified BMC Group liquidator lines ((888) 909-0100 and direct (310) 321-5555, El Segundo CA) for Aldoxorubicin asset purchase dialogue."
    }
  },

  "QRON": {
    contacts: [
      {
        id: "c1",
        name: "Jonah Martin Meer, Esq.",
        title: "Chief Executive Officer & Corporate Counsel",
        entity: "Public Parent",
        email: "jmeer@qrons.com",
        phone: "(212) 945-2080",
        address: "50 Battery Place, Suite 7F, New York, NY 10280 / 28-10 Jackson Ave #26N, Long Island City, NY 11101",
        roleSummary: "CEO, director, and licensed attorney (NYU Law LL.M., JD) holding sole executive and legal decision-making authority.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-qron-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Confirmed CEO Jonah Martin Meer is an NYU Law educated attorney managing legal and corporate affairs directly at (212) 945-2080 (New York NY)."
    }
  },

  "PBIO": {
    contacts: [
      {
        id: "c-pbio-lucosky",
        name: "John O'Leary, Esq.",
        title: "Outside Securities Counsel (Lucosky Brookman LLP)",
        entity: "Legal Counsel",
        email: "joleary@lucbro.com",
        phone: "(732) 395-4400",
        address: "101 Wood Avenue South, 5th Floor, Woodbridge, NJ 08830",
        roleSummary: "Partner at Lucosky Brookman LLP acting as outside securities counsel for SEC filings and public offerings.",
        receptivityScore: "very_high"
      },
      {
        id: "c1",
        name: "Richard T. Schumacher",
        title: "President & Chief Executive Officer",
        entity: "Public Parent",
        email: "rschumacher@pressurebiosciences.com",
        phone: "(508) 230-1828",
        roleSummary: "Founder, President and CEO leading commercial contracts for Ultra Shear Technology.",
        receptivityScore: "high"
      },
      {
        id: "c-pbio-pollack",
        name: "Kevin A. Pollack, Esq.",
        title: "Securities Attorney & Board Director",
        entity: "Public Parent",
        email: "rschumacher@pressurebiosciences.com",
        phone: "(508) 230-1828",
        roleSummary: "Board director with securities attorney and M&A background (former Sidley Austin LLP attorney, Wharton / Vanderbilt JD/MBA).",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-pbio-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Added outside securities counsel Lucosky Brookman LLP (John O'Leary, Esq. / Joseph Lucosky, Esq., (732) 395-4400, Woodbridge NJ) per Form S-1/A. Noted securities attorney director Kevin Pollack, Esq. alongside CEO Richard Schumacher ((508) 230-1828, Canton MA)."
    }
  },

  "QPRC": {
    contacts: [
      {
        id: "c-qprc-levitsky",
        name: "Asher S. Levitsky, Esq.",
        title: "Outside Securities Counsel (Ellenoff Grossman & Schole)",
        entity: "Legal Counsel",
        email: "alevitsky@egsllp.com",
        phone: "(212) 370-1300",
        address: "1345 Avenue of the Americas, Suite 1100, New York, NY 10105",
        roleSummary: "Partner at Ellenoff Grossman & Schole LLP acting as lead securities counsel for SEC filings and registration statements.",
        receptivityScore: "very_high"
      },
      {
        id: "c-qprc-fabricant",
        name: "Peter Fabricant, Esq.",
        title: "Outside Patent Litigation & Escrow Counsel (Fabricant LLP)",
        entity: "Legal Counsel",
        email: "pfabricant@fabricantllp.com",
        phone: "(212) 257-5797",
        address: "411 Theodore Fremd Ave, Rye, NY 10580",
        roleSummary: "Lead patent litigation counsel managing escrow and patent monetization suits.",
        receptivityScore: "very_high"
      },
      {
        id: "c1",
        name: "Jon C. Scahill, Esq.",
        title: "Chief Executive Officer, President & Acting CFO",
        entity: "Public Parent",
        email: "jscahill@qprc.com",
        phone: "(888) 743-7577",
        address: "411 Theodore Fremd Ave, Rye, NY 10580",
        roleSummary: "Chief Executive Officer and registered patent attorney leading IP acquisition and litigation monetization.",
        receptivityScore: "high"
      },
      {
        id: "c-qprc-tim",
        name: "Timothy J. Scahill",
        title: "Chief Technology Officer & Director",
        entity: "Public Parent",
        email: "jscahill@qprc.com",
        phone: "(888) 743-7577",
        roleSummary: "Chief Technology Officer directing patent evaluation and technical litigation support.",
        receptivityScore: "high"
      }
    ],
    note: {
      id: "note-qprc-legal-2026",
      date: "2026-10-06",
      author: "Legal & Deal Desk",
      text: "Added lead outside securities counsel Asher S. Levitsky, Esq. at Ellenoff Grossman & Schole LLP ((212) 370-1300, New York NY) per Form POS AM cover. Verified patent litigation counsel Peter Fabricant, Esq. ((212) 257-5797) and CEO Jon C. Scahill, Esq. ((888) 743-7577)."
    }
  }
};

// Now parse rawTargets in lib/data/targets.ts
// We will replace each target's contacts and unshift the new note
// Let us do this with a robust script that evaluates and outputs formatted typescript.

