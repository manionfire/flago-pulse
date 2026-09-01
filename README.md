# FLAGO PULSE

An automated market, creative and trend intelligence platform for Flago Creative. This is
the V1 narrow-MVP slice of the full [product spec](#product-spec): a real, working core
loop — source ingestion → AI classification & scoring → a daily signal dashboard — built
to be expanded toward the full platform described in the spec.

## What's built

- **Source registry** (`sources` table) seeded with 8 real, verified RSS feeds spanning
  Tanzania, Africa and Global marketing/business/tech coverage. See
  [`src/lib/db/seed-sources.ts`](src/lib/db/seed-sources.ts) — add more sources there or
  directly in the database.
- **Ingestion pipeline** (`src/lib/ingest/rss.ts`) — fetches all active sources, dedupes
  against previously seen items by content hash, stores new items.
- **AI classification + scoring** (`src/lib/ai/classify.ts`, `src/lib/scoring.ts`) — each
  new item is classified (category, market level, industries) and scored using Claude,
  then combined with source credibility and recency into a 0–100 signal strength score,
  answering the PRD's "So what?" question: why it matters, what it means for Flago, and
  a recommended action.
- **Dashboard** (`/`) — Market Temperature by region + Today's Pulse signal cards.
- **Source registry page** (`/sources`).
- **Model router** (`src/lib/ai/router.ts`) — an abstraction layer so models/providers can
  be swapped per task without touching call sites, per the PRD's model-abstraction
  principle.

### Deliberately deferred (see PRD sections 59–61 for the full roadmap)

Trend engine, Africa Gap engine, Creative Radar / campaign database, Competitor Watch,
Client Pulse, Opportunity pipeline, Idea Bank, Ask Pulse, report generation (daily/
weekly/monthly PDFs), auth/roles, and event-level dedup (today, near-duplicate stories
from different sources become separate signals rather than one event with multiple
sources).

## Setup

1. **Database** — provision a Postgres database (Vercel Postgres or Neon both work).
   Copy the connection string into `DATABASE_URL`.
2. **Anthropic API key** — copy `.env.example` to `.env.local` and set
   `ANTHROPIC_API_KEY`.
3. Install dependencies and push the schema:

   ```bash
   npm install
   npm run db:push
   npm run db:seed
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

5. Trigger a manual ingestion + classification run (needs `DATABASE_URL` and
   `ANTHROPIC_API_KEY` set):

   ```bash
   npm run ingest
   ```

   Refresh `/` to see signals appear.

## Deploying

The app deploys to Vercel as a standard Next.js app. Set `DATABASE_URL`,
`ANTHROPIC_API_KEY` and `CRON_SECRET` as Vercel project environment variables — Vercel
Cron automatically sends `CRON_SECRET` as a bearer token when it calls `/api/ingest` on
the schedule defined in `vercel.json` (daily at 05:00 UTC).

## Product spec

The full V1–V3 product requirements this build is scoped against live in the
conversation history with the product owner; ask for a copy if you need the source
document.
