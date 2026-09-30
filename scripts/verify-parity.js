/**
 * Automated Prebuild Parity & Verification Guard
 * Enforces data accuracy, dual filing existence, and synthetic contact elimination.
 */

const fs = require('fs');
const path = require('path');

const targetsTs = fs.readFileSync(path.join(__dirname, '../lib/data/targets.ts'), 'utf8');
const jsonMatch = targetsTs.match(/const rawTargets: TargetCompany\[\] = ([\s\S]*?);\s*export const INITIAL_TARGETS/);

if (!jsonMatch) {
  console.error('FATAL [prebuild]: Failed to extract rawTargets from targets.ts');
  process.exit(1);
}

const targets = JSON.parse(jsonMatch[1]);

if (targets.length !== 18) {
  console.error(`FATAL [prebuild]: Expected exactly 18 targets, found ${targets.length}`);
  process.exit(1);
}

// Check dual filing availability
for (const t of targets) {
  if (!t.latestFilingUrl || !t.latestFilingType || !t.latestFilingDate) {
    console.error(`FATAL [prebuild]: Missing latest filing on ${t.ticker}`);
    process.exit(1);
  }
  if (!t.baseline10KFilingUrl || !t.baseline10KFilingType || !t.baseline10KFilingDate) {
    console.error(`FATAL [prebuild]: Missing baseline 10-K filing on ${t.ticker}`);
    process.exit(1);
  }
}

// Check contact validity
const BANNED_DOMAINS = [
  'creditagency-llc.com', 'securedtrust-cap.com', 'solarcreditpartners.com',
  'commercialbank-west.com', 'apexdistressed.com', 'bio-restructuring.com',
  'energy-securedtrust.com', 'patentcreditor-llc.com', 'healthcredit-partners.com',
  'aerocredit-llc.com', 'greentech-secured.com', 'firstcapital-sec.com', 'ladrxcorp.com'
];

for (const t of targets) {
  for (const c of t.contacts) {
    if (c.entity === 'Senior Creditor') {
      console.error(`FATAL [prebuild]: Synthetic creditor contact detected on ${t.ticker}: ${c.name}`);
      process.exit(1);
    }
    for (const b of BANNED_DOMAINS) {
      if (c.email && c.email.includes(b)) {
        console.error(`FATAL [prebuild]: Non-resolving contact domain detected on ${t.ticker}: ${c.email}`);
        process.exit(1);
      }
    }
  }
}

// Financial assertions
const rwax = targets.find(t => t.ticker === 'RWAX');
if (!rwax || rwax.asset.annualRevenue !== 0) {
  console.error('FATAL [prebuild]: RWAX revenue assertion failed');
  process.exit(1);
}

const nlst = targets.find(t => t.ticker === 'NLST');
if (!nlst || nlst.asset.annualRevenue < 400000000 || nlst.stockPrice < 5.0) {
  console.error('FATAL [prebuild]: NLST annualized revenue/price assertion failed');
  process.exit(1);
}

console.log('✓ [prebuild]: Parity & accuracy assertion passed for all 18 targets.');
