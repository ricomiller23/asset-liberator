const { spawnSync } = require('child_process');

const emails = [
  {
    ticker: 'PHIL',
    company: 'Philux Global Group Inc. (f/k/a PHI Group Inc.)',
    to: 'info@philuxglobal.com',
    recipientName: 'Tina T. Phan & Henry D. Fahman',
    subject: 'CONFIDENTIAL: Strategic Asset Carve-Out & Senior Debt Settlement — Philux Global Group (American Pacific Resources)',
    body: `Dear Ms. Phan and Mr. Fahman,

I hope this message finds you well. I am reaching out to you both in your executive capacities as Treasurer/Corporate Secretary and Chairman/President of Philux Global Group Inc. (f/k/a PHI Group, Inc., CIK: 0000704172).

We have closely monitored Philux's ongoing restructuring initiatives and corporate filings, specifically noting the operational cash generation within American Pacific Resources & Energy LLC alongside the current capital structure constraints, delinquent periodic SEC reporting (Forms NT 10-K), and OTC Expert Market quotation status.

We represent an institutional special situations consortium specializing in solvent operating asset carve-outs and public shell recapitalizations. We are actively evaluating an asset-level acquisition and debt resolution transaction structured to:

1. Carve-Out Operating Assets: Acquire the operating agro-processing and export infrastructure of American Pacific Resources & Energy LLC into a well-capitalized, unencumbered operating vehicle.
2. Comprehensive Debt Settlement: Satisfy or compromise outstanding senior creditor and promissory note encumbrances at the subsidiary level.
3. Clean Public Shell Preservation: Deliver non-dilutive liquidity and retained equity participation to Philux Global Group, clearing subsidiary liabilities and restoring the public parent as a clean, compliant vehicle for future corporate opportunities.

Given your oversight of treasury, corporate administration, and strategic direction alongside counsel (Dieterich & Associates), we would welcome a 15-minute introductory conference call this week to review high-level transaction parameters under mutual NDA.

Are you available for a brief introductory discussion on Wednesday or Thursday?

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },
  {
    ticker: 'ZNOG',
    company: 'Zion Oil & Gas, Inc.',
    to: 'dallas@zionoil.com',
    recipientName: 'Robert Dunn & William H. Avery',
    subject: 'CONFIDENTIAL: Specialized Drilling Rig 9 & Meged Exploration Carve-Out Proposal — Zion Oil & Gas',
    body: `Dear Mr. Dunn and Mr. Avery,

I am writing to you directly following the recent executive leadership succession at Zion Oil & Gas, Inc. (CIK: 0001131312) in your respective roles as Chief Executive Officer / Chairman of the Board and Chief Legal Officer / General Counsel.

Having analyzed Zion's ongoing operational disclosures on Form 8-K and the financial baseline from your Form 10-K, we recognize the substantial intrinsic engineering value embedded in Zion Drilling Rig 9 (the 2,000 HP heavy exploration rig) and the proprietary 3D seismic processing dataset covering the 99,000-acre Meged / Jordan Valley exploration license. At the same time, we recognize the ongoing corporate overhead and capital formation demands required to advance testing and potential completions.

Our private investment group specializes in distressed energy infrastructure carve-outs and asset-level joint ventures. We would like to propose a confidential carve-out framework structured as follows:

1. Rig 9 & Field Infrastructure Isolation: Isolate Rig 9 and dedicated onshore exploration equipment into a ring-fenced, unencumbered asset-level operating partnership.
2. Dedicated Operational Capital Injection: Provide non-dilutive institutional capital specifically dedicated to field operations and testing programs, avoiding the need for continuous dilutive equity unit offerings.
3. Commercial Drilling & Shell Value Realization: Allow Zion Oil & Gas to retain commercial utilization priority and substantial carried working interest while establishing an unencumbered corporate vehicle for independent financing.

We would appreciate the opportunity to discuss this framework confidentially with you and your legal and finance team. Please let us know if you have availability for a brief introductory call later this week.

Sincerely,

Eric Miller
Managing Principal
Distressed Infrastructure & Asset Rollup Engine
Direct: (480) 287-2227
ricomiller@icloud.com`
  },
  {
    ticker: 'LADX',
    company: 'LadRx Corporation (BMC Group Assignee Administration)',
    to: 'info@bmcgroup.com',
    recipientName: 'BMC Group (Re: LadRX ABC Assignee)',
    subject: 'FORMAL ACQUISITION INQUIRY: LadRX ABC — Aldoxorubicin & LADR Oncology Asset Purchase (Ref: LadRX ABC)',
    body: `To the Assignee and Claims Administration Team:
BMC Group, Inc.
Re: LADRX, Assignment for the Benefit of Creditors, LLC
PO Box 90100, Los Angeles, CA 90009
Case Reference: LadRX ABC (https://LadRX-abc.smartexchange.com)

Dear Assignee Administration Team:

We are writing in formal reference to the General Assignment for the Benefit of Creditors (ABC) entered into by LADRX Corporation (f/k/a CytRx Corporation, CIK: 0000799698) on July 28, 2025, pursuant to California state law, as disclosed on SEC Form 8-K.

Our investment syndicate specializes in the acquisition and revival of distressed clinical biotechnology assets. We are formally submitting an Expression of Interest to acquire from the Assignee estate all right, title, and interest in the following assets:

1. Clinical & Regulatory Assets: All patents, preclinical and clinical data dossiers, FDA IND files, and proprietary manufacturing documentation for Aldoxorubicin (albumin-binding doxorubicin formulation) regained from NantCell / ImmunityBio.
2. Linker Platform IP: All intellectual property and patents associated with the LADR (Linker Activated Drug Release) chemistry platform.
3. Royalty & License Rights: Any residual contract rights, milestone interests, or sublicense agreements.

We are prepared to submit a binding, all-cash purchase offer structured to provide immediate, definitive liquidity to the ABC estate for distribution to general unsecured creditors and senior administrative claims.

Please provide the Assignee's standard non-disclosure agreement (NDA), bidding procedures, and virtual data room (VDR) access instructions at your earliest convenience so our technical and legal team can proceed with expedited diligence.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
Email: ricomiller@icloud.com`
  },
  {
    ticker: 'QPRC',
    company: 'Quest Patent Research Corporation',
    to: 'jscahill@qprc.com',
    recipientName: 'Jon C. Scahill, Esq.',
    subject: 'CONFIDENTIAL: IP Monetization Portfolio Carve-Out & Senior Debt Rollup — Quest Patent Research Corp.',
    body: `Dear Mr. Scahill,

I hope this message finds you well. I am reaching out to you directly in your dual capacity as Chief Executive Officer, President, Acting CFO, and registered patent attorney for Quest Patent Research Corporation (CIK: 0000824416).

We have closely evaluated Quest's patent monetization portfolios—including the semiconductor memory, mobile wireless communications, and encryption portfolios—as well as your capital structure disclosures in recent Forms 10-K and 10-Q, including the litigation escrow arrangements with Fabricant LLP and outstanding senior secured note obligations.

We represent an institutional special situations vehicle focused on intellectual property recapitalizations and public carve-outs. We are interested in structuring a consensual transaction that achieves:

1. Senior Debt Payoff / Compromise: Purchasing or restructuring senior secured noteholder claims to eliminate immediate default and amortization pressures.
2. Dedicated Monetization Enforcement Facility: Providing ring-fenced litigation finance capital to aggressively prosecute pending patent assertion actions and licensing campaigns without operational starvation.
3. Corporate Separation / Clean Shell Optimization: Extracting encumbered IP portfolios into an institutional joint venture while preserving equity upside for QPRC and creating an unencumbered corporate platform.

Given your deep legal and executive familiarity with Quest's litigation waterfall and creditor agreements, we would appreciate the opportunity to speak with you and your brother Timothy Scahill this week.

Could we schedule a confidential 15-minute introductory call on Thursday or Friday?

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },
  {
    ticker: 'IQST',
    company: 'iQSTEL Inc.',
    to: 'ir@iqstel.com',
    recipientName: 'Alvaro Quintana Cardona & Leandro Iglesias',
    subject: 'CONFIDENTIAL: Etelix Wholesale Carrier Division Carve-Out & Equity Multiple Optimization — iQSTEL Inc.',
    body: `Dear Mr. Quintana and Mr. Iglesias,

I am writing to you directly in your executive leadership capacities as Chief Operating Officer / Chief Financial Officer and Chief Executive Officer of iQSTEL Inc. (CIK: 0001527702), with a copy to Mr. Ethan Walfish (Head of Investor Relations).

We have thoroughly analyzed iQSTEL's corporate trajectory across both its NASDAQ market presence and recent Form 10-Q/10-K filings. While iQSTEL's Etelix Wholesale Carrier & Global Telecom division generates substantial topline revenue ($142M+ annually), the capital markets consistently apply low commodity wholesale telecom multiples to iQSTEL as a whole, severely dampening the valuation of your proprietary FinTech (Global Settlement Exchange), IoT, and EV battery technology divisions.

We propose an institutional carve-out transaction designed to unlock substantial equity value:

1. Separation of Wholesale Telecom Division: Carve out the Etelix wholesale carrier operations into a specialized telecom rollup consortium.
2. Debt De-leveraging & Cash Inflow: Provide an immediate cash injection and debt assumption at the subsidiary level, substantially strengthening iQSTEL's balance sheet.
3. Pure-Play Tech Valuation: Allow iQSTEL to re-rate as a high-margin, pure-play FinTech and EV innovation company, trading at premium multiples on NASDAQ while retaining a significant equity interest in the carved-out wholesale telecom vehicle.

We would be pleased to schedule a 15-minute introductory conference call this week with you both to discuss transaction architecture and valuation metrics under mutual NDA.

Please let us know your availability for a call later this week.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
Email: ricomiller@icloud.com`
  }
];

function sendEmailAppleScript(item) {
  const script = `
tell application "Mail"
  set newMessage to make new outgoing message with properties {subject:${JSON.stringify(item.subject)}, content:${JSON.stringify(item.body)}, visible:false}
  tell newMessage
    set sender to "Eric Miller <ricomiller@icloud.com>"
    make new to recipient at end of to recipients with properties {address:${JSON.stringify(item.to)}}
    send
  end tell
end tell
`;

  const res = spawnSync('osascript', ['-'], { input: script, encoding: 'utf8' });
  if (res.error || res.status !== 0) {
    console.error(`[FAIL] ${item.ticker} to ${item.to}:`, res.stderr || res.error);
    return false;
  }
  console.log(`[SENT] ✓ ${item.ticker} -> ${item.to} (${item.recipientName})`);
  return true;
}

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

console.log(`Starting real outbound dispatch of 5 researched executive & legal contacts...`);
let successCount = 0;

for (let i = 0; i < emails.length; i++) {
  const item = emails[i];
  console.log(`[${i + 1}/5] Dispatching ${item.ticker} (${item.company})...`);
  const ok = sendEmailAppleScript(item);
  if (ok) successCount++;
  if (i < emails.length - 1) {
    sleep(2000); // 2 second pause between sends
  }
}

console.log(`\nDispatch complete: ${successCount} of ${emails.length} successfully sent via Mail.app.`);
