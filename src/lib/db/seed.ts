import "dotenv/config";
import { db } from "./index";
import { sources } from "./schema";
import { SEED_SOURCES } from "./seed-sources";
import { CREDIBILITY_BY_TYPE } from "../taxonomy";
import { sql } from "drizzle-orm";

async function main() {
  for (const source of SEED_SOURCES) {
    await db
      .insert(sources)
      .values({
        ...source,
        credibilityScore: CREDIBILITY_BY_TYPE[source.sourceType],
      })
      .onConflictDoNothing();
  }

  const count = await db.execute<{ count: number }>(sql`select count(*)::int as count from sources`);
  console.log(`Sources in database: ${count[0]?.count}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
