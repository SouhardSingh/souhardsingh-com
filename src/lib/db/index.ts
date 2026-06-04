/**
 * Database client — Drizzle ORM, auto-selects driver from DATABASE_URL.
 *
 * Current default: Neon serverless HTTP driver (works in edge + Node.js functions).
 *
 * To switch to standard Postgres (local docker, self-hosted, Supabase, etc.):
 *   1. pnpm add postgres
 *   2. Comment out the Neon block below, uncomment the postgres-js block.
 *   No other files need to change — all query code goes through `db`.
 *
 * DATABASE_URL formats:
 *   Neon:           postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
 *   Local postgres: postgresql://postgres:password@localhost:5432/souhardsingh
 */

import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Add it to .env.local (local dev) or the Vercel dashboard (production).'
  )
}

// ── Neon HTTP driver (current) ────────────────────────────────────────────────
const sql = neon(process.env.DATABASE_URL)
export const db = drizzleNeon(sql, { schema })

// ── Standard postgres-js driver (swap for local / self-hosted) ────────────────
// import postgres from 'postgres'
// import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js'
// export const db = drizzlePg(postgres(process.env.DATABASE_URL), { schema })

export type DB = typeof db
