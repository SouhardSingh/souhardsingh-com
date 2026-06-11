'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MenuIcon, MoonIcon, SunIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/travel', label: 'Travel' },
  { href: '/ask', label: '/ask', accent: true },
]

function SSLogo() {
  return (
    <Link href="/" aria-label="Souhard Singh — home" className="group flex items-center gap-2.5">
      {/* Custom S mark — bezier path, not a font glyph */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-opacity group-hover:opacity-75"
      >
        <rect
          width="32"
          height="32"
          rx="7"
          fill="hsl(var(--surface-2))"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        <path
          d="M21,9 C21,6 11,6 11,13 C11,18 21,18 21,22 C21,27 11,27 11,24"
          stroke="hsl(var(--accent))"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-text hidden text-sm font-semibold tracking-wide sm:inline">
        Souhard Singh
      </span>
    </Link>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Intentional hydration gate
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="size-11 md:size-8" />
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="text-text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-accent flex size-11 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:size-8"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
    </button>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full backdrop-blur-sm transition-shadow duration-200',
        scrolled ? 'border-border border-b shadow-sm' : 'border-b border-transparent',
        'bg-bg/80'
      )}
    >
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <SSLogo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex" role="list">
          {NAV_LINKS.map(({ href, label, accent }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    accent
                      ? 'text-accent hover:text-accent-hover'
                      : active
                        ? 'text-text decoration-accent underline underline-offset-4'
                        : 'text-text-muted hover:text-text'
                  )}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="text-text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-accent flex size-11 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden md:size-8"
              aria-label="Open navigation menu"
            >
              <MenuIcon size={16} />
            </SheetTrigger>
            <SheetContent side="right" showCloseButton={false} className="bg-bg w-72 pt-12">
              <button
                onClick={() => setOpen(false)}
                className="text-text-muted hover:bg-surface-2 hover:text-text absolute top-3 right-3 flex size-11 items-center justify-center rounded-md"
                aria-label="Close menu"
              >
                <XIcon size={16} />
              </button>
              <ul className="flex flex-col gap-1 px-4" role="list">
                {NAV_LINKS.map(({ href, label, accent }) => {
                  const active = pathname === href || pathname.startsWith(href + '/')
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'block rounded-md px-3 py-3 text-base font-medium transition-colors',
                          accent
                            ? 'text-accent'
                            : active
                              ? 'bg-surface-2 text-text'
                              : 'text-text-muted hover:bg-surface-2 hover:text-text'
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
