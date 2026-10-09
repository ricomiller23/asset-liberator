import React from "react";
import { TargetCompany, ExecutiveContact } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { 
  Building2, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle,
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  UserCheck,
  ExternalLink, 
  FileCode2, 
  Send,
  Scale,
  Pencil,
  PhoneCall,
  Clock,
  Layers,
  HelpCircle
} from "lucide-react";

interface TargetCardProps {
  target: TargetCompany;
  onOpenDrawer: (target: TargetCompany) => void;
  onOpenPlaybook: (target: TargetCompany) => void;
  onOpenOutreach: (target: TargetCompany) => void;
  onOpenEditContact?: (target: TargetCompany, contact: ExecutiveContact | null) => void;
  onOpenLogCall?: (target: TargetCompany, contact: ExecutiveContact | null) => void;
}

export const TargetCard: React.FC<TargetCardProps> = ({
  target,
  onOpenDrawer,
  onOpenPlaybook,
  onOpenOutreach,
  onOpenEditContact,
  onOpenLogCall,
}) => {
  const getRoiColor = (roi: number) => {
    if (roi >= 85) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (roi >= 60) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    if (roi >= 35) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-rose-400 bg-rose-500/10 border-rose-500/30";
  };

  const getTierBadge = (tier: string) => {
    if (tier === "verified") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    if (tier === "screened") return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    if (tier === "radar") return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    return "bg-rose-500/15 text-rose-300 border-rose-500/30 line-through opacity-80";
  };

  const getExchangeBadge = (exchange: string) => {
    if (exchange === "EXPERT_MARKET") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (exchange === "PINK_LIMITED") return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (exchange === "PINK_CURRENT") return "bg-amber-500/10 text-amber-300 border-amber-500/20";
    if (exchange === "OTCID_BASIC") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (exchange === "OTCQB") return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    if (exchange === "OTCQX") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (exchange === "TSX" || exchange === "TSXV" || exchange === "CSE" || exchange === "NEO") return "bg-red-500/15 text-red-300 border-red-500/30";
    if (exchange === "ASX") return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  const formatPlaybook = (p: string) => {
    if (p === "article_9_foreclosure") return "Article 9 UCC Foreclosure";
    if (p === "section_363_sale") return "Section 363 Stalking Horse";
    if (p === "abc_receivership") return "ABC / State Receivership";
    if (p === "consensual_carveout") return "Consensual Carve-Out";
    return p;
  };

  const primaryContact = target.contacts[0];
  const isDisqualified = target.tier === "disqualified";

  return (
    <div className={`group relative flex flex-col justify-between rounded-3xl border bg-stone-900/90 shadow-lg transition duration-300 overflow-hidden ${
      isDisqualified 
        ? "border-rose-900/40 bg-stone-950/60 opacity-75 hover:opacity-100" 
        : "border-stone-850 hover:border-emerald-500/40 hover:shadow-2xl"
    }`}>
      {/* Top Banner: Ticker, Name, Tier, Exchange, ROI */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                {target.ticker}
              </span>
              <span className={`font-mono text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${getTierBadge(target.tier)}`}>
                {target.tier === "disqualified" ? "Excluded Current Filer" : `${target.tier.toUpperCase()} TIER`}
              </span>
              <span className={`font-mono text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getExchangeBadge(target.exchange)}`}>
                {["TSX", "TSXV", "CSE", "NEO"].includes(target.exchange)
                  ? `🇨🇦 ${target.exchange}`
                  : target.exchange === "ASX"
                  ? `🇦🇺 ASX`
                  : target.exchange}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                {target.cik ? `CIK:${target.cik}` : `ID:${target.id}`}
              </span>
            </div>
            
            <h3 className="mt-1 text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition truncate">
              {target.name}
            </h3>
            <p className="text-[11px] text-stone-400 truncate">
              Vertical: {target.vertical?.toUpperCase().replace("_", " ")} • Sector: {target.sector}
            </p>

            {/* Sourced Primary Receipts Links */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <a
                href={target.secEdgarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 rounded bg-emerald-950/40 px-1.5 py-0.5 text-[9px] font-mono text-emerald-300 hover:text-emerald-100 border border-emerald-800/40 transition"
              >
                <span>EDGAR 10-K</span>
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </a>
              <a
                href={target.latestFilingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 rounded bg-amber-950/40 px-1.5 py-0.5 text-[9px] font-mono text-amber-300 hover:text-amber-100 border border-amber-800/40 transition"
              >
                <span>Receipt: {target.latestFilingType}</span>
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </a>
              {target.extractionFeasibility.uccSearchNumber && (
                <span className="inline-flex items-center space-x-1 rounded bg-stone-950 px-1.5 py-0.5 text-[9px] font-mono text-cyan-300 border border-stone-800">
                  <span>UCC-1 #{target.extractionFeasibility.uccSearchNumber}</span>
                </span>
              )}
            </div>
          </div>

          {/* Tri-Factor ROI Badge */}
          <div className="flex flex-col items-end shrink-0">
            <div className={`flex flex-col items-center justify-center rounded-2xl border px-3 py-1.5 shadow-inner ${getRoiColor(target.scores.rollupOpportunityIndex)}`}>
              <span className="text-[9px] font-mono font-semibold uppercase tracking-wider opacity-80">
                {isDisqualified ? "DISQUALIFIED" : "Rollup ROI"}
              </span>
              <span className="font-mono text-lg sm:text-xl font-black">
                {target.scores.rollupOpportunityIndex}
              </span>
            </div>
            
            {/* Catalyst Clock Countdown */}
            {target.forcingEvent && (
              <div className={`mt-1.5 flex items-center space-x-1 rounded-md px-1.5 py-0.5 text-[9px] font-mono font-semibold border ${
                target.forcingEvent.leadTimeWindow === "inside_90d_active"
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse"
                  : "bg-stone-950 text-stone-400 border-stone-850"
              }`}>
                <Clock className="h-2.5 w-2.5" />
                <span>⏱ {target.forcingEvent.daysRemaining}d catalyst</span>
              </div>
            )}
          </div>
        </div>

        {/* Disqualification Banner if Current Filer */}
        {isDisqualified && target.disqualificationReason && (
          <div className="mt-2.5 rounded-xl border border-rose-900/60 bg-rose-950/30 p-2 text-[11px] text-rose-300">
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{target.disqualificationReason}</span>
            </div>
          </div>
        )}

        {/* Three Hard Gates Funnel Bar */}
        <div className="mt-3 rounded-xl border border-stone-800/80 bg-stone-950/70 p-2 text-xs">
          <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>THREE HARD GATES AUDIT</span>
            <span className={`font-bold ${
              target.threeGates?.overallGate === "passed_all_3" 
                ? "text-emerald-400" 
                : target.threeGates?.overallGate === "partial_screened" 
                ? "text-cyan-400" 
                : "text-rose-400"
            }`}>
              {target.threeGates?.overallGate === "passed_all_3" ? "PASSED ALL 3" : target.threeGates?.overallGate === "partial_screened" ? "PARTIAL SCREENED" : "FAILED GATE"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            {/* Gate 1 */}
            <div className={`flex items-center space-x-1 rounded-md p-1 border ${
              target.threeGates?.gate1_parentDistress.passed
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/5 text-rose-400"
            }`}>
              {target.threeGates?.gate1_parentDistress.passed ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <XCircle className="h-3 w-3 shrink-0" />}
              <span className="truncate">G1: Distress</span>
            </div>

            {/* Gate 2 */}
            <div className={`flex items-center space-x-1 rounded-md p-1 border ${
              target.threeGates?.gate2_separableValue.passed
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/5 text-rose-400"
            }`}>
              {target.threeGates?.gate2_separableValue.passed ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <XCircle className="h-3 w-3 shrink-0" />}
              <span className="truncate">G2: EX-21 Sub</span>
            </div>

            {/* Gate 3 */}
            <div className={`flex items-center space-x-1 rounded-md p-1 border ${
              target.threeGates?.gate3_controlPoint.passed
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                : "border-amber-500/30 bg-amber-500/5 text-amber-300"
            }`}>
              {target.threeGates?.gate3_controlPoint.passed ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <HelpCircle className="h-3 w-3 shrink-0" />}
              <span className="truncate">G3: &le;2 Lenders</span>
            </div>
          </div>
        </div>

        {/* The Separable Operating Asset & Segment-Profit Mismatch */}
        <div className="mt-3 rounded-2xl border border-stone-800 bg-stone-950 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
              Separable EX-21 Subsidiary:
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              Clean Shell Fit: <strong className="text-white capitalize">{target.extractionFeasibility.cleanShellFit}</strong>
            </span>
          </div>

          <p className="mt-1 font-bold text-stone-100 text-xs sm:text-sm">
            {target.asset.subsidiaryName}
          </p>
          <p className="mt-1 text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
            {target.asset.businessSummary}
          </p>

          {/* Segment-Profit Mismatch Callout */}
          {target.segmentMismatch && (
            <div className="mt-2 rounded-lg bg-stone-900 border border-stone-800/80 p-2 text-[10px] font-mono flex items-center justify-between text-stone-300">
              <span className="text-rose-400">Parent Loss: ${(Math.abs(target.segmentMismatch.parentConsolidatedLoss) / 1e6).toFixed(1)}M</span>
              <span className="text-stone-500">&rarr;</span>
              <span className="text-emerald-400">Sub Cash Flow: ${target.asset.annualRevenue > 0 ? (target.asset.annualRevenue / 1e6).toFixed(1) + 'M Rev' : '$0 Pre-Rev IP'}</span>
              <span className="text-cyan-400 font-bold">Spread: +${(target.segmentMismatch.spreadDelta / 1e6).toFixed(1)}M</span>
            </div>
          )}

          {/* Financial Breakdown Grid */}
          <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-850 text-[11px]">
            <div>
              <span className="text-[10px] text-stone-500 font-mono">SUB REVENUE</span>
              <p className="font-mono font-bold text-white">
                {target.asset.annualRevenue > 0 ? formatCurrency(target.asset.annualRevenue) : "$0 (Pre-Rev IP)"}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-mono">SENIOR SECURED DEBT</span>
              <p className="font-mono font-bold text-amber-400">
                {formatCurrency(target.extractionFeasibility.seniorSecuredDebtAmount)}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-mono">EST. BUYOUT COST</span>
              <p className="font-mono font-bold text-emerald-400">
                {formatCurrency(target.extractionFeasibility.estimatedAcquisitionCost)}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-mono">SENIOR CREDITOR</span>
              <p className="font-mono font-semibold text-stone-300 truncate" title={target.extractionFeasibility.seniorSecuredHolder}>
                {target.extractionFeasibility.seniorSecuredHolder.split("/")[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Contact Person Box */}
        {primaryContact && (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-stone-800/80 bg-stone-950/60 px-3 py-2 text-xs">
            <div className="min-w-0">
              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400">
                Primary Decision Maker:
              </span>
              <p className="font-bold text-stone-200 truncate">
                {primaryContact.name} • <span className="text-stone-400 font-normal">{primaryContact.title}</span>
              </p>
              <p className="font-mono text-[10px] text-stone-400 truncate">
                {primaryContact.phone} • {primaryContact.email}
              </p>
            </div>
            <div className="flex items-center space-x-1 shrink-0 ml-2">
              {onOpenLogCall && (
                <button
                  onClick={() => onOpenLogCall(target, primaryContact)}
                  className="rounded-lg bg-emerald-950/60 border border-emerald-800/50 p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800 transition"
                  title="Log Call"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                </button>
              )}
              {onOpenEditContact && (
                <button
                  onClick={() => onOpenEditContact(target, primaryContact)}
                  className="rounded-lg bg-stone-900 border border-stone-800 p-1.5 text-stone-400 hover:text-white transition"
                  title="Edit Contact"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="border-t border-stone-850 bg-stone-950/80 p-3 sm:p-4 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenPlaybook(target)}
          className="flex-1 flex items-center justify-center space-x-1.5 rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-semibold text-stone-300 hover:border-stone-700 hover:text-white transition"
        >
          <Scale className="h-3.5 w-3.5 text-cyan-400" />
          <span className="truncate">{formatPlaybook(target.extractionFeasibility.recommendedPlaybook)}</span>
        </button>

        <button
          onClick={() => onOpenOutreach(target)}
          className="flex items-center space-x-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md transition"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Outreach</span>
        </button>

        <button
          onClick={() => onOpenDrawer(target)}
          className="flex items-center space-x-1 rounded-xl bg-stone-850 px-2.5 py-2 text-xs font-semibold text-stone-300 hover:text-white transition"
          title="Open Dossier"
        >
          <span>Dossier</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
