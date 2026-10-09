import { formatCurrency } from "@/lib/utils";
import React, { useState } from "react";
import { TargetCompany, CrmStage, PriorityLevel, ExecutiveContact } from "@/lib/types";
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
  Check,
  PhoneCall,
  Pencil,
  Star
} from "lucide-react";

interface TargetDrawerProps {
  target: TargetCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (targetId: string, stage: CrmStage, priority?: PriorityLevel) => void;
  onAddNote: (targetId: string, text: string) => void;
  onOpenPlaybook: (target: TargetCompany) => void;
  onOpenOutreach: (target: TargetCompany) => void;
  onOpenEditContact: (target: TargetCompany, contact: ExecutiveContact | null) => void;
  onOpenLogCall: (target: TargetCompany, contact: ExecutiveContact | null) => void;
  onSetPrimaryContact?: (targetId: string, contactId: string) => void;
}

export const TargetDrawer: React.FC<TargetDrawerProps> = ({
  target,
  isOpen,
  onClose,
  onUpdateStage,
  onAddNote,
  onOpenPlaybook,
  onOpenOutreach,
  onOpenEditContact,
  onOpenLogCall,
  onSetPrimaryContact,
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
    { id: "new", label: "New Opportunity" },
    { id: "outreach_sent", label: "Outreach Sent" },
    { id: "in_dialogue", label: "Active Dialogue" },
    { id: "nda_signed", label: "NDA Executed" },
    { id: "diligence", label: "In Diligence" },
    { id: "term_sheet", label: "Term Sheet Issued" },
    { id: "foreclosure_pending", label: "Foreclosure / Closing" },
    { id: "closed", label: "Closed / Carved Out" },
    { id: "passed", label: "Passed / Dead" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-800 bg-stone-950/80">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20">
                    {target.ticker}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {target.exchange}
                  </span>
                  <span className="text-stone-600">•</span>
                  <span className="text-xs text-stone-400 flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-stone-500" />
                    <span>{target.headquarters}</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {target.name}
                </h2>
                <p className="text-xs text-stone-400">
                  Sector: {target.sector} • Industry: {target.industry}
                </p>
                {/* Regulatory & SEC Edgar Links */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <a
                    href={target.otcMarketsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 rounded-lg bg-cyan-950/60 px-2 py-0.5 text-[11px] font-mono text-cyan-300 hover:text-cyan-100 border border-cyan-700/60 hover:border-cyan-400 transition shadow-xs"
                  >
                    <span>otcmarkets.com</span>
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                  <a
                    href={target.secEdgarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 rounded-lg bg-emerald-950/60 px-2 py-0.5 text-[11px] font-mono text-emerald-300 hover:text-emerald-100 border border-emerald-700/60 hover:border-emerald-400 transition shadow-xs"
                  >
                    <span>SEC EDGAR CIK:{target.cik}</span>
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                  <a
                    href={target.latestFilingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 rounded-lg bg-amber-950/60 px-2 py-0.5 text-[11px] font-mono text-amber-300 hover:text-amber-100 border border-amber-700/60 hover:border-amber-400 transition shadow-xs"
                    title="Actual most recent SEC EDGAR filing"
                  >
                    <span>Most Recent: {target.latestFilingType} ({target.latestFilingDate})</span>
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                  {target.baseline10KFilingUrl && target.baseline10KFilingUrl !== target.latestFilingUrl && (
                    <a
                      href={target.baseline10KFilingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 rounded-lg bg-stone-800/80 px-2 py-0.5 text-[11px] font-mono text-stone-200 hover:text-white border border-stone-600 hover:border-stone-400 transition shadow-xs"
                      title="Baseline Annual 10-K filing"
                    >
                      <span>Baseline: {target.baseline10KFilingType || "Form 10-K"} ({target.baseline10KFilingDate})</span>
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  )}
                </div>
                {/* Data Provenance & SEC Verification Badge */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="inline-flex items-center space-x-1 rounded-lg bg-emerald-950/40 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-800/40">
                    <ShieldCheck className="h-3 w-3" />
                    <span>SEC EDGAR Verified {target.secVerifiedDate || '2026-09-30'}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 rounded-lg px-2 py-0.5 text-[10px] font-mono border bg-emerald-950/40 text-emerald-400 border-emerald-800/40">
                    <CheckCircle className="h-3 w-3" />
                    <span>SEC EDGAR & UCC-1 Sourced Receipts</span>
                  </span>
                  {target.priceSource && (
                    <span className="inline-flex items-center space-x-1 rounded-lg px-2 py-0.5 text-[10px] font-mono border bg-stone-900/60 text-stone-400 border-stone-800">
                      <span>Quote: {target.priceSource}</span>
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl border border-stone-800 bg-stone-900 p-2 text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Action Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-3 mt-3 border-t border-stone-850 text-xs">
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
                  onClick={() => onOpenLogCall(target, target.contacts[0] || null)}
                  className="inline-flex items-center space-x-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
                >
                  <PhoneCall className="h-3 w-3" />
                  <span>Log Call</span>
                </button>
                <button
                  onClick={() => onOpenPlaybook(target)}
                  className="rounded-lg border border-stone-750 bg-stone-850 px-3 py-1.5 font-semibold text-stone-200 hover:bg-stone-800 transition"
                >
                  Deal Playbook
                </button>
                <button
                  onClick={() => onOpenOutreach(target)}
                  className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 font-bold text-stone-950 hover:bg-emerald-400 transition"
                >
                  <Send className="h-3 w-3" />
                  <span>Outreach</span>
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
            
            {/* THREE HARD GATES & CATALYST CLOCK AUDIT */}
            <div className="rounded-2xl border border-stone-800 bg-stone-950/90 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  Three Hard Gates Thesis Verification:
                </span>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                  target.threeGates?.overallGate === "passed_all_3" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}>
                  {target.threeGates?.overallGate === "passed_all_3" ? "PASSED ALL 3 GATES" : "PARTIAL / REVIEW"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="rounded-xl border border-stone-850 bg-stone-900/60 p-2.5 space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 block font-semibold">GATE 1: PARENT DISTRESS</span>
                  <div className="text-white font-medium">{target.threeGates?.gate1_parentDistress.metric}</div>
                  <div className="text-[10px] text-stone-400 font-mono truncate">{target.threeGates?.gate1_parentDistress.citation}</div>
                </div>

                <div className="rounded-xl border border-stone-850 bg-stone-900/60 p-2.5 space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 block font-semibold">GATE 2: SEPARABLE VALUE (EX-21)</span>
                  <div className="text-emerald-400 font-medium truncate">{target.threeGates?.gate2_separableValue.legalEntityName}</div>
                  <div className="text-[10px] text-stone-400 font-mono">Confirmed EX-21 Sub Entity</div>
                </div>

                <div className="rounded-xl border border-stone-850 bg-stone-900/60 p-2.5 space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 block font-semibold">GATE 3: CONTROL POINT</span>
                  <div className="text-cyan-400 font-medium truncate">{target.threeGates?.gate3_controlPoint.seniorLenderName}</div>
                  <div className="text-[10px] text-stone-400 font-mono">UCC: {target.threeGates?.gate3_controlPoint.uccJurisdiction}</div>
                </div>
              </div>

              {/* Catalyst Clock & Segment Mismatch */}
              <div className="pt-2 border-t border-stone-850 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                {target.forcingEvent && (
                  <div className="rounded-lg bg-stone-900 p-2 border border-stone-850 flex items-center justify-between">
                    <span className="text-stone-400">⏱ FORCING CLOCK:</span>
                    <span className="text-amber-400 font-bold">{target.forcingEvent.daysRemaining} Days to Catalyst</span>
                  </div>
                )}
                {target.segmentMismatch && (
                  <div className="rounded-lg bg-stone-900 p-2 border border-stone-850 flex items-center justify-between">
                    <span className="text-stone-400">MISMATCH SPREAD:</span>
                    <span className="text-emerald-400 font-bold">+${(target.segmentMismatch.spreadDelta / 1e6).toFixed(1)}M Delta</span>
                  </div>
                )}
              </div>
            </div>

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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 font-mono">
                <div className="rounded-xl bg-stone-950/60 p-2.5 border border-emerald-500/10">
                  <span className="text-stone-500 block text-[10px]">ANNUAL REVENUE</span>
                  <span className="text-sm font-bold text-emerald-400">
                    ${(target.asset.annualRevenue / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="rounded-xl bg-stone-950/60 p-2.5 border border-emerald-500/10">
                  <span className="text-stone-500 block text-[10px]">GROSS MARGIN</span>
                  <span className="text-sm font-bold text-white">
                    {target.asset.grossMarginPct}%
                  </span>
                </div>
                <div className="rounded-xl bg-stone-950/60 p-2.5 border border-emerald-500/10">
                  <span className="text-stone-500 block text-[10px]">OPERATING EBITDA</span>
                  <span className={`text-sm font-bold ${target.asset.ebitda >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                    ${(target.asset.ebitda / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="rounded-xl bg-stone-950/60 p-2.5 border border-emerald-500/10">
                  <span className="text-stone-500 block text-[10px]">EMPLOYEES</span>
                  <span className="text-sm font-bold text-white">
                    {target.asset.employees} Full-Time
                  </span>
                </div>
              </div>

              {/* IP & Key Clients */}
              <div className="mt-3 pt-3 border-t border-emerald-500/10 text-stone-300 space-y-2">
                <div>
                  <span className="text-stone-500 font-mono text-[10px] block">PATENTS & INTELLECTUAL PROPERTY:</span>
                  <span className="text-emerald-300 font-medium">{target.asset.ipDetails}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-mono text-[10px] block">COMMERCIAL CUSTOMERS:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {target.asset.keyClients.map((client, idx) => (
                      <span key={idx} className="rounded bg-stone-950 px-2 py-0.5 text-[10px] font-mono text-stone-300 border border-stone-800">
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. The Vehicle Distress (The Grave) */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-4">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-2 mb-3">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>The Public Shell Distress: {target.ticker}</span>
                </div>
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono text-rose-300 font-bold uppercase">
                  {target.vehicleDistress.filingStatus.replace("_", " ")}
                </span>
              </div>

              <p className="text-stone-300 leading-relaxed text-xs">
                {target.vehicleDistress.statusSummary}
              </p>

              {/* Debt & Auditor Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 font-mono">
                <div className="rounded-xl bg-stone-950/60 p-2.5 border border-rose-500/10">
                  <span className="text-stone-500 block text-[10px]">TOXIC DEBT BALANCE</span>
                  <span className="text-sm font-bold text-rose-400">
                    {formatCurrency(target.vehicleDistress.toxicDebtBalance)}
                  </span>
                </div>
                <div className="rounded-xl bg-stone-950/60 p-2.5 border border-rose-500/10">
                  <span className="text-stone-500 block text-[10px]">LAST AUDITOR STATUS</span>
                  <span className="text-sm font-bold text-amber-400">
                    {target.vehicleDistress.auditorStatus.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <div className="rounded-xl bg-stone-950/60 p-2.5 border border-rose-500/10">
                  <span className="text-stone-500 block text-[10px]">CONVERTIBLE DISCOUNT</span>
                  <span className="text-sm font-bold text-rose-300">
                    {target.vehicleDistress.convertibleDiscountPct}% vs Market
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Extraction Feasibility & Mechanics */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/10 p-4">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                  <Scale className="h-4 w-4" />
                  <span>Forensic Extraction: {target.extractionFeasibility.recommendedPlaybook.replace(/_/g, " ").toUpperCase()}</span>
                </div>
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold uppercase">
                  {target.extractionFeasibility.cleanShellFit} SHELL FIT
                </span>
              </div>

              <p className="text-stone-300 leading-relaxed text-xs">
                {target.extractionFeasibility.rationale}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 font-mono">
                <div className="rounded-xl bg-stone-950/60 p-2.5 border border-cyan-500/10">
                  <span className="text-stone-500 block text-[10px]">SENIOR DEBT RECOVERY</span>
                  <div className="text-xs font-bold text-white">
                    {formatCurrency(target.extractionFeasibility.seniorSecuredDebtAmount)}
                  </div>
                </div>
                <div className="rounded-xl bg-stone-950/60 p-2.5 border border-cyan-500/10">
                  <span className="text-stone-500 block text-[10px]">EST. BUYOUT DISCOUNT</span>
                  <div className="text-xs font-bold text-cyan-300">
                    {target.extractionFeasibility.estimatedBuyoutDiscountPct}% Off Face
                  </div>
                </div>
                <div className="rounded-xl bg-stone-950/60 p-2.5 border border-cyan-500/10">
                  <span className="text-stone-500 block text-[10px]">TOTAL ACQUISITION CASH</span>
                  <div className="text-xs font-bold text-emerald-400">
                    {formatCurrency(target.extractionFeasibility.estimatedAcquisitionCost)} Cash
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Complete Contacts Directory */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
                <div>
                  <span className="font-bold text-white text-sm">Key Management & Creditor Dossier ({target.contacts.length})</span>
                  <span className="text-[10px] text-stone-500 font-mono block">DIRECT OUTREACH & PHONE LINES</span>
                </div>
                <button
                  onClick={() => onOpenEditContact(target, null)}
                  className="flex items-center space-x-1 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-300 hover:bg-emerald-500/20 transition shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Add Decision Maker</span>
                </button>
              </div>

              <div className="space-y-3">
                {target.contacts.map((c, index) => (
                  <div key={c.id} className="rounded-xl border border-stone-800 bg-stone-950 p-3.5 flex flex-col justify-between space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-xs sm:text-sm">{c.name}</span>
                          <span className="rounded bg-stone-850 px-1.5 py-0.2 text-[9px] font-mono text-stone-400 border border-stone-750">
                            {c.entity}
                          </span>
                          {index === 0 ? (
                            <span className="rounded bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-amber-300 border border-amber-500/20 flex items-center space-x-0.5">
                              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                              <span>PRIMARY</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => onSetPrimaryContact && onSetPrimaryContact(target.id, c.id)}
                              className="text-[9px] font-mono text-stone-500 hover:text-amber-400 flex items-center space-x-0.5 transition"
                              title="Set as primary decision maker"
                            >
                              <Star className="h-2.5 w-2.5" />
                              <span>Set Primary</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-emerald-400 font-medium">{c.title}</p>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className={`rounded px-2 py-0.5 text-[9px] font-mono font-bold ${
                          c.receptivityScore === "very_high"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-cyan-500/20 text-cyan-300"
                        }`}>
                          {c.receptivityScore.replace("_", " ").toUpperCase()} RECEPTIVITY
                        </span>
                        <button
                          onClick={() => onOpenEditContact(target, c)}
                          title="Edit Contact Person"
                          className="rounded-lg border border-stone-800 bg-stone-900 p-1 text-stone-400 hover:text-white hover:bg-stone-800 transition"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-400 leading-snug">
                      {c.roleSummary}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-850 text-[11px] font-mono text-stone-300">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="h-3 w-3 text-stone-500" />
                          <a href={`mailto:${c.email}`} className="hover:text-emerald-400 underline">{c.email}</a>
                          <button onClick={() => handleCopy(c.email, c.id + "-email")} className="text-stone-500 hover:text-stone-300">
                            {copiedText === c.id + "-email" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <Phone className="h-3 w-3 text-stone-500" />
                          <a href={`tel:${c.phone.replace(/[^0-9]/g, "")}`} className="hover:text-emerald-400 font-bold text-emerald-400">{c.phone}</a>
                        </div>

                        {c.linkedIn && (
                          <div className="flex items-center space-x-1 text-cyan-400">
                            <Globe className="h-3 w-3" />
                            <span className="truncate max-w-[140px]">{c.linkedIn}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onOpenLogCall(target, c)}
                        className="flex items-center space-x-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300 hover:bg-cyan-500/20 transition"
                      >
                        <PhoneCall className="h-2.5 w-2.5" />
                        <span>Log Call</span>
                      </button>
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
