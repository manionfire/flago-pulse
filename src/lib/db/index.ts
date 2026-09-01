import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let instance: Db | null = null;

function getDb(): Db {
  if (!instance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }
    const client = postgres(connectionString, { prepare: false });
    instance = drizzle(client, { schema });
  }
  return instance;
}

// Lazy proxy: defers connecting (and the "DATABASE_URL is not set" error) until a
// query actually runs, instead of throwing at import time. Next.js evaluates route
// modules during build-time page-data collection even for force-dynamic routes, so
// an eager connection would break `next build` whenever DATABASE_URL isn't present
// in the build environment.
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb() as object, prop, receiver);
  },
});
