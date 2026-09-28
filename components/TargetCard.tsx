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
      <div className="flex items-center justify-between border-b border-stone-800/80 bg-stone-950/60 px-5 py-3.5">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-850 font-mono text-sm font-bold text-white border border-stone-750">
            {target.ticker}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white hover:text-emerald-400 transition cursor-pointer" onClick={() => onOpenDrawer(target)}>
                {target.name}
              </h3>
              <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono border ${getExchangeBadge(target.exchange)}`}>
                {target.exchange.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-stone-400 mt-0.5">
              <span>{target.sector}</span>
              <span>•</span>
              <span>CIK: {target.cik}</span>
              <span>•</span>
              <span className="font-mono text-stone-300">Market Cap: $${(target.marketCap / 1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>

        {/* ROI Badge */}
        <div className="text-right">
          <div className={`inline-flex items-center space-x-1.5 rounded-xl border px-3 py-1 font-mono text-xs font-bold ${getRoiColor(target.scores.rollupOpportunityIndex)}`}>
            <span>ROI {target.scores.rollupOpportunityIndex}/100</span>
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5 font-mono">
            AQS {target.scores.assetQualityScore} | VTS {target.scores.vehicleDistressScore}
          </div>
        </div>
      </div>

      {/* Side-by-Side: The Asset (The Gold) vs The Vehicle Distress (The Grave) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 flex-1">
        {/* Left: The Operating Asset */}
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/10 p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center space-x-1.5 font-semibold text-emerald-400">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{target.asset.subsidiaryName}</span>
              </span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                THE ASSET
              </span>
            </div>

            <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
              {target.asset.businessSummary}
            </p>

            {/* Financial Badges */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono">
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[10px] text-stone-400">ANNUAL REV</div>
                <div className="text-xs font-bold text-emerald-400">
                  $${(target.asset.annualRevenue / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[10px] text-stone-400">GROSS MARGIN</div>
                <div className="text-xs font-bold text-emerald-300">
                  {target.asset.grossMarginPct}%
                </div>
              </div>
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[10px] text-stone-400">EBITDA</div>
                <div className="text-xs font-bold text-stone-200">
                  $${(target.asset.ebitda / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-emerald-500/15 flex items-center justify-between text-[11px] text-stone-400">
            <span>{target.asset.employees} team | {target.asset.patentsCount} patents</span>
            <span className="truncate max-w-[160px] text-stone-300">
              Clients: {target.asset.keyClients[0]}
            </span>
          </div>
        </div>

        {/* Right: The Vehicle Distress */}
        <div className="rounded-xl border border-rose-500/25 bg-rose-950/10 p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center space-x-1.5 font-semibold text-rose-400">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Vehicle Failure Mode</span>
              </span>
              <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-rose-300">
                THE GRAVE
              </span>
            </div>

            <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
              {target.vehicleDistress.statusSummary}
            </p>

            {/* Distress Badges */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-center font-mono">
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[10px] text-stone-400">TOXIC DEBT</div>
                <div className="text-xs font-bold text-rose-400">
                  $${(target.vehicleDistress.toxicDebtBalance / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="rounded-lg bg-stone-900/80 p-1.5 border border-stone-800">
                <div className="text-[10px] text-stone-400">AUDITOR STATUS</div>
                <div className="text-xs font-bold text-amber-400 truncate">
                  {target.vehicleDistress.auditorStatus.replace("_", " ").toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-rose-500/15 flex items-center justify-between text-[11px] text-stone-400">
            <span className="text-rose-300 font-mono font-medium">
              {target.vehicleDistress.secTriggers[0]}
            </span>
            <span className="text-stone-500">
              Lenders: {target.vehicleDistress.toxicLenders[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Extraction Mechanics & Clean Shell Rollup Bar */}
      <div className="border-t border-stone-800 bg-stone-950/80 px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <Scale className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-semibold text-white font-mono">
                {formatPlaybook(target.extractionFeasibility.recommendedPlaybook)}
              </span>
            </div>
            <span className="text-stone-600">|</span>
            <div className="text-stone-400 font-mono text-[11px]">
              Est. Cash Buyout: <strong className="text-cyan-300">$${(target.extractionFeasibility.estimatedAcquisitionCost / 1000).toFixed(0)}k</strong> ({target.extractionFeasibility.estimatedBuyoutDiscountPct}% off $${(target.extractionFeasibility.seniorSecuredDebtAmount / 1000000).toFixed(1)}M note)
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span className="text-stone-400">Shell Fit:</span>
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-cyan-300 border border-cyan-500/20 font-bold uppercase">
              {target.extractionFeasibility.cleanShellFit}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions & Key Contacts Bar */}
      <div className="border-t border-stone-800/80 bg-stone-900 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-[11px] text-stone-400">
          <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>Primary: <strong className="text-stone-200">{target.contacts[0]?.name}</strong> ({target.contacts[0]?.title})</span>
          <span className="text-stone-600 hidden sm:inline">•</span>
          <span className="text-stone-400 hidden sm:inline">{target.contacts[0]?.phone}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenDrawer(target)}
            className="rounded-xl border border-stone-750 bg-stone-850 px-3 py-1.5 font-medium text-stone-300 hover:bg-stone-800 hover:text-white transition"
          >
            Forensic Dossier
          </button>
          <button
            onClick={() => onOpenPlaybook(target)}
            className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-medium text-cyan-300 hover:bg-cyan-500/20 transition"
          >
            Deal Playbook
          </button>
          <button
            onClick={() => onOpenOutreach(target)}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 font-bold text-stone-950 hover:bg-emerald-400 transition shadow-sm"
          >
            <Send className="h-3 w-3" />
            <span>Outreach</span>
          </button>
        </div>
      </div>
    </div>
  );
};
