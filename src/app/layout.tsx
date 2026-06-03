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
    default: 'Souhard Singh',
  },
  description: 'Software engineer, writer, and traveler.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://souhardsingh.com',
    siteName: 'Souhard Singh',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@souhardsingh',
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
