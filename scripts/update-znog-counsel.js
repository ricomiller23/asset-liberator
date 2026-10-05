const fs = require('fs');
const path = require('path');

const targetsTsPath = path.join(__dirname, '../lib/data/targets.ts');
let targetsTs = fs.readFileSync(targetsTsPath, 'utf8');

const jsonMatch = targetsTs.match(/const rawTargets: TargetCompany\[\] = ([\s\S]*?);\s*export const INITIAL_TARGETS/);
if (!jsonMatch) {
  console.error('Failed to match rawTargets');
  process.exit(1);
}

const targets = JSON.parse(jsonMatch[1]);
const znog = targets.find(t => t.ticker === 'ZNOG');

if (znog) {
  const aboudiContact = {
    id: 'c-znog-aboudi',
    name: 'David Aboudi, Esq.',
    title: 'Securities Counsel (The Crone Law Group, P.C.)',
    entity: 'Legal Counsel',
    email: 'daboudi@cronelawgroup.com',
    phone: '(646) 861-7891',
    roleSummary: 'Designated outside securities and corporate legal counsel of record on SEC Form S-3 and Form 8-K registration statements for Zion Oil & Gas, Inc.',
    receptivityScore: 'high'
  };

  // Place David Aboudi as primary contact, followed by CEO Robert Dunn, CFO Michael Croswell, and CLO William Avery
  znog.contacts = [
    aboudiContact,
    ...znog.contacts.filter(c => c.id !== 'c-znog-aboudi')
  ];

  if (!znog.crm) znog.crm = { stage: 'outreach_sent', priority: 'critical', notes: [], activities: [] };

  znog.crm.notes.unshift({
    id: `note-znog-legal-${Date.now()}`,
    date: '2026-10-05',
    author: 'Legal & Outbound Audit Desk',
    text: '1-Hour audit on ricomiller@icloud.com confirmed PHIL, LADX, QPRC, and IQST delivered without bounce. ZNOG corporate address rejected dallas@zionoil.com (SMTP 550 5.7.133 SenderNotAuthenticatedForGroup). Per protocol, routed formal carve-out proposal to designated outside securities legal counsel: David Aboudi, Esq. at The Crone Law Group, P.C. (daboudi@cronelawgroup.com, (646) 861-7891). Dispatched via Apple Mail from ricomiller@icloud.com at 12:27 PM.'
  });

  znog.crm.activities.unshift({
    id: `act-znog-legal-${Date.now()}`,
    date: '2026-10-05',
    type: 'email',
    summary: 'Dispatched formal Rig 9 & Meged exploration carve-out proposal to outside securities legal counsel David Aboudi, Esq. (The Crone Law Group, P.C., daboudi@cronelawgroup.com) for transmission to Board.'
  });

  znog.crm.lastContactDate = '2026-10-05';
}

const newJsonStr = JSON.stringify(targets, null, 2);
const updatedContent = targetsTs.replace(
  /const rawTargets: TargetCompany\[\] = [\s\S]*?;\s*export const INITIAL_TARGETS/,
  `const rawTargets: TargetCompany[] = ${newJsonStr};\n\nexport const INITIAL_TARGETS`
);

fs.writeFileSync(targetsTsPath, updatedContent, 'utf8');
console.log('✓ Successfully updated targets.ts with ZNOG legal counsel David Aboudi, Esq.');

const storePath = '/tmp/asset_liberator_targets_store.json';
fs.writeFileSync(storePath, JSON.stringify(targets, null, 2), 'utf8');
console.log('✓ Successfully synchronized /tmp/asset_liberator_targets_store.json');
