import { NextRequest, NextResponse } from "next/server";
import { INITIAL_TARGETS } from "@/lib/data/targets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, targetId, stage, noteText, author, activityType, summary } = body;

    return NextResponse.json({
      success: true,
      message: "Action registered successfully",
      timestamp: new Date().toISOString(),
      action,
      targetId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
