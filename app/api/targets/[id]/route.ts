import { NextRequest, NextResponse } from "next/server";
import { getServerTargets } from "@/lib/serverStore";
import { withLiveClock } from "@/lib/pipeline/clock";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const targets = getServerTargets();
  const target = targets.find((t) => t.id === id || (t.ticker && t.ticker.toUpperCase() === id.toUpperCase()));

  if (!target) {
    return NextResponse.json({ error: "Target company not found" }, { status: 404 });
  }

  return NextResponse.json({ target: withLiveClock(target, new Date()) });
}
