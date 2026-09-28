import React, { useState } from "react";
import { TargetCompany, CrmStage } from "@/lib/types";
import { 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  Send, 
  FileText, 
  ChevronRight, 
  Calendar, 
  Plus, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface CrmPipelineViewProps {
  targets: TargetCompany[];
  onOpenDrawer: (target: TargetCompany) => void;
  onOpenOutreach: (target: TargetCompany) => void;
  onUpdateStage: (targetId: string, stage: CrmStage) => void;
  onAddNote: (targetId: string, text: string) => void;
}

export const CrmPipelineView: React.FC<CrmPipelineViewProps> = ({
  targets,
  onOpenDrawer,
  onOpenOutreach,
  onUpdateStage,
  onAddNote,
}) => {
  const [quickNoteTargetId, setQuickNoteTargetId] = useState<string | null>(null);
  const [quickNoteText, setQuickNoteText] = useState("");
  const [selectedMobileStage, setSelectedMobileStage] = useState<CrmStage | "all">("all");

  const stages: { id: CrmStage; title: string; color: string }[] = [
    { id: "new", title: "New Opportunities", color: "border-stone-700 text-stone-300" },
    { id: "outreach_sent", title: "Outreach Sent", color: "border-blue-500/40 text-blue-400" },
    { id: "in_dialogue", title: "Active Dialogue", color: "border-cyan-500/40 text-cyan-400" },
    { id: "nda_signed", title: "NDA Executed", color: "border-purple-500/40 text-purple-400" },
    { id: "diligence", title: "In Diligence", color: "border-amber-500/40 text-amber-400" },
    { id: "term_sheet", title: "Term Sheet Issued", color: "border-emerald-500/40 text-emerald-400" },
    { id: "foreclosure_pending", title: "Foreclosure / Closing", color: "border-rose-500/40 text-rose-400" },
  ];

  const handleQuickNoteSubmit = (targetId: string) => {
    if (!quickNoteText.trim()) return;
    onAddNote(targetId, quickNoteText.trim());
    setQuickNoteText("");
    setQuickNoteTargetId(null);
  };

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
          All Stages ({targets.length})
        </button>
        {stages.map((stage) => {
          const count = targets.filter((t) => t.crm.stage === stage.id).length;
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

      {/* Kanban Board with Smooth Touch Snap Scroll */}
      <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin">
        {visibleStages.map((stage) => {
          const stageTargets = targets.filter((t) => t.crm.stage === stage.id);
          return (
            <div
              key={stage.id}
              className="w-[85vw] sm:w-80 shrink-0 snap-start flex flex-col rounded-2xl border border-stone-850 bg-stone-950/70 p-3 sm:p-3.5 shadow-md"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-2.5 mb-3 px-1">
                <span className={`text-xs font-mono font-bold tracking-wide uppercase ${stage.color}`}>
                  {stage.title}
                </span>
                <span className="rounded-full bg-stone-850 px-2 py-0.5 text-[10px] font-mono font-bold text-stone-300 border border-stone-750">
                  {stageTargets.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-18rem)] pr-1">
                {stageTargets.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-stone-850 py-8 text-center text-[11px] text-stone-600 font-mono">
                    No deals in this stage
                  </div>
                ) : (
                  stageTargets.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-stone-800 bg-stone-900/90 p-3 text-xs shadow-xs transition hover:border-stone-700 hover:shadow-md"
                    >
                      {/* Top line */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="font-mono font-bold text-white bg-stone-850 px-1.5 py-0.5 rounded text-[11px] border border-stone-750 shrink-0">
                            {t.ticker}
                          </span>
                          <span 
                            onClick={() => onOpenDrawer(t)}
                            className="font-bold text-stone-200 hover:text-emerald-400 transition cursor-pointer truncate"
                          >
                            {t.asset.subsidiaryName}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-400 shrink-0 ml-1">
                          ROI {t.scores.rollupOpportunityIndex}
                        </span>
                      </div>

                      {/* Parent & Financial Highlights */}
                      <div className="mt-2 text-[11px] text-stone-400">
                        <span className="text-stone-500">Parent:</span> {t.name}
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                        <div className="rounded bg-stone-950/80 p-1.5 border border-stone-850">
                          <span className="text-stone-500 block text-[9px]">REVENUE</span>
                          <span className="text-emerald-400 font-bold">
                            ${(t.asset.annualRevenue / 1000000).toFixed(1)}M Rev
                          </span>
                        </div>
                        <div className="rounded bg-stone-950/80 p-1.5 border border-stone-850">
                          <span className="text-stone-500 block text-[9px]">SR BUYOUT</span>
                          <span className="text-cyan-400 font-bold">
                            ${(t.extractionFeasibility.estimatedAcquisitionCost / 1000).toFixed(0)}k Cash
                          </span>
                        </div>
                      </div>

                      {/* Contact highlight */}
                      {t.contacts[0] && (
                        <div className="mt-2.5 pt-2 border-t border-stone-850/80 flex items-center justify-between text-[10px] text-stone-400">
                          <span className="truncate">
                            {t.contacts[0].name} ({t.contacts[0].entity})
                          </span>
                          <span className="text-stone-500 shrink-0 ml-1">
                            {t.contacts[0].phone}
                          </span>
                        </div>
                      )}

                      {/* Quick stage selector */}
                      <div className="mt-3 pt-2 border-t border-stone-850 flex items-center justify-between text-[10px]">
                        <select
                          value={t.crm.stage}
                          onChange={(e) => onUpdateStage(t.id, e.target.value as CrmStage)}
                          className="rounded bg-stone-950 px-2 py-1 text-[10px] font-mono text-cyan-300 border border-stone-800 focus:outline-none max-w-[130px] sm:max-w-none truncate"
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
                            title="Open Dossier"
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
                            className="w-full rounded bg-stone-950 px-2 py-1 text-[10px] text-white border border-stone-800 focus:border-emerald-500 focus:outline-none mb-1.5"
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
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
