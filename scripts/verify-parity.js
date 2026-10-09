/**
 * Automated Prebuild Parity & Thesis Verification Guard
 * Enforces thesis gates, sourced provenance, ZNOG/NLST corrections, and score discrimination.
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

// Seed set is a floor, not a ceiling: new candidates arrive via the ingestion pipeline
// (data/candidates.json), so the seed list only has to keep the original records.
const SEED_FLOOR = 18;
if (targets.length < SEED_FLOOR) {
  console.error(`FATAL [prebuild]: Seed records were dropped: expected at least ${SEED_FLOOR}, found ${targets.length}`);
  process.exit(1);
}

// 1. Dual filing availability & Sourced Provenance (No analyst_estimate)
for (const t of targets) {
  if (!t.latestFilingUrl || !t.latestFilingType || !t.latestFilingDate) {
    console.error(`FATAL [prebuild]: Missing latest filing on ${t.ticker}`);
    process.exit(1);
  }
  if (!t.baseline10KFilingUrl || !t.baseline10KFilingType || !t.baseline10KFilingDate) {
    console.error(`FATAL [prebuild]: Missing baseline 10-K filing on ${t.ticker}`);
    process.exit(1);
  }
  if (t.dataProvenance === 'analyst_estimate') {
    console.error(`FATAL [prebuild]: Unverified dataProvenance 'analyst_estimate' detected on ${t.ticker}. Sourced receipts required.`);
    process.exit(1);
  }
}

// 2. Three Hard Gates Verification
for (const t of targets) {
  if (!t.threeGates || !t.threeGates.gate1_parentDistress || !t.threeGates.gate2_separableValue || !t.threeGates.gate3_controlPoint) {
    console.error(`FATAL [prebuild]: Missing Three Hard Gates evaluation on ${t.ticker}`);
    process.exit(1);
  }
  if (t.tier === 'verified' && t.threeGates.overallGate !== 'passed_all_3') {
    console.error(`FATAL [prebuild]: Verified tier target ${t.ticker} did not pass all 3 hard gates`);
    process.exit(1);
  }
}

// 3. Forcing Event / Catalyst Clock Verification
for (const t of targets) {
  if (!t.forcingEvent || typeof t.forcingEvent.daysRemaining !== 'number') {
    console.error(`FATAL [prebuild]: Missing forcing event catalyst clock on ${t.ticker}`);
    process.exit(1);
  }
  if (t.tier === 'verified' && t.forcingEvent.daysRemaining > 90) {
    console.error(`FATAL [prebuild]: Verified target ${t.ticker} has catalyst clock > 90d (must be inside 90d active window)`);
    process.exit(1);
  }
}

// 4. Contact validity
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

// 5. Zion Oil & Gas (ZNOG) Sourced Pre-Revenue Assertion
const znog = targets.find(t => t.ticker === 'ZNOG');
if (!znog || znog.asset.annualRevenue !== 0) {
  console.error(`FATAL [prebuild]: ZNOG revenue assertion failed (expected $0 pre-revenue explorer, found $${znog?.asset.annualRevenue})`);
  process.exit(1);
}

// 6. Current Filers Reclassification & Disqualification Assertion
const currentFilerTickers = ['NLST', 'NWBO', 'CYDY', 'IQST'];
for (const ticker of currentFilerTickers) {
  const t = targets.find(item => item.ticker === ticker);
  if (!t || t.tier !== 'disqualified' || !t.disqualificationReason) {
    console.error(`FATAL [prebuild]: Current filer ${ticker} must be reclassified to tier 'disqualified' with clear reason`);
    process.exit(1);
  }
}

// 7. Score Discrimination Assertion (Wide Spread, not flat 72-97)
const rois = targets.map(t => t.scores.rollupOpportunityIndex);
const minRoi = Math.min(...rois);
const maxRoi = Math.max(...rois);
const spread = maxRoi - minRoi;

if (spread < 50) {
  console.error(`FATAL [prebuild]: Scoring failed to discriminate. Spread is only ${spread} points (expected >= 50 spread).`);
  process.exit(1);
}

console.log(`✓ [prebuild]: Thesis, Gates & Recalibrated Parity assertions passed.`);
console.log(`  - Targets: ${targets.length}`);
console.log(`  - Score Spread: Min ${minRoi} to Max ${maxRoi} (Spread: ${spread} pts)`);
console.log(`  - Disqualified Current Filers: ${currentFilerTickers.join(', ')}`);
console.log(`  - ZNOG Pre-Revenue Verified: $${znog.asset.annualRevenue}`);
