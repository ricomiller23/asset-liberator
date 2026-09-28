import React from "react";
import { Search, Filter, SlidersHorizontal, RefreshCcw, Sparkles } from "lucide-react";
import { SearchFilters, PlaybookType, ExchangeType, FilingStatus } from "@/lib/types";

interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  resultCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  resultCount,
}) => {
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, query: e.target.value });
  };

  const handlePlaybookSelect = (playbook: PlaybookType | "all") => {
    onFilterChange({ ...filters, playbook });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as any });
  };

  const handleReset = () => {
    onFilterChange({
      query: "",
      sector: "all",
      playbook: "all",
      exchange: "all",
      filingStatus: "all",
      minRevenue: undefined,
      sortBy: "roi",
    });
  };

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-3 sm:p-4 shadow-sm backdrop-blur-md">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Search Ticker, Name, Subsidiary, IP (e.g. AERO, Precision, Avionics, 510(k))..."
            value={filters.query || ""}
            onChange={handleQueryChange}
            className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-stone-400 shrink-0">
            <span className="font-mono text-emerald-400 font-semibold">{resultCount}</span>
            <span className="text-[11px] sm:text-xs">targets</span>
          </div>

          <div className="flex items-center space-x-1.5 flex-1 sm:flex-initial">
            <span className="text-stone-400 text-[11px] sm:text-xs shrink-0">Sort:</span>
            <select
              value={filters.sortBy || "roi"}
              onChange={handleSortChange}
              className="w-full sm:w-auto rounded-xl border border-stone-800 bg-stone-950 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-medium text-stone-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="roi">Highest Rollup ROI</option>
              <option value="revenue">Highest Sub Revenue</option>
              <option value="distress">Vehicle Distress</option>
              <option value="debt_asc">Lowest Debt Buyout</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="rounded-xl border border-stone-800 bg-stone-950 p-1.5 sm:p-2 text-stone-400 hover:text-white transition shrink-0"
            title="Reset Filters"
          >
            <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Playbook Quick Chips - Horizontal Scrollable on Mobile */}
      <div className="mt-2.5 sm:mt-3.5 flex items-center gap-1.5 pt-2.5 border-t border-stone-800/80 text-xs overflow-x-auto scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
        <span className="text-[10px] sm:text-[11px] font-mono text-stone-500 mr-1 uppercase tracking-wider shrink-0">Playbook:</span>
        {[
          { id: "all", label: "All Playbooks" },
          { id: "article_9_foreclosure", label: "Article 9 UCC Foreclosure" },
          { id: "section_363_sale", label: "Section 363 Stalking Horse" },
          { id: "consensual_carveout", label: "Consensual Triangular Carve-Out" },
          { id: "abc_receivership", label: "ABC / State Receivership" },
        ].map((item) => {
          const isSelected = (filters.playbook || "all") === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handlePlaybookSelect(item.id as any)}
              className={`rounded-lg px-2.5 py-1 text-[11px] sm:text-xs transition font-medium shrink-0 ${
                isSelected
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold"
                  : "bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-850"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
