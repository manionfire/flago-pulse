import { classifySignalStrength } from "./taxonomy";

export interface ScoringInput {
  sourceCredibility: number; // 0-100, from the source registry
  publishedAt: Date | null;
  tanzaniaRelevance: number; // 0-100, from AI classification
  flagoRelevance: number; // 0-100, from AI classification
  marketImpact: number; // 0-100, from AI classification
}

// Simplified version of the PRD's 8-factor weighting (section 20). The full
// model needs independent-source-count and acceleration data that only exist
// once the trend engine is built; until then those weights are folded into
// marketImpact, which the classifier estimates directly from the article.
const WEIGHTS = {
  sourceCredibility: 0.15,
  recency: 0.15,
  marketImpact: 0.2,
  tanzaniaRelevance: 0.25,
  flagoRelevance: 0.25,
};

function recencyScore(publishedAt: Date | null): number {
  if (!publishedAt) return 40;
  const hoursOld = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  if (hoursOld <= 24) return 100;
  if (hoursOld >= 24 * 7) return 0;
  return Math.round(100 - ((hoursOld - 24) / (24 * 6)) * 100);
}

export function scoreSignal(input: ScoringInput) {
  const recency = recencyScore(input.publishedAt);

  const signalStrength = Math.round(
    input.sourceCredibility * WEIGHTS.sourceCredibility +
      recency * WEIGHTS.recency +
      input.marketImpact * WEIGHTS.marketImpact +
      input.tanzaniaRelevance * WEIGHTS.tanzaniaRelevance +
      input.flagoRelevance * WEIGHTS.flagoRelevance
  );

  return {
    signalStrength: Math.max(0, Math.min(100, signalStrength)),
    classification: classifySignalStrength(signalStrength),
    recency,
  };
}
