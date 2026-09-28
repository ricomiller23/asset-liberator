import { NextRequest, NextResponse } from "next/server";
import { INITIAL_TARGETS } from "@/lib/data/targets";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const target = INITIAL_TARGETS.find((t) => t.id === id);

  if (!target) {
    return NextResponse.json({ error: "Target company not found" }, { status: 404 });
  }

  return NextResponse.json({ target });
}
