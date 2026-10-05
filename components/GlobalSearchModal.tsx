import React, { useState, useEffect, useRef } from "react";
import { TargetCompany, ExecutiveContact } from "@/lib/types";
import { searchTargetsAndContacts, GlobalSearchResult } from "@/lib/crm";
import { formatCurrency } from "@/lib/utils";
import { 
  Search, 
  X, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  ArrowUpRight, 
  PhoneCall, 
  Pencil, 
  FileText,
  Layers,
  Sparkles
} from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  targets: TargetCompany[];
  onOpenDrawer: (target: TargetCompany) => void;
  onOpenEditContact: (target: TargetCompany, contact: ExecutiveContact | null) => void;
  onOpenLogCall: (target: TargetCompany, contact: ExecutiveContact | null) => void;
  onNavigateToCrm?: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  targets,
  onOpenDrawer,
  onOpenEditContact,
  onOpenLogCall,
  onNavigateToCrm,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Keyboard shortcut Cmd+K or Ctrl+K to toggle modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResults: GlobalSearchResult = searchTargetsAndContacts(query, targets);
  const hasResults = searchResults.contacts.length > 0 || searchResults.companies.length > 0;
  const isQueryEmpty = query.trim().length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 border-b border-stone-800 flex items-center space-x-3 bg-stone-950/80">
          <Search className="h-5 w-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people (names, phones, emails), companies, tickers (e.g. Stephen, NLST, 310)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-stone-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="rounded-lg p-1 text-stone-400 hover:text-white hover:bg-stone-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center rounded border border-stone-800 bg-stone-950 px-2 py-0.5 text-[10px] font-mono text-stone-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1 max-h-[65vh]">
          {isQueryEmpty ? (
            <div className="py-8 text-center space-y-3">
              <div className="flex justify-center space-x-3 text-stone-600">
                <User className="h-6 w-6 text-cyan-500/50" />
                <Building2 className="h-6 w-6 text-emerald-500/50" />
                <Sparkles className="h-6 w-6 text-amber-500/50" />
              </div>
              <p className="text-xs text-stone-400 font-mono">
                Type any executive name, telephone digits, email, ticker, or company name.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {["Stephen", "NLST", "CEO", "Receiver", "310", "California", "HMBL"].map((badge) => (
                  <button
                    key={badge}
                    onClick={() => setQuery(badge)}
                    className="rounded-lg border border-stone-800 bg-stone-950/60 px-2.5 py-1 text-[11px] font-mono text-stone-400 hover:border-emerald-500/40 hover:text-emerald-300 transition"
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center text-stone-500">
              <p className="text-sm font-semibold text-stone-300">No matching contacts or companies found</p>
              <p className="text-xs mt-1">Try searching by partial name, phone digits, or stock symbol.</p>
            </div>
          ) : (
            <>
              {/* Category 1: People & Decision Makers */}
              {searchResults.contacts.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider px-1">
                    <span className="flex items-center space-x-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>People & Decision Makers ({searchResults.contacts.length})</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-normal">Click to call, email or edit</span>
                  </div>

                  <div className="space-y-2">
                    {searchResults.contacts.map(({ target, contact, matchField }) => (
                      <div
                        key={target.id + "-" + contact.id}
                        className="rounded-2xl border border-stone-800 bg-stone-950/90 p-3 sm:p-3.5 hover:border-cyan-500/40 transition group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-xs sm:text-sm group-hover:text-cyan-300 transition">
                                {contact.name}
                              </span>
                              <span className="rounded bg-stone-850 px-1.5 py-0.2 text-[9px] font-mono text-stone-400 border border-stone-750">
                                {contact.entity}
                              </span>
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/20">
                                {target.ticker}
                              </span>
                            </div>
                            <p className="text-[11px] text-cyan-400 font-medium mt-0.5">
                              {contact.title} <span className="text-stone-500">•</span> {target.name} ({target.asset.subsidiaryName})
                            </p>
                            <div className="flex items-center space-x-3 text-[11px] font-mono text-stone-400 mt-1.5">
                              <a 
                                href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                                className="flex items-center space-x-1 text-stone-300 hover:text-emerald-400"
                              >
                                <Phone className="h-3 w-3 text-stone-500" />
                                <span>{contact.phone}</span>
                              </a>
                              <span>•</span>
                              <a 
                                href={`mailto:${contact.email}`}
                                className="flex items-center space-x-1 text-stone-300 hover:text-cyan-400 truncate max-w-[200px]"
                              >
                                <Mail className="h-3 w-3 text-stone-500" />
                                <span>{contact.email}</span>
                              </a>
                            </div>
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex items-center space-x-1.5 self-end sm:self-center shrink-0">
                            <button
                              onClick={() => {
                                onClose();
                                onOpenLogCall(target, contact);
                              }}
                              title="Log Call"
                              className="flex items-center space-x-1 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1.5 text-[11px] font-mono font-medium text-cyan-300 hover:bg-cyan-500/20 transition"
                            >
                              <PhoneCall className="h-3 w-3" />
                              <span className="hidden sm:inline">Log Call</span>
                            </button>
                            <button
                              onClick={() => {
                                onClose();
                                onOpenEditContact(target, contact);
                              }}
                              title="Edit Contact"
                              className="rounded-xl border border-stone-800 bg-stone-900 p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 transition"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                onClose();
                                onOpenDrawer(target);
                              }}
                              title="View Full Company Dossier"
                              className="flex items-center space-x-1 rounded-xl bg-stone-800 px-2.5 py-1.5 text-[11px] font-medium text-stone-200 hover:bg-stone-700 hover:text-white transition"
                            >
                              <span>Dossier</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category 2: Companies & Tickers */}
              {searchResults.companies.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider px-1">
                    <span className="flex items-center space-x-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>Companies & Tickers ({searchResults.companies.length})</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-normal">Click to inspect extraction terms</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResults.companies.map(({ target }) => (
                      <div
                        key={target.id}
                        onClick={() => {
                          onClose();
                          onOpenDrawer(target);
                        }}
                        className="rounded-2xl border border-stone-800 bg-stone-950/80 p-3 hover:border-emerald-500/40 cursor-pointer transition flex flex-col justify-between space-y-2 group"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-emerald-400 flex items-center space-x-1.5">
                              <span>{target.ticker}</span>
                              <span className="text-[10px] text-stone-500 font-normal">• {target.exchange}</span>
                            </span>
                            <span className="rounded bg-stone-850 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300">
                              ROI {target.scores.rollupOpportunityIndex}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-white group-hover:text-emerald-300 transition mt-1 truncate">
                            {target.asset.subsidiaryName}
                          </h4>
                          <p className="text-[10px] text-stone-400 truncate">
                            Parent: {target.name}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-850 flex items-center justify-between font-mono text-[10px]">
                          <span className="text-emerald-400 font-bold">
                            ${(target.asset.annualRevenue / 1000000).toFixed(1)}M Rev
                          </span>
                          <span className="text-stone-400">
                            Buyout: {formatCurrency(target.extractionFeasibility.estimatedAcquisitionCost)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-[11px] font-mono text-stone-500">
          <div className="flex items-center space-x-3">
            <span>Live indexed: {targets.length} Companies</span>
            <span>•</span>
            <span>{targets.reduce((acc, t) => acc + t.contacts.length, 0)} Decision Makers</span>
          </div>
          <span className="hidden sm:inline text-stone-400">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
