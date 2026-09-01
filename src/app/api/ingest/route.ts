import { NextRequest, NextResponse } from "next/server";
import { ingestAllSources } from "@/lib/ingest/rss";
import { processUnclassifiedContent } from "@/lib/ingest/process";

export const maxDuration = 300;

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured (local dev) — allow
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const fetchResults = await ingestAllSources();
  const processResult = await processUnclassifiedContent(40);

  return NextResponse.json({ fetchResults, processResult });
}

// Vercel Cron sends GET requests with the CRON_SECRET as a bearer token.
export async function GET(req: NextRequest) {
  return POST(req);
}
