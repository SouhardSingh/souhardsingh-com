import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { EasterEggs } from '@/components/easter-eggs/EasterEggs'
import { cn } from '@/lib/utils'
import { absoluteUrl, ogImageUrl, siteConfig } from '@/lib/site'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const defaultOgImage = {
  url: ogImageUrl(siteConfig.name),
  width: 1200,
  height: 630,
  alt: siteConfig.title,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s — ${siteConfig.name}`,
    default: siteConfig.title,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitterHandle,
    creator: siteConfig.social.twitterHandle,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [defaultOgImage],
  },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': absoluteUrl('/feed.xml') },
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'default',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

// themeColor / colorScheme belong in `viewport`, not `metadata` — Next ignores them there.
// The two theme colors match `--bg` in globals.css so the mobile browser chrome matches the page.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: siteConfig.brand.bgLight },
    { media: '(prefers-color-scheme: dark)', color: siteConfig.brand.bgDark },
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: siteConfig.lang,
  author: { '@type': 'Person', name: siteConfig.author.name, url: siteConfig.url },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteConfig.lang}
      suppressHydrationWarning
      className={cn(playfair.variable, inter.variable, jetbrains.variable)}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>
          <a
            href="#main-content"
            className="focus:bg-accent focus:text-bg sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
          >
            Skip to content
          </a>
          <EasterEggs />
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
