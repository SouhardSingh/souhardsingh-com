/**
 * Provider-agnostic blob storage.
 *
 * Set STORAGE_PROVIDER in .env.local to switch backends:
 *   'r2'    — Cloudflare R2  (needs NEXT_PUBLIC_STORAGE_BASE_URL + R2 API keys for uploads)
 *   'local' — /public/uploads/ on disk, served as static files (default, zero deps)
 *   'blob'  — Vercel Blob   (install @vercel/blob + set BLOB_READ_WRITE_TOKEN, then wire below)
 *
 * Consumer code only ever calls `storage.url(key)` (read) or `storage.upload(...)` (write).
 * Swapping providers is a one-line env-var change; no application code changes needed.
 */

export interface StorageProvider {
  /** Resolve a stored key to its public URL — synchronous, no network call. */
  url(key: string): string
  /** Upload a file and return its public URL. Requires server-side env vars. */
  upload(key: string, body: Buffer, contentType: string): Promise<string>
}

// ── R2 provider ───────────────────────────────────────────────────────────────
// Public reads go straight to the CDN — no SDK needed.
// Uploads: implement /api/admin/upload with @aws-sdk/client-s3 pointed at the R2 endpoint.
function r2Provider(): StorageProvider {
  const base = (process.env.NEXT_PUBLIC_STORAGE_BASE_URL ?? '').replace(/\/$/, '')
  return {
    url(key: string) {
      if (!key) return ''
      if (key.startsWith('http://') || key.startsWith('https://')) return key
      if (key.startsWith('/')) return key // local /public/ path — pass through
      return `${base}/${key}`
    },
    async upload() {
      throw new Error(
        'R2 upload not yet wired. Add @aws-sdk/client-s3 and implement /api/admin/upload. See docs/plan/07-infrastructure.md §7.'
      )
    },
  }
}

// ── Local filesystem provider (dev / self-hosted) ─────────────────────────────
// Files land in /public/uploads/<key> and are served as static assets.
// Upload only works in Node.js runtime (not edge). Fine for local dev and self-hosted.
function localProvider(): StorageProvider {
  return {
    url(key: string) {
      if (!key) return ''
      if (key.startsWith('http://') || key.startsWith('https://')) return key
      if (key.startsWith('/')) return key
      return `/uploads/${key}`
    },
    async upload(key: string, body: Buffer) {
      const { writeFile, mkdir } = await import('fs/promises')
      const { join, dirname } = await import('path')
      const dest = join(process.cwd(), 'public', 'uploads', key)
      await mkdir(dirname(dest), { recursive: true })
      await writeFile(dest, body)
      return `/uploads/${key}`
    },
  }
}

// ── Vercel Blob provider (stub) ───────────────────────────────────────────────
// Install @vercel/blob, then replace this stub with:
//   import { put } from '@vercel/blob'
//   upload: async (key, body, contentType) => { const { url } = await put(key, body, { access: 'public', contentType }); return url }
function blobProvider(): StorageProvider {
  return {
    url(key: string) {
      // Vercel Blob URLs are returned by put() and stored alongside the key.
      // Until implemented, fall back to treating the key as a path.
      return key.startsWith('http') ? key : `/uploads/${key}`
    },
    async upload() {
      throw new Error(
        'Vercel Blob upload not yet wired. Install @vercel/blob and implement blobProvider.upload().'
      )
    },
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────
function createProvider(): StorageProvider {
  const p = process.env.STORAGE_PROVIDER ?? 'local'
  if (p === 'r2') return r2Provider()
  if (p === 'blob') return blobProvider()
  return localProvider()
}

export const storage = createProvider()

/**
 * Canonical key paths — use these everywhere so renaming a bucket doesn't
 * require a search-replace across the codebase.
 */
export const storageKey = {
  blogImage: (slug: string, file: string) => `blog/${slug}/${file}`,
  blogCover: (slug: string, ext = 'jpg') => `blog/covers/${slug}.${ext}`,
  travelPhoto: (slug: string, file: string) => `travel/${slug}/${file}`,
  avatar: (ext = 'jpg') => `about/avatar.${ext}`,
} as const
