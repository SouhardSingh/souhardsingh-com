/**
 * Database client — Drizzle ORM.
 *
 * Driver is selected by DB_DRIVER in .env.local (defaults to 'neon'):
 *
 *   DB_DRIVER=neon  — @neondatabase/serverless HTTP driver (edge + serverless, installed)
 *   DB_DRIVER=pg    — postgres-js standard driver (local docker, self-hosted, Supabase)
 *                     Requires: pnpm add postgres
 *
 * DATABASE_URL is the only required secret. Format:
 *   postgresql://user:pass@host/dbname[?sslmode=require]
 */

import { neon } from '@neondatabase/serverless'
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-http'
// For postgres-js, uncomment:
// import postgres from 'postgres'
// import { drizzle as pgDrizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set. See .env.example.')

const driver = process.env.DB_DRIVER ?? 'neon'

function createDb() {
  if (driver === 'neon') return neonDrizzle(neon(url!), { schema })
  // if (driver === 'pg') return pgDrizzle(postgres(url!), { schema })
  throw new Error(`Unknown DB_DRIVER: "${driver}". Valid values: "neon" | "pg".`)
}

export const db = createDb()
export type DB = typeof db
