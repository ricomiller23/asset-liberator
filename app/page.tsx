"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { TargetCompany, SearchFilters, CrmStage, PriorityLevel } from "@/lib/types";
import { getStoredTargets, saveStoredTargets, updateTargetCrmStage, addTargetCrmNote, logTargetActivity } from "@/lib/crm";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { TargetCard } from "@/components/TargetCard";
import { TargetDrawer } from "@/components/TargetDrawer";
import { DealPlaybookModal } from "@/components/DealPlaybookModal";
import { OutreachModal } from "@/components/OutreachModal";
import { CrmPipelineView } from "@/components/CrmPipelineView";
import { 
  ShieldAlert, 
  Sparkles, 
  Scale, 
  Layers, 
  RefreshCcw, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  DollarSign 
} from "lucide-react";

function AssetLiberatorMain() {
  const [activeTab, setActiveTab] = useState<"screener" | "crm">("screener");
  const [localTargets, setLocalTargets] = useState<TargetCompany[]>([]);
  const [activeDrawerTarget, setActiveDrawerTarget] = useState<TargetCompany | null>(null);
  const [activePlaybookTarget, setActivePlaybookTarget] = useState<TargetCompany | null>(null);
  const [activeOutreachTarget, setActiveOutreachTarget] = useState<TargetCompany | null>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    sector: "all",
    playbook: "all",
    exchange: "all",
    filingStatus: "all",
    sortBy: "roi",
  });

  // Load from local storage or initialize
  useEffect(() => {
    const data = getStoredTargets();
    setLocalTargets(data);
  }, []);

  // Fetch targets via API (and merge local CRM state)
  const { data: apiData, isLoading, refetch } = useQuery({
    queryKey: ["targets", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.query) params.set("query", filters.query);
      if (filters.sector && filters.sector !== "all") params.set("sector", filters.sector);
      if (filters.playbook && filters.playbook !== "all") params.set("playbook", filters.playbook);
      if (filters.exchange && filters.exchange !== "all") params.set("exchange", filters.exchange);
      if (filters.filingStatus && filters.filingStatus !== "all") params.set("filingStatus", filters.filingStatus);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);

      const res = await fetch(`/api/targets?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch targets");
      return res.json();
    },
  });

  // Sync API data with locally stored CRM modifications
  const displayedTargets: TargetCompany[] = useMemo(() => {
    const rawList: TargetCompany[] = apiData?.targets || localTargets;
    if (localTargets.length === 0) return rawList;

    return rawList.map((target) => {
      const match = localTargets.find((lt) => lt.id === target.id);
      if (match) {
        return {
          ...target,
          crm: match.crm,
        };
      }
      return target;
    });
  }, [apiData, localTargets]);

  // Aggregated Stats
  const stats = useMemo(() => {
    const totalSubsidiaryRevenue = displayedTargets.reduce((acc, t) => acc + t.asset.annualRevenue, 0);
    const totalSeniorDebt = displayedTargets.reduce((acc, t) => acc + t.extractionFeasibility.seniorSecuredDebtAmount, 0);
    const totalToxicDebtExtinguished = displayedTargets.reduce((acc, t) => acc + t.vehicleDistress.toxicDebtBalance, 0);
    const totalContacts = displayedTargets.reduce((acc, t) => acc + t.contacts.length, 0);
    const totalTargets = displayedTargets.length;

    return {
      totalSubsidiaryRevenue,
      totalSeniorDebt,
      totalToxicDebtExtinguished,
      totalContacts,
      totalTargets,
    };
  }, [displayedTargets]);

  // CRM Handlers
  const handleUpdateStage = (targetId: string, stage: CrmStage, priority?: PriorityLevel) => {
    const updated = updateTargetCrmStage(targetId, stage, priority);
    setLocalTargets(updated);
    if (activeDrawerTarget && activeDrawerTarget.id === targetId) {
      const targetMatch = updated.find((t) => t.id === targetId);
      if (targetMatch) setActiveDrawerTarget(targetMatch);
    }
  };

  const handleAddNote = (targetId: string, text: string) => {
    const updated = addTargetCrmNote(targetId, text, "Special Situations Desk");
    setLocalTargets(updated);
    if (activeDrawerTarget && activeDrawerTarget.id === targetId) {
      const targetMatch = updated.find((t) => t.id === targetId);
      if (targetMatch) setActiveDrawerTarget(targetMatch);
    }
  };

  const handleLogOutreach = (targetId: string, contactName: string, summary: string) => {
    let updated = updateTargetCrmStage(targetId, "outreach_sent");
    updated = logTargetActivity(targetId, "email", summary);
    setLocalTargets(updated);
    if (activeDrawerTarget && activeDrawerTarget.id === targetId) {
      const targetMatch = updated.find((t) => t.id === targetId);
      if (targetMatch) setActiveDrawerTarget(targetMatch);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full space-y-6">
        
        {/* Hero Strategy Briefing Banner */}
        <div className="rounded-3xl border border-stone-800 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-emerald-950/20 p-4 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400">
                <Scale className="h-4 w-4" />
                <span>CLEAN SHELL ROLLUP & CARVE-OUT ENGINE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Liberating Viable Operating Subsidiaries Trapped in Broken Public Vehicles
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Systematically scanning the OTC & Micro-Cap markets for operating businesses with real revenue ($1M–$50M), positive gross margins, and Tier-1 clients trapped under toxic convertibles, delinquent SEC filings, and auditor resignations—ready to strip clean and roll into our unencumbered public shells.
              </p>
            </div>

            {/* Quick Playbook Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-xs font-mono shrink-0">
              <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-2.5">
                <span className="text-emerald-400 font-bold">ARTICLE 9 UCC</span>
                <p className="text-[10px] text-stone-400 mt-0.5">Senior debt purchase & clean foreclosure</p>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-2.5">
                <span className="text-cyan-400 font-bold">SEC 363 SALE</span>
                <p className="text-[10px] text-stone-400 mt-0.5">Court-ordered free & clear title</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Routing: Deal Screener vs CRM Pipeline */}
        {activeTab === "screener" ? (
          <div className="space-y-6">
            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              resultCount={displayedTargets.length}
            />

            {/* Target Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 rounded-2xl border border-stone-850 bg-stone-900/60 p-5 animate-pulse">
                    <div className="h-6 w-1/4 rounded bg-stone-800 mb-4" />
                    <div className="h-28 w-full rounded bg-stone-800 mb-3" />
                    <div className="h-16 w-full rounded bg-stone-800" />
                  </div>
                ))}
              </div>
            ) : displayedTargets.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-800 bg-stone-900/40 py-16 px-6 text-center">
                <ShieldAlert className="mx-auto h-12 w-12 text-stone-600 mb-3" />
                <h3 className="text-base font-bold text-white">No targets matching filter criteria</h3>
                <p className="mt-1 text-xs text-stone-400 max-w-sm mx-auto">
                  Try clearing the search query or selecting "All Playbooks" to view all live special situations candidates.
                </p>
                <div className="mt-5">
                  <button
                    onClick={() => setFilters({ query: "", sector: "all", playbook: "all", exchange: "all", filingStatus: "all", sortBy: "roi" })}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-emerald-400 transition"
                  >
                    Reset Filter View
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {displayedTargets.map((target) => (
                  <TargetCard
                    key={target.id}
                    target={target}
                    onOpenDrawer={(t) => setActiveDrawerTarget(t)}
                    onOpenPlaybook={(t) => setActivePlaybookTarget(t)}
                    onOpenOutreach={(t) => setActiveOutreachTarget(t)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <CrmPipelineView
            targets={displayedTargets}
            onOpenDrawer={(t) => setActiveDrawerTarget(t)}
            onOpenOutreach={(t) => setActiveOutreachTarget(t)}
            onUpdateStage={handleUpdateStage}
            onAddNote={handleAddNote}
          />
        )}

      </main>

      {/* Deep-Dive Slide-Over Forensic Drawer */}
      <TargetDrawer
        target={activeDrawerTarget}
        isOpen={!!activeDrawerTarget}
        onClose={() => setActiveDrawerTarget(null)}
        onUpdateStage={handleUpdateStage}
        onAddNote={handleAddNote}
        onOpenPlaybook={(t) => {
          setActiveDrawerTarget(null);
          setActivePlaybookTarget(t);
        }}
        onOpenOutreach={(t) => {
          setActiveDrawerTarget(null);
          setActiveOutreachTarget(t);
        }}
      />

      {/* Statutory Deal Playbook & Term Sheet Modal */}
      <DealPlaybookModal
        target={activePlaybookTarget}
        isOpen={!!activePlaybookTarget}
        onClose={() => setActivePlaybookTarget(null)}
      />

      {/* Executive Outreach Generator Modal */}
      <OutreachModal
        target={activeOutreachTarget}
        isOpen={!!activeOutreachTarget}
        onClose={() => setActiveOutreachTarget(null)}
        onLogOutreach={handleLogOutreach}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading Asset Liberator Special Situations Radar...</div>}>
      <AssetLiberatorMain />
    </Suspense>
  );
}
