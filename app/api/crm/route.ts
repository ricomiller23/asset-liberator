import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, targetId } = body;

    return NextResponse.json({
      success: true,
      message: `Action '${action}' processed successfully`,
      timestamp: new Date().toISOString(),
      action,
      targetId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
