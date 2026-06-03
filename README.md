# souhardsingh.com

Personal site for Souhard Singh — software engineer, writer, traveler.

## Stack

- [Next.js 16](https://nextjs.org) — App Router
- [Tailwind CSS 4](https://tailwindcss.com) — utility-first styling with CSS-first token config
- [shadcn/ui](https://ui.shadcn.com) — component primitives (base-nova style)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [MDX](https://mdxjs.com) — content (coming soon)
- [next-themes](https://github.com/pacocoursey/next-themes) — dark mode

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Build

```bash
pnpm build      # type-check + production build
pnpm type-check # TypeScript only
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values (file coming soon):

```
# /ask AI chatbot
DATABASE_URL=          # Neon Postgres (pgvector)
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

## Content

Written content lives in `content/` as `.mdx` files (not yet set up). Set `published: false` in frontmatter to draft safely — unpublished files won't render.

## License

MIT
