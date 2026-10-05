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

// 1. PHIL
const phil = targets.find(t => t.ticker === 'PHIL');
if (phil) {
  phil.primaryContact = {
    id: 'c-phil-tina',
    name: 'Tina T. Phan',
    title: 'Treasurer, Corporate Secretary & Managing Director',
    entity: 'Public Parent',
    email: 'info@philuxglobal.com',
    phone: '(714) 793-9227',
    roleSummary: 'Corporate Treasurer and Secretary overseeing corporate administration, financial records, and international capital restructuring.',
    receptivityScore: 'high'
  };
  phil.contacts = [
    phil.primaryContact,
    {
      id: 'c1',
      name: 'Henry D. Fahman',
      title: 'Chairman, President & Acting CFO',
      entity: 'Public Parent',
      email: 'info@philuxglobal.com',
      phone: '(714) 793-9227',
      roleSummary: 'Chairman and President facing capital structure gridlock; reachable via corporate office.',
      receptivityScore: 'high'
    },
    {
      id: 'c-phil-legal',
      name: 'Christopher Dieterich, Esq.',
      title: 'Securities Counsel (Dieterich & Associates Law Office)',
      entity: 'Legal Counsel',
      email: 'info@philuxglobal.com',
      phone: '(310) 312-6888',
      roleSummary: 'Longstanding securities and SEC disclosure counsel for Philux Global Group.',
      receptivityScore: 'moderate'
    }
  ];
  if (!phil.crm) phil.crm = { stage: 'outreach_sent', priority: 'critical', notes: [], activities: [] };
  // remove any existing note-next-phil
  phil.crm.notes = phil.crm.notes.filter(n => !n.id.startsWith('note-next-phil'));
  phil.crm.activities = phil.crm.activities.filter(a => !a.id.startsWith('act-next-phil'));
  phil.crm.notes.unshift({
    id: `note-next-phil-2`,
    date: '2026-10-05',
    author: 'Special Situations Research',
    text: 'Research verified next-in-line executive Tina T. Phan (Treasurer, Corporate Secretary & Managing Director, Philux Global Advisors) and Chairman Henry D. Fahman reachable via verified active domain philuxglobal.com (info@philuxglobal.com, (714) 793-9227). Outside legal counsel identified as Dieterich & Associates (Christopher Dieterich, Esq.). Personalized carve-out proposal dispatched to info@philuxglobal.com Attn: Tina T. Phan & Henry Fahman.'
  });
  phil.crm.activities.unshift({
    id: `act-next-phil-2`,
    date: '2026-10-05',
    type: 'email',
    summary: 'Dispatched personalized carve-out proposal to Tina T. Phan (Treasurer & Secretary) and Henry D. Fahman (Chairman & President) via info@philuxglobal.com.'
  });
  phil.crm.lastContactDate = '2026-10-05';
}

// 2. ZNOG
const znog = targets.find(t => t.ticker === 'ZNOG');
if (znog) {
  znog.primaryContact = {
    id: 'c-znog-dunn',
    name: 'Robert Dunn',
    title: 'Chief Executive Officer & Chairman of the Board',
    entity: 'Public Parent',
    email: 'dallas@zionoil.com',
    phone: '(214) 221-4610',
    roleSummary: 'Chief Executive Officer and Chairman of the Board leading corporate strategy, exploration operations, and capital formation following May 2026 executive succession.',
    receptivityScore: 'high'
  };
  znog.contacts = [
    znog.primaryContact,
    {
      id: 'c-znog-croswell',
      name: 'Michael B. Croswell Jr.',
      title: 'President & Chief Financial Officer',
      entity: 'Public Parent',
      email: 'dallas@zionoil.com',
      phone: '(214) 221-4610',
      roleSummary: 'President and CFO managing treasury, financial reporting, and SEC compliance.',
      receptivityScore: 'high'
    },
    {
      id: 'c-znog-avery',
      name: 'William H. Avery',
      title: 'Chief Legal Officer, General Counsel & Director',
      entity: 'Legal Counsel',
      email: 'dallas@zionoil.com',
      phone: '(214) 221-4610',
      roleSummary: 'Chief Legal Officer and General Counsel overseeing regulatory compliance, contracts, and drilling concessions.',
      receptivityScore: 'high'
    }
  ];
  if (!znog.crm) znog.crm = { stage: 'outreach_sent', priority: 'critical', notes: [], activities: [] };
  znog.crm.notes = znog.crm.notes.filter(n => !n.id.startsWith('note-next-znog'));
  znog.crm.activities = znog.crm.activities.filter(a => !a.id.startsWith('act-next-znog'));
  znog.crm.notes.unshift({
    id: `note-next-znog-2`,
    date: '2026-10-05',
    author: 'Special Situations Research',
    text: 'Research verified leadership succession: Founder John Brown passed away May 2026; Robert Dunn appointed CEO & Board Chairman, Michael B. Croswell Jr. serving as President & CFO, and William H. Avery serving as Chief Legal Officer & General Counsel. Direct executive correspondence routed to Dallas executive headquarters (dallas@zionoil.com, (214) 221-4610). Outside securities counsel: Gibson, Dunn & Crutcher LLP. Personalized drilling asset carve-out proposal dispatched to dallas@zionoil.com Attn: Robert Dunn & William Avery.'
  });
  znog.crm.activities.unshift({
    id: `act-next-znog-2`,
    date: '2026-10-05',
    type: 'email',
    summary: 'Dispatched personalized drilling rig carve-out proposal to Robert Dunn (CEO & Chairman) and William Avery (CLO & General Counsel) via dallas@zionoil.com.'
  });
  znog.crm.lastContactDate = '2026-10-05';
}

// 3. LADX
const ladx = targets.find(t => t.ticker === 'LADX');
if (ladx) {
  ladx.primaryContact = {
    id: 'c-ladx-bmc',
    name: 'BMC Group (Re: LadRX ABC Assignee)',
    title: 'Legal Liquidator & Claims Administrator for Assignee',
    entity: 'Legal Counsel',
    email: 'info@bmcgroup.com',
    phone: '(888) 909-0100',
    roleSummary: 'Designated legal assignee claims administrator managing LADRX, Assignment for the Benefit of Creditors, LLC liquidation of assets and creditor distributions under California law.',
    receptivityScore: 'high'
  };
  ladx.contacts = [
    ladx.primaryContact,
    {
      id: 'c-ladx-1',
      name: 'Stephen Snowdy',
      title: 'Former Chief Executive Officer (Resigned July 2025)',
      entity: 'Public Parent',
      email: 'info@bmcgroup.com',
      phone: '(310) 826-5648',
      roleSummary: 'Former CEO who resigned July 28, 2025 upon company entering California Assignment for Benefit of Creditors (ABC).',
      receptivityScore: 'moderate'
    }
  ];
  if (!ladx.crm) ladx.crm = { stage: 'outreach_sent', priority: 'critical', notes: [], activities: [] };
  ladx.crm.notes = ladx.crm.notes.filter(n => !n.id.startsWith('note-next-ladx'));
  ladx.crm.activities = ladx.crm.activities.filter(a => !a.id.startsWith('act-next-ladx'));
  ladx.crm.notes.unshift({
    id: `note-next-ladx-2`,
    date: '2026-10-05',
    author: 'Special Situations Research',
    text: 'Research verified corporate shutdown and liquidation status per Form 8-K: LadRx entered into a California General Assignment for the Benefit of Creditors (ABC) on July 28, 2025, assigning all assets to LADRX, Assignment for the Benefit of Creditors, LLC. All officers and directors (Stephen Snowdy, John Caloz) resigned. Designated legal liquidator and claims administrator is BMC Group (info@bmcgroup.com, (888) 909-0100, PO Box 90100, Los Angeles, CA 90009). Per protocol, institutional carve-out inquiry regarding Aldoxorubicin asset acquisition sent to BMC Group legal representation.'
  });
  ladx.crm.activities.unshift({
    id: `act-next-ladx-2`,
    date: '2026-10-05',
    type: 'email',
    summary: 'Dispatched formal asset carve-out acquisition inquiry to legal liquidator BMC Group (Assignee for LadRx ABC) via info@bmcgroup.com.'
  });
  ladx.crm.lastContactDate = '2026-10-05';
}

// 4. QPRC
const qprc = targets.find(t => t.ticker === 'QPRC');
if (qprc) {
  qprc.primaryContact = {
    id: 'c-qprc-scahill',
    name: 'Jon C. Scahill, Esq.',
    title: 'Chief Executive Officer, President & Acting CFO',
    entity: 'Public Parent',
    email: 'jscahill@qprc.com',
    phone: '(888) 743-7577',
    roleSummary: 'Patent attorney, CEO, President, and Acting CFO leading licensing strategies, litigation monetization, and corporate governance.',
    receptivityScore: 'high'
  };
  qprc.contacts = [
    qprc.primaryContact,
    {
      id: 'c-qprc-timothy',
      name: 'Timothy J. Scahill',
      title: 'Chief Technology Officer & Director',
      entity: 'Public Parent',
      email: 'jscahill@qprc.com',
      phone: '(888) 743-7577',
      roleSummary: 'CTO overseeing technical patent evaluations and semiconductor portfolio architecture.',
      receptivityScore: 'high'
    },
    {
      id: 'c-qprc-fabricant',
      name: 'Peter Fabricant, Esq.',
      title: 'Outside Patent Litigation & Escrow Counsel (Fabricant LLP)',
      entity: 'Legal Counsel',
      email: 'jscahill@qprc.com',
      phone: '(212) 257-5797',
      roleSummary: 'Lead patent litigation and waterfall escrow legal counsel for QPRC monetization portfolios.',
      receptivityScore: 'moderate'
    }
  ];
  if (!qprc.crm) qprc.crm = { stage: 'outreach_sent', priority: 'critical', notes: [], activities: [] };
  qprc.crm.notes = qprc.crm.notes.filter(n => !n.id.startsWith('note-next-qprc'));
  qprc.crm.activities = qprc.crm.activities.filter(a => !a.id.startsWith('act-next-qprc'));
  qprc.crm.notes.unshift({
    id: `note-next-qprc-2`,
    date: '2026-10-05',
    author: 'Special Situations Research',
    text: 'Research verified from Form 10-K and 10-Q that true CEO, President & Acting CFO is registered patent attorney Jon C. Scahill, Esq. (correcting earlier misidentified name). Next-in-line executive is Timothy J. Scahill (CTO). Outside litigation counsel is Fabricant LLP (Peter Fabricant). Direct verified corporate email is jscahill@qprc.com ((888) 743-7577). Tailored patent portfolio carve-out proposal dispatched to jscahill@qprc.com.'
  });
  qprc.crm.activities.unshift({
    id: `act-next-qprc-2`,
    date: '2026-10-05',
    type: 'email',
    summary: 'Dispatched personalized patent monetization carve-out proposal to Jon C. Scahill, Esq. (CEO & Acting CFO) via jscahill@qprc.com.'
  });
  qprc.crm.lastContactDate = '2026-10-05';
}

// 5. IQST
const iqst = targets.find(t => t.ticker === 'IQST');
if (iqst) {
  iqst.primaryContact = {
    id: 'c-iqst-quintana',
    name: 'Alvaro Quintana Cardona',
    title: 'Chief Operating Officer & Chief Financial Officer',
    entity: 'Public Parent',
    email: 'ir@iqstel.com',
    phone: '(954) 951-8191',
    roleSummary: 'Chief Operating Officer and Chief Financial Officer overseeing international wholesale telecommunications operations, financial audits, and capital markets strategy.',
    receptivityScore: 'high'
  };
  iqst.contacts = [
    iqst.primaryContact,
    {
      id: 'c1',
      name: 'Leandro Iglesias',
      title: 'Chief Executive Officer & Director',
      entity: 'Public Parent',
      email: 'ir@iqstel.com',
      phone: '(954) 951-8191',
      roleSummary: 'Founder and CEO driving corporate development, telecom infrastructure, and strategic partnerships.',
      receptivityScore: 'high'
    },
    {
      id: 'c-iqst-walfish',
      name: 'Ethan Walfish',
      title: 'Head of Investor Relations',
      entity: 'Public Parent',
      email: 'ir@iqstel.com',
      phone: '+1 (484) 847-7835',
      roleSummary: 'Executive liaison managing institutional investor dialogue and corporate announcements.',
      receptivityScore: 'high'
    },
    {
      id: 'c-iqst-legal',
      name: 'Scott Doney, Esq.',
      title: 'Securities Counsel (The Doney Law Firm)',
      entity: 'Legal Counsel',
      email: 'ir@iqstel.com',
      phone: '(702) 998-0500',
      roleSummary: 'Outside securities counsel representing iQSTEL in SEC registration statements and compliance.',
      receptivityScore: 'moderate'
    }
  ];
  if (!iqst.crm) iqst.crm = { stage: 'outreach_sent', priority: 'critical', notes: [], activities: [] };
  iqst.crm.notes = iqst.crm.notes.filter(n => !n.id.startsWith('note-next-iqst'));
  iqst.crm.activities = iqst.crm.activities.filter(a => !a.id.startsWith('act-next-iqst'));
  iqst.crm.notes.unshift({
    id: `note-next-iqst-2`,
    date: '2026-10-05',
    author: 'Special Situations Research',
    text: 'Research verified next-in-line C-Suite executive Alvaro Quintana Cardona (COO & CFO) managing operations and financial reporting alongside CEO Leandro Iglesias and IR Head Ethan Walfish. Direct executive correspondence routed to ir@iqstel.com ((954) 951-8191). Outside securities counsel: The Doney Law Firm (Scott Doney, Esq.). Personalized telecom wholesale carve-out proposal dispatched to ir@iqstel.com Attn: Alvaro Quintana & Leandro Iglesias.'
  });
  iqst.crm.activities.unshift({
    id: `act-next-iqst-2`,
    date: '2026-10-05',
    type: 'email',
    summary: 'Dispatched personalized wholesale carrier carve-out proposal to Alvaro Quintana Cardona (COO & CFO) and Leandro Iglesias (CEO) via ir@iqstel.com.'
  });
  iqst.crm.lastContactDate = '2026-10-05';
}

const newJsonStr = JSON.stringify(targets, null, 2);
const updatedContent = targetsTs.replace(
  /const rawTargets: TargetCompany\[\] = [\s\S]*?;\s*export const INITIAL_TARGETS/,
  `const rawTargets: TargetCompany[] = ${newJsonStr};\n\nexport const INITIAL_TARGETS`
);

fs.writeFileSync(targetsTsPath, updatedContent, 'utf8');
console.log('✓ Successfully updated targets.ts with conforming TypeScript types.');

const storePath = '/tmp/asset_liberator_targets_store.json';
fs.writeFileSync(storePath, JSON.stringify(targets, null, 2), 'utf8');
console.log('✓ Successfully synchronized /tmp/asset_liberator_targets_store.json');
