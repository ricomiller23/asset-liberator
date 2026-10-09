import { NextRequest, NextResponse } from "next/server";
import { getServerTargets } from "@/lib/serverStore";
import { buildUniverse } from "@/lib/pipeline/universe";
import type { Bucket, CandidateClass, CandidateStoreFile, ScoredCandidate } from "@/lib/pipeline/types";
import store from "@/data/candidates.json";

export const dynamic = "force-dynamic";

const CLASSES: CandidateClass[] = ["distressed_carveout", "bankruptcy_sale", "motivated_seller", "dormant_shell", "cross_border"];
const BUCKETS: Bucket[] = ["actionable", "watch", "low"];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cls = searchParams.get("class");
  const bucket = searchParams.get("bucket");
  const source = searchParams.get("source");
  const query = searchParams.get("q")?.toLowerCase();
  const minPriority = searchParams.get("minPriority") ? parseInt(searchParams.get("minPriority")!, 10) : undefined;
  const limit = Math.min(500, Math.max(1, parseInt(searchParams.get("limit") ?? "200", 10) || 200));
  const sortBy = searchParams.get("sortBy") || "priority";

  const storeFile = store as unknown as CandidateStoreFile;
  const universe = buildUniverse(getServerTargets(), storeFile, new Date());

  const counts = {
    total: universe.length,
    byClass: Object.fromEntries(CLASSES.map((c) => [c, universe.filter((u) => u.class === c).length])),
    byBucket: Object.fromEntries(BUCKETS.map((b) => [b, universe.filter((u) => u.bucket === b).length])),
    bySource: {
      seed: universe.filter((u) => u.source === "seed").length,
      edgar: universe.filter((u) => u.source === "edgar").length,
    },
  };

  let results: ScoredCandidate[] = universe;
  if (cls && cls !== "all") results = results.filter((c) => c.class === cls);
  if (bucket && bucket !== "all") results = results.filter((c) => c.bucket === bucket);
  if (source && source !== "all") results = results.filter((c) => c.source === source);
  if (minPriority !== undefined) results = results.filter((c) => c.scores.priority >= minPriority);
  if (query) {
    results = results.filter(
      (c) => c.name.toLowerCase().includes(query) || (c.ticker ?? "").toLowerCase().includes(query) || c.cik === query.replace(/^0+/, "")
    );
  }

  results = [...results].sort((a, b) => {
    if (sortBy === "timing") return (a.nextClock?.daysRemaining ?? 9999) - (b.nextClock?.daysRemaining ?? 9999);
    if (sortBy === "distress") return b.scores.distress - a.scores.distress;
    if (sortBy === "separable") return b.scores.separable - a.scores.separable;
    return b.scores.priority - a.scores.priority;
  });

  return NextResponse.json({
    candidates: results.slice(0, limit),
    meta: {
      shown: Math.min(results.length, limit),
      matched: results.length,
      counts,
      ingest: { generatedAt: storeFile.generatedAt, windowDays: storeFile.windowDays ?? null, ingestedCandidates: storeFile.candidates.length },
      timestamp: new Date().toISOString(),
    },
  });
}
