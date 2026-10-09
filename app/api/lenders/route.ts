import { NextRequest, NextResponse } from "next/server";
import { DISTRESSED_LENDERS_INDEX } from "@/lib/data/lenderIndex";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    lenders: DISTRESSED_LENDERS_INDEX,
    meta: {
      total: DISTRESSED_LENDERS_INDEX.length,
      totalDebtTracked: DISTRESSED_LENDERS_INDEX.reduce((acc, l) => acc + l.totalSecuredDebt, 0),
      timestamp: new Date().toISOString(),
    },
  });
}
