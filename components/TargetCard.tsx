import React from "react";
import { TargetCompany, ExecutiveContact } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { 
  Building2, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  UserCheck,
  ExternalLink, 
  FileCode2, 
  Send,
  Scale,
  Pencil,
  PhoneCall
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
    if (roi >= 75) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  };

  const getExchangeBadge = (exchange: string) => {
    if (exchange === "EXPERT_MARKET") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (exchange === "PINK_LIMITED") return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (exchange === "PINK_CURRENT") return "bg-amber-500/10 text-amber-300 border-amber-500/20";
    if (exchange === "OTCID_BASIC") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (exchange === "OTCQB") return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    if (exchange === "OTCQX") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  const formatPlaybook = (p: string) => {
    if (p === "article_9_foreclosure") return "Article 9 UCC Foreclosure";
    if (p === "section_363_sale") return "Section 363 Stalking Horse";
    if (p === "abc_receivership") return "ABC / State Receivership";
    if (p === "consensual_carveout") return "Consensual Carve-Out";
    return p;
  };

  const formatDistress = (s: string) => {
    if (s === "delinquent_10k") return "Delinquent 10-K";
    if (s === "delinquent_10q") return "Delinquent 10-Q";
    if (s === "suspended_15c211") return "Rule 15c2-11 Revoked";
    if (s === "current") return "Current Filer";
    return s;
  };

  const primaryContact = target.contacts[0];

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-stone-850 bg-stone-900/90 shadow-lg hover:border-emerald-500/40 hover:shadow-2xl transition duration-300 overflow-hidden">
      {/* Top Banner: Ticker, Name, Exchange, ROI */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                {target.ticker}
              </span>
              <span className={`font-mono text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getExchangeBadge(target.exchange)}`}>
                {target.exchange}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                CIK:{target.cik}
              </span>
            </div>
            
            <h3 className="mt-1 text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition truncate">
              {target.name}
            </h3>
            <p className="text-[11px] text-stone-400 truncate">
              Sector: {target.sector} • Industry: {target.industry}
            </p>
            {/* Primary Source Verification Links */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <a
                href={target.otcMarketsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 rounded bg-cyan-950/40 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300 hover:text-cyan-100 border border-cyan-800/40 transition"
              >
                <span>otcmarkets</span>
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </a>
              <a
                href={target.secEdgarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 rounded bg-emerald-950/40 px-1.5 py-0.2 text-[9px] font-mono text-emerald-300 hover:text-emerald-100 border border-emerald-800/40 transition"
              >
                <span>EDGAR</span>
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </a>
              <a
                href={target.latestFilingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 rounded bg-amber-950/40 px-1.5 py-0.2 text-[9px] font-mono text-amber-300 hover:text-amber-100 border border-amber-800/40 transition"
                title="Actual most recent SEC EDGAR filing"
              >
                <span>Most Recent: {target.latestFilingType}</span>
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </a>
              {target.baseline10KFilingUrl && target.baseline10KFilingUrl !== target.latestFilingUrl && (
                <a
                  href={target.baseline10KFilingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 rounded bg-stone-850 px-1.5 py-0.2 text-[9px] font-mono text-stone-300 hover:text-white border border-stone-750 transition"
                  title="Baseline Annual 10-K filing"
                >
                  <span>10-K</span>
                  <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                </a>
              )}
            </div>
            {/* Provenance note */}
            {target.extractionFeasibility.provenanceNote && (
              <div className="text-[9px] font-mono text-amber-400/80 mt-1">
                {target.extractionFeasibility.provenanceNote}
              </div>
            )}
          </div>

          {/* Tri-Factor ROI Index Badge */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider font-semibold">
              Rollup ROI
            </span>
            <div className={`mt-0.5 flex items-center space-x-1 rounded-xl px-2.5 py-1 border font-mono font-bold text-xs sm:text-sm ${getRoiColor(target.scores.rollupOpportunityIndex)}`}>
              <span>{target.scores.rollupOpportunityIndex}</span>
              <span className="text-[10px] font-normal text-stone-400">/100</span>
            </div>
          </div>
        </div>

        {/* The Two Sides: Gold vs Grave Contrast Container */}
        <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          
          {/* LEFT: The Asset (The Gold) */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/15 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                <span className="flex items-center space-x-1">
                  <Building2 className="h-3 w-3" />
                  <span>SUBSIDIARY ASSET</span>
                </span>
                <span className="text-emerald-300">
                  {target.asset.commercialReadiness === "revenue_generating" ? "REV GENERATING" : "ACTIVE IP"}
                </span>
              </div>
              <h4 className="font-bold text-white text-xs mt-1.5 truncate">
                {target.asset.subsidiaryName}
              </h4>
              <p className="text-[11px] text-stone-300 line-clamp-2 mt-0.5 leading-snug">
                {target.asset.businessSummary}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1.5 font-mono text-[10px] pt-2 border-t border-emerald-500/20">
              <div>
                <span className="text-stone-500 block text-[9px]">ANNUAL REV</span>
                <span className="text-emerald-400 font-bold">
                  ${(target.asset.annualRevenue / 1000000).toFixed(1)}M
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[9px]">GROSS MARGIN</span>
                <span className="text-white font-bold">
                  {target.asset.grossMarginPct}%
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: The Distress (The Grave) */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/15 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-rose-500/20 text-rose-400 font-mono text-[10px] font-bold">
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>PUBLIC SHELL DISTRESS</span>
                </span>
                <span className="text-rose-300">
                  {formatDistress(target.vehicleDistress.filingStatus)}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span className="text-stone-400 text-[11px]">Toxic Debt:</span>
                <span className="font-mono font-bold text-rose-400">
                  {formatCurrency(target.vehicleDistress.toxicDebtBalance)}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 line-clamp-2 mt-1 leading-snug">
                {target.vehicleDistress.statusSummary}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex items-center justify-between font-mono text-[10px]">
              <span className="text-stone-500 text-[9px]">AUDITOR:</span>
              <span className="text-amber-400 font-semibold truncate max-w-[130px]">
                {target.vehicleDistress.auditorStatus.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>

        </div>

        {/* Extraction Metrics Bar */}
        <div className="mt-3 rounded-2xl border border-stone-800 bg-stone-950/60 p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <Scale className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="text-[11px] text-stone-300 font-medium truncate">
              Playbook: <strong className="text-cyan-300">{formatPlaybook(target.extractionFeasibility.recommendedPlaybook)}</strong>
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-3 font-mono text-[10px] sm:text-[11px]">
            <div>
              <span className="text-stone-500">Sr Buyout: </span>
              <strong className="text-emerald-400">{formatCurrency(target.extractionFeasibility.estimatedAcquisitionCost)}</strong>
            </div>
            <div className="text-stone-600">•</div>
            <div>
              <span className="text-stone-500">Discount: </span>
              <strong className="text-cyan-400">{target.extractionFeasibility.estimatedBuyoutDiscountPct}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions & Key Contacts Bar */}
      <div className="border-t border-stone-800/80 bg-stone-900 px-3.5 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-stone-400 min-w-0">
          <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          {primaryContact ? (
            <div className="flex items-center space-x-1.5 truncate">
              <span className="truncate">
                Primary: <strong className="text-stone-200">{primaryContact.name}</strong> ({primaryContact.title})
              </span>
              <span className="text-stone-600 hidden md:inline">•</span>
              <a
                href={`tel:${primaryContact.phone.replace(/[^0-9]/g, "")}`}
                className="text-emerald-400 hover:underline hidden md:inline shrink-0"
              >
                {primaryContact.phone}
              </a>
              {onOpenEditContact && (
                <button
                  onClick={() => onOpenEditContact(target, primaryContact)}
                  title="Change / Edit Contact"
                  className="text-stone-500 hover:text-cyan-300 p-0.5 rounded transition shrink-0 ml-1"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              )}
              {onOpenLogCall && (
                <button
                  onClick={() => onOpenLogCall(target, primaryContact)}
                  title="Log Call"
                  className="text-stone-500 hover:text-cyan-300 p-0.5 rounded transition shrink-0"
                >
                  <PhoneCall className="h-3 w-3" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenEditContact && onOpenEditContact(target, null)}
              className="text-emerald-400 hover:underline text-[10px]"
            >
              + Assign Decision Maker
            </button>
          )}
        </div>

        {/* 3-Button Action Row on Mobile */}
        <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto sm:flex sm:items-center sm:space-x-2 shrink-0">
          <button
            onClick={() => onOpenDrawer(target)}
            className="rounded-xl border border-stone-750 bg-stone-850 py-2 sm:py-1.5 px-2.5 sm:px-3 text-center text-[11px] sm:text-xs font-medium text-stone-300 hover:bg-stone-800 hover:text-white transition"
          >
            Dossier
          </button>
          <button
            onClick={() => onOpenPlaybook(target)}
            className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2 sm:py-1.5 px-2.5 sm:px-3 text-center text-[11px] sm:text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition"
          >
            Playbook
          </button>
          <button
            onClick={() => onOpenOutreach(target)}
            className="inline-flex items-center justify-center space-x-1 sm:space-x-1.5 rounded-xl bg-emerald-500 py-2 sm:py-1.5 px-2.5 sm:px-3 text-center text-[11px] sm:text-xs font-bold text-stone-950 hover:bg-emerald-400 transition shadow-sm"
          >
            <Send className="h-3 w-3 shrink-0" />
            <span>Outreach</span>
          </button>
        </div>
      </div>
    </div>
  );
};
