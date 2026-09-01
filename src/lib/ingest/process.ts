import { db } from "../db";
import { contentItems, signals, sources } from "../db/schema";
import { eq } from "drizzle-orm";
import { getUnclassifiedContentItems } from "./rss";
import { classifyContentItem } from "../ai/classify";
import { scoreSignal } from "../scoring";

export interface ProcessResult {
  processed: number;
  signalsCreated: number;
  errors: number;
}

export async function processUnclassifiedContent(limit = 40): Promise<ProcessResult> {
  const items = await getUnclassifiedContentItems(limit);
  let signalsCreated = 0;
  let errors = 0;

  for (const item of items) {
    try {
      const [source] = await db.select().from(sources).where(eq(sources.id, item.sourceId));
      if (!source) continue;

      const classification = await classifyContentItem({
        title: item.title,
        summaryRaw: item.summaryRaw ?? "",
        sourceName: source.name,
        sourceCountry: source.country,
        publishedAt: item.publishedAt,
      });

      const { signalStrength, classification: tier } = scoreSignal({
        sourceCredibility: source.credibilityScore,
        publishedAt: item.publishedAt,
        tanzaniaRelevance: classification.tanzaniaRelevance,
        flagoRelevance: classification.flagoRelevance,
        marketImpact: classification.marketImpact,
      });

      await db.insert(signals).values({
        contentItemId: item.id,
        title: item.title,
        summary: classification.summary,
        category: classification.category,
        country: classification.country,
        region: classification.country,
        industries: classification.industries,
        signalStrength,
        confidence: classification.confidence,
        classification: tier,
        whyItMatters: classification.whyItMatters,
        whatIsHappening: classification.whatIsHappening,
        flagoImplication: classification.flagoImplication,
        recommendedAction: classification.recommendedAction,
        tanzaniaRelevance: classification.tanzaniaRelevance,
        flagoRelevance: classification.flagoRelevance,
        marketImpact: classification.marketImpact,
        sourceCredibility: source.credibilityScore,
        sources: [{ name: source.name, url: item.url }],
      });

      await db.update(contentItems).set({ classifiedAt: new Date() }).where(eq(contentItems.id, item.id));
      signalsCreated++;
    } catch (err) {
      console.error(`Failed to classify content item ${item.id}:`, err);
      errors++;
    }
  }

  return { processed: items.length, signalsCreated, errors };
}
