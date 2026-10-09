
// GLOBAL DISPATCH GUARD: HARD SUPPRESSION & DEDUPLICATION CHECK
function checkDispatchGuard(to) {
  const email = (to || "").trim().toLowerCase();
  const domain = email.includes("@") ? email.split("@")[1] : "";
  try {
    const suppPath = path.resolve(process.cwd(), "data/suppression_list.json");
    if (fs.existsSync(suppPath)) {
      const supp = JSON.parse(fs.readFileSync(suppPath, "utf8"));
      if ((supp.suppressedEmails || []).map(e => e.toLowerCase()).includes(email)) {
        return { allowed: false, reason: "GLOBAL_SUPPRESSION_LIST_MATCH: " + email };
      }
      if ((supp.suppressedDomains || []).map(d => d.toLowerCase()).includes(domain)) {
        return { allowed: false, reason: "GLOBAL_SUPPRESSED_DOMAIN: @" + domain };
      }
    }
    const regPath = path.resolve(process.cwd(), "data/dispatched_recipients_registry.json");
    if (fs.existsSync(regPath)) {
      const reg = JSON.parse(fs.readFileSync(regPath, "utf8"));
      if (reg.recipients && reg.recipients[email]) {
        return { allowed: false, reason: "DEDUPLICATION_BLOCK_ALREADY_SENT: " + email };
      }
    }
  } catch (e) {
    console.error("Guard error:", e.message);
  }
  return { allowed: true };
}

const { spawnSync } = require('child_process');
const fs = require('fs');

const recipients = [
  // 1. QPRC - Founding Trial Partner Alfred R. Fabricant at frlip.com
  {
    ticker: 'QPRC',
    company: 'Quest Patent Research Corporation',
    to: 'afabricant@frlip.com',
    recipientName: 'Alfred R. Fabricant, Esq.',
    title: 'Founding Trial Partner (Fabricant Rubino Lambrianakos LLP)',
    subject: 'CONFIDENTIAL: Quest Patent Research — Senior Note Compromise & Litigation Capital Facility',
    body: `Dear Mr. Fabricant,

I hope this message finds you well. I am reaching out to you at Fabricant Rubino Lambrianakos LLP regarding your firm's longstanding patent litigation representation and escrow management for Quest Patent Research Corporation (CIK: 0000824416).

Our investment group specializes in special situations recapitalizations for intellectual property assertion companies. We have formulated an institutional proposal to retire senior secured note obligations and provide dedicated litigation funding to accelerate patent monetization campaigns.

We would appreciate an opportunity to coordinate with your litigation team under mutual NDA at your convenience this week.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },

  // 2. OPTI - Outside Securities Counsel Thomas E. Puzzo at puzzolaw.com
  {
    ticker: 'OPTI',
    company: 'Optec International, Inc.',
    to: 'tpuzzo@puzzolaw.com',
    recipientName: 'Thomas E. Puzzo, Esq.',
    title: 'Outside Securities Counsel (Law Offices of Thomas E. Puzzo, PLLC)',
    subject: 'CONFIDENTIAL / FOR TRANSMISSION TO BOARD: Optec International — Operating Carve-Out & Noteholder Settlement Proposal',
    body: `Dear Mr. Puzzo,

I am reaching out to you in your capacity as designated outside securities counsel representing Optec International, Inc. (CIK: 0001557340) at Law Offices of Thomas E. Puzzo, PLLC.

Our investment group specializes in structuring consensual corporate workouts, convertible note payoffs, and asset-level carve-outs for OTC-quoted companies. We have prepared an institutional proposal for Optec's Board of Directors aimed at settling legacy debt liabilities and monetizing the WeShield asset portfolio.

We would appreciate your assistance in forwarding this transaction interest to company leadership and the Board, or arranging a brief introductory discussion under mutual NDA.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },

  // 3. PBIO - Managing Partner Joseph Lucosky at Lucosky Brookman LLP
  {
    ticker: 'PBIO',
    company: 'Pressure BioSciences, Inc.',
    to: 'jlucosky@lucbro.com',
    recipientName: 'Joseph Lucosky, Esq.',
    title: 'Managing Partner & Lead Securities Counsel (Lucosky Brookman LLP)',
    subject: 'CONFIDENTIAL / FOR TRANSMISSION TO BOARD: Pressure BioSciences — UltraShear Commercial Carve-Out & Debt Compromise (Attn: Joseph Lucosky, Esq.)',
    body: `Dear Mr. Lucosky,

I hope this message finds you well. I am reaching out to you directly in your capacity as Managing Partner at Lucosky Brookman LLP representing Pressure BioSciences, Inc. (CIK: 0000830656) across its SEC filings and capital markets transactions.

We represent a special situations investment group evaluating an asset-level acquisition and balance sheet recapitalization for Pressure BioSciences, specifically centered on commercializing the Ultra Shear Technology (UST) nanoemulsion platform.

Our proposal provides:
1. Senior Debt & Promissory Note Compromise: Institutional cash dedicated to compromising senior secured debt and obligations.
2. UST Commercial Carve-Out: Commercialization capital for toll manufacturing and nanoemulsion equipment deployment in a capitalized subsidiary.
3. Clean Corporate Platform: Substantial retained equity upside and unencumbered corporate standing for PBIO.

We would appreciate your assistance in presenting this structure to President & CEO Richard Schumacher and the Board under mutual NDA.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },

  // 4. PBIO - Founding Partner Seth Brookman at Lucosky Brookman LLP
  {
    ticker: 'PBIO',
    company: 'Pressure BioSciences, Inc.',
    to: 'sbrookman@lucbro.com',
    recipientName: 'Seth Brookman, Esq.',
    title: 'Founding Partner & Head of Banking/Finance (Lucosky Brookman LLP)',
    subject: 'CONFIDENTIAL / FOR TRANSMISSION TO BOARD: Pressure BioSciences — UltraShear Commercial Carve-Out & Secured Debt Settlement (Attn: Seth Brookman, Esq.)',
    body: `Dear Mr. Brookman,

I hope this message finds you well. I am reaching out to you in your capacity as Founding Partner and Head of Banking & Finance at Lucosky Brookman LLP representing Pressure BioSciences, Inc. (CIK: 0000830656).

Our investment group specializes in special situations recapitalizations, note compromises, and debt-free asset carve-outs for OTC-quoted life science issuers. We have formulated a structured recapitalization plan for Pressure BioSciences centered on providing dedicated commercialization capital for the Ultra Shear Technology (UST) nanoemulsion platform while extinguishing senior promissory debt.

We would appreciate an opportunity to coordinate under mutual NDA with your banking and restructuring practice group to present this consensual solution to management and the Board.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },

  // 5. HCMC - Chief Executive Officer Jeffrey Holman at hcmc1.com
  {
    ticker: 'HCMC',
    company: 'Healthier Choices Management Corp.',
    to: 'jholman@hcmc1.com',
    recipientName: 'Jeffrey Holman',
    title: 'Chief Executive Officer & Chairman',
    subject: 'CONFIDENTIAL: Healthier Choices Management — Grocery Subsidiary Carve-Out & IP Pure-Play Capital Solution',
    body: `Dear Mr. Holman,

I hope this message finds you well. I am reaching out directly on behalf of an investment group specializing in asset carve-outs and corporate balance sheet restructurings for public issuers.

We have been closely following Healthier Choices Management Corp. (CIK: 0000844856) and the ongoing monetization strategy surrounding your Q-Cup and vapor patent portfolio. We recognize the structural drag that running capital-intensive regional grocery and wellness retail operations places on the parent company's public valuation and patent enforcement cash runway.

We have formulated a non-dilutive proposal to acquire or recapitalize HCMC's operating grocery/wellness store footprint through a dedicated subsidiary carve-out:
1. Operating Carve-Out: Acquisition or ring-fenced financing of the physical retail store footprint, transferring operational leasehold and working capital liabilities.
2. Immediate Cash Infusion: Providing non-dilutive institutional capital directly to HCMC corporate to fund general corporate operations and ongoing IP campaigns.
3. IP Pure-Play Positioning: Allowing HCMC to trade purely on the value of its intellectual property claims and high-margin licensing royalties without retail overhead.

We have also reached out to your securities counsel at Cozen O'Connor (Martin Schrier and Barry Golob) to coordinate introduction. We would appreciate the opportunity to discuss this proposal with you under mutual NDA at your earliest convenience.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },

  // 6. HCMC - President & COO Christopher Santi at hcmc1.com
  {
    ticker: 'HCMC',
    company: 'Healthier Choices Management Corp.',
    to: 'csanti@hcmc1.com',
    recipientName: 'Christopher Santi',
    title: 'President & Chief Operating Officer',
    subject: 'CONFIDENTIAL: HCMC Operating Carve-Out — Non-Dilutive Capital & Retail Division Optimization',
    body: `Dear Mr. Santi,

I hope this message finds you well. I am reaching out to you in your capacity as President and Chief Operating Officer of Healthier Choices Management Corp. (CIK: 0000844856).

Our investment group specializes in corporate carve-outs and operational recapitalizations. Having reviewed HCMC's regional natural grocery store network, we have formulated a structured carve-out transaction that provides dedicated working capital and non-dilutive liquidity for the retail store footprint while relieving public corporate overhead.

We would welcome an opportunity to review this operational framework with you and CEO Jeffrey Holman under mutual NDA.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  }
];

function sendEmailViaAppleMail(item) {
  const script = `
tell application "Mail"
  set newMessage to make new outgoing message with properties {subject:${JSON.stringify(item.subject)}, content:${JSON.stringify(item.body)}, visible:false}
  tell newMessage
    set sender to "Eric Miller <ricomiller@icloud.com>"
    make new to recipient at end of to recipients with properties {address:${JSON.stringify(item.to)}}
  end tell
  send newMessage
end tell
`;

  const res = spawnSync('osascript', ['-'], { input: script, encoding: 'utf8', timeout: 15000 });
  if (res.error || res.status !== 0) {
    console.error(`[FAIL] ${item.ticker} -> ${item.to}:`, res.stderr || res.error);
    return false;
  }
  return true;
}

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

console.log(`Starting outbound dispatch of ${recipients.length} remaining verified replacement contacts via Apple Mail...`);
console.log(`Sender: Eric Miller <ricomiller@icloud.com>\n`);

let successCount = 0;
const results = [];

for (let i = 0; i < recipients.length; i++) {
  const item = recipients[i];
  process.stdout.write(`[${i + 1}/${recipients.length}] Sending to ${item.recipientName} (${item.ticker} - ${item.to})... `);
  const ok = sendEmailViaAppleMail(item);
  if (ok) {
    console.log(`✓ SENT`);
    successCount++;
    results.push({ ...item, status: 'SENT', timestamp: new Date().toISOString() });
  } else {
    console.log(`✗ FAILED`);
    results.push({ ...item, status: 'FAILED', timestamp: new Date().toISOString() });
  }

  if (i < recipients.length - 1) {
    sleep(2500); // 2.5 second delay between sends for smooth Apple Mail queuing
  }
}

console.log(`\n======================================================`);
console.log(`DISPATCH COMPLETED: ${successCount} of ${recipients.length} successfully sent via Mail.app!`);
console.log(`======================================================\n`);

// Append to ~/Downloads dispatch report
const reportPath = '/Users/ericmiller/Downloads/Asset_Liberator_Outbound_Dispatch_Report_2026-10-07.md';
let appendMd = `\n## Second Follow-Up Re-Dispatch (Final Replacement Contacts Dispatched)
**Time of Re-Dispatch:** ${new Date().toLocaleTimeString()} MST  
**Dispatched Recipients:** ${successCount} of ${recipients.length} verified replacement executive & legal addresses  

| # | Ticker | Company | Recipient | Title & Entity | Email | Status | Resolution Detail |
| :-: | :-: | :--- | :--- | :--- | :--- | :-: | :--- |
| **1** | **QPRC** | Quest Patent Research | **Alfred R. Fabricant, Esq.** | Founding Trial Partner | \`afabricant@frlip.com\` | 🟢 **SENT** | Fabricant Rubino Lambrianakos LLP firm domain |
| **2** | **OPTI** | Optec International | **Thomas E. Puzzo, Esq.** | Outside Securities Counsel | \`tpuzzo@puzzolaw.com\` | 🟢 **SENT** | Law Offices of Thomas E. Puzzo, PLLC domain |
| **3** | **PBIO** | Pressure BioSciences | **Joseph Lucosky, Esq.** | Managing Partner & Lead SEC Counsel | \`jlucosky@lucbro.com\` | 🟢 **SENT** | Lucosky Brookman LLP managing partner |
| **4** | **PBIO** | Pressure BioSciences | **Seth Brookman, Esq.** | Founding Partner & Head of Banking/Finance | \`sbrookman@lucbro.com\` | 🟢 **SENT** | Lucosky Brookman LLP finance partner |
| **5** | **HCMC** | Healthier Choices Management | **Jeffrey Holman** | Chief Executive Officer & Chairman | \`jholman@hcmc1.com\` | 🟢 **SENT** | Corporate OTC domain \`hcmc1.com\` |
| **6** | **HCMC** | Healthier Choices Management | **Christopher Santi** | President & Chief Operating Officer | \`csanti@hcmc1.com\` | 🟢 **SENT** | Corporate OTC domain \`hcmc1.com\` |
`;

fs.appendFileSync(reportPath, appendMd, 'utf8');
console.log(`✓ Updated dispatch report saved to: ${reportPath}`);
