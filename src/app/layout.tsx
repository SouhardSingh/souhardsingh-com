import type { Metadata } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { EasterEggs } from '@/components/easter-eggs/EasterEggs'
import { cn } from '@/lib/utils'

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

export const metadata: Metadata = {
  metadataBase: new URL('https://souhardsingh.com'),
  title: {
    template: '%s — Souhard Singh',
    default: 'Souhard Singh — Software Engineer',
  },
  description:
    'Software engineer focused on backend systems and distributed infrastructure. Writing about engineering, travel, and the things in between.',
  keywords: ['software engineer', 'backend', 'distributed systems', 'TypeScript', 'Go', 'Next.js'],
  authors: [{ name: 'Souhard Singh', url: 'https://souhardsingh.com' }],
  creator: 'Souhard Singh',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://souhardsingh.com',
    siteName: 'Souhard Singh',
    title: 'Souhard Singh — Software Engineer',
    description:
      'Software engineer focused on backend systems and distributed infrastructure. Writing about engineering, travel, and the things in between.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@souhardsingh',
  },
  alternates: {
    canonical: 'https://souhardsingh.com',
    types: { 'application/rss+xml': 'https://souhardsingh.com/feed.xml' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(playfair.variable, inter.variable, jetbrains.variable)}
    >
      <body className="flex min-h-screen flex-col antialiased">
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
