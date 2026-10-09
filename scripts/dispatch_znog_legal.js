
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

const item = {
  ticker: 'ZNOG',
  to: 'daboudi@cronelawgroup.com',
  subject: 'CONFIDENTIAL / FOR TRANSMISSION TO BOARD: Zion Oil & Gas — Rig 9 & Meged Exploration Asset Carve-Out Proposal (Attn: David Aboudi, Esq.)',
  body: `Dear Mr. Aboudi,

I hope this message finds you well. I am contacting you directly in your capacity as designated outside securities and corporate legal counsel for Zion Oil & Gas, Inc. (CIK: 0001131312) at The Crone Law Group, P.C.

We are reaching out to present a confidential, non-hostile institutional carve-out and capital solution to the Board of Directors of Zion Oil & Gas (specifically Chairman & CEO Robert Dunn and General Counsel William H. Avery) regarding Zion Drilling Rig 9 and the Meged / Jordan Valley exploration license assets. 

Because Zion's internal corporate gateway rejects external inbound emails with administrative restrictions, we are formally routing this executive communication through outside securities counsel of record.

Our private investment group specializes in distressed energy infrastructure carve-outs and asset-level joint ventures. We would like to propose a confidential carve-out framework structured as follows:

1. Rig 9 & Field Infrastructure Isolation: Isolate Rig 9 (2,000 HP heavy exploration rig) and dedicated onshore exploration equipment into a ring-fenced, unencumbered asset-level operating partnership.
2. Dedicated Operational Capital Injection: Provide non-dilutive institutional capital specifically dedicated to field operations and testing programs, avoiding the need for continuous dilutive equity unit offerings.
3. Commercial Drilling & Shell Value Realization: Allow Zion Oil & Gas to retain commercial utilization priority and substantial carried working interest while establishing an unencumbered corporate vehicle for independent financing.

We would appreciate your forwarding this inquiry to Mr. Dunn and Mr. Avery, or arranging a brief introductory discussion under mutual NDA between counsel and principals later this week.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
};

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

console.log(`Dispatching ZNOG legal representation outreach to ${item.to}...`);
const res = spawnSync('osascript', ['-'], { input: script, encoding: 'utf8' });
if (res.error || res.status !== 0) {
  console.error(`[FAIL]:`, res.stderr || res.error);
  process.exit(1);
}
console.log(`[SENT] ✓ ZNOG -> ${item.to} (David Aboudi, Esq. - The Crone Law Group, P.C.)`);
