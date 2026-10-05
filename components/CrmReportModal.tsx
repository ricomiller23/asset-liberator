import React, { useState, useMemo } from "react";
import { 
  TargetCompany, 
  CrmStage, 
  ExecutiveContact 
} from "@/lib/types";
import { 
  ReportPeriod, 
  buildCrmReport, 
  generateCrmReportMarkdown,
  STAGE_TITLES 
} from "@/lib/crmReport";
import { formatCurrency } from "@/lib/utils";
import { 
  BarChart3, 
  Calendar, 
  Mail, 
  PhoneCall, 
  FileText, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  X, 
  Search, 
  ArrowUpRight, 
  Clock, 
  Building2, 
  Users, 
  TrendingUp, 
  Send,
  Filter
} from "lucide-react";

interface CrmReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targets: TargetCompany[];
  onOpenDrawer: (target: TargetCompany) => void;
  onOpenLogCall: (target: TargetCompany, contact: ExecutiveContact | null) => void;
  onOpenOutreach: (target: TargetCompany) => void;
}

export const CrmReportModal: React.FC<CrmReportModalProps> = ({
  isOpen,
  onClose,
  targets,
  onOpenDrawer,
  onOpenLogCall,
  onOpenOutreach,
}) => {
  const [period, setPeriod] = useState<ReportPeriod>("today");
  const [viewTab, setViewTab] = useState<"timeline" | "matrix" | "notes" | "briefing">("timeline");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Compute report data dynamically from current targets
  const reportData = useMemo(() => {
    return buildCrmReport(targets, period, "2026-10-05");
  }, [targets, period]);

  const { metrics, activities, targetRows, notes } = reportData;

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Type filter
      if (typeFilter !== "all" && act.type !== typeFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const cleanDigits = q.replace(/[^0-9]/g, "");
        const matchText = 
          act.ticker.toLowerCase().includes(q) ||
          act.companyName.toLowerCase().includes(q) ||
          act.subsidiaryName.toLowerCase().includes(q) ||
          act.contactName.toLowerCase().includes(q) ||
          act.summary.toLowerCase().includes(q) ||
          (cleanDigits.length >= 3 && act.contactPhone.replace(/[^0-9]/g, "").includes(cleanDigits));
        if (!matchText) return false;
      }

      return true;
    });
  }, [activities, typeFilter, searchQuery]);

  // Filter matrix targets
  const filteredTargetRows = useMemo(() => {
    if (!searchQuery.trim()) return targetRows;
    const q = searchQuery.toLowerCase().trim();
    const cleanDigits = q.replace(/[^0-9]/g, "");
    return targetRows.filter((r) => 
      r.ticker.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.subsidiaryName.toLowerCase().includes(q) ||
      (r.primaryContact?.name && r.primaryContact.name.toLowerCase().includes(q)) ||
      (cleanDigits.length >= 3 && r.primaryContact?.phone && r.primaryContact.phone.replace(/[^0-9]/g, "").includes(cleanDigits))
    );
  }, [targetRows, searchQuery]);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    const md = generateCrmReportMarkdown(reportData);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl border border-stone-800 bg-stone-950 p-4 sm:p-6 shadow-2xl text-stone-200 my-auto max-h-[94vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  CRM Activity & Audit Report
                </h2>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/20">
                  {metrics.totalActivities} Touchpoints
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Audited timeline across 18 distressed public rollups and carve-out outreach
              </p>
            </div>
          </div>

          {/* Right Header Buttons */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-stone-750 bg-stone-900 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-850 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-stone-400" />}
              <span>{copied ? "Copied Report" : "Copy Briefing"}</span>
            </button>

            <a
              href={`/api/crm/report?period=${period}&format=markdown`}
              download={`asset-liberator-crm-report-${period}.md`}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Download .md</span>
            </a>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-stone-400 hover:text-white hover:bg-stone-850 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Timeframe Period Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-3 border-b border-stone-850 shrink-0">
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-mono text-stone-500 mr-1 hidden sm:inline">TIMEFRAME:</span>
            
            <button
              onClick={() => setPeriod("today")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                period === "today"
                  ? "bg-emerald-500 text-stone-950 shadow-md font-bold"
                  : "bg-stone-900 text-stone-300 hover:bg-stone-850 border border-stone-800"
              }`}
            >
              📅 Today (Oct 5)
            </button>

            <button
              onClick={() => setPeriod("week")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                period === "week"
                  ? "bg-cyan-500 text-stone-950 shadow-md font-bold"
                  : "bg-stone-900 text-stone-300 hover:bg-stone-850 border border-stone-800"
              }`}
            >
              📆 This Week (7 Days)
            </button>

            <button
              onClick={() => setPeriod("month")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                period === "month"
                  ? "bg-purple-500 text-white shadow-md font-bold"
                  : "bg-stone-900 text-stone-300 hover:bg-stone-850 border border-stone-800"
              }`}
            >
              🗓️ This Month (30 Days)
            </button>

            <button
              onClick={() => setPeriod("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                period === "all"
                  ? "bg-amber-500 text-stone-950 shadow-md font-bold"
                  : "bg-stone-900 text-stone-300 hover:bg-stone-850 border border-stone-800"
              }`}
            >
              🌐 All Time to Date
            </button>
          </div>

          <div className="text-[11px] font-mono text-stone-400 bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-850">
            Active Window: <span className="text-white font-semibold">{metrics.dateRangeStr}</span>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 py-3 shrink-0">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-2.5 sm:p-3">
            <div className="text-[10px] font-mono text-stone-400">TOTAL TOUCHES</div>
            <div className="text-lg sm:text-xl font-bold text-white mt-0.5">{metrics.totalActivities}</div>
            <div className="text-[9px] text-stone-400 mt-0.5">Recorded actions</div>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-2.5 sm:p-3">
            <div className="text-[10px] font-mono text-blue-300">OUTREACH EMAILS</div>
            <div className="text-lg sm:text-xl font-bold text-blue-400 mt-0.5">{metrics.emailsSent}</div>
            <div className="text-[9px] text-blue-300/80 mt-0.5">Dispatched to CEOs</div>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-2.5 sm:p-3">
            <div className="text-[10px] font-mono text-amber-300">CALLS LOGGED</div>
            <div className="text-lg sm:text-xl font-bold text-amber-400 mt-0.5">{metrics.callsLogged}</div>
            <div className="text-[9px] text-amber-300/80 mt-0.5">With dispositions</div>
          </div>

          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-2.5 sm:p-3">
            <div className="text-[10px] font-mono text-purple-300">DEAL NOTES</div>
            <div className="text-lg sm:text-xl font-bold text-purple-400 mt-0.5">{metrics.notesCount}</div>
            <div className="text-[9px] text-purple-300/80 mt-0.5">M&A intelligence</div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 sm:p-3">
            <div className="text-[10px] font-mono text-emerald-300">TARGETS TOUCHED</div>
            <div className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5">
              {metrics.uniqueTargetsEngaged} / {targetRows.length}
            </div>
            <div className="text-[9px] text-emerald-300/80 mt-0.5">Active companies</div>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-2.5 sm:p-3">
            <div className="text-[10px] font-mono text-cyan-300">REV IN PLAY</div>
            <div className="text-lg sm:text-xl font-bold text-cyan-400 mt-0.5">
              ${(metrics.totalSubsidiaryRevenueEngaged / 1000000).toFixed(1)}M
            </div>
            <div className="text-[9px] text-cyan-300/80 mt-0.5">Operating subsidiary</div>
          </div>
        </div>

        {/* View Switcher & In-Report Search Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-2.5 border-t border-b border-stone-850 shrink-0">
          {/* Sub-tabs */}
          <div className="flex items-center space-x-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setViewTab("timeline")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition ${
                viewTab === "timeline" ? "bg-stone-800 text-white font-semibold" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>Activity Log ({filteredActivities.length})</span>
            </button>

            <button
              onClick={() => setViewTab("matrix")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition ${
                viewTab === "matrix" ? "bg-stone-800 text-white font-semibold" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Company Matrix ({filteredTargetRows.length})</span>
            </button>

            <button
              onClick={() => setViewTab("notes")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition ${
                viewTab === "notes" ? "bg-stone-800 text-white font-semibold" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-purple-400" />
              <span>Deal Notes ({notes.length})</span>
            </button>

            <button
              onClick={() => setViewTab("briefing")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition ${
                viewTab === "briefing" ? "bg-stone-800 text-white font-semibold" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Copy className="h-3.5 w-3.5 text-amber-400" />
              <span>Markdown Preview</span>
            </button>
          </div>

          {/* Search + Action Filter */}
          <div className="flex items-center space-x-2">
            {viewTab === "timeline" && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-stone-800 bg-stone-900 px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Types</option>
                <option value="email">Emails Only</option>
                <option value="call">Calls Only</option>
                <option value="filing_alert">Alerts / Stages</option>
              </select>
            )}

            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter results..."
                className="rounded-xl border border-stone-800 bg-stone-900 pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-48"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1.5 text-stone-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab 1: Chronological Activity Feed */}
        {viewTab === "timeline" && (
          <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                No activities match the current filter in this timeframe.
              </div>
            ) : (
              filteredActivities.map((act) => {
                const targetObj = targets.find((t) => t.id === act.targetId || t.ticker === act.ticker);
                const isEmail = act.type === "email";
                const isCall = act.type === "call";
                const isAlert = act.type === "filing_alert";

                return (
                  <div
                    key={act.id}
                    className="rounded-2xl border border-stone-850 bg-stone-900/50 p-3.5 sm:p-4 hover:border-stone-750 transition flex flex-col space-y-2.5"
                  >
                    {/* Top Row: Type Badge, Ticker, Date */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center space-x-1 rounded-lg px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                            isEmail
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : isCall
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {isEmail && <Mail className="h-3 w-3" />}
                          {isCall && <PhoneCall className="h-3 w-3" />}
                          {isAlert && <ShieldCheck className="h-3 w-3" />}
                          <span>{isEmail ? "Outreach Email" : isCall ? "Call Logged" : "Milestone / Alert"}</span>
                        </span>

                        <button
                          onClick={() => targetObj && onOpenDrawer(targetObj)}
                          className="font-mono font-bold text-xs text-white hover:text-emerald-400 transition bg-stone-950 px-2 py-0.5 rounded border border-stone-800 flex items-center space-x-1"
                        >
                          <span>{act.ticker}</span>
                          <ArrowUpRight className="h-2.5 w-2.5 text-stone-500" />
                        </button>

                        <span className="text-xs font-semibold text-stone-200">
                          {act.companyName}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] font-mono text-stone-400">
                        {act.isToday && (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
                            TODAY
                          </span>
                        )}
                        <span>{act.date}</span>
                      </div>
                    </div>

                    {/* Middle Row: Contact & Asset Context */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-stone-400 bg-stone-950/60 p-2 rounded-xl border border-stone-850 gap-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="font-semibold text-stone-200">{act.contactName}</span>
                        <span className="text-stone-400">({act.contactTitle})</span>
                        <span className="font-mono text-stone-300">• {act.contactPhone}</span>
                      </div>

                      <div className="text-[11px] font-mono text-stone-400">
                        Subsidiary: <strong className="text-stone-300">{act.subsidiaryName}</strong>
                      </div>
                    </div>

                    {/* Bottom Row: Activity Summary */}
                    <div className="text-xs text-stone-300 leading-relaxed font-sans bg-stone-900/80 p-2.5 rounded-xl border border-stone-800">
                      {act.summary}
                    </div>

                    {/* Quick Action Footer */}
                    {targetObj && (
                      <div className="flex items-center justify-end space-x-2 pt-1 text-xs">
                        <button
                          onClick={() => onOpenLogCall(targetObj, targetObj.contacts[0] || null)}
                          className="inline-flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300 font-mono hover:underline"
                        >
                          <PhoneCall className="h-3 w-3" />
                          <span>Log Follow-Up Call</span>
                        </button>
                        <span className="text-stone-700">•</span>
                        <button
                          onClick={() => onOpenOutreach(targetObj)}
                          className="inline-flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300 font-mono hover:underline"
                        >
                          <Send className="h-3 w-3" />
                          <span>Generate Outreach</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Company Matrix View */}
        {viewTab === "matrix" && (
          <div className="flex-1 overflow-y-auto pr-1 py-3">
            <div className="overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-900/90 font-mono text-[10px] uppercase tracking-wider text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="px-3.5 py-3">Ticker / Company</th>
                    <th className="px-3 py-3">Carve-Out Subsidiary</th>
                    <th className="px-3 py-3">Primary Executive</th>
                    <th className="px-3 py-3">Current Stage</th>
                    <th className="px-3 py-3 text-center">Period Actions</th>
                    <th className="px-3 py-3">Last Contact</th>
                    <th className="px-3.5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-850 bg-stone-950 font-sans">
                  {filteredTargetRows.map((row) => {
                    const targetObj = targets.find((t) => t.id === row.targetId || t.ticker === row.ticker);
                    return (
                      <tr key={row.targetId} className="hover:bg-stone-900/50 transition">
                        <td className="px-3.5 py-3">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono font-bold text-white">{row.ticker}</span>
                            <span className="text-stone-400 font-normal truncate max-w-[120px]">{row.name}</span>
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <div className="font-medium text-stone-200">{row.subsidiaryName}</div>
                          <div className="text-[10px] text-emerald-400 font-mono">
                            ${(row.annualRevenue / 1000000).toFixed(1)}M Annual Rev
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <div className="font-semibold text-white">{row.primaryContact?.name || "N/A"}</div>
                          <div className="text-[10px] font-mono text-stone-400">{row.primaryContact?.phone || "N/A"}</div>
                        </td>

                        <td className="px-3 py-3">
                          <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-stone-800">
                            {row.stageTitle}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-mono font-bold ${
                              row.activitiesInPeriod > 0
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-stone-900 text-stone-500"
                            }`}
                          >
                            {row.activitiesInPeriod}
                          </span>
                        </td>

                        <td className="px-3 py-3 font-mono text-[11px] text-stone-400">
                          {row.lastContactDate}
                        </td>

                        <td className="px-3.5 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {targetObj && (
                              <>
                                <button
                                  onClick={() => onOpenLogCall(targetObj, row.primaryContact || null)}
                                  title="Log Call"
                                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-1.5 text-amber-300 hover:bg-amber-500/20 transition"
                                >
                                  <PhoneCall className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => onOpenOutreach(targetObj)}
                                  title="Outreach Proposal"
                                  className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-1.5 text-blue-300 hover:bg-blue-500/20 transition"
                                >
                                  <Send className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => onOpenDrawer(targetObj)}
                                  title="Open Full Dossier"
                                  className="rounded-lg bg-stone-800 p-1.5 text-stone-300 hover:text-white transition"
                                >
                                  <ArrowUpRight className="h-3 w-3" />
                                </button>
                              </>
                            )}
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

        {/* Tab 3: Deal Desk Notes */}
        {viewTab === "notes" && (
          <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-2.5">
            {notes.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                No notes logged for this timeframe.
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-2xl border border-stone-850 bg-stone-900/60 p-3.5 text-xs flex flex-col space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-white bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                        {note.ticker}
                      </span>
                      <span className="text-stone-300 font-medium">{note.companyName}</span>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.2 rounded border border-purple-500/20">
                        {note.author}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-stone-500">{note.date}</span>
                  </div>
                  <p className="text-stone-200 leading-relaxed font-sans">{note.text}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Markdown Preview & Direct Copy */}
        {viewTab === "briefing" && (
          <div className="flex-1 overflow-y-auto pr-1 py-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-400 font-mono">
                Executive Markdown Briefing (Ready for Download / Clipboard):
              </span>
              <button
                onClick={handleCopyMarkdown}
                className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied!" : "Copy Full Markdown"}</span>
              </button>
            </div>
            <pre className="flex-1 overflow-auto rounded-2xl border border-stone-800 bg-stone-900/90 p-4 text-[11px] font-mono text-stone-300 leading-relaxed whitespace-pre-wrap select-all">
              {generateCrmReportMarkdown(reportData)}
            </pre>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs shrink-0">
          <div className="text-[11px] text-stone-500 font-mono">
            Showing <strong className="text-stone-300">{metrics.uniqueTargetsEngaged}</strong> active targets in {metrics.periodLabel}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-stone-800 px-4 py-2 font-semibold text-white hover:bg-stone-700 transition"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
