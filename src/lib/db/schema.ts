import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  feedUrl: text("feed_url").notNull(),
  country: text("country").notNull(), // Tanzania | East Africa | Africa | Global
  region: text("region").notNull(),
  category: text("category").notNull(), // Advertising | Business | Technology | ...
  sourceType: text("source_type").notNull(), // primary | industry | specialist | community
  credibilityScore: integer("credibility_score").notNull().default(65),
  active: boolean("active").notNull().default(true),
  lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("sources_feed_url_idx").on(table.feedUrl),
]);

export const contentItems = pgTable(
  "content_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    url: text("url").notNull(),
    contentHash: text("content_hash").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    summaryRaw: text("summary_raw"),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
    classifiedAt: timestamp("classified_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("content_items_hash_idx").on(table.contentHash),
    index("content_items_source_idx").on(table.sourceId),
  ]
);

export const signals = pgTable(
  "signals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contentItemId: uuid("content_item_id")
      .notNull()
      .references(() => contentItems.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    category: text("category").notNull(),
    country: text("country").notNull(),
    region: text("region").notNull(),
    industries: text("industries").array().notNull().default([]),
    signalStrength: integer("signal_strength").notNull(),
    confidence: text("confidence").notNull(), // High | Medium | Low
    classification: text("classification").notNull(), // MAJOR SIGNAL | IMPORTANT | WATCH | BACKGROUND
    whyItMatters: text("why_it_matters").notNull(),
    whatIsHappening: text("what_is_happening").notNull(),
    flagoImplication: text("flago_implication").notNull(),
    recommendedAction: text("recommended_action").notNull(),
    tanzaniaRelevance: integer("tanzania_relevance").notNull(),
    flagoRelevance: integer("flago_relevance").notNull(),
    marketImpact: integer("market_impact").notNull(),
    sourceCredibility: integer("source_credibility").notNull(),
    sources: jsonb("sources").notNull().$type<{ name: string; url: string }[]>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("signals_strength_idx").on(table.signalStrength),
    index("signals_region_idx").on(table.region),
    index("signals_created_idx").on(table.createdAt),
  ]
);
