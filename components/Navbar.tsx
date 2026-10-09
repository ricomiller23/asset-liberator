import React from "react";
import { ShieldAlert, Database, Layers, Users, Download, Search, Command, BarChart3, Radio, Landmark, Compass } from "lucide-react";

export type NavTabType = "screener" | "discovery" | "events" | "lenders" | "crm";

interface NavbarProps {
  activeTab: NavTabType;
  onTabChange: (tab: NavTabType) => void;
  onOpenGlobalSearch: () => void;
  onOpenReport?: () => void;
  stats?: {
    totalSubsidiaryRevenue: number;
    totalSeniorDebt: number;
    totalToxicDebtExtinguished: number;
    totalContacts: number;
    totalTargets: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenGlobalSearch,
  onOpenReport,
  stats,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/95 backdrop-blur-md">
      {/* Top Telemetry Bar */}
      <div className="border-b border-stone-850 px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] text-stone-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold">EDGAR & UCC FORENSIC RADAR</span>
            </span>
            <span className="hidden md:inline text-stone-600">|</span>
            <span className="hidden md:inline text-stone-400">
              Three Hard Gates • Event-Driven 8-K Feeds • Inverted Lender Index
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 font-mono text-[9px] sm:text-[10px] shrink-0">
            {stats && (
              <>
                <span className="text-stone-300">
                  QUALIFIED SUB REV: <strong className="text-emerald-400">${(stats.totalSubsidiaryRevenue / 1000000).toFixed(1)}M</strong>
                </span>
                <span className="text-stone-300">
                  SR DEBT: <strong className="text-cyan-400">${(stats.totalSeniorDebt / 1000000).toFixed(1)}M</strong>
                </span>
                <span className="hidden sm:inline text-stone-300">
                  TOXIC WIPED: <strong className="text-amber-400">${(stats.totalToxicDebtExtinguished / 1000000).toFixed(1)}M</strong>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3 gap-3">
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-amber-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-emerald-400 truncate">
                ASSET LIBERATOR
              </span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-mono font-semibold text-emerald-300 border border-emerald-500/20 shrink-0">
                SPECIAL SITUATIONS
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-semibold tracking-tight text-stone-300 truncate hidden xs:block">
              Public Carve-Out & Clean Shell Rollup Engine
            </h1>
          </div>
        </div>

        {/* Global Search Bar (Center / Omnibar Trigger) */}
        <div className="flex-1 max-w-md mx-2">
          <button
            onClick={onOpenGlobalSearch}
            className="w-full flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/90 px-3 py-1.5 sm:py-2 text-xs text-stone-400 hover:border-emerald-500/50 hover:text-stone-200 transition group shadow-inner"
          >
            <div className="flex items-center space-x-2 truncate">
              <Search className="h-3.5 w-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate text-stone-400 group-hover:text-stone-200">
                <span className="hidden sm:inline">Search people, companies, tickers, lenders...</span>
                <span className="sm:hidden">Search targets & lenders...</span>
              </span>
            </div>
            <div className="flex items-center space-x-1 shrink-0 ml-2">
              <kbd className="hidden md:inline-flex items-center rounded border border-stone-800 bg-stone-950 px-1.5 py-0.5 text-[9px] font-mono text-stone-400 font-semibold">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* View Switcher & Export */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <div className="flex rounded-xl bg-stone-900 p-0.5 sm:p-1 border border-stone-800 text-xs">
            <button
              onClick={() => onTabChange("screener")}
              className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2 py-1.5 sm:px-2.5 sm:py-1.5 font-medium transition ${
                activeTab === "screener"
                  ? "bg-stone-800 text-white shadow-xs font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">Screener</span>
            </button>

            <button
              onClick={() => onTabChange("discovery")}
              className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2 py-1.5 sm:px-2.5 sm:py-1.5 font-medium transition ${
                activeTab === "discovery"
                  ? "bg-stone-800 text-white shadow-xs font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">Discovery</span>
            </button>

            <button
              onClick={() => onTabChange("events")}
              className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2 py-1.5 sm:px-2.5 sm:py-1.5 font-medium transition ${
                activeTab === "events"
                  ? "bg-stone-800 text-white shadow-xs font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Radio className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">8-K Events</span>
            </button>

            <button
              onClick={() => onTabChange("lenders")}
              className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2 py-1.5 sm:px-2.5 sm:py-1.5 font-medium transition ${
                activeTab === "lenders"
                  ? "bg-stone-800 text-white shadow-xs font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Landmark className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">Lenders</span>
            </button>

            <button
              onClick={() => onTabChange("crm")}
              className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2 py-1.5 sm:px-2.5 sm:py-1.5 font-medium transition ${
                activeTab === "crm"
                  ? "bg-stone-800 text-white shadow-xs font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Users className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">CRM</span>
            </button>
          </div>

          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition shadow-xs"
            >
              <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden md:inline">Report</span>
            </button>
          )}

          <a
            href="/api/export?format=csv"
            download
            className="hidden xl:inline-flex items-center space-x-1.5 rounded-xl border border-stone-750 bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-stone-300 hover:bg-stone-850 hover:text-white transition shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-stone-400" />
            <span>CSV</span>
          </a>
        </div>
      </div>
    </header>
  );
};
