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
  const lubinContact = {
    id: 'c-znog-lubin',
    name: 'David Lubin',
    title: 'Senior Legal Support Director (The Crone Law Group, P.C.)',
    entity: 'Legal Counsel',
    email: 'dlubin@cronelawgroup.com',
    phone: '+1 (203) 666-2331',
    roleSummary: 'Senior Legal Support Director at The Crone Law Group, P.C. handling legal inquiries and board communications for Zion Oil & Gas matters following transition from David Aboudi. Longstanding decade-plus firm relationship with founder Mark Crone noted.',
    receptivityScore: 'high'
  };

  // Place David Lubin as primary contact, followed by CEO Robert Dunn, CFO Michael Croswell, and CLO William Avery
  znog.contacts = [
    lubinContact,
    ...znog.contacts.filter(c => c.id !== 'c-znog-lubin' && c.id !== 'c-znog-aboudi')
  ];

  if (!znog.crm) znog.crm = { stage: 'outreach_sent', priority: 'critical', notes: [], activities: [] };

  znog.crm.notes.unshift({
    id: `note-znog-lubin-${Date.now()}`,
    date: '2026-10-05',
    author: 'Special Situations Desk',
    text: 'Transition notice received from The Crone Law Group, P.C. indicating David Aboudi has departed the firm; official replacement for legal inquiries is David Lubin (Senior Legal Support Director, dlubin@cronelawgroup.com, +1 (203) 666-2331 / Israel: +972 55-500-3481). Revised Rig 9 & Meged exploration carve-out proposal dispatched to David Lubin referencing Eric Miller\'s decade-plus professional relationship with firm founder Mark Crone for executive board transmission to CEO Robert Dunn and General Counsel William Avery.'
  });

  znog.crm.activities.unshift({
    id: `act-znog-lubin-${Date.now()}`,
    date: '2026-10-05',
    type: 'email',
    summary: 'Dispatched revised carve-out proposal to David Lubin (Senior Legal Support Director, The Crone Law Group, P.C., dlubin@cronelawgroup.com) referencing decade-plus relationship with Mark Crone for transmission to Zion Board.'
  });

  znog.crm.lastContactDate = '2026-10-05';
}

const newJsonStr = JSON.stringify(targets, null, 2);
const updatedContent = targetsTs.replace(
  /const rawTargets: TargetCompany\[\] = [\s\S]*?;\s*export const INITIAL_TARGETS/,
  `const rawTargets: TargetCompany[] = ${newJsonStr};\n\nexport const INITIAL_TARGETS`
);

fs.writeFileSync(targetsTsPath, updatedContent, 'utf8');
console.log('✓ Successfully updated targets.ts with ZNOG legal contact David Lubin (mentioning Mark Crone).');

const storePath = '/tmp/asset_liberator_targets_store.json';
fs.writeFileSync(storePath, JSON.stringify(targets, null, 2), 'utf8');
console.log('✓ Successfully synchronized /tmp/asset_liberator_targets_store.json');
