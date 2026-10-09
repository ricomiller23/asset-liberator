"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ChevronDown, ChevronRight, Compass, ExternalLink } from "lucide-react";
import type { Bucket, CandidateClass, ScoredCandidate } from "@/lib/pipeline/types";

interface DiscoveryResponse {
  candidates: ScoredCandidate[];
  meta: {
    shown: number;
    matched: number;
    counts: {
      total: number;
      byClass: Record<string, number>;
      byBucket: Record<string, number>;
      bySource: { seed: number; edgar: number };
    };
    ingest: { generatedAt: string | null; windowDays: number | null; ingestedCandidates: number };
  };
}

const CLASS_LABELS: Record<CandidateClass, string> = {
  distressed_carveout: "Distressed carve-out",
  bankruptcy_sale: "Ch.11 / 363 sale",
  motivated_seller: "Motivated seller",
  dormant_shell: "Dormant shell",
  cross_border: "Cross-border",
};

const BUCKET_STYLE: Record<Bucket, string> = {
  actionable: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  watch: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  low: "bg-stone-700/30 text-stone-400 border-stone-700",
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-stone-400">
      <span className="w-7">{label}</span>
      <div className="h-1.5 w-16 rounded bg-stone-800">
        <div className="h-1.5 rounded bg-emerald-500/70" style={{ width: `${value}%` }} />
      </div>
      <span className="w-6 text-right text-stone-300">{value}</span>
    </div>
  );
}

export const DiscoveryView: React.FC = () => {
  const [cls, setCls] = useState<CandidateClass | "all">("all");
  const [bucket, setBucket] = useState<Bucket | "all">("all");
  const [source, setSource] = useState<"all" | "seed" | "edgar">("all");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("priority");
  const [open, setOpen] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery<DiscoveryResponse>({
    queryKey: ["candidates", cls, bucket, source, q, sortBy],
    queryFn: async () => {
      const p = new URLSearchParams({ sortBy, limit: "200" });
      if (cls !== "all") p.set("class", cls);
      if (bucket !== "all") p.set("bucket", bucket);
      if (source !== "all") p.set("source", source);
      if (q) p.set("q", q);
      const res = await fetch(`/api/candidates?${p.toString()}`);
      if (!res.ok) throw new Error("Failed to load candidates");
      return res.json();
    },
  });

  const counts = data?.meta.counts;
  const ingest = data?.meta.ingest;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-stone-850 bg-stone-900/90 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center space-x-2">
          <Compass className="h-4 w-4 text-emerald-400" />
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/20">
            DISCOVERY UNIVERSE
          </span>
        </div>
        <p className="mt-2 text-xs text-stone-400 max-w-3xl">
          Every candidate is scored on graded distress, separable value, control point and timing. Only three must-haves filter anything out; unknowns are scored as
          unknown, not failed.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-mono text-stone-400">
          <span>{counts?.total ?? "—"} in universe</span>
          <span className="text-emerald-300">{counts?.byBucket.actionable ?? "—"} actionable</span>
          <span className="text-amber-300">{counts?.byBucket.watch ?? "—"} watch</span>
          <span>{counts?.bySource.seed ?? "—"} seed (unverified)</span>
          <span>{counts?.bySource.edgar ?? "—"} from EDGAR</span>
          <span>{ingest?.generatedAt ? `last ingest ${ingest.generatedAt.slice(0, 10)}` : "no EDGAR ingest has run yet"}</span>
        </div>
        {ingest && !ingest.generatedAt && (
          <p className="mt-2 text-[11px] text-amber-300">
            Only the 18 seed records are loaded. Run <span className="font-mono">pnpm ingest</span> (or the scheduled workflow) to populate EDGAR-derived candidates.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {(["all", ...Object.keys(CLASS_LABELS)] as Array<CandidateClass | "all">).map((c) => (
          <button
            key={c}
            onClick={() => setCls(c)}
            className={`rounded-lg border px-2.5 py-1.5 font-medium transition ${cls === c ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200"}`}
          >
            {c === "all" ? "All classes" : CLASS_LABELS[c]}
            {counts && c !== "all" ? ` (${counts.byClass[c] ?? 0})` : ""}
          </button>
        ))}
        <select value={bucket} onChange={(e) => setBucket(e.target.value as Bucket | "all")} className="rounded-lg border border-stone-800 bg-stone-900 px-2 py-1.5 text-stone-300">
          <option value="all">All buckets</option>
          <option value="actionable">Actionable</option>
          <option value="watch">Watch</option>
          <option value="low">Low</option>
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value as "all" | "seed" | "edgar")} className="rounded-lg border border-stone-800 bg-stone-900 px-2 py-1.5 text-stone-300">
          <option value="all">All sources</option>
          <option value="seed">Seed only</option>
          <option value="edgar">EDGAR only</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-stone-800 bg-stone-900 px-2 py-1.5 text-stone-300">
          <option value="priority">Sort: priority</option>
          <option value="timing">Sort: next clock</option>
          <option value="distress">Sort: distress</option>
          <option value="separable">Sort: separable value</option>
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name, ticker, CIK"
          className="rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1.5 text-stone-200 placeholder:text-stone-600"
        />
      </div>

      {isLoading ? (
        <div className="h-40 rounded-2xl border border-stone-850 bg-stone-900/60 animate-pulse" />
      ) : isError ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 text-xs text-rose-300">Could not load the discovery universe.</div>
      ) : (
        <div className="space-y-2">
          {data!.candidates.map((c) => {
            const isOpen = open === c.id;
            return (
              <div key={c.id} className="rounded-2xl border border-stone-850 bg-stone-900/70">
                <button onClick={() => setOpen(isOpen ? null : c.id)} className="flex w-full items-start gap-3 p-3 text-left">
                  {isOpen ? <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-stone-500" /> : <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-stone-500" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">{c.ticker ?? `CIK ${c.cik}`}</span>
                      <span className="truncate text-xs text-stone-300">{c.name}</span>
                      <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${BUCKET_STYLE[c.bucket]}`}>{c.bucket}</span>
                      <span className="rounded border border-stone-700 px-1.5 py-0.5 text-[10px] text-stone-400">{CLASS_LABELS[c.class]}</span>
                      {c.provenance === "seed_unverified" && <span className="rounded border border-amber-500/30 px-1.5 py-0.5 text-[10px] text-amber-300">seed · unverified</span>}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {Array.from(new Set(c.signals.map((s) => s.code))).map((code) => (
                        <span key={code} className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] font-mono text-stone-400">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:block">
                    <ScoreBar label="DIS" value={c.scores.distress} />
                    <ScoreBar label="SEP" value={c.scores.separable} />
                    <ScoreBar label="CTL" value={c.scores.control} />
                    <ScoreBar label="TIM" value={c.scores.timing} />
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-xl font-bold text-emerald-300">{c.scores.priority}</div>
                    <div className="text-[10px] text-stone-500">
                      {c.nextClock ? (c.nextClock.daysRemaining >= 0 ? `${c.nextClock.daysRemaining}d` : `lapsed ${-c.nextClock.daysRemaining}d`) : "no clock"}
                    </div>
                  </div>
                </button>
                {isOpen && (
                  <div className="space-y-2 border-t border-stone-850 px-4 py-3 text-xs text-stone-400">
                    <ul className="list-disc space-y-0.5 pl-4">
                      {c.explain.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    {c.nextClock && (
                      <p>
                        <span className="text-stone-300">{c.nextClock.label}</span> · {c.nextClock.deadline} · {c.nextClock.basis}
                      </p>
                    )}
                    {c.dataQualityFlags.length > 0 && (
                      <div className="space-y-0.5 text-amber-300">
                        {c.dataQualityFlags.map((f) => (
                          <p key={f} className="flex items-start gap-1.5">
                            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                            <span>{f}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3 pt-1">
                      {c.signals.slice(0, 6).map((s) => (
                        <a key={`${s.code}-${s.accession ?? s.date}`} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-300 hover:underline">
                          {s.code} · {s.date}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {data!.candidates.length === 0 && <p className="py-10 text-center text-xs text-stone-500">No candidates match these filters.</p>}
        </div>
      )}
    </div>
  );
};
