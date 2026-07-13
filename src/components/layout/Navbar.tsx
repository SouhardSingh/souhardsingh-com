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
  { href: '/play', label: 'Play' },
  { href: '/ask', label: '/ask', accent: true },
]

function SSLogo() {
  return (
    <Link href="/" aria-label="Souhard Singh — home" className="group flex items-center gap-2.5">
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
          d="M24,6 C29,10 28,19 19,25 C15,27 12,25 11,22 C9,19 10,14 13,11 C16,8 20,7 24,6 Z"
          fill="hsl(var(--accent))"
        />
        <line
          x1="24"
          y1="6"
          x2="11"
          y2="25"
          stroke="hsl(var(--surface-2))"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="9"
          x2="26"
          y2="12"
          stroke="hsl(var(--surface-2))"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="19"
          y1="13"
          x2="24"
          y2="16"
          stroke="hsl(var(--surface-2))"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="17"
          x2="20"
          y2="20"
          stroke="hsl(var(--surface-2))"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="13"
          y1="21"
          x2="16"
          y2="23"
          stroke="hsl(var(--surface-2))"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="9"
          x2="19"
          y2="7"
          stroke="hsl(var(--surface-2))"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="19"
          y1="13"
          x2="16"
          y2="11"
          stroke="hsl(var(--surface-2))"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="17"
          x2="14"
          y2="16"
          stroke="hsl(var(--surface-2))"
          strokeWidth="0.9"
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
