import Anthropic from "@anthropic-ai/sdk";
import { getModel } from "./router";
import { CATEGORIES, INDUSTRIES, MARKET_LEVELS } from "../taxonomy";

const anthropic = new Anthropic();

export interface ClassificationInput {
  title: string;
  summaryRaw: string;
  sourceName: string;
  sourceCountry: string;
  publishedAt: Date | null;
}

export interface ClassificationResult {
  category: (typeof CATEGORIES)[number];
  country: (typeof MARKET_LEVELS)[number];
  industries: (typeof INDUSTRIES)[number][];
  summary: string;
  whatIsHappening: string;
  whyItMatters: string;
  flagoImplication: string;
  recommendedAction: string;
  tanzaniaRelevance: number;
  flagoRelevance: number;
  marketImpact: number;
  confidence: "High" | "Medium" | "Low";
}

const TOOL_NAME = "emit_signal_classification";

const SYSTEM_PROMPT = `You are the Classifier + Strategist for FLAGO PULSE, an intelligence platform for \
Flago Creative, a marketing and advertising agency based in Tanzania. \
For every article you are given, extract a structured classification and answer the \
"So what?" question the way a sharp strategy director would for agency leadership: \
what happened, why it matters, what it means for Flago (a creative/marketing/digital \
agency serving Tanzanian and East African clients across banking, FMCG, telecom, \
insurance and other sectors), and what Flago should actually do about it. \
Be concrete and specific — never generic filler like "this could be an opportunity." \
If the article has no real relevance to marketing, business, technology, culture or \
consumer behavior, still classify it honestly and score relevance low rather than \
inventing significance.`;

export async function classifyContentItem(
  input: ClassificationInput
): Promise<ClassificationResult> {
  const response = await anthropic.messages.create({
    model: getModel("classify"),
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [
      {
        name: TOOL_NAME,
        description: "Emit the structured classification and strategic analysis for this article.",
        input_schema: {
          type: "object",
          properties: {
            category: { type: "string", enum: [...CATEGORIES] },
            country: {
              type: "string",
              enum: [...MARKET_LEVELS],
              description:
                "The market level this development is MOST about — not the source's own location.",
            },
            industries: {
              type: "array",
              items: { type: "string", enum: [...INDUSTRIES] },
              description: "0-4 industries this is relevant to. Empty array if none apply.",
            },
            summary: { type: "string", description: "2-3 sentence neutral summary." },
            whatIsHappening: { type: "string", description: "1-2 sentences, factual." },
            whyItMatters: { type: "string", description: "1-2 sentences of strategic context." },
            flagoImplication: {
              type: "string",
              description: "1-2 sentences: what this specifically means for Flago Creative.",
            },
            recommendedAction: {
              type: "string",
              description: "One concrete, specific next action. Not generic advice.",
            },
            tanzaniaRelevance: {
              type: "integer",
              description: "0-100: how directly relevant to the Tanzanian market.",
            },
            flagoRelevance: {
              type: "integer",
              description: "0-100: how relevant to an agency's creative/strategy/digital services.",
            },
            marketImpact: {
              type: "integer",
              description: "0-100: how significant this development is in its own market.",
            },
            confidence: { type: "string", enum: ["High", "Medium", "Low"] },
          },
          required: [
            "category",
            "country",
            "industries",
            "summary",
            "whatIsHappening",
            "whyItMatters",
            "flagoImplication",
            "recommendedAction",
            "tanzaniaRelevance",
            "flagoRelevance",
            "marketImpact",
            "confidence",
          ],
        },
      },
    ],
    tool_choice: { type: "tool", name: TOOL_NAME },
    messages: [
      {
        role: "user",
        content: `SOURCE: ${input.sourceName} (${input.sourceCountry})
PUBLISHED: ${input.publishedAt?.toISOString() ?? "unknown"}
TITLE: ${input.title}

CONTENT:
${input.summaryRaw?.slice(0, 4000) ?? "(no body text available, use title only)"}`,
      },
    ],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Model did not return a structured classification");
  }

  return toolUse.input as ClassificationResult;
}
