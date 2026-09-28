import React, { useState, useEffect } from "react";
import { TargetCompany, ExecutiveContact, CrmStage } from "@/lib/types";
import { OUTREACH_TEMPLATES, OutreachTemplate } from "@/lib/data/templates";
import { X, Send, Copy, Check, Mail, Phone, ExternalLink, Sparkles, UserCheck } from "lucide-react";

interface OutreachModalProps {
  target: TargetCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onLogOutreach: (targetId: string, contactName: string, summary: string) => void;
}

export const OutreachModal: React.FC<OutreachModalProps> = ({
  target,
  isOpen,
  onClose,
  onLogOutreach,
}) => {
  const [selectedContact, setSelectedContact] = useState<ExecutiveContact | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("sub-founder-liberation");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (target && target.contacts.length > 0) {
      const contact = target.contacts[0];
      setSelectedContact(contact);
      
      // Select matching template
      const matchingTemplate = OUTREACH_TEMPLATES.find((t) => t.targetRole === contact.entity) || OUTREACH_TEMPLATES[0];
      setSelectedTemplateId(matchingTemplate.id);
      setSubject(matchingTemplate.subject(target, contact));
      setBody(matchingTemplate.body(target, contact));
      setLogged(false);
    }
  }, [target]);

  const handleContactChange = (contactId: string) => {
    if (!target) return;
    const contact = target.contacts.find((c) => c.id === contactId);
    if (!contact) return;
    setSelectedContact(contact);

    const matchingTemplate = OUTREACH_TEMPLATES.find((t) => t.targetRole === contact.entity) || OUTREACH_TEMPLATES[0];
    setSelectedTemplateId(matchingTemplate.id);
    setSubject(matchingTemplate.subject(target, contact));
    setBody(matchingTemplate.body(target, contact));
  };

  const handleTemplateChange = (templateId: string) => {
    if (!target || !selectedContact) return;
    const template = OUTREACH_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    setSelectedTemplateId(templateId);
    setSubject(template.subject(target, selectedContact));
    setBody(template.body(target, selectedContact));
  };

  if (!isOpen || !target || !selectedContact) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogAndSend = () => {
    onLogOutreach(
      target.id,
      selectedContact.name,
      `Outreach sent to ${selectedContact.name} (${selectedContact.title}) regarding ${target.asset.subsidiaryName} carve-out.`
    );
    setLogged(true);
    setTimeout(() => {
      setLogged(false);
      onClose();
    }, 1200);
  };

  const mailtoUrl = `mailto:${encodeURIComponent(selectedContact.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl text-stone-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <Send className="h-5 w-5" />
            <span>Executive Outreach Generator • {target.ticker}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contact Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <label className="block text-stone-400 font-mono text-[11px] mb-1">SELECT RECIPIENT:</label>
            <select
              value={selectedContact.id}
              onChange={(e) => handleContactChange(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none"
            >
              {target.contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.title} • {c.entity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-stone-400 font-mono text-[11px] mb-1">DEAL PROPOSAL TEMPLATE:</label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-semibold text-cyan-300 focus:border-cyan-500 focus:outline-none"
            >
              {OUTREACH_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Quick Dossier */}
        <div className="rounded-xl border border-stone-850 bg-stone-900/60 p-3 mb-4 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-white">{selectedContact.name}</span>
            <span className="text-stone-400">({selectedContact.title})</span>
          </div>
          <div className="flex items-center space-x-3 text-stone-300 font-mono text-[11px]">
            <span>{selectedContact.email}</span>
            <span>•</span>
            <span>{selectedContact.phone}</span>
          </div>
        </div>

        {/* Subject Input */}
        <div className="mb-3 text-xs">
          <label className="block text-stone-400 font-mono text-[11px] mb-1">SUBJECT LINE:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-2 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Body Textarea */}
        <div className="mb-4 text-xs">
          <label className="block text-stone-400 font-mono text-[11px] mb-1">CONFIDENTIAL PROPOSAL BODY:</label>
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-xl border border-stone-800 bg-stone-900 p-3.5 text-xs text-stone-200 font-sans focus:border-emerald-500 focus:outline-none leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-800 text-xs">
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-stone-750 bg-stone-900 px-3.5 py-2 font-semibold text-stone-300 hover:text-white hover:bg-stone-850 transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied Email" : "Copy to Clipboard"}</span>
          </button>

          <div className="flex items-center space-x-2">
            <a
              href={mailtoUrl}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Open in Mail Client</span>
            </a>

            <button
              onClick={handleLogAndSend}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-500 px-4 py-2 font-bold text-stone-950 hover:bg-emerald-400 transition shadow-sm"
            >
              {logged ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
              <span>{logged ? "Logged in CRM!" : "Log as Sent in CRM"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
