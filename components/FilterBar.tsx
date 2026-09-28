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
    <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-4 shadow-sm backdrop-blur-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Search by Ticker, Parent Name, Subsidiary (e.g. AERO, Precision, Avionics, 510(k))..."
            value={filters.query || ""}
            onChange={handleQueryChange}
            className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Sort and Count */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 text-stone-400">
            <span className="font-mono text-emerald-400 font-semibold">{resultCount}</span>
            <span>targets qualified</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-stone-400">Sort:</span>
            <select
              value={filters.sortBy || "roi"}
              onChange={handleSortChange}
              className="rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs font-medium text-stone-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="roi">Highest Rollup ROI</option>
              <option value="revenue">Highest Subsidiary Revenue</option>
              <option value="distress">Greatest Vehicle Distress</option>
              <option value="debt_asc">Lowest Senior Debt Buyout</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="rounded-xl border border-stone-800 bg-stone-950 p-2 text-stone-400 hover:text-white transition"
            title="Reset Filters"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Playbook Quick Chips */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-3 border-t border-stone-800/80 text-xs">
        <span className="text-[11px] font-mono text-stone-500 mr-1.5 uppercase tracking-wider">Playbook:</span>
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
              className={`rounded-lg px-2.5 py-1 text-xs transition font-medium ${
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
