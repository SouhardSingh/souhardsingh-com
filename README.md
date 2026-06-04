# souhardsingh.com

Personal site for Souhard Singh — software engineer, writer, traveler.

## Stack

- [Next.js 16](https://nextjs.org) — App Router, Turbopack
- [Tailwind CSS 4](https://tailwindcss.com) — CSS-first token config (no `tailwind.config.ts`)
- [shadcn/ui](https://ui.shadcn.com) — base-nova style (`@base-ui/react` primitives)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) — MDX content pipeline
- [next-themes](https://github.com/pacocoursey/next-themes) — dark mode

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
  data/
    projects.ts   experience.ts   books.ts   films.ts
```

## Environment Variables

Copy `.env.example` to `.env.local` (required for `/ask` and guestbook — not yet implemented):

```
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
