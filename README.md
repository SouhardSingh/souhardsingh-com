# souhardsingh.com

Personal site for Souhard Singh — software engineer, writer, traveler.

## Stack

- [Next.js 16](https://nextjs.org) — App Router, Turbopack
- [Tailwind CSS 4](https://tailwindcss.com) — CSS-first token config (no `tailwind.config.ts`)
- [shadcn/ui](https://ui.shadcn.com) — base-nova style (`@base-ui/react` primitives)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) — MDX content pipeline
- [next-themes](https://github.com/pacocoursey/next-themes) — dark mode
- [cobe](https://github.com/shuding/cobe) — WebGL globe on `/travel`
- [react-simple-maps](https://www.react-simple-maps.io) — flat guess map for the `/play` geo-guesser

## Features

- **`/travel`** — interactive 3D globe (drag to rotate, tap a pin) with visited/wishlist markers.
- **`/play`** — two games: "Where on Earth" satellite geo-guesser and "Comet Run" arcade dodger
  (also hidden behind the Konami code on any page).
- **SEO** — dynamic OG images (`/og`), RSS feed (`/feed.xml`), sitemap, robots, PWA manifest, and
  per-page metadata. All URLs/identity come from `src/lib/site.ts`.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Build

```bash
pnpm build      # production build (Turbopack)
pnpm type-check # TypeScript only
pnpm lint       # ESLint
pnpm format     # Prettier
```

## Content

Written content lives in `content/` as `.mdx` files. Set `published: false` in frontmatter to draft safely — unpublished files won't render.

```
content/
  blog/           ← /writing/blog/[slug]
  garden/         ← /writing/garden/[slug]  (wiki-links supported: [[slug]])
  travel/
    destinations.json
  play/
    geo-rounds.json  ← geo-guesser rounds; images live in public/play/rounds/{id}.jpg
  data/
    projects.ts   experience.ts   books.ts   films.ts
```

## Environment Variables

Copy `.env.example` to `.env.local`. Everything below is optional for local dev; the site runs without it.

```
# Canonical site URL — set in preview/staging so canonicals, OG images,
# the sitemap, and the RSS feed point at the right origin (defaults to prod).
NEXT_PUBLIC_SITE_URL=

# /ask AI chatbot
DATABASE_URL=
OLLAMA_BASE_URL=
OLLAMA_MODEL=

# Guestbook auth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
KV_REST_API_URL=
KV_REST_API_TOKEN=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

## License

MIT
