import React, { useState } from "react";
import { EDGAR_EVENT_FEEDS } from "@/lib/data/eventFeeds";
import { EdgarEventFeedItem } from "@/lib/types";
import { 
  FileText, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Filter, 
  Search, 
  CheckCircle2, 
  Building2, 
  Scale, 
  ArrowRight 
} from "lucide-react";

interface EventFeedViewProps {
  onSelectTarget?: (ticker: string) => void;
}

export const EventFeedView: React.FC<EventFeedViewProps> = ({ onSelectTarget }) => {
  const [selectedItemType, setSelectedItemType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredEvents = EDGAR_EVENT_FEEDS.filter((item) => {
    if (selectedItemType !== "all" && item.itemType !== selectedItemType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.ticker.toLowerCase().includes(q) ||
        item.companyName.toLowerCase().includes(q) ||
        item.headline.toLowerCase().includes(q) ||
        item.separableAssetIdentified.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getItemBadge = (type: string) => {
    if (type === "item_204") return "bg-rose-500/15 text-rose-300 border-rose-500/30";
    if (type === "item_301") return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    if (type === "item_401" || type === "item_402") return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    if (type === "item_103") return "bg-red-500/15 text-red-300 border-red-500/30";
    if (type === "nt_10k" || type === "nt_10q") return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-850 bg-stone-900/90 p-5 sm:p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/20">
                DAILY SEC EDGAR EVENT FEED
              </span>
              <span className="text-xs font-mono text-stone-400">
                Early-Warning Restructuring Triggers
              </span>
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-black text-white">
              Sourced from Events, Not Names
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-400 max-w-2xl">
              Monitors automated 8-K debt accelerations (Item 2.04), Nasdaq deficiency notices (Item 3.01 with 6–12 months early lead time), auditor resignations (Item 4.01), and Chapter 11 dockets.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-3 text-right shrink-0">
            <span className="text-[10px] font-mono text-stone-500 uppercase">ACTIVE TRIGGERS</span>
            <p className="text-lg font-mono font-black text-emerald-400">
              {filteredEvents.length} Monitored
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mt-4 pt-4 border-t border-stone-800 flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Triggers" },
            { id: "item_204", label: "Item 2.04: Debt Acceleration" },
            { id: "item_301", label: "Item 3.01: Nasdaq Deficiency (6-12m Lead)" },
            { id: "item_401", label: "Item 4.01: Auditor Resignation" },
            { id: "item_103", label: "Item 1.03: Chapter 11 Petitions" },
            { id: "nt_10k", label: "NT 10-K: Late Annual Reports" },
            { id: "ccaa_notice", label: "Canada CCAA / TSXV Cease Trade" },
          ].map((chip) => {
            const isSelected = selectedItemType === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedItemType(chip.id)}
                className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-850"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Event Cards List */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="rounded-2xl border border-stone-850 bg-stone-900/80 p-4 sm:p-5 hover:border-emerald-500/40 transition duration-200 shadow-md space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                  {evt.ticker}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold uppercase ${getItemBadge(evt.itemType)}`}>
                  {evt.itemCode}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  {evt.filingDate}
                </span>
                <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                  ⏱ {evt.leadTimeMonths} Mo Lead Time
                </span>
              </div>

              <a
                href={evt.filingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
              >
                <span>SEC Filing Receipt</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {evt.headline}
              </h4>
              <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                {evt.accelerationOrDeficiencyDetails}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-850 text-xs">
              <div className="rounded-xl bg-stone-950 p-2.5 border border-stone-850">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  Separable Asset Identified:
                </span>
                <p className="text-stone-200 mt-0.5 font-medium">
                  {evt.separableAssetIdentified}
                </p>
              </div>

              <div className="rounded-xl bg-stone-950 p-2.5 border border-stone-850">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  Senior Noteholder / Agent:
                </span>
                <p className="text-stone-200 mt-0.5 font-medium">
                  {evt.primaryLender}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
