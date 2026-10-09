import { NextRequest, NextResponse } from "next/server";
import { EDGAR_EVENT_FEEDS } from "@/lib/data/eventFeeds";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemType = searchParams.get("itemType");
  const query = searchParams.get("query")?.toLowerCase();

  let feeds = [...EDGAR_EVENT_FEEDS];

  if (itemType && itemType !== "all") {
    feeds = feeds.filter((f) => f.itemType === itemType);
  }

  if (query) {
    feeds = feeds.filter((f) =>
      f.ticker.toLowerCase().includes(query) ||
      f.companyName.toLowerCase().includes(query) ||
      f.headline.toLowerCase().includes(query) ||
      f.separableAssetIdentified.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    events: feeds,
    meta: {
      total: feeds.length,
      timestamp: new Date().toISOString(),
    },
  });
}
