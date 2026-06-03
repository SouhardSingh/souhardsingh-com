import Link from 'next/link'
import { RssIcon } from 'lucide-react'

const SECONDARY_NAV = [
  { href: '/now', label: 'Now' },
  { href: '/uses', label: 'Uses' },
  { href: '/shelf', label: 'Shelf' },
  { href: '/lab', label: 'Lab' },
  { href: '/guestbook', label: 'Guestbook' },
  { href: '/contact', label: 'Contact' },
]

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { href: 'https://github.com/souhardsingh', label: 'GitHub', Icon: GitHubIcon },
  { href: 'https://twitter.com/souhardsingh', label: 'Twitter / X', Icon: XIcon },
  { href: 'https://linkedin.com/in/souhardsingh', label: 'LinkedIn', Icon: LinkedInIcon },
  {
    href: '/feed.xml',
    label: 'RSS',
    Icon: ({ size }: { size?: number }) => <RssIcon size={size} aria-hidden="true" />,
  },
]

export function Footer() {
  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <nav aria-label="Secondary navigation">
            <ul className="flex flex-wrap gap-x-4 gap-y-2" role="list">
              {SECONDARY_NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-text-muted hover:text-text text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Social links">
            <ul className="flex items-center gap-3" role="list">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    aria-label={label}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-text-muted hover:bg-surface-2 hover:text-text flex size-8 items-center justify-center rounded-md transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-muted text-sm">© {new Date().getFullYear()} Souhard Singh</p>
          <p className="text-text-muted text-sm">
            Built with{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors"
            >
              Next.js
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
