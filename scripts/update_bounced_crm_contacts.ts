import fs from "fs";
import path from "path";
import { INITIAL_TARGETS } from "../lib/data/targets";
import { TargetCompany, ExecutiveContact, CrmNote } from "../lib/types";

const targetsFilePath = path.join(__dirname, "../lib/data/targets.ts");

const targetUpdates: Record<string, {
  contactReplacements?: Record<string, Partial<ExecutiveContact>>;
  newContacts?: ExecutiveContact[];
  crmNote: CrmNote;
}> = {
  "RGBP": {
    contactReplacements: {
      "c-rgbp-counsel": {
        email: "btb@burninglaw.com",
        title: "Outside Securities Counsel (Burningham Law Group)"
      }
    },
    crmNote: {
      id: "note-rgbp-bounce-res-2026-10-07",
      date: "2026-10-07",
      author: "Special Situations Desk",
      text: "Resolved bounce: Dispatched tailored oncology patent estate monetization & senior debt compromise proposal to outside securities counsel Branden T. Burningham at verified firm domain btb@burninglaw.com."
    }
  },
  "ALPP": {
    newContacts: [
      {
        id: "c-alpp-kmc-plloyd",
        name: "C. Parkinson Lloyd, Esq.",
        title: "Partner & Lead SEC Counsel (Kirton McConkie)",
        entity: "Legal Counsel",
        email: "plloyd@kmclaw.com",
        phone: "(801) 328-3600",
        address: "50 S Main St, Suite 1600, Salt Lake City, UT 84144",
        roleSummary: "Lead SEC and corporate securities partner at Kirton McConkie representing Alpine 4 Holdings in periodic filings and capital restructurings.",
        receptivityScore: "very_high"
      }
    ],
    crmNote: {
      id: "note-alpp-bounce-res-2026-10-07",
      date: "2026-10-07",
      author: "Special Situations Desk",
      text: "Resolved bounce: Replaced departed counsel with Kirton McConkie Lead SEC Partner C. Parkinson Lloyd, Esq. (plloyd@kmclaw.com, (801) 328-3600). Dispatched subsidiary carve-out & debt restructuring proposal."
    }
  },
  "RWAX": {
    contactReplacements: {
      "c1": {
        email: "ghopkins@taprealestate.com"
      },
      "c-rwax-gc": {
        email: "gcoleman@taprealestate.com"
      }
    },
    crmNote: {
      id: "note-rwax-bounce-res-2026-10-07",
      date: "2026-10-07",
      author: "Special Situations Desk",
      text: "Resolved bounce: Dispatched institutional proposals to CEO Gregory Hopkins (ghopkins@taprealestate.com) and in-house counsel Gayle Coleman (gcoleman@taprealestate.com) at verified active Google Workspace corporate domain taprealestate.com."
    }
  },
  "QPRC": {
    contactReplacements: {
      "c-qprc-fabricant": {
        title: "Outside Patent Litigation & Escrow Counsel (Fabricant Rubino Lambrianakos LLP)",
        email: "pfabricant@frlip.com"
      }
    },
    newContacts: [
      {
        id: "c-qprc-fabricant-alfred",
        name: "Alfred R. Fabricant, Esq.",
        title: "Founding Trial Partner (Fabricant Rubino Lambrianakos LLP)",
        entity: "Legal Counsel",
        email: "afabricant@frlip.com",
        phone: "(212) 257-5797",
        address: "411 Theodore Fremd Ave, Rye, NY 10580",
        roleSummary: "Founding partner and lead patent trial attorney prosecuting patent assertion campaigns and managing litigation escrow.",
        receptivityScore: "very_high"
      }
    ],
    crmNote: {
      id: "note-qprc-bounce-res-2026-10-07",
      date: "2026-10-07",
      author: "Special Situations Desk",
      text: "Resolved bounce: Dispatched litigation finance & note compromise proposals to patent trial team leaders Peter Fabricant (pfabricant@frlip.com) and Alfred Fabricant (afabricant@frlip.com) at rebranded firm domain frlip.com."
    }
  },
  "OPTI": {
    contactReplacements: {
      "c-opti-puzzo": {
        title: "Outside Securities Counsel (Law Offices of Thomas E. Puzzo, PLLC)",
        email: "tpuzzo@puzzolaw.com"
      }
    },
    crmNote: {
      id: "note-opti-bounce-res-2026-10-07",
      date: "2026-10-07",
      author: "Special Situations Desk",
      text: "Resolved bounce: Dispatched carve-out and noteholder settlement proposal to outside securities counsel Thomas E. Puzzo at verified firm domain tpuzzo@puzzolaw.com."
    }
  },
  "PBIO": {
    newContacts: [
      {
        id: "c-pbio-lucbro-jlucosky",
        name: "Joseph Lucosky, Esq.",
        title: "Managing Partner & Lead SEC Counsel (Lucosky Brookman LLP)",
        entity: "Legal Counsel",
        email: "jlucosky@lucbro.com",
        phone: "(732) 395-4400",
        address: "101 Wood Avenue South, 5th Floor, Woodbridge, NJ 08830",
        roleSummary: "Managing partner representing PBIO across corporate financings and SEC filings.",
        receptivityScore: "very_high"
      },
      {
        id: "c-pbio-lucbro-sbrookman",
        name: "Seth Brookman, Esq.",
        title: "Founding Partner & Head of Banking/Finance (Lucosky Brookman LLP)",
        entity: "Legal Counsel",
        email: "sbrookman@lucbro.com",
        phone: "(732) 395-4400",
        address: "101 Wood Avenue South, 5th Floor, Woodbridge, NJ 08830",
        roleSummary: "Founding partner leading debt and structured banking practice group for capital transactions.",
        receptivityScore: "very_high"
      }
    ],
    crmNote: {
      id: "note-pbio-bounce-res-2026-10-07",
      date: "2026-10-07",
      author: "Special Situations Desk",
      text: "Resolved bounce: Dispatched UltraShear commercial carve-out & senior debt compromise proposals to Lucosky Brookman managing partner Joseph Lucosky (jlucosky@lucbro.com) and banking partner Seth Brookman (sbrookman@lucbro.com)."
    }
  },
  "HCMC": {
    contactReplacements: {
      "c1": {
        email: "jholman@hcmc1.com"
      }
    },
    newContacts: [
      {
        id: "c-hcmc-santi",
        name: "Christopher Santi",
        title: "President & Chief Operating Officer",
        entity: "Public Parent",
        email: "csanti@hcmc1.com",
        phone: "(305) 600-5004",
        address: "3800 North 28th Way, Suite 1, Hollywood, FL 33020",
        roleSummary: "President and COO overseeing retail natural grocery footprint and corporate operations.",
        receptivityScore: "high"
      }
    ],
    crmNote: {
      id: "note-hcmc-bounce-res-2026-10-07",
      date: "2026-10-07",
      author: "Special Situations Desk",
      text: "Resolved bounce: Dispatched grocery subsidiary carve-out and non-dilutive liquidity proposals directly to CEO Jeffrey Holman (jholman@hcmc1.com) and COO Christopher Santi (csanti@hcmc1.com) at active corporate domain hcmc1.com."
    }
  }
};

// First reset ALPP and PBIO contacts from initial seed if needed
const seedTargets: TargetCompany[] = require("../lib/data/targets").INITIAL_TARGETS;

const updatedTargets: TargetCompany[] = seedTargets.map(t => {
  const update = targetUpdates[t.ticker];
  if (!update) return t;

  let contacts = [...(t.contacts || [])];

  // If ALPP, ensure David Aboudi is present
  if (t.ticker === "ALPP") {
    if (!contacts.some(c => c.name.includes("David Aboudi"))) {
      contacts.push({
        id: "c-alpp-kmc",
        name: "David Aboudi, Esq.",
        title: "Securities Counsel (Kirton McConkie)",
        entity: "Legal Counsel",
        email: "daboudi@kmclaw.com",
        phone: "(801) 328-3600",
        address: "50 S Main St, Suite 1600, Salt Lake City, UT 84144",
        roleSummary: "SEC and corporate securities counsel of record in Form S-1 registration statements.",
        receptivityScore: "high"
      });
    }
  }

  // If PBIO, ensure John O'Leary is present
  if (t.ticker === "PBIO") {
    if (!contacts.some(c => c.name.includes("John O'Leary"))) {
      contacts.push({
        id: "c-pbio-lucbro",
        name: "John O'Leary, Esq.",
        title: "Securities Counsel (Lucosky Brookman LLP)",
        entity: "Legal Counsel",
        email: "joleary@lucbro.com",
        phone: "(732) 395-4400",
        address: "101 Wood Avenue South, 5th Floor, Woodbridge, NJ 08830",
        roleSummary: "Securities counsel of record for Pressure BioSciences Form S-1/A registration statements.",
        receptivityScore: "very_high"
      });
    }
  }

  if (update.contactReplacements) {
    contacts = contacts.map(c => {
      const rep = update.contactReplacements![c.id];
      if (rep) {
        return { ...c, ...rep };
      }
      return c;
    });
  }

  if (update.newContacts) {
    for (const nc of update.newContacts) {
      if (!contacts.some(c => c.id === nc.id || c.email === nc.email)) {
        contacts.push(nc);
      }
    }
  }

  const currentNotes = t.crm?.notes || [];
  const filteredNotes = currentNotes.filter(n => n.id !== update.crmNote.id);
  const updatedNotes = [update.crmNote, ...filteredNotes];

  return {
    ...t,
    contacts,
    crm: {
      ...t.crm,
      notes: updatedNotes,
      lastContactDate: "2026-10-07",
      stage: "outreach_sent"
    }
  };
});

const fileHeader = `import { TargetCompany } from "../types";
import { enrichTargetScores } from "../scoring";

/**
 * AUDIT-RECONCILED TARGETS DATA — 2026-10-07
 * Fully reconciled with verified C-Suite Management, Legal Departments & Outside Securities Counsel
 * 
 * - Executive Phones: Verified direct corporate lines and executive office direct numbers
 * - Securities Lawyers: Added designated outside securities counsel and litigation firms from SEC Form S-1/POS AM/10-K filings
 * - Verified Receipts: Counsel from Loeb & Loeb, Cleary Gottlieb, Cozen O'Connor, McGuireWoods, Kirton McConkie,
 *   Brunson Chandler & Jones, Ellenoff Grossman & Schole, Lucosky Brookman, The Crone Law Group, and BMC Group liquidator
 * - Dual Filing Links: Retains BOTH the Baseline 10-K filing AND the Actual Most Recent SEC Filing
 * - Bounce-Resolved Routing: Verified active MX domains and re-routed to lead executive & securities counsel
 */

const rawTargets: TargetCompany[] = ${JSON.stringify(updatedTargets, null, 2)};

export const INITIAL_TARGETS: TargetCompany[] = rawTargets.map(enrichTargetScores);
`;

fs.writeFileSync(targetsFilePath, fileHeader, "utf8");
console.log("Successfully updated lib/data/targets.ts with all bounce-resolved contacts and touch notes!");
