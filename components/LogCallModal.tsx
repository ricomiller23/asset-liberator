import React, { useState } from "react";
import { TargetCompany, CrmStage, ExecutiveContact } from "@/lib/types";
import { PhoneCall, X, Calendar, CheckCircle, Clock, AlertTriangle, ArrowRight, UserPlus } from "lucide-react";

interface LogCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: TargetCompany | null;
  initialContact?: ExecutiveContact | null;
  onLogCall: (
    targetId: string,
    callDetails: {
      contactName: string;
      outcome: string;
      notes: string;
      nextFollowUpDate?: string;
      suggestedStage?: CrmStage;
    }
  ) => void;
  onOpenEditContact?: (target: TargetCompany, contact: ExecutiveContact | null) => void;
}

export const LogCallModal: React.FC<LogCallModalProps> = ({
  isOpen,
  onClose,
  target,
  initialContact,
  onLogCall,
  onOpenEditContact,
}) => {
  const [selectedContactName, setSelectedContactName] = useState("");
  const [customContactName, setCustomContactName] = useState("");
  const [outcome, setOutcome] = useState("Connected - Meaningful Dialogue");
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [suggestedStage, setSuggestedStage] = useState<CrmStage | "keep">("keep");

  React.useEffect(() => {
    if (initialContact) {
      setSelectedContactName(initialContact.name);
    } else if (target && target.contacts.length > 0) {
      setSelectedContactName(target.contacts[0].name);
    } else {
      setSelectedContactName("custom");
    }
    setCustomContactName("");
    setOutcome("Connected - Meaningful Dialogue");
    setNotes("");
    setFollowUpDate("");
    setSuggestedStage("keep");
  }, [initialContact, target, isOpen]);

  if (!isOpen || !target) return null;

  const resolvedContactName = selectedContactName === "custom" 
    ? customContactName.trim() || "New Executive / Decision Maker" 
    : selectedContactName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      alert("Please enter a brief note about the phone call.");
      return;
    }

    onLogCall(target.id, {
      contactName: resolvedContactName,
      outcome,
      notes: notes.trim(),
      nextFollowUpDate: followUpDate || undefined,
      suggestedStage: suggestedStage === "keep" ? undefined : suggestedStage,
    });

    onClose();
  };

  const outcomes = [
    { label: "Connected — Meaningful Dialogue", color: "text-emerald-400" },
    { label: "Left Voicemail / Callback Requested", color: "text-amber-400" },
    { label: "Personnel Changed — Reached Successor", color: "text-cyan-400" },
    { label: "Gatekeeper / Transfer Requested", color: "text-stone-300" },
    { label: "Wrong Number / Outdated Line", color: "text-rose-400" },
    { label: "Term Sheet / NDA Requested", color: "text-purple-400" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Log Executive Call</span>
                <span className="rounded bg-stone-800 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                  {target.ticker}
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                {target.name} • {target.asset.subsidiaryName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Contact Person Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono font-medium text-stone-300">
                DECISION MAKER SPOKEN WITH
              </label>
              {onOpenEditContact && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenEditContact(target, null);
                  }}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  <UserPlus className="h-3 w-3" />
                  <span>+ Add as New Permanent Contact</span>
                </button>
              )}
            </div>

            <select
              value={selectedContactName}
              onChange={(e) => setSelectedContactName(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              {target.contacts.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.title} • {c.phone})
                </option>
              ))}
              <option value="custom">+ New Contact / Different Person Running Things</option>
            </select>

            {selectedContactName === "custom" && (
              <input
                type="text"
                value={customContactName}
                onChange={(e) => setCustomContactName(e.target.value)}
                placeholder="Enter new contact's full name & title..."
                className="mt-2 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none animate-in fade-in"
              />
            )}
          </div>

          {/* Call Outcome */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1">
              CALL OUTCOME / DISPOSITION
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {outcomes.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setOutcome(o.label)}
                  className={`text-left rounded-xl p-2.5 text-xs transition border ${
                    outcome === o.label
                      ? "border-cyan-500/50 bg-cyan-500/10 text-white font-semibold"
                      : "border-stone-800 bg-stone-950/60 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                  }`}
                >
                  <span className={`block font-medium ${o.color}`}>{o.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Call Notes */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1">
              CALL NOTES & DISCUSSIONS SUMMARY *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Spoke with new interim CEO. Confirmed operating subsidiary is profitable with $3.4M run-rate. Open to Article 9 senior debt purchase if we assume facility leases."
              className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          {/* Follow-up & Stage Update */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1 flex items-center space-x-1.5">
                <Calendar className="h-3.5 w-3.5 text-stone-500" />
                <span>NEXT FOLLOW-UP DATE</span>
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1 flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-stone-500" />
                <span>MOVE PIPELINE STAGE</span>
              </label>
              <select
                value={suggestedStage}
                onChange={(e) => setSuggestedStage(e.target.value as CrmStage | "keep")}
                className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="keep">Keep Current ({target.crm.stage.toUpperCase()})</option>
                <option value="in_dialogue">Advance to: Active Dialogue</option>
                <option value="nda_signed">Advance to: NDA Executed</option>
                <option value="diligence">Advance to: In Diligence</option>
                <option value="term_sheet">Advance to: Term Sheet Issued</option>
                <option value="passed">Move to: Passed / Disqualified</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-stone-400 hover:bg-stone-800 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-cyan-400 transition shadow-md"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Log Call & Save to CRM</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
