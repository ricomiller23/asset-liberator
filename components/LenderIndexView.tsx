import React, { useState } from "react";
import { DISTRESSED_LENDERS_INDEX } from "@/lib/data/lenderIndex";
import { formatCurrency } from "@/lib/utils";
import { Landmark, ArrowUpRight, ShieldAlert, FileText, CheckCircle2, DollarSign, Building } from "lucide-react";

interface LenderIndexViewProps {
  onSelectTicker?: (ticker: string) => void;
}

export const LenderIndexView: React.FC<LenderIndexViewProps> = ({ onSelectTicker }) => {
  const [selectedLenderId, setSelectedLenderId] = useState<string | null>(null);

  const totalTrackedDebt = DISTRESSED_LENDERS_INDEX.reduce((acc, l) => acc + l.totalSecuredDebt, 0);
  const totalBorrowers = DISTRESSED_LENDERS_INDEX.reduce((acc, l) => acc + l.borrowerCount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-850 bg-stone-900/90 p-5 sm:p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-mono font-bold text-amber-300 border border-amber-500/20">
                INVERTED LENDER INDEX
              </span>
              <span className="text-xs font-mono text-stone-400">
                Portfolio-Level Workout Map
              </span>
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-black text-white">
              Senior Creditor & Toxic Debt Portfolios
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-400 max-w-2xl">
              Index distressed borrowers by noteholder instead of company. One bilateral restructuring negotiation with a single senior fund unlocks 3 to 5 operating carve-outs simultaneously.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-3 text-right">
              <span className="text-[10px] font-mono text-stone-500 uppercase">TRACKED DEBT</span>
              <p className="text-lg font-mono font-black text-emerald-400">
                {formatCurrency(totalTrackedDebt)}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-3 text-right">
              <span className="text-[10px] font-mono text-stone-500 uppercase">FUNDS INDEXED</span>
              <p className="text-lg font-mono font-black text-cyan-400">
                {DISTRESSED_LENDERS_INDEX.length} Funds
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lender Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DISTRESSED_LENDERS_INDEX.map((lender) => (
          <div
            key={lender.lenderId}
            className="rounded-3xl border border-stone-850 bg-stone-900/80 p-5 hover:border-amber-500/40 transition duration-200 shadow-md space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  {lender.principal}
                </span>
                <h3 className="text-base font-bold text-white">
                  {lender.lenderName}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  UCC Jurisdictions: {lender.uccFilingStates.join(", ")}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-stone-500 uppercase">PORTFOLIO DEBT</span>
                <p className="text-sm font-mono font-bold text-emerald-400">
                  {formatCurrency(lender.totalSecuredDebt)}
                </p>
              </div>
            </div>

            {/* Borrowers / Targets Chips */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Borrower Portfolio ({lender.borrowerCount} Targets):
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {lender.borrowerTickers.map((ticker) => (
                  <button
                    key={ticker}
                    onClick={() => onSelectTicker && onSelectTicker(ticker)}
                    className="inline-flex items-center space-x-1 rounded-lg border border-stone-800 bg-stone-950 px-2 py-1 text-xs font-mono font-bold text-stone-200 hover:border-emerald-500/50 hover:text-emerald-300 transition"
                  >
                    <span>{ticker}</span>
                    <ArrowUpRight className="h-3 w-3 text-stone-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Negotiation Strategy Box */}
            <div className="rounded-2xl border border-stone-800/90 bg-stone-950/70 p-3 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Workable Playbook & Negotiation Strategy:
              </span>
              <p className="mt-1 text-[11px] text-stone-300 leading-relaxed">
                {lender.negotiationStrategy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
