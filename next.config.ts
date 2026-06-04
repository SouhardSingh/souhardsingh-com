import type { NextConfig } from 'next'

// Resolve the storage base URL at build time so next/image can validate remote patterns.
// NEXT_PUBLIC_STORAGE_BASE_URL is the public-facing URL of the storage bucket
// (e.g. https://cdn.souhardsingh.com or https://pub-xxx.r2.dev).
const storageBase = process.env.NEXT_PUBLIC_STORAGE_BASE_URL
const storageHostname = storageBase ? new URL(storageBase).hostname : null

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Storage bucket (R2, Vercel Blob, or any CDN) — hostname read from env at build time
      ...(storageHostname ? [{ protocol: 'https' as const, hostname: storageHostname }] : []),
      // Fallback: all r2.dev subdomains (covers unset env during local dev)
      { protocol: 'https' as const, hostname: '*.r2.dev' },
      // Guestbook avatars (GitHub OAuth)
      { protocol: 'https' as const, hostname: 'avatars.githubusercontent.com' },
      // Shelf — book covers from Open Library
      { protocol: 'https' as const, hostname: 'covers.openlibrary.org' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
