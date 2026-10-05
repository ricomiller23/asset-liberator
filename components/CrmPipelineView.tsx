import React, { useState, useMemo } from "react";
import { TargetCompany, CrmStage, PriorityLevel, ExecutiveContact } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  Send, 
  FileText, 
  Plus, 
  CheckCircle,
  AlertCircle,
  PhoneCall,
  Pencil,
  Kanban,
  Table as TableIcon,
  Search,
  Star,
  ExternalLink,
  ArrowUpRight
} from "lucide-react";

interface CrmPipelineViewProps {
  targets: TargetCompany[];
  onOpenDrawer: (target: TargetCompany) => void;
  onOpenOutreach: (target: TargetCompany) => void;
  onUpdateStage: (targetId: string, stage: CrmStage, priority?: PriorityLevel) => void;
  onAddNote: (targetId: string, text: string) => void;
  onOpenEditContact: (target: TargetCompany, contact: ExecutiveContact | null) => void;
  onOpenLogCall: (target: TargetCompany, contact: ExecutiveContact | null) => void;
  onSetPrimaryContact?: (targetId: string, contactId: string) => void;
}

export const CrmPipelineView: React.FC<CrmPipelineViewProps> = ({
  targets,
  onOpenDrawer,
  onOpenOutreach,
  onUpdateStage,
  onAddNote,
  onOpenEditContact,
  onOpenLogCall,
  onSetPrimaryContact,
}) => {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [crmSearchQuery, setCrmSearchQuery] = useState("");
  const [quickNoteTargetId, setQuickNoteTargetId] = useState<string | null>(null);
  const [quickNoteText, setQuickNoteText] = useState("");
  const [selectedMobileStage, setSelectedMobileStage] = useState<CrmStage | "all">("all");

  const stages: { id: CrmStage; title: string; color: string; badgeBg: string }[] = [
    { id: "new", title: "New Opportunities", color: "border-stone-700 text-stone-300", badgeBg: "bg-stone-800 text-stone-300" },
    { id: "outreach_sent", title: "Outreach Sent", color: "border-blue-500/40 text-blue-400", badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
    { id: "in_dialogue", title: "Active Dialogue", color: "border-cyan-500/40 text-cyan-400", badgeBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20" },
    { id: "nda_signed", title: "NDA Executed", color: "border-purple-500/40 text-purple-400", badgeBg: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
    { id: "diligence", title: "In Diligence", color: "border-amber-500/40 text-amber-400", badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
    { id: "term_sheet", title: "Term Sheet Issued", color: "border-emerald-500/40 text-emerald-400", badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
    { id: "foreclosure_pending", title: "Foreclosure / Closing", color: "border-rose-500/40 text-rose-400", badgeBg: "bg-rose-500/10 text-rose-300 border-rose-500/20" },
  ];

  const handleQuickNoteSubmit = (targetId: string) => {
    if (!quickNoteText.trim()) return;
    onAddNote(targetId, quickNoteText.trim());
    setQuickNoteText("");
    setQuickNoteTargetId(null);
  };

  // Filter targets inside CRM by search query
  const filteredTargets = useMemo(() => {
    const q = crmSearchQuery.trim().toLowerCase();
    if (!q) return targets;
    const cleanDigits = q.replace(/[^0-9]/g, "");

    return targets.filter((t) => {
      const matchCompany = 
        t.ticker.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.asset.subsidiaryName.toLowerCase().includes(q);

      const matchContact = t.contacts.some((c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (cleanDigits.length >= 3 && c.phone.replace(/[^0-9]/g, "").includes(cleanDigits))
      );

      return matchCompany || matchContact;
    });
  }, [targets, crmSearchQuery]);

  const visibleStages = selectedMobileStage === "all" 
    ? stages 
    : stages.filter((s) => s.id === selectedMobileStage);

  return (
    <div className="flex flex-col space-y-4 sm:space-y-6">
      {/* CRM Telemetry Top Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-3 sm:p-4 font-mono">
          <div className="text-[10px] sm:text-[11px] text-stone-500">ACTIVE PIPELINE TARGETS</div>
          <div className="text-base sm:text-xl font-bold text-white mt-1">{targets.length} Companies</div>
        </div>
        <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-3 sm:p-4 font-mono">
          <div className="text-[10px] sm:text-[11px] text-stone-500">SUBSIDIARY REV IN PLAY</div>
          <div className="text-base sm:text-xl font-bold text-emerald-400 mt-1">
            ${(targets.reduce((acc, t) => acc + t.asset.annualRevenue, 0) / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-3 sm:p-4 font-mono">
          <div className="text-[10px] sm:text-[11px] text-stone-500">SENIOR DEBT RECOVERY</div>
          <div className="text-base sm:text-xl font-bold text-cyan-400 mt-1">
            ${(targets.reduce((acc, t) => acc + t.extractionFeasibility.seniorSecuredDebtAmount, 0) / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-3 sm:p-4 font-mono">
          <div className="text-[10px] sm:text-[11px] text-stone-500">EXECUTIVE CONTACTS</div>
          <div className="text-base sm:text-xl font-bold text-amber-400 mt-1">
            {targets.reduce((acc, t) => acc + t.contacts.length, 0)} Decision Makers
          </div>
        </div>
      </div>

      {/* CRM Controls Bar: Search + View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900/60 p-2.5 sm:p-3 rounded-2xl border border-stone-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            value={crmSearchQuery}
            onChange={(e) => setCrmSearchQuery(e.target.value)}
            placeholder="Filter CRM by person name, phone, ticker, or company..."
            className="w-full rounded-xl border border-stone-800 bg-stone-950 pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:border-cyan-500 focus:outline-none"
          />
          {crmSearchQuery && (
            <button
              onClick={() => setCrmSearchQuery("")}
              className="absolute right-2.5 top-2 text-stone-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Toggle (Kanban vs Table) */}
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          <span className="text-[11px] font-mono text-stone-400 hidden md:inline">VIEW:</span>
          <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800 text-xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                viewMode === "kanban"
                  ? "bg-stone-800 text-white shadow-xs font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Kanban className="h-3.5 w-3.5 text-cyan-400" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                viewMode === "table"
                  ? "bg-stone-800 text-white shadow-xs font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Stage Selector Tabs (visible on small screens for fast 1-tap navigation) */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        <button
          onClick={() => setSelectedMobileStage("all")}
          className={`rounded-lg px-2.5 py-1 text-[11px] font-mono shrink-0 transition ${
            selectedMobileStage === "all"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
              : "bg-stone-900 text-stone-400 border border-stone-800"
          }`}
        >
          All Stages ({filteredTargets.length})
        </button>
        {stages.map((stage) => {
          const count = filteredTargets.filter((t) => t.crm.stage === stage.id).length;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedMobileStage(stage.id)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-mono shrink-0 transition ${
                selectedMobileStage === stage.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "bg-stone-900 text-stone-400 border border-stone-800"
              }`}
            >
              {stage.title.split(" ")[0]} ({count})
            </button>
          );
        })}
      </div>

      {/* View Mode 1: KANBAN BOARD */}
      {viewMode === "kanban" ? (
        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin">
          {visibleStages.map((stage) => {
            const stageTargets = filteredTargets.filter((t) => t.crm.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="w-80 sm:w-84 shrink-0 snap-start flex flex-col rounded-3xl border border-stone-800 bg-stone-900/60 p-3 sm:p-4 backdrop-blur-sm shadow-lg"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`h-2.5 w-2.5 rounded-full border ${stage.color.split(" ")[0]} bg-current`} />
                    <h3 className="font-bold text-xs sm:text-sm text-stone-200">{stage.title}</h3>
                  </div>
                  <span className="rounded-full bg-stone-800 px-2 py-0.5 font-mono text-[10px] text-stone-400">
                    {stageTargets.length}
                  </span>
                </div>

                {/* Column Items */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[68vh] pr-1 scrollbar-thin">
                  {stageTargets.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-stone-800/80 p-6 text-center text-[11px] text-stone-600 font-mono">
                      No targets in {stage.title.toLowerCase()}
                    </div>
                  ) : (
                    stageTargets.map((t) => {
                      const primaryContact = t.contacts[0];
                      return (
                        <div
                          key={t.id}
                          className="rounded-2xl border border-stone-800 bg-stone-950 p-3 sm:p-3.5 hover:border-stone-700 transition shadow-xs group"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-1.5 min-w-0">
                              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 shrink-0">
                                {t.ticker}
                              </span>
                              <span
                                onClick={() => onOpenDrawer(t)}
                                className="font-bold text-stone-200 hover:text-emerald-400 transition cursor-pointer truncate text-xs"
                              >
                                {t.asset.subsidiaryName}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-emerald-400 shrink-0 ml-1">
                              ROI {t.scores.rollupOpportunityIndex}
                            </span>
                          </div>

                          <div className="mt-1 text-[11px] text-stone-400 truncate">
                            <span className="text-stone-500">Parent:</span> {t.name}
                          </div>

                          {/* Financials pill grid */}
                          <div className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                            <div className="rounded bg-stone-900 p-1.5 border border-stone-850">
                              <span className="text-stone-500 block text-[9px]">REVENUE</span>
                              <span className="text-emerald-400 font-bold">
                                ${(t.asset.annualRevenue / 1000000).toFixed(1)}M Rev
                              </span>
                            </div>
                            <div className="rounded bg-stone-900 p-1.5 border border-stone-850">
                              <span className="text-stone-500 block text-[9px]">SR BUYOUT</span>
                              <span className="text-cyan-400 font-bold">
                                {formatCurrency(t.extractionFeasibility.estimatedAcquisitionCost)} Cash
                              </span>
                            </div>
                          </div>

                          {/* Decision Maker Card Highlight */}
                          <div className="mt-2.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-2.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center space-x-1.5 min-w-0">
                                <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                                <span className="font-bold text-white truncate">
                                  {primaryContact ? primaryContact.name : "No Contact Assigned"}
                                </span>
                              </div>
                              <button
                                onClick={() => onOpenEditContact(t, primaryContact || null)}
                                title="Change or Edit Contact Person"
                                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-0.5 shrink-0 ml-1"
                              >
                                <Pencil className="h-2.5 w-2.5" />
                                <span>Edit</span>
                              </button>
                            </div>

                            {primaryContact && (
                              <>
                                <p className="text-[10px] text-cyan-300 truncate mt-0.5">
                                  {primaryContact.title} ({primaryContact.entity})
                                </p>
                                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-stone-300 pt-1.5 border-t border-cyan-900/40">
                                  <a
                                    href={`tel:${primaryContact.phone.replace(/[^0-9]/g, "")}`}
                                    className="flex items-center space-x-1 text-emerald-400 hover:underline"
                                  >
                                    <Phone className="h-2.5 w-2.5" />
                                    <span>{primaryContact.phone}</span>
                                  </a>
                                  <button
                                    onClick={() => onOpenLogCall(t, primaryContact)}
                                    className="flex items-center space-x-1 text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30"
                                  >
                                    <PhoneCall className="h-2.5 w-2.5" />
                                    <span>Log Call</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Quick stage selector */}
                          <div className="mt-3 pt-2 border-t border-stone-850 flex items-center justify-between text-[10px]">
                            <select
                              value={t.crm.stage}
                              onChange={(e) => onUpdateStage(t.id, e.target.value as CrmStage)}
                              className="rounded bg-stone-900 px-2 py-1 text-[10px] font-mono text-cyan-300 border border-stone-800 focus:outline-none max-w-[130px] sm:max-w-none truncate"
                            >
                              {stages.map((s) => (
                                <option key={s.id} value={s.id}>
                                  Move: {s.title}
                                </option>
                              ))}
                            </select>

                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => onOpenOutreach(t)}
                                title="Generate Outreach"
                                className="rounded bg-emerald-500/20 p-1.5 text-emerald-300 hover:bg-emerald-500/30 transition"
                              >
                                <Send className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => onOpenDrawer(t)}
                                title="Open Full Dossier"
                                className="rounded bg-stone-800 p-1.5 text-stone-300 hover:text-white transition"
                              >
                                <FileText className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Note expander */}
                          {quickNoteTargetId === t.id ? (
                            <div className="mt-2 pt-2 border-t border-stone-850">
                              <input
                                type="text"
                                placeholder="Add quick activity note..."
                                value={quickNoteText}
                                onChange={(e) => setQuickNoteText(e.target.value)}
                                className="w-full rounded bg-stone-900 px-2 py-1 text-[10px] text-white border border-stone-800 focus:border-emerald-500 focus:outline-none mb-1.5"
                              />
                              <div className="flex justify-end space-x-1">
                                <button
                                  onClick={() => setQuickNoteTargetId(null)}
                                  className="rounded px-2 py-0.5 text-[9px] text-stone-500 hover:text-stone-300"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleQuickNoteSubmit(t.id)}
                                  className="rounded bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-stone-950"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setQuickNoteTargetId(t.id)}
                              className="mt-2 text-[9px] font-mono text-stone-500 hover:text-stone-300 flex items-center space-x-1"
                            >
                              <Plus className="h-2.5 w-2.5" />
                              <span>Add note</span>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode 2: WORLD-CLASS TABLE VIEW */
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 overflow-hidden shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/80 text-[10px] font-mono text-stone-400 border-b border-stone-800 uppercase">
                <tr>
                  <th className="px-4 py-3">Ticker / Target</th>
                  <th className="px-4 py-3">Operating Asset</th>
                  <th className="px-4 py-3">Primary Decision Maker</th>
                  <th className="px-4 py-3">Direct Phone / Email</th>
                  <th className="px-4 py-3">Pipeline Stage</th>
                  <th className="px-4 py-3 text-right">Rev / Buyout</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 font-mono text-[11px]">
                {filteredTargets.map((t) => {
                  const primaryContact = t.contacts[0];
                  const currentStageObj = stages.find((s) => s.id === t.crm.stage);

                  return (
                    <tr key={t.id} className="hover:bg-stone-850/50 transition">
                      {/* Ticker / Company */}
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                            {t.ticker}
                          </span>
                          <span className="font-sans font-semibold text-stone-200 truncate max-w-[140px]">
                            {t.name}
                          </span>
                        </div>
                      </td>

                      {/* Operating Asset */}
                      <td className="px-4 py-3">
                        <div className="font-sans font-medium text-white truncate max-w-[180px]">
                          {t.asset.subsidiaryName}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {t.sector}
                        </div>
                      </td>

                      {/* Primary Contact Person with Quick Change */}
                      <td className="px-4 py-3">
                        {primaryContact ? (
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-sans font-bold text-white">
                                {primaryContact.name}
                              </span>
                              <button
                                onClick={() => onOpenEditContact(t, primaryContact)}
                                title="Change Contact Person"
                                className="text-cyan-400 hover:text-cyan-300 p-0.5 rounded hover:bg-stone-800 transition"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="text-[10px] text-cyan-400 font-sans">
                              {primaryContact.title} ({primaryContact.entity})
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => onOpenEditContact(t, null)}
                            className="text-xs text-emerald-400 hover:underline flex items-center space-x-1"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Assign Contact</span>
                          </button>
                        )}
                      </td>

                      {/* Direct Phone & Email */}
                      <td className="px-4 py-3">
                        {primaryContact && (
                          <div className="space-y-1">
                            <a
                              href={`tel:${primaryContact.phone.replace(/[^0-9]/g, "")}`}
                              className="flex items-center space-x-1 text-emerald-400 hover:underline"
                            >
                              <Phone className="h-3 w-3 text-stone-500" />
                              <span>{primaryContact.phone}</span>
                            </a>
                            <a
                              href={`mailto:${primaryContact.email}`}
                              className="flex items-center space-x-1 text-stone-400 hover:text-cyan-300 truncate max-w-[160px]"
                            >
                              <Mail className="h-3 w-3 text-stone-500" />
                              <span>{primaryContact.email}</span>
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Pipeline Stage Dropdown */}
                      <td className="px-4 py-3">
                        <select
                          value={t.crm.stage}
                          onChange={(e) => onUpdateStage(t.id, e.target.value as CrmStage)}
                          className={`rounded-lg px-2 py-1 text-[10px] font-mono border focus:outline-none ${
                            currentStageObj?.badgeBg || "bg-stone-900 text-stone-300 border-stone-800"
                          }`}
                        >
                          {stages.map((s) => (
                            <option key={s.id} value={s.id} className="bg-stone-950 text-white">
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Revenue & Buyout */}
                      <td className="px-4 py-3 text-right">
                        <div className="text-emerald-400 font-bold">
                          ${(t.asset.annualRevenue / 1000000).toFixed(1)}M Rev
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {formatCurrency(t.extractionFeasibility.estimatedAcquisitionCost)} Cash
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onOpenLogCall(t, primaryContact || null)}
                            title="Log Call"
                            className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-1.5 text-cyan-300 hover:bg-cyan-500/20 transition"
                          >
                            <PhoneCall className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onOpenOutreach(t)}
                            title="Generate Outreach"
                            className="rounded-lg bg-emerald-500/20 p-1.5 text-emerald-300 hover:bg-emerald-500/30 transition"
                          >
                            <Send className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onOpenDrawer(t)}
                            title="Open Dossier"
                            className="rounded-lg bg-stone-800 p-1.5 text-stone-300 hover:text-white transition"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
