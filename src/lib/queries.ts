import { db } from "./db";
import { signals, sources, contentItems } from "./db/schema";
import { desc, gte, sql, eq } from "drizzle-orm";
import { MARKET_LEVELS } from "./taxonomy";

export async function getTopSignals(limit = 20) {
  return db
    .select({
      id: signals.id,
      title: signals.title,
      summary: signals.summary,
      category: signals.category,
      country: signals.country,
      signalStrength: signals.signalStrength,
      confidence: signals.confidence,
      classification: signals.classification,
      whyItMatters: signals.whyItMatters,
      whatIsHappening: signals.whatIsHappening,
      flagoImplication: signals.flagoImplication,
      recommendedAction: signals.recommendedAction,
      industries: signals.industries,
      sources: signals.sources,
      createdAt: signals.createdAt,
      sourceUrl: contentItems.url,
      publishedAt: contentItems.publishedAt,
    })
    .from(signals)
    .innerJoin(contentItems, eq(signals.contentItemId, contentItems.id))
    .orderBy(desc(signals.signalStrength), desc(signals.createdAt))
    .limit(limit);
}

export async function getMarketTemperature() {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const rows = await db
    .select({
      region: signals.region,
      count: sql<number>`count(*)::int`,
      avgStrength: sql<number>`avg(${signals.signalStrength})::int`,
    })
    .from(signals)
    .where(gte(signals.createdAt, since))
    .groupBy(signals.region);

  const byRegion = new Map(rows.map((r) => [r.region, r]));

  return MARKET_LEVELS.map((level) => {
    const row = byRegion.get(level);
    const count = row?.count ?? 0;
    const avgStrength = row?.avgStrength ?? 0;

    let status: string;
    if (count === 0) status = "QUIET";
    else if (count <= 2) status = "STEADY";
    else if (count <= 5 || avgStrength < 65) status = "ACTIVE";
    else status = "HIGH ACTIVITY";

    return { level, count, avgStrength, status };
  });
}

export async function getSourceRegistry() {
  return db.select().from(sources).orderBy(sources.region, sources.name);
}

export async function getSignalCounts() {
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(signals);
  return row?.count ?? 0;
}
