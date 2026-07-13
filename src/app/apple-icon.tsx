import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

// Generated at request time so it always tracks the brand palette in src/lib/site.ts.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
export const alt = `${siteConfig.name} icon`

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: siteConfig.brand.accent,
        color: siteConfig.brand.bgLight,
        fontSize: 84,
        fontWeight: 700,
        letterSpacing: 2,
      }}
    >
      SS
    </div>,
    size
  )
}
