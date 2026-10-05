const { spawnSync } = require('child_process');

const item = {
  ticker: 'ZNOG',
  to: 'dlubin@cronelawgroup.com',
  subject: 'CONFIDENTIAL / FOR TRANSMISSION TO BOARD: Zion Oil & Gas — Rig 9 & Meged Exploration Asset Carve-Out Proposal (Attn: David Lubin)',
  body: `Dear Mr. Lubin,

I hope this message finds you well. I was referred to you via the firm's transition notice regarding matters previously handled with David Aboudi.

I've had the pleasure of knowing Mark Crone for over a decade, so I have great respect for The Crone Law Group and the institutional caliber of counsel your team provides across cross-border corporate and securities matters.

We are reaching out to present a confidential, non-hostile institutional carve-out and capital solution to the Board of Directors of Zion Oil & Gas, Inc. (CIK: 0001131312)—specifically Chairman & CEO Robert Dunn, President & CFO Michael B. Croswell Jr., and Chief Legal Officer & General Counsel William H. Avery—regarding Zion Drilling Rig 9 and the Meged / Jordan Valley exploration license assets.

Because Zion's corporate email gateways enforce internal authentication restrictions that filter unsolicited inbound communications, we are formally routing this executive communication through outside securities counsel of record at The Crone Law Group.

Our private investment group specializes in distressed energy infrastructure carve-outs and asset-level joint ventures. We would like to propose a confidential carve-out framework structured as follows:

1. Rig 9 & Field Infrastructure Isolation: Isolate Rig 9 (the specialized 2,000 HP heavy exploration rig) and dedicated onshore exploration equipment into a ring-fenced, unencumbered asset-level operating partnership.
2. Dedicated Operational Capital Injection: Provide non-dilutive institutional capital specifically dedicated to field operations, testing programs, and potential completions, avoiding the need for continuous dilutive equity unit offerings.
3. Commercial Drilling & Shell Value Realization: Allow Zion Oil & Gas to retain commercial utilization priority and substantial carried working interest while establishing an unencumbered corporate vehicle for independent financing.

Given the firm's representation of Zion and presence across both the US and Israel, we would appreciate your assistance in forwarding this transaction framework to Mr. Dunn and Mr. Avery, or arranging a brief introductory discussion under mutual NDA between counsel and principals later this week. Please also give my warmest regards to Mark.

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
  end tell
  send newMessage
end tell
`;

console.log(`Dispatching ZNOG legal representation outreach to ${item.to}...`);
const res = spawnSync('osascript', ['-'], { input: script, encoding: 'utf8' });
if (res.error || res.status !== 0) {
  console.error(`[FAIL]:`, res.stderr || res.error);
  process.exit(1);
}
console.log(`[SENT] ✓ ZNOG -> ${item.to} (David Lubin - Senior Legal Support Director, The Crone Law Group, P.C.)`);
