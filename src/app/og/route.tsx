import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { siteConfig } from '@/lib/site'

export const alt = `${siteConfig.name} — Open Graph image`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const { accent, bgDark, textDark, mutedDark, surfaceDark } = siteConfig.brand

const LABELS: Record<string, string> = {
  blog: 'Writing',
  page: siteConfig.name,
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const rawTitle = searchParams.get('title')?.slice(0, 100) ?? siteConfig.name
  const type = searchParams.get('type') === 'blog' ? 'blog' : 'page'
  const description = searchParams.get('description')?.slice(0, 160) ?? undefined

  // Long titles need to step down a size or they overflow the card.
  const fontSize = rawTitle.length > 55 ? 60 : rawTitle.length > 32 ? 74 : 88

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: bgDark,
        padding: '72px 80px',
        position: 'relative',
      }}
    >
      {/* Warm glow, echoing the hero orbs */}
      <div
        style={{
          position: 'absolute',
          top: -180,
          right: -120,
          width: 520,
          height: 520,
          borderRadius: 9999,
          background: accent,
          opacity: 0.16,
        }}
      />
      {/* Accent rule */}
      <div style={{ display: 'flex', width: 96, height: 6, background: accent, borderRadius: 4 }} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: accent,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          {LABELS[type]}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize,
            color: textDark,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 20,
            maxWidth: 1000,
          }}
        >
          {rawTitle}
        </div>
        {description && (
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: mutedDark,
              lineHeight: 1.4,
              marginTop: 24,
              maxWidth: 900,
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Footer: avatar chip + domain */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 14,
              background: accent,
              color: bgDark,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            SS
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: textDark, marginLeft: 20 }}>
            {siteConfig.name}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: mutedDark,
            background: surfaceDark,
            padding: '10px 22px',
            borderRadius: 9999,
          }}
        >
          {siteConfig.url.replace(/^https?:\/\//, '')}
        </div>
      </div>
    </div>,
    size
  )
}
