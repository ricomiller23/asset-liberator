import React, { useState } from "react";
import { TargetCompany, CrmStage, PriorityLevel } from "@/lib/types";
import { 
  X, 
  Building2, 
  AlertTriangle, 
  FileText, 
  Phone, 
  Mail, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Send, 
  Plus, 
  DollarSign, 
  Scale, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Copy,
  Check
} from "lucide-react";

interface TargetDrawerProps {
  target: TargetCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (targetId: string, stage: CrmStage, priority?: PriorityLevel) => void;
  onAddNote: (targetId: string, text: string) => void;
  onOpenPlaybook: (target: TargetCompany) => void;
  onOpenOutreach: (target: TargetCompany) => void;
}

export const TargetDrawer: React.FC<TargetDrawerProps> = ({
  target,
  isOpen,
  onClose,
  onUpdateStage,
  onAddNote,
  onOpenPlaybook,
  onOpenOutreach,
}) => {
  const [newNote, setNewNote] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen || !target) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(target.id, newNote.trim());
    setNewNote("");
  };

  const stages: { id: CrmStage; label: string }[] = [
    { id: "new", label: "New Lead" },
    { id: "outreach_sent", label: "Outreach Sent" },
    { id: "in_dialogue", label: "In Dialogue" },
    { id: "nda_signed", label: "NDA Signed" },
    { id: "diligence", label: "Due Diligence" },
    { id: "term_sheet", label: "Term Sheet Issued" },
    { id: "foreclosure_pending", label: "Foreclosure Scheduled" },
    { id: "closed", label: "Closed / Rolled Into Shell" },
    { id: "passed", label: "Passed / Dead" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-3xl border-l border-stone-800 bg-stone-950 p-6 shadow-2xl flex flex-col h-full overflow-hidden text-stone-200">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-800 pb-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-lg font-bold text-white bg-stone-850 px-2.5 py-1 rounded-lg border border-stone-750">
                  {target.ticker}
                </span>
                <h2 className="text-lg font-bold text-white">{target.name}</h2>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20">
                  ROI {target.scores.rollupOpportunityIndex}/100
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {target.sector} • CIK {target.cik} • HQ: {target.headquarters} • Market Cap: $${(target.marketCap / 1000).toFixed(0)}k
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-stone-800 bg-stone-900 p-2 text-stone-400 hover:text-white hover:bg-stone-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Action Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-stone-850 text-xs">
            {/* Stage Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-stone-400 font-mono text-[11px]">CRM STAGE:</span>
              <select
                value={target.crm.stage}
                onChange={(e) => onUpdateStage(target.id, e.target.value as CrmStage)}
                className="rounded-lg border border-stone-750 bg-stone-900 px-3 py-1.5 text-xs font-semibold text-emerald-400 focus:border-emerald-500 focus:outline-none"
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenPlaybook(target)}
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
              >
                Deal Playbook & LOI
              </button>
              <button
                onClick={() => onOpenOutreach(target)}
                className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 font-bold text-stone-950 hover:bg-emerald-400 transition"
              >
                <Send className="h-3 w-3" />
                <span>Launch Outreach</span>
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6 text-xs">
            
            {/* 1. The Operating Asset (The Gold) */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Building2 className="h-4 w-4" />
                  <span>The Operating Business: {target.asset.subsidiaryName}</span>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold uppercase">
                  {target.asset.commercialReadiness.replace("_", " ")}
                </span>
              </div>

              <p className="text-stone-300 leading-relaxed text-xs">
                {target.asset.businessSummary}
              </p>

              {/* Financial Metrics */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
                <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-2.5">
                  <div className="text-[10px] text-stone-500">ANNUAL REVENUE</div>
                  <div className="text-sm font-bold text-emerald-400">
                    $${(target.asset.annualRevenue / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-2.5">
                  <div className="text-[10px] text-stone-500">GROSS MARGIN</div>
                  <div className="text-sm font-bold text-emerald-300">
                    {target.asset.grossMarginPct}%
                  </div>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-2.5">
                  <div className="text-[10px] text-stone-500">EBITDA</div>
                  <div className="text-sm font-bold text-stone-200">
                    $${(target.asset.ebitda / 1000).toFixed(0)}k
                  </div>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-2.5">
                  <div className="text-[10px] text-stone-500">HEADCOUNT</div>
                  <div className="text-sm font-bold text-stone-200">
                    {target.asset.employees} Engineers/Staff
                  </div>
                </div>
              </div>

              {/* Commercial Validation & Facilities */}
              <div className="mt-3 space-y-2 border-t border-emerald-500/15 pt-2.5 text-stone-300">
                <div>
                  <strong className="text-emerald-400 font-mono text-[11px]">KEY CLIENT CONTRACTS: </strong>
                  <span>{target.asset.keyClients.join(", ")}</span>
                </div>
                <div>
                  <strong className="text-emerald-400 font-mono text-[11px]">FACILITY & FOOTPRINT: </strong>
                  <span>{target.asset.facilities}</span>
                </div>
                <div>
                  <strong className="text-emerald-400 font-mono text-[11px]">INTELLECTUAL PROPERTY ({target.asset.patentsCount} PATENTS): </strong>
                  <span>{target.asset.ipDetails}</span>
                </div>
              </div>
            </div>

            {/* 2. Public Vehicle Failure Mode & Toxic Debt */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-4">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-2 mb-3">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Public Vehicle Failure Mode & Toxic Debt Forensics</span>
                </div>
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono text-rose-300 font-bold uppercase">
                  PARALYSIS LEVEL: CRITICAL
                </span>
              </div>

              <p className="text-stone-300 leading-relaxed text-xs">
                {target.vehicleDistress.statusSummary}
              </p>

              {/* Forensic Details */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-center">
                <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-2.5">
                  <div className="text-[10px] text-stone-500">TOXIC DEBT OVERHANG</div>
                  <div className="text-sm font-bold text-rose-400">
                    $${(target.vehicleDistress.toxicDebtBalance / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-2.5">
                  <div className="text-[10px] text-stone-500">AUDITOR STATUS</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">
                    {target.vehicleDistress.lastAuditorName}
                  </div>
                  <div className="text-[9px] text-stone-500">({target.vehicleDistress.auditorStatus.replace("_", " ")})</div>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-2.5">
                  <div className="text-[10px] text-stone-500">CONVERTIBLE RATINGS</div>
                  <div className="text-xs font-bold text-rose-300 mt-0.5">
                    {target.vehicleDistress.convertibleDiscountPct}% Disc. / {target.vehicleDistress.defaultInterestRatePct}% Int.
                  </div>
                </div>
              </div>

              {/* SEC Triggers */}
              <div className="mt-3 pt-2.5 border-t border-rose-500/15">
                <span className="text-[11px] font-mono text-rose-300 font-bold">SEC & REGULATORY TRIGGERS:</span>
                <ul className="mt-1.5 list-disc list-inside space-y-1 text-stone-300">
                  {target.vehicleDistress.secTriggers.map((t, idx) => (
                    <li key={idx} className="font-mono text-[11px]">{t}</li>
                  ))}
                </ul>
                <div className="mt-2 text-[11px] text-stone-400 font-mono">
                  Identified Toxic Noteholders: <span className="text-stone-300">{target.vehicleDistress.toxicLenders.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* 3. Extraction & Clean Shell Rollup Strategy */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/10 p-4">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                  <Scale className="h-4 w-4" />
                  <span>Carve-Out Mechanics & UCC Lien Records</span>
                </div>
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold uppercase">
                  {target.extractionFeasibility.cleanShellFit} SHELL FIT
                </span>
              </div>

              <div className="space-y-2 text-stone-300 text-xs">
                <p>
                  <strong className="text-cyan-400 font-mono">RECOMMENDED PLAYBOOK: </strong>
                  <span className="capitalize">{target.extractionFeasibility.recommendedPlaybook.replace(/_/g, " ")}</span>
                </p>
                <p>
                  <strong className="text-cyan-400 font-mono">SENIOR SECURED HOLDER: </strong>
                  <span>{target.extractionFeasibility.seniorSecuredHolder}</span>
                </p>
                <p>
                  <strong className="text-cyan-400 font-mono">UCC-1 LIEN RECORD: </strong>
                  <span className="font-mono text-stone-300">{target.extractionFeasibility.uccLienJurisdiction} ({target.extractionFeasibility.uccLienStatus})</span>
                </p>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-cyan-500/20 text-cyan-200 mt-2 font-mono text-[11px]">
                  {target.extractionFeasibility.rationale}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between font-mono bg-stone-950 p-3 rounded-xl border border-stone-850">
                <div>
                  <span className="text-stone-500 text-[10px]">SENIOR NOTE FACE VALUE</span>
                  <div className="text-xs font-bold text-stone-200">
                    $${(target.extractionFeasibility.seniorSecuredDebtAmount / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">DISCOUNT POTENTIAL</span>
                  <div className="text-xs font-bold text-cyan-400">
                    {target.extractionFeasibility.estimatedBuyoutDiscountPct}% Off
                  </div>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">EST. CASH BUYOUT COST</span>
                  <div className="text-xs font-bold text-emerald-400">
                    $${(target.extractionFeasibility.estimatedAcquisitionCost / 1000).toFixed(0)}k Cash
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Complete Contacts Directory */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
                <span className="font-bold text-white text-sm">Key Management & Creditor Dossier ({target.contacts.length})</span>
                <span className="text-[10px] text-stone-500 font-mono">DIRECT OUTREACH TARGETS</span>
              </div>

              <div className="space-y-3">
                {target.contacts.map((c) => (
                  <div key={c.id} className="rounded-xl border border-stone-800 bg-stone-950 p-3.5 flex flex-col justify-between space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-xs">{c.name}</span>
                          <span className="rounded bg-stone-850 px-1.5 py-0.2 text-[9px] font-mono text-stone-400 border border-stone-750">
                            {c.entity}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-400 font-medium">{c.title}</p>
                      </div>

                      <span className={`rounded px-2 py-0.5 text-[9px] font-mono font-bold ${
                        c.receptivityScore === "very_high"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-cyan-500/20 text-cyan-300"
                      }`}>
                        {c.receptivityScore.replace("_", " ").toUpperCase()} RECEPTIVITY
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-400 leading-snug">
                      {c.roleSummary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-850 text-[11px] font-mono text-stone-300">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="h-3 w-3 text-stone-500" />
                        <a href={`mailto:${c.email}`} className="hover:text-emerald-400 underline">{c.email}</a>
                        <button onClick={() => handleCopy(c.email, c.id + "-email")} className="text-stone-500 hover:text-stone-300">
                          {copiedText === c.id + "-email" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <Phone className="h-3 w-3 text-stone-500" />
                        <a href={`tel:${c.phone.replace(/[^0-9]/g, "")}`} className="hover:text-emerald-400">{c.phone}</a>
                      </div>

                      {c.linkedIn && (
                        <div className="flex items-center space-x-1 text-cyan-400">
                          <Globe className="h-3 w-3" />
                          <span className="truncate max-w-[140px]">{c.linkedIn}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Built-in CRM Activity & Notes Feed */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
                <span className="font-bold text-white text-sm">CRM Activity Log & Notes</span>
                <span className="text-[10px] text-stone-500 font-mono">{target.crm.notes.length} Notes Logged</span>
              </div>

              {/* Add Note Input */}
              <form onSubmit={handleNoteSubmit} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Log a call, diligence note, or meeting summary..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-1 rounded-xl bg-stone-800 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-750 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Note</span>
                  </button>
                </div>
              </form>

              {/* Activity & Notes Stream */}
              <div className="space-y-2.5">
                {target.crm.notes.map((n) => (
                  <div key={n.id} className="rounded-xl border border-stone-850 bg-stone-950 p-3 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono mb-1">
                      <span className="text-emerald-400 font-bold">{n.author}</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="text-stone-300 leading-relaxed">{n.text}</p>
                  </div>
                ))}

                {target.crm.activities.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg bg-stone-950/60 px-3 py-2 text-[11px] border border-stone-850">
                    <span className="text-stone-400">
                      <strong className="text-stone-300 font-mono uppercase">[{a.type}]</strong> {a.summary}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">{a.date}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
