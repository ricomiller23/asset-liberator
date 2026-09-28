import React from "react";
import { TargetCompany } from "@/lib/types";
import { 
  Building2, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  UserCheck, 
  FileCode2, 
  Send,
  Scale
} from "lucide-react";

interface TargetCardProps {
  target: TargetCompany;
  onOpenDrawer: (target: TargetCompany) => void;
  onOpenPlaybook: (target: TargetCompany) => void;
  onOpenOutreach: (target: TargetCompany) => void;
}

export const TargetCard: React.FC<TargetCardProps> = ({
  target,
  onOpenDrawer,
  onOpenPlaybook,
  onOpenOutreach,
}) => {
  const getRoiColor = (roi: number) => {
    if (roi >= 85) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (roi >= 75) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  };

  const getExchangeBadge = (exchange: string) => {
    if (exchange === "EXPERT_MARKET") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (exchange.includes("PINK")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  const formatPlaybook = (p: string) => {
    if (p === "article_9_foreclosure") return "Article 9 UCC Foreclosure";
    if (p === "section_363_sale") return "Section 363 Stalking Horse";
    if (p === "consensual_carveout") return "Consensual Carve-Out";
    return "ABC / Receivership";
  };

  return (
    <div className="flex flex-col rounded-2xl border border-stone-800 bg-stone-900/90 shadow-md transition hover:border-stone-700 hover:shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-stone-800/80 bg-stone-950/60 px-3.5 sm:px-5 py-3 sm:py-3.5">
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-stone-850 font-mono text-xs sm:text-sm font-bold text-white border border-stone-750">
            {target.ticker}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h3 
                className="text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition cursor-pointer truncate" 
                onClick={() => onOpenDrawer(target)}
              >
                {target.name}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] text-stone-400">
              <span className={`rounded px-1.5 py-0.2 font-mono font-semibold border ${getExchangeBadge(target.exchange)}`}>
                {target.exchange.replace("_", " ")}
              </span>
              <span className="hidden sm:inline text-stone-600">•</span>
              <span className="text-stone-400 truncate">{target.sector}</span>
              <span className="hidden sm:inline text-stone-600">•</span>
              <span className="font-mono text-stone-400">Cap: ${(target.marketCap / 1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>

        {/* Master ROI Score Badge */}
        <div className="text-right shrink-0 ml-2">
          <div className="text-[9px] sm:text-[10px] font-mono text-stone-400">ROLLUP ROI</div>
          <div className={`mt-0.5 inline-flex items-center space-x-1 rounded-xl px-2 py-0.5 font-mono text-xs sm:text-sm font-bold border ${getRoiColor(target.scores.rollupOpportunityIndex)}`}>
            <span>{target.scores.rollupOpportunityIndex}</span>
            <span className="text-[10px] text-stone-500">/100</span>
          </div>
        </div>
      </div>

      {/* Trapped Asset vs Toxic Vehicle 2-Column Core Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 sm:p-4.5 bg-stone-900/40">
        
        {/* Left Column: The Trapped Gold (Subsidiary) */}
        <div className="flex flex-col justify-between rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3 sm:p-3.5">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{target.asset.subsidiaryName}</span>
              </div>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-500/30 shrink-0">
                THE ASSET
              </span>
            </div>

            <p className="mt-2 text-xs text-stone-300 line-clamp-2 leading-relaxed">
              {target.asset.businessSummary}
            </p>

            {/* Financial Telemetry Pills */}
            <div className="mt-3 grid grid-cols-3 gap-1.5 text-center font-mono">
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[9px] sm:text-[10px] text-stone-400">ANNUAL REV</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400">
                  ${(target.asset.annualRevenue / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[9px] sm:text-[10px] text-stone-400">GROSS MARGIN</div>
                <div className="text-xs sm:text-sm font-bold text-stone-200">
                  {target.asset.grossMarginPct}%
                </div>
              </div>
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[9px] sm:text-[10px] text-stone-400">EBITDA</div>
                <div className="text-xs sm:text-sm font-bold text-cyan-400">
                  ${(target.asset.ebitda / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-emerald-500/15 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-400">
            <span className="text-stone-300 truncate">
              Client: <strong>{target.asset.keyClients[0]}</strong>
            </span>
            <span className="text-stone-400 shrink-0 ml-1 font-mono">
              {target.asset.patentsCount} Patents
            </span>
          </div>
        </div>

        {/* Right Column: The Toxic Grave (Parent Shell) */}
        <div className="flex flex-col justify-between rounded-xl border border-rose-500/20 bg-rose-950/10 p-3 sm:p-3.5">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-400">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Public Parent Paralysis</span>
              </div>
              <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-rose-300 border border-rose-500/30 shrink-0">
                THE GRAVE
              </span>
            </div>

            <p className="mt-2 text-xs text-stone-300 line-clamp-2 leading-relaxed">
              {target.vehicleDistress.statusSummary}
            </p>

            {/* Toxic Debt Metrics */}
            <div className="mt-3 grid grid-cols-3 gap-1.5 text-center font-mono">
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[9px] sm:text-[10px] text-stone-400">TOXIC DEBT</div>
                <div className="text-xs sm:text-sm font-bold text-rose-400">
                  ${(target.vehicleDistress.toxicDebtBalance / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[9px] sm:text-[10px] text-stone-400">FILING DELINQ</div>
                <div className="text-xs sm:text-sm font-bold text-amber-400 truncate">
                  {target.vehicleDistress.filingStatus.replace("delinquent_", "").toUpperCase()}
                </div>
              </div>
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[9px] sm:text-[10px] text-stone-400">AUDITOR STATUS</div>
                <div className="text-xs sm:text-sm font-bold text-amber-400 truncate">
                  {target.vehicleDistress.auditorStatus.replace("_", " ").toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-rose-500/15 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-400">
            <span className="text-rose-300 font-mono font-medium truncate">
              {target.vehicleDistress.secTriggers[0]}
            </span>
            <span className="text-stone-400 shrink-0 ml-1">
              Lender: {target.vehicleDistress.toxicLenders[0]?.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Extraction Mechanics & Clean Shell Rollup Bar */}
      <div className="border-t border-stone-800 bg-stone-950/80 px-3.5 sm:px-4 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:space-x-3">
            <div className="flex items-center space-x-1.5">
              <Scale className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="font-semibold text-white font-mono text-[11px] sm:text-xs">
                {formatPlaybook(target.extractionFeasibility.recommendedPlaybook)}
              </span>
            </div>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <div className="text-stone-400 font-mono text-[10px] sm:text-[11px]">
              Est. Cash Buyout: <strong className="text-cyan-300">${(target.extractionFeasibility.estimatedAcquisitionCost / 1000).toFixed(0)}k</strong> ({target.extractionFeasibility.estimatedBuyoutDiscountPct}% off ${(target.extractionFeasibility.seniorSecuredDebtAmount / 1000000).toFixed(1)}M note)
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[10px] sm:text-[11px] shrink-0">
            <span className="text-stone-400">Shell Fit:</span>
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-cyan-300 border border-cyan-500/20 font-bold uppercase">
              {target.extractionFeasibility.cleanShellFit}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions & Key Contacts Bar */}
      <div className="border-t border-stone-800/80 bg-stone-900 px-3.5 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-stone-400 min-w-0">
          <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Primary: <strong className="text-stone-200">{target.contacts[0]?.name}</strong> ({target.contacts[0]?.title})</span>
          <span className="text-stone-600 hidden md:inline">•</span>
          <span className="text-stone-400 hidden md:inline">{target.contacts[0]?.phone}</span>
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
