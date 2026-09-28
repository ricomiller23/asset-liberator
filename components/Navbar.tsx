import React from "react";
import Link from "next/link";
import { ShieldAlert, Database, Layers, Users, Download, ArrowUpRight, Activity } from "lucide-react";

interface NavbarProps {
  activeTab: "screener" | "crm";
  onTabChange: (tab: "screener" | "crm") => void;
  stats?: {
    totalSubsidiaryRevenue: number;
    totalSeniorDebt: number;
    totalToxicDebtExtinguished: number;
    totalContacts: number;
    totalTargets: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, stats }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/90 backdrop-blur-md">
      {/* Top Telemetry Bar */}
      <div className="border-b border-stone-850 px-4 py-1.5 text-[11px] text-stone-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE EDGAR & UCC FORENSIC RADAR</span>
            </span>
            <span className="hidden sm:inline text-stone-600">|</span>
            <span className="hidden sm:inline text-stone-400">
              Clean Shell Rollup Target Engine
            </span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[10px]">
            {stats && (
              <>
                <span className="text-stone-300">
                  SUBSIDIARY REV: <strong className="text-emerald-400">$${(stats.totalSubsidiaryRevenue / 1000000).toFixed(1)}M</strong>
                </span>
                <span className="hidden md:inline text-stone-300">
                  SR DEBT BUYOUT: <strong className="text-cyan-400">$${(stats.totalSeniorDebt / 1000000).toFixed(1)}M</strong>
                </span>
                <span className="hidden lg:inline text-stone-300">
                  TOXIC DEBT WIPED: <strong className="text-amber-400">$${(stats.totalToxicDebtExtinguished / 1000000).toFixed(1)}M</strong>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-amber-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold tracking-wider text-emerald-400">ASSET LIBERATOR</span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-emerald-300 border border-emerald-500/20">
                SPECIAL SITUATIONS
              </span>
            </div>
            <h1 className="text-sm font-semibold tracking-tight text-white">
              Public Carve-Out & Clean Shell Rollup Engine
            </h1>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex rounded-xl bg-stone-900 p-1 border border-stone-800 text-xs">
            <button
              onClick={() => onTabChange("screener")}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
                activeTab === "screener"
                  ? "bg-stone-800 text-white shadow-xs font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>Deal Screener</span>
            </button>
            <button
              onClick={() => onTabChange("crm")}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
                activeTab === "crm"
                  ? "bg-stone-800 text-white shadow-xs font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span>CRM Pipeline</span>
              {stats && (
                <span className="ml-1 rounded-full bg-cyan-500/20 px-1.5 py-0.2 text-[10px] text-cyan-300 font-mono">
                  {stats.totalContacts}
                </span>
              )}
            </button>
          </div>

          <a
            href="/api/export?format=csv"
            download
            className="hidden sm:inline-flex items-center space-x-1.5 rounded-xl border border-stone-750 bg-stone-900 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:bg-stone-850 hover:text-white transition shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-stone-400" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>
    </header>
  );
};
