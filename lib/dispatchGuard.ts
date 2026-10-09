import fs from "fs";
import path from "path";

export interface GuardCheckResult {
  allowed: boolean;
  reason?: string;
}

export function canSendEmail(to: string): GuardCheckResult {
  const email = to.trim().toLowerCase();
  const domain = email.includes("@") ? email.split("@")[1] : "";

  // 1. Check Suppression List
  try {
    const suppPath = path.resolve(process.cwd(), "data/suppression_list.json");
    if (fs.existsSync(suppPath)) {
      const suppData = JSON.parse(fs.readFileSync(suppPath, "utf8"));
      const emails = (suppData.suppressedEmails || []).map((e: string) => e.toLowerCase());
      const domains = (suppData.suppressedDomains || []).map((d: string) => d.toLowerCase());

      if (emails.includes(email)) {
        return { allowed: false, reason: `PERMANENTLY SUPPRESSED: ${email} is on global opt-out list.` };
      }
      if (domains.includes(domain)) {
        return { allowed: false, reason: `PERMANENTLY SUPPRESSED DOMAIN: @${domain} has requested global firm-wide stop.` };
      }
    }
  } catch (err) {
    console.error("Error reading suppression_list.json:", err);
  }

  // 2. Check Dispatched Registry (Deduplication)
  try {
    const regPath = path.resolve(process.cwd(), "data/dispatched_recipients_registry.json");
    if (fs.existsSync(regPath)) {
      const regData = JSON.parse(fs.readFileSync(regPath, "utf8"));
      if (regData.recipients && regData.recipients[email]) {
        const record = regData.recipients[email];
        return {
          allowed: false,
          reason: `DEDUPLICATION BLOCK: ${email} already received ${record.count} email(s) on ${record.lastSent}. Duplicate transmission forbidden.`
        };
      }
    }
  } catch (err) {
    console.error("Error reading dispatched_recipients_registry.json:", err);
  }

  return { allowed: true };
}

export function registerSentEmail(to: string, subject: string, ticker?: string): void {
  const email = to.trim().toLowerCase();
  try {
    const regPath = path.resolve(process.cwd(), "data/dispatched_recipients_registry.json");
    let regData: any = { updatedAt: new Date().toISOString(), recipients: {} };
    if (fs.existsSync(regPath)) {
      regData = JSON.parse(fs.readFileSync(regPath, "utf8"));
    }
    if (!regData.recipients) regData.recipients = {};

    const today = new Date().toISOString().slice(0, 10);
    if (!regData.recipients[email]) {
      regData.recipients[email] = {
        email,
        firstSent: today,
        lastSent: today,
        count: 1,
        ticker: ticker || "UNKNOWN",
        subjects: [subject]
      };
    } else {
      regData.recipients[email].lastSent = today;
      regData.recipients[email].count++;
      if (!regData.recipients[email].subjects.includes(subject)) {
        regData.recipients[email].subjects.push(subject);
      }
    }
    regData.totalUniqueRecipients = Object.keys(regData.recipients).length;
    regData.updatedAt = new Date().toISOString();

    fs.writeFileSync(regPath, JSON.stringify(regData, null, 2), "utf8");
  } catch (err) {
    console.error("Error updating dispatched_recipients_registry.json:", err);
  }
}
