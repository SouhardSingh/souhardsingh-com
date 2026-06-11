import { NextRequest, NextResponse } from 'next/server'

import { getRandomLetterKey, getLetterMeta, SUPPORTED_CHARS } from '@/lib/landsat'
import { getPresignedUrl } from '@/lib/r2'
import { checkRateLimit } from '@/lib/rate-limit'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const { allowed, remaining, resetAt } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          ...CORS,
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  const name = req.nextUrl.searchParams.get('name') ?? ''
  if (!name) {
    return NextResponse.json({ error: 'Missing name parameter' }, { status: 400, headers: CORS })
  }
  if (name.length > 20) {
    return NextResponse.json(
      { error: 'Name must be 20 characters or fewer' },
      { status: 400, headers: CORS }
    )
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return NextResponse.json(
      { error: 'Name may only contain letters and spaces' },
      { status: 400, headers: CORS }
    )
  }

  const letters = await Promise.all(
    name.split('').map(async (char) => {
      if (char === ' ') return { char: ' ', url: null, meta: null }

      const upper = char.toUpperCase()
      if (!SUPPORTED_CHARS.has(upper)) return { char, url: null, meta: null }

      const key = getRandomLetterKey(upper)
      if (!key) return { char, url: null, meta: null }

      // Extract index from key for metadata lookup
      const idx = parseInt(key.split('/').pop()?.replace('.jpg', '') ?? '0', 10)
      const meta = getLetterMeta(upper, idx)

      try {
        const url = await getPresignedUrl(key, 300)
        return { char, url, meta }
      } catch {
        return { char, url: null, meta }
      }
    })
  )

  return NextResponse.json(
    { letters },
    {
      headers: {
        ...CORS,
        'Cache-Control': 'no-store',
        'X-RateLimit-Remaining': String(remaining),
      },
    }
  )
}
