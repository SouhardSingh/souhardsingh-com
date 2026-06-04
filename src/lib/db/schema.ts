import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core'

// ── Guestbook ─────────────────────────────────────────────────────────────────
// Phase 4 — GitHub OAuth required; see docs/plan/04-features.md
export const guestbookEntries = pgTable('guestbook_entries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  username: varchar('username', { length: 50 }).notNull(),
  avatar: text('avatar').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// ── Post view counts ───────────────────────────────────────────────────────────
// Lightweight hit counter — no PII. Increment with a server action on page load.
export const postViews = pgTable('post_views', {
  slug: varchar('slug', { length: 255 }).primaryKey(),
  views: integer('views').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// ── pgvector embeddings (stub) ─────────────────────────────────────────────────
// Phase 5 — /ask RAG. Requires: CREATE EXTENSION IF NOT EXISTS vector; in Neon.
// Uncomment when Phase 5 begins:
//
// import { customType } from 'drizzle-orm/pg-core'
// const vector = (name: string, dim: number) =>
//   customType<{ data: number[] }>({
//     dataType: () => `vector(${dim})`,
//     fromDriver: (v: string) => v.slice(1, -1).split(',').map(Number),
//     toDriver: (v: number[]) => `[${v.join(',')}]`,
//   })(name)
//
// export const embeddings = pgTable('embeddings', {
//   id:        serial('id').primaryKey(),
//   slug:      varchar('slug', { length: 255 }).notNull(),
//   chunk:     text('chunk').notNull(),
//   embedding: vector('embedding', 1536),
//   createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
// })

export type GuestbookEntry = typeof guestbookEntries.$inferSelect
export type NewGuestbookEntry = typeof guestbookEntries.$inferInsert
export type PostView = typeof postViews.$inferSelect
