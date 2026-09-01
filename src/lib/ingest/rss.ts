import Parser from "rss-parser";
import { createHash } from "node:crypto";
import { db } from "../db";
import { sources, contentItems } from "../db/schema";
import { eq, sql } from "drizzle-orm";

const parser = new Parser({
  headers: { "User-Agent": "Mozilla/5.0 (compatible; FlagoPulseBot/1.0)" },
  timeout: 15000,
});

function normalize(str: string) {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

function hashItem(sourceId: string, title: string, link: string) {
  return createHash("sha256").update(`${sourceId}|${normalize(title)}|${normalize(link)}`).digest("hex");
}

export interface IngestResult {
  sourceName: string;
  fetched: number;
  inserted: number;
  error?: string;
}

export async function ingestAllSources(): Promise<IngestResult[]> {
  const activeSources = await db.select().from(sources).where(eq(sources.active, true));
  const results: IngestResult[] = [];

  for (const source of activeSources) {
    try {
      const feed = await parser.parseURL(source.feedUrl);
      let inserted = 0;

      for (const item of feed.items) {
        const title = item.title?.trim();
        const link = item.link?.trim();
        if (!title || !link) continue;

        const contentHash = hashItem(source.id, title, link);
        const summaryRaw = (item.contentSnippet || item.content || item.summary || "").slice(0, 6000);
        const publishedAt = item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : null;

        const result = await db
          .insert(contentItems)
          .values({
            sourceId: source.id,
            title,
            url: link,
            contentHash,
            publishedAt,
            summaryRaw,
          })
          .onConflictDoNothing({ target: contentItems.contentHash })
          .returning({ id: contentItems.id });

        if (result.length > 0) inserted++;
      }

      await db.update(sources).set({ lastCheckedAt: new Date() }).where(eq(sources.id, source.id));

      results.push({ sourceName: source.name, fetched: feed.items.length, inserted });
    } catch (err) {
      results.push({
        sourceName: source.name,
        fetched: 0,
        inserted: 0,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}

export async function getUnclassifiedContentItems(limit: number) {
  return db
    .select()
    .from(contentItems)
    .where(sql`${contentItems.classifiedAt} is null`)
    .orderBy(sql`${contentItems.publishedAt} desc nulls last`)
    .limit(limit);
}
