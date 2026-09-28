import { TargetCompany, ExecutiveContact } from "../types";

export interface OutreachTemplate {
  id: string;
  name: string;
  targetRole: "Operating Subsidiary" | "Senior Creditor" | "Public Parent" | "Legal Counsel";
  subject: (target: TargetCompany, contact: ExecutiveContact) => string;
  body: (target: TargetCompany, contact: ExecutiveContact) => string;
}

export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: "sub-founder-liberation",
    name: "Operating Founder Liberation & Clean Shell Rollup",
    targetRole: "Operating Subsidiary",
    subject: (target, contact) => `CONFIDENTIAL: Strategic Recapitalization & Carve-Out Proposal for ${target.asset.subsidiaryName}`,
    body: (target, contact) => `Dear ${contact.name},

I am reaching out confidentially regarding ${target.asset.subsidiaryName}. Our investment group specializes in special situations recapitalizations and public company corporate restructurings.

We have closely analyzed ${target.name} (${target.ticker}) and its current public vehicle distress (including the ${target.vehicleDistress.filingStatus.replace("_", " ")} filing status and the ${target.vehicleDistress.secTriggers[0] || "toxic convertible debt load"}). It is obvious to any sophisticated observer that while your underlying operating business is robust (generating over $${(target.asset.annualRevenue / 1000000).toFixed(1)}M in real commercial revenue), the public parent company vehicle is fatally broken and unable to finance your growth.

We control pristine, unencumbered public shells (clean cap tables, DTC/FAST eligible, zero debt, zero litigation, current PCAOB auditors). We are prepared to:

1. Acquire or restructure the senior secured debt held by ${target.extractionFeasibility.seniorSecuredHolder}.
2. Execute a clean carve-out (via an Article 9 friendly foreclosure or consensual assignment) that completely isolates ${target.asset.subsidiaryName} from the toxic convertible notes and liabilities of ${target.name}.
3. Roll ${target.asset.subsidiaryName} into our clean public vehicle, providing you and your core management team with substantial, un-diluted equity, working capital, and an institutional board to support your customers.

We would welcome a confidential 20-minute discussion under NDA this week to discuss how we can free your business. Are you available for a brief call tomorrow or Wednesday?

Best regards,

Special Situations & M&A Team
Clean Shell Capital Partners
Direct: (949) 555-0190 | Confidential M&A Desk`
  },
  {
    id: "senior-creditor-buyout",
    name: "Senior Note Purchase & Cash Payoff Offer",
    targetRole: "Senior Creditor",
    subject: (target, contact) => `OFFER TO PURCHASE: Defaulted Senior Credit Position on ${target.asset.subsidiaryName} (${target.ticker})`,
    body: (target, contact) => `Dear ${contact.name},

I am writing to submit an expression of interest to acquire the first-lien senior secured debt position held by ${contact.entity === "Senior Creditor" ? contact.name : target.extractionFeasibility.seniorSecuredHolder} with respect to ${target.asset.subsidiaryName} / ${target.name} (${target.ticker}).

We understand this credit facility is currently in special assets / workout status with an outstanding balance of approximately $${(target.extractionFeasibility.seniorSecuredDebtAmount / 1000000).toFixed(2)}M, secured by a first-priority UCC-1 lien on the operating assets, inventory, and IP of ${target.asset.subsidiaryName}.

Given the extensive junior toxic debt overhang ($${(target.vehicleDistress.toxicDebtBalance / 1000000).toFixed(1)}M) and SEC filing paralysis at the parent level, recovery via conventional operational turnaround is mathematically improbable.

Our group has completed initial underwriting and is prepared to offer:
- An immediate, all-cash purchase and assignment of the senior note and underlying UCC collateral at an agreed discounted valuation ($${(target.extractionFeasibility.estimatedAcquisitionCost / 1000000).toFixed(2)}M cash at closing).
- Expedited due diligence (7 business days) with standard institutional loan assignment documentation.
- Elimination of ongoing workout legal expenses and provisioning requirements for your institution.

Please let us know if we can execute a standard bilateral NDA to review the loan documentation and move toward definitive assignment terms.

Sincerely,

Principal & Head of Distressed Credit
Clean Shell Capital Partners
Direct: (949) 555-0190`
  },
  {
    id: "parent-board-carveout",
    name: "Consensual Carve-Out & Liability Discharge (Parent CEO)",
    targetRole: "Public Parent",
    subject: (target, contact) => `Confidential: Proposal to Relieve Parent Overhead & Carve Out ${target.asset.subsidiaryName}`,
    body: (target, contact) => `Dear ${contact.name},

We are writing to propose a consensual transaction structure that resolves the pressing balance sheet liabilities of ${target.name} (${target.ticker}) while unlocking value for your stakeholders.

Currently, ${target.name} faces substantial operational and regulatory friction, including $${(target.vehicleDistress.toxicDebtBalance / 1000000).toFixed(1)}M in convertible note obligations and delinquent SEC filings. Continued delay risks involuntary creditor foreclosure or total liquidation.

We propose a consensual carve-out transaction wherein our entity:
1. Assumes or satisfies the senior secured obligations held by ${target.extractionFeasibility.seniorSecuredHolder}, extinguishing default liability.
2. Injects required capital directly into ${target.asset.subsidiaryName} to safeguard customer contracts and ongoing operations.
3. Provides ${target.name} with either a cash consideration or an equity interest in a clean, fully-audited public vehicle to be distributed or monetized for the benefit of parent stakeholders.

This structure shields the board from breach of fiduciary duty claims by maximizing asset recovery in a solvent, going-concern transaction rather than a fire-sale liquidation.

We are prepared to discuss terms under NDA immediately.

Respectfully,

Managing Partner
Clean Shell Capital Partners`
  },
  {
    id: "legal-counsel-stalking-horse",
    name: "Section 363 Stalking Horse / Foreclosure Coordination",
    targetRole: "Legal Counsel",
    subject: (target, contact) => `Inquiry: Stalking Horse Asset Acquisition / UCC Article 9 Coordination (${target.asset.subsidiaryName})`,
    body: (target, contact) => `Dear ${contact.name},

Our firm focuses on acquiring distressed operating assets out of broken public corporate structures via expedited Section 363 bankruptcy sales and Article 9 secured UCC foreclosures.

We have reviewed the filings and UCC-1 lien records for ${target.name} (${target.ticker}) and its operating subsidiary ${target.asset.subsidiaryName}. We recognize that you serve as counsel with respect to the corporate / restructuring affairs of this entity.

We have committed capital ready to act as a Stalking Horse Bidder under Section 363 or to partner on a consensual Article 9 disposition with the senior secured lender. Our acquisition vehicle is backed by clean public shell infrastructure, allowing seamless continuity of employee payroll, vendor contracts, and client deliverables.

Could we schedule a 15-minute conference call with your restructuring team this week to outline our proposed timeline and bid parameters?

Sincerely,

General Counsel & Restructuring Director
Clean Shell Capital Partners`
  }
];
