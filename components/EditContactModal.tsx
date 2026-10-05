import React, { useState, useEffect } from "react";
import { TargetCompany, ExecutiveContact } from "@/lib/types";
import { X, UserCheck, Phone, Mail, Building2, Briefcase, Trash2, CheckCircle2, Star } from "lucide-react";

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: TargetCompany | null;
  contactToEdit?: ExecutiveContact | null; // If null, we are adding a new contact
  onSaveContact: (targetId: string, contact: ExecutiveContact, isNew: boolean, setAsPrimary: boolean) => void;
  onDeleteContact?: (targetId: string, contactId: string) => void;
}

export const EditContactModal: React.FC<EditContactModalProps> = ({
  isOpen,
  onClose,
  target,
  contactToEdit,
  onSaveContact,
  onDeleteContact,
}) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [entity, setEntity] = useState<ExecutiveContact["entity"]>("Public Parent");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [roleSummary, setRoleSummary] = useState("");
  const [receptivityScore, setReceptivityScore] = useState<ExecutiveContact["receptivityScore"]>("high");
  const [isPrimary, setIsPrimary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contactToEdit) {
      setName(contactToEdit.name || "");
      setTitle(contactToEdit.title || "");
      setEntity(contactToEdit.entity || "Public Parent");
      setPhone(contactToEdit.phone || "");
      setEmail(contactToEdit.email || "");
      setRoleSummary(contactToEdit.roleSummary || "");
      setReceptivityScore(contactToEdit.receptivityScore || "high");
      setIsPrimary(target?.contacts[0]?.id === contactToEdit.id);
    } else {
      setName("");
      setTitle("");
      setEntity("Public Parent");
      setPhone("");
      setEmail("");
      setRoleSummary("");
      setReceptivityScore("high");
      setIsPrimary(target ? target.contacts.length === 0 : false);
    }
    setError(null);
  }, [contactToEdit, target, isOpen]);

  if (!isOpen || !target) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the contact person's full name.");
      return;
    }

    const contactData: ExecutiveContact = {
      id: contactToEdit ? contactToEdit.id : "c-" + Date.now(),
      name: name.trim(),
      title: title.trim() || "Executive",
      entity,
      phone: phone.trim() || "Direct line pending",
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z]/g, "")}@${target.ticker.toLowerCase()}.com`,
      roleSummary: roleSummary.trim() || `Key decision maker at ${target.name}.`,
      receptivityScore,
    };

    onSaveContact(target.id, contactData, !contactToEdit, isPrimary);
    onClose();
  };

  const handleDelete = () => {
    if (!contactToEdit || !onDeleteContact) return;
    if (confirm(`Remove ${contactToEdit.name} from ${target.ticker}?`)) {
      onDeleteContact(target.id, contactToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{contactToEdit ? "Edit Decision Maker" : "Add New Decision Maker"}</span>
                <span className="rounded bg-stone-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                  {target.ticker}
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                {target.name} ({target.asset.subsidiaryName})
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
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Full Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1">
                CONTACT NAME *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Stephen Snowdy"
                className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white placeholder-stone-600 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1">
                EXECUTIVE TITLE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chief Executive Officer"
                className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white placeholder-stone-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Entity & Receptivity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1">
                CORPORATE ENTITY
              </label>
              <select
                value={entity}
                onChange={(e) => setEntity(e.target.value as ExecutiveContact["entity"])}
                className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Public Parent">Public Parent Company</option>
                <option value="Operating Subsidiary">Operating Subsidiary</option>
                <option value="Senior Creditor">Senior Secured Creditor</option>
                <option value="Legal Counsel">Legal Counsel / Receiver</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1">
                RECEPTIVITY ASSESSMENT
              </label>
              <select
                value={receptivityScore}
                onChange={(e) => setReceptivityScore(e.target.value as ExecutiveContact["receptivityScore"])}
                className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="very_high">Very High (Highly Motivated)</option>
                <option value="high">High (Open to Recap)</option>
                <option value="moderate">Moderate (Guarded / Distressed)</option>
              </select>
            </div>
          </div>

          {/* Direct Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1 flex items-center justify-between">
                <span>DIRECT PHONE</span>
                <span className="text-[9px] text-emerald-400">Click-to-Call enabled</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-500" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(310) 826-5648"
                  className="w-full rounded-xl border border-stone-800 bg-stone-950 pl-9 pr-3 py-2 text-xs text-white placeholder-stone-600 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1 flex items-center justify-between">
                <span>OFFICIAL EMAIL</span>
                <span className="text-[9px] text-cyan-400">1-Click Outreach</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ceo@company.com"
                  className="w-full rounded-xl border border-stone-800 bg-stone-950 pl-9 pr-3 py-2 text-xs text-white placeholder-stone-600 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Responsibilities & Notes */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-stone-300 mb-1">
              ROLE SUMMARY & SPECIAL SITUATIONS CONTEXT
            </label>
            <textarea
              rows={3}
              value={roleSummary}
              onChange={(e) => setRoleSummary(e.target.value)}
              placeholder="e.g. Recently appointed by senior creditors following SEC filing default. Primary decision maker for carve-out asset transfer."
              className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white placeholder-stone-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Primary Contact Toggle */}
          <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Star className={`h-4 w-4 ${isPrimary ? "text-amber-400 fill-amber-400" : "text-stone-500"}`} />
              <div>
                <span className="text-xs font-bold text-white block">Primary Decision Maker</span>
                <span className="text-[10px] text-stone-400">
                  Featured on target cards, Kanban boards, and default email generator
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
            {contactToEdit && onDeleteContact ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-medium text-stone-400 hover:bg-stone-800 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-emerald-400 transition shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{contactToEdit ? "Save Changes" : "Add to Dossier"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
