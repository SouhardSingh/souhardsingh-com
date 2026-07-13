/**
 * Single source of truth for site-wide identity, URLs, and social handles.
 * Everything that used to hardcode `https://souhardsingh.com` reads from here.
 *
 * Set NEXT_PUBLIC_SITE_URL in preview/staging so canonicals, OG images, the
 * sitemap, and the RSS feed all point at the deployment they were built for.
 */
export const siteConfig = {
  name: 'Souhard Singh',
  title: 'Souhard Singh — Software Engineer',
  tagline: 'Software engineer, writer, and traveler.',
  description:
    'Software engineer focused on backend systems and distributed infrastructure. Writing about engineering, travel, and the things in between.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://souhardsingh.com').replace(/\/$/, ''),
  locale: 'en_US',
  lang: 'en',
  author: {
    name: 'Souhard Singh',
    email: 'hi@souhardsingh.com',
  },
  keywords: ['software engineer', 'backend', 'distributed systems', 'TypeScript', 'Go', 'Next.js'],
  social: {
    github: 'https://github.com/souhardsingh',
    twitter: 'https://twitter.com/souhardsingh',
    twitterHandle: '@souhardsingh',
    linkedin: 'https://linkedin.com/in/souhardsingh',
  },
  /** Brand colors used where CSS custom properties can't reach (OG images, manifest, theme-color). */
  brand: {
    accent: '#D4A34E',
    bgLight: '#FEF9EF',
    bgDark: '#191207',
    textLight: '#231108',
    textDark: '#F8F0E3',
    mutedDark: '#AD9985',
    surfaceDark: '#241C13',
  },
} as const

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = '/') {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}

/** URL of the generated OG image for a page or post. */
export function ogImageUrl(title: string, type: 'page' | 'blog' = 'page', description?: string) {
  const params = new URLSearchParams({ title, type })
  if (description) params.set('description', description)
  return `/og?${params.toString()}`
}
