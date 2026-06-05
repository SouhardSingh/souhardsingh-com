/**
 * Provider-agnostic blob storage.
 *
 * Set STORAGE_PROVIDER in .env.local to choose a backend:
 *   's3'          — any S3-compatible service: Cloudflare R2, AWS S3, Backblaze B2, MinIO
 *   'vercel-blob' — Vercel Blob (install @vercel/blob + set BLOB_READ_WRITE_TOKEN)
 *
 * Required env vars (all providers):
 *   NEXT_PUBLIC_STORAGE_BASE_URL  — public CDN/bucket URL for reads (no trailing slash)
 *
 * Additional vars for 's3':
 *   STORAGE_ENDPOINT        — S3-compatible endpoint (e.g. https://<account>.r2.cloudflarestorage.com)
 *   STORAGE_ACCESS_KEY_ID   — access key ID
 *   STORAGE_SECRET_ACCESS_KEY — secret access key
 *   STORAGE_BUCKET          — bucket name
 *
 * Consumer code only ever calls `storage.url(key)` or `storage.upload(...)`.
 * Switching providers is a one-line env-var change — no application code changes needed.
 */

export interface StorageProvider {
  /** Resolve a stored key to its public URL — synchronous, no network call. */
  url(key: string): string
  /** Upload a file and return its public URL. Server-side only. */
  upload(key: string, body: Buffer, contentType: string): Promise<string>
}

// ── S3-compatible (Cloudflare R2, AWS S3, Backblaze B2, MinIO) ───────────────
// Public reads go directly via NEXT_PUBLIC_STORAGE_BASE_URL — no SDK needed.
// Uploads: implement /api/admin/upload with @aws-sdk/client-s3.
// See docs/plan/07-infrastructure.md §7 for the upload route.
function s3Provider(): StorageProvider {
  const base = (process.env.NEXT_PUBLIC_STORAGE_BASE_URL ?? '').replace(/\/$/, '')
  return {
    url(key: string) {
      if (!key) return ''
      if (key.startsWith('http://') || key.startsWith('https://')) return key
      return `${base}/${key}`
    },
    async upload() {
      throw new Error(
        'S3 upload not yet wired. Add @aws-sdk/client-s3 and implement /api/admin/upload. See docs/plan/07-infrastructure.md §7.'
      )
    },
  }
}

// ── Vercel Blob (stub) ────────────────────────────────────────────────────────
// Install @vercel/blob, then replace this stub:
//   import { put } from '@vercel/blob'
//   upload: async (key, body, contentType) => {
//     const { url } = await put(key, body, { access: 'public', contentType })
//     return url
//   }
function vercelBlobProvider(): StorageProvider {
  const base = (process.env.NEXT_PUBLIC_STORAGE_BASE_URL ?? '').replace(/\/$/, '')
  return {
    url(key: string) {
      if (!key) return ''
      if (key.startsWith('http://') || key.startsWith('https://')) return key
      return base ? `${base}/${key}` : key
    },
    async upload() {
      throw new Error(
        'Vercel Blob upload not yet wired. Install @vercel/blob and implement vercelBlobProvider.upload().'
      )
    },
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────
function createProvider(): StorageProvider {
  const p = process.env.STORAGE_PROVIDER ?? 's3'
  if (p === 'vercel-blob') return vercelBlobProvider()
  return s3Provider()
}

export const storage = createProvider()

/**
 * Canonical key paths — use these everywhere so renaming a bucket prefix
 * doesn't require a search-replace across the codebase.
 */
export const storageKey = {
  blogImage: (slug: string, file: string) => `blog/${slug}/${file}`,
  blogCover: (slug: string, ext = 'jpg') => `blog/covers/${slug}.${ext}`,
  travelPhoto: (slug: string, file: string) => `travel/${slug}/${file}`,
  avatar: (ext = 'jpg') => `about/avatar.${ext}`,
} as const
