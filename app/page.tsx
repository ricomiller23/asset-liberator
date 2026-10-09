"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TargetCompany, SearchFilters, CrmStage, PriorityLevel, ExecutiveContact } from "@/lib/types";
import { 
  getStoredTargets, 
  saveStoredTargets, 
  updateTargetCrmStage, 
  addTargetCrmNote, 
  logTargetActivity,
  updateTargetContact,
  addTargetContact,
  setPrimaryContact,
  deleteTargetContact,
  logCallActivity
} from "@/lib/crm";
import { Navbar } from "@/components/Navbar";
import { EventFeedView } from "@/components/EventFeedView";
import { LenderIndexView } from "@/components/LenderIndexView";
import { NavTabType } from "@/components/Navbar";

import { FilterBar } from "@/components/FilterBar";
import { TargetCard } from "@/components/TargetCard";
import { TargetDrawer } from "@/components/TargetDrawer";
import { DealPlaybookModal } from "@/components/DealPlaybookModal";
import { OutreachModal } from "@/components/OutreachModal";
import { CrmPipelineView } from "@/components/CrmPipelineView";
import { EditContactModal } from "@/components/EditContactModal";
import { LogCallModal } from "@/components/LogCallModal";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import { CrmReportModal } from "@/components/CrmReportModal";
import { 
  ShieldAlert, 
  Sparkles, 
  Flame, 
  Scale, 
  Layers, 
  Users, 
  Download, 
  RefreshCcw,
  CheckCircle2,
  FileCheck2,
  PhoneCall
} from "lucide-react";

function AssetLiberatorMain() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const initialTierParam = searchParams.get("revenueTier");
  const initialTier = (initialTierParam === "commercial" || initialTierParam === "pre_revenue_ip") 
    ? initialTierParam 
    : "all";
  const initialVertical = (searchParams.get("vertical") as any) || "all";

  const [activeTab, setActiveTab] = useState<NavTabType>("screener");
  const [activeDrawerTarget, setActiveDrawerTarget] = useState<TargetCompany | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(500);
  const [activePlaybookTarget, setActivePlaybookTarget] = useState<TargetCompany | null>(null);
  const [activeOutreachTarget, setActiveOutreachTarget] = useState<TargetCompany | null>(null);
  
  // Contact & Call Modals
  const [editContactTarget, setEditContactTarget] = useState<TargetCompany | null>(null);
  const [contactToEdit, setContactToEdit] = useState<ExecutiveContact | null>(null);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);

  const [logCallTarget, setLogCallTarget] = useState<TargetCompany | null>(null);
  const [logCallContact, setLogCallContact] = useState<ExecutiveContact | null>(null);
  const [isLogCallOpen, setIsLogCallOpen] = useState(false);

  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isCrmReportOpen, setIsCrmReportOpen] = useState(false);

  const [localTargets, setLocalTargets] = useState<TargetCompany[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    sector: "all",
    playbook: "all",
    exchange: "all",
    filingStatus: "all",
    revenueTier: initialTier,
    vertical: initialVertical,
    sortBy: "roi",
  });

  // Load initial targets on client mount
  useEffect(() => {
    const data = getStoredTargets();
    setLocalTargets(data);
  }, []);

  // Fetch targets via API (refreshes every time opened / focused)
  const { data: apiData, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["targets", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.query) params.set("query", filters.query);
      if (filters.sector && filters.sector !== "all") params.set("sector", filters.sector);
      if (filters.playbook && filters.playbook !== "all") params.set("playbook", filters.playbook);
      if (filters.exchange && filters.exchange !== "all") params.set("exchange", filters.exchange);
      if (filters.filingStatus && filters.filingStatus !== "all") params.set("filingStatus", filters.filingStatus);
      if (filters.revenueTier && filters.revenueTier !== "all") params.set("revenueTier", filters.revenueTier);
      if (filters.tier && filters.tier !== "all") params.set("tier", filters.tier);
      if (filters.vertical && filters.vertical !== "all") params.set("vertical", filters.vertical);
      if (filters.leadTime && filters.leadTime !== "all") params.set("leadTime", filters.leadTime);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      params.set("_t", Date.now().toString());

      const res = await fetch(`/api/targets?${params.toString()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch targets");
      const json = await res.json();
      return json;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
  });

  // Re-fetch automatically when window/tab is focused or opened
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };
    const handleFocus = () => {
      refetch();
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refetch]);

  // Sync API response into local state when fresh server targets arrive
  useEffect(() => {
    if (apiData?.targets && Array.isArray(apiData.targets)) {
      setLocalTargets((prev) => {
        if (prev.length === 0) return apiData.targets;

        // Merge server targets with any local modifications
        return apiData.targets.map((serverT: TargetCompany) => {
          const localMatch = prev.find((p) => p.id === serverT.id || p.ticker === serverT.ticker);
          if (localMatch) {
            return {
              ...serverT,
              contacts: localMatch.contacts && localMatch.contacts.length > 0 ? localMatch.contacts : serverT.contacts,
              crm: localMatch.crm || serverT.crm,
            };
          }
          return serverT;
        });
      });
    }
  }, [apiData]);

  // Displayed targets are directly derived from localTargets
  const displayedTargets: TargetCompany[] = useMemo(() => {
    let list: TargetCompany[] = localTargets.length > 0 ? localTargets : (apiData?.targets || []);

    // Foreign stock & vertical filtering
    if (filters.vertical && filters.vertical !== "all") {
      list = list.filter((t: TargetCompany) => {
        if (filters.vertical === "cross_border_canada") {
          return (
            t.vertical === "cross_border_canada" ||
            ["TSX", "TSXV", "CSE", "NEO"].includes(t.exchange) ||
            t.jurisdiction === "Canada" ||
            t.id.startsWith("ca-")
          );
        }
        if (filters.vertical === "cross_border_australia") {
          return (
            t.vertical === "cross_border_australia" ||
            t.exchange === "ASX" ||
            t.jurisdiction === "Australia" ||
            t.id.startsWith("au-")
          );
        }
        if (filters.vertical === "all_foreign") {
          return (
            t.vertical === "cross_border_canada" ||
            t.vertical === "cross_border_australia" ||
            ["TSX", "TSXV", "CSE", "NEO", "ASX"].includes(t.exchange) ||
            t.jurisdiction === "Canada" ||
            t.jurisdiction === "Australia" ||
            t.id.startsWith("ca-") ||
            t.id.startsWith("au-")
          );
        }
        return t.vertical === filters.vertical;
      });
    }

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      const digits = q.replace(/[^0-9]/g, "");
      return list.filter((t: TargetCompany) =>
        t.ticker.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.asset.subsidiaryName.toLowerCase().includes(q) ||
        t.sector.toLowerCase().includes(q) ||
        t.contacts.some((c: ExecutiveContact) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (digits.length >= 3 && c.phone.replace(/[^0-9]/g, "").includes(digits))
        )
      );
    }

    return list;
  }, [localTargets, apiData, filters.query, filters.vertical]);

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

  // Sync drawer target with latest local modifications
  const syncActiveDrawer = (updatedList: TargetCompany[], targetId: string) => {
    if (activeDrawerTarget && (activeDrawerTarget.id === targetId || activeDrawerTarget.ticker.toUpperCase() === targetId.toUpperCase())) {
      const match = updatedList.find((t) => t.id === targetId || t.ticker.toUpperCase() === targetId.toUpperCase());
      if (match) setActiveDrawerTarget(match);
    }
  };

  // CRM Handlers
  const handleUpdateStage = (targetId: string, stage: CrmStage, priority?: PriorityLevel) => {
    const updated = updateTargetCrmStage(targetId, stage, priority);
    setLocalTargets(updated);
    syncActiveDrawer(updated, targetId);
  };

  const handleAddNote = (targetId: string, text: string) => {
    const updated = addTargetCrmNote(targetId, text, "Special Situations Desk");
    setLocalTargets(updated);
    syncActiveDrawer(updated, targetId);
  };

  const handleLogOutreach = (targetId: string, contactName: string, summary: string) => {
    let updated = updateTargetCrmStage(targetId, "outreach_sent");
    updated = logTargetActivity(targetId, "email", summary);
    setLocalTargets(updated);
    syncActiveDrawer(updated, targetId);
  };

  // Contact Handlers
  const handleSaveContact = (
    targetId: string,
    contactData: ExecutiveContact,
    isNew: boolean,
    setAsPrimary: boolean
  ) => {
    let updated: TargetCompany[];
    if (isNew) {
      updated = addTargetContact(targetId, contactData, setAsPrimary);
    } else {
      updated = updateTargetContact(targetId, contactData);
      if (setAsPrimary) {
        updated = setPrimaryContact(targetId, contactData.id);
      }
    }
    setLocalTargets(updated);
    syncActiveDrawer(updated, targetId);
  };

  const handleDeleteContact = (targetId: string, contactId: string) => {
    const updated = deleteTargetContact(targetId, contactId);
    setLocalTargets(updated);
    syncActiveDrawer(updated, targetId);
  };

  const handleSetPrimaryContact = (targetId: string, contactId: string) => {
    const updated = setPrimaryContact(targetId, contactId);
    setLocalTargets(updated);
    syncActiveDrawer(updated, targetId);
  };

  const handleLogCall = (
    targetId: string,
    callDetails: {
      contactName: string;
      outcome: string;
      notes: string;
      nextFollowUpDate?: string;
      suggestedStage?: CrmStage;
    }
  ) => {
    const updated = logCallActivity(targetId, callDetails);
    setLocalTargets(updated);
    syncActiveDrawer(updated, targetId);
  };

  const handleOpenEditContact = (target: TargetCompany, contact: ExecutiveContact | null) => {
    setEditContactTarget(target);
    setContactToEdit(contact);
    setIsEditContactOpen(true);
  };

  const handleOpenLogCall = (target: TargetCompany, contact: ExecutiveContact | null) => {
    setLogCallTarget(target);
    setLogCallContact(contact);
    setIsLogCallOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        onOpenReport={() => setIsCrmReportOpen(true)}
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
                Systematically scanning the OTC & Micro-Cap markets for operating businesses with real revenue, positive gross margins, and Tier-1 clients trapped under toxic convertibles, delinquent SEC filings, and auditor resignations—ready to strip clean and roll into our unencumbered public shells.
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

        {/* View Routing: Deal Screener vs 8-K Events vs Lenders vs CRM Pipeline */}
        {activeTab === "screener" ? (
          <div className="space-y-6">
            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              resultCount={displayedTargets.length}
              allTotal={apiData?.meta?.allTotal || (apiData?.meta?.total ?? localTargets.length)}
              tierCounts={apiData?.meta?.tierCounts || apiData?.meta?.tiers}
              onRefresh={() => refetch()}
              isRefreshing={isFetching}
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
                  Try clearing the search query or selecting "All Qualified" to view all live special situations candidates.
                </p>
                <div className="mt-5">
                  <button
                    onClick={() => setFilters({ query: "", sector: "all", playbook: "all", exchange: "all", filingStatus: "all", tier: "all", sortBy: "roi" })}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-emerald-400 transition"
                  >
                    Reset Filter View
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {displayedTargets.slice(0, visibleCount).map((target) => (
                    <TargetCard
                      key={target.id}
                      target={target}
                      onOpenDrawer={(t) => setActiveDrawerTarget(t)}
                      onOpenPlaybook={(t) => setActivePlaybookTarget(t)}
                      onOpenOutreach={(t) => setActiveOutreachTarget(t)}
                      onOpenEditContact={handleOpenEditContact}
                      onOpenLogCall={handleOpenLogCall}
                    />
                  ))}
                </div>

                {visibleCount < displayedTargets.length && (
                  <div className="mt-8 flex justify-center pb-8">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 24)}
                      className="flex items-center space-x-2 rounded-xl border border-stone-800 bg-stone-900 px-6 py-2.5 text-xs font-semibold text-stone-200 hover:bg-stone-850 hover:border-stone-700 transition shadow-sm cursor-pointer"
                    >
                      <span>Load more</span>
                      <span className="text-[11px] font-mono text-stone-400">
                        ({displayedTargets.length - visibleCount} remaining)
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : activeTab === "events" ? (
          <EventFeedView
            onSelectTarget={(ticker) => {
              setFilters((prev) => ({ ...prev, query: ticker, tier: "all" }));
              setActiveTab("screener");
            }}
          />
        ) : activeTab === "lenders" ? (
          <LenderIndexView
            onSelectTicker={(ticker) => {
              setFilters((prev) => ({ ...prev, query: ticker, tier: "all" }));
              setActiveTab("screener");
            }}
          />
        ) : (
          <CrmPipelineView
            targets={displayedTargets}
            onOpenDrawer={(t) => setActiveDrawerTarget(t)}
            onOpenOutreach={(t) => setActiveOutreachTarget(t)}
            onUpdateStage={handleUpdateStage}
            onAddNote={handleAddNote}
            onOpenEditContact={handleOpenEditContact}
            onOpenLogCall={handleOpenLogCall}
            onSetPrimaryContact={handleSetPrimaryContact}
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
        onOpenEditContact={handleOpenEditContact}
        onOpenLogCall={handleOpenLogCall}
        onSetPrimaryContact={handleSetPrimaryContact}
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

      {/* Edit Decision Maker / Contact Modal */}
      <EditContactModal
        isOpen={isEditContactOpen}
        onClose={() => {
          setIsEditContactOpen(false);
          setEditContactTarget(null);
          setContactToEdit(null);
        }}
        target={editContactTarget}
        contactToEdit={contactToEdit}
        onSaveContact={handleSaveContact}
        onDeleteContact={handleDeleteContact}
      />

      {/* Log Executive Call Modal */}
      <LogCallModal
        isOpen={isLogCallOpen}
        onClose={() => {
          setIsLogCallOpen(false);
          setLogCallTarget(null);
          setLogCallContact(null);
        }}
        target={logCallTarget}
        initialContact={logCallContact}
        onLogCall={handleLogCall}
        onOpenEditContact={handleOpenEditContact}
      />

      {/* Global Search Omnibar Modal (Cmd+K / Search Any Entity) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        targets={displayedTargets}
        onOpenDrawer={(t) => setActiveDrawerTarget(t)}
        onOpenEditContact={handleOpenEditContact}
        onOpenLogCall={handleOpenLogCall}
        onNavigateToCrm={() => setActiveTab("crm")}
      />
      {/* CRM Activity & Audit Performance Report Modal */}
      <CrmReportModal
        isOpen={isCrmReportOpen}
        onClose={() => setIsCrmReportOpen(false)}
        targets={displayedTargets}
        onOpenDrawer={(t) => setActiveDrawerTarget(t)}
        onOpenLogCall={handleOpenLogCall}
        onOpenOutreach={(t) => setActiveOutreachTarget(t)}
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
