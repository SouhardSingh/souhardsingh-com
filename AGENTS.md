# AGENTS.md

Guidance for AI coding agents working in this repo. Reflects **current state only** — see `PLANS.md` for roadmap and future work.

## Project

Personal site for Souhard Singh at souhardsingh.com. Built with Next.js 16 App Router, TypeScript, Tailwind CSS 4, shadcn/ui (base-nova style), and Framer Motion. Package manager: pnpm.

## Commands

```bash
pnpm dev          # start dev server (localhost:3000)
pnpm build        # production build (Turbopack)
pnpm lint         # ESLint on src/
pnpm format       # Prettier --write on everything
pnpm type-check   # tsc --noEmit
pnpm start        # serve production build
```

> pnpm binary: `/Users/bigoh/Library/pnpm/bin/pnpm` — not in default PATH. Always run `export PATH="/Users/bigoh/Library/pnpm/bin:$PATH"` first, or use the full path.

## Stack (actual versions)

| Package                  | Version | Note                                                                                                                                      |
| ------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| next                     | 16.2.7  | App Router, Turbopack                                                                                                                     |
| react                    | 19.2.4  |                                                                                                                                           |
| tailwindcss              | 4.x     | CSS-first config — **no `tailwind.config.ts`**                                                                                            |
| @base-ui/react           | 1.x     | Used by shadcn base-nova components                                                                                                       |
| framer-motion            | 12.x    |                                                                                                                                           |
| next-themes              | 0.4.6   | Class-based dark mode                                                                                                                     |
| lucide-react             | 1.17.0  | No brand icons (GitHub/X/LinkedIn are inline SVGs)                                                                                        |
| next-mdx-remote          | 6.x     | MDX rendering via `MDXRemote` (RSC variant from `next-mdx-remote/rsc`)                                                                    |
| gray-matter              | 4.x     | Frontmatter parsing                                                                                                                       |
| reading-time             | 1.x     | Auto-computes `readingTime` in minutes                                                                                                    |
| rehype-pretty-code       | 0.14.x  | Syntax highlighting (github-dark / github-light themes via shiki)                                                                         |
| github-slugger           | 2.x     | Slug generation — matches `rehype-slug` output exactly, handles duplicates                                                                |
| cobe                     | 2.0.x   | WebGL dot globe on /travel (~5 KB). v2 has **no** `onRender` — you drive it with your own rAF loop calling `globe.update({ phi, theta })` |
| react-simple-maps        | 3.x     | SVG world map — now used only by the geo-guesser's `GuessMap` (client-only, `ssr: false`)                                                 |
| drizzle-orm              | 0.45.x  | ORM — installed, DB files not yet created (see PLANS.md)                                                                                  |
| @neondatabase/serverless | 1.x     | Neon HTTP driver — installed, not yet wired                                                                                               |
| drizzle-kit              | 0.31.x  | Dev tool for schema migrations — installed, config not yet created                                                                        |
| eslint                   | 9.x     | Flat config (`eslint.config.mjs`), **not** v10 — v10 breaks `eslint-plugin-react`                                                         |
| prettier                 | 3.x     | With `prettier-plugin-tailwindcss` for class sorting                                                                                      |

## Commit Message Convention

Enforced by `commitlint` on every `git commit` via `.husky/commit-msg`.

Format: `<type>: <subject>` — subject must be lower-case, max 72 chars.

| Type       | Use for                              |
| ---------- | ------------------------------------ |
| `feat`     | new feature or component             |
| `fix`      | bug fix                              |
| `docs`     | AGENTS.md, README, comments          |
| `chore`    | deps, config, tooling, scripts       |
| `content`  | MDX posts, static data files, media  |
| `style`    | formatting only, no logic change     |
| `refactor` | restructure without behaviour change |
| `perf`     | performance improvement              |
| `test`     | tests                                |
| `ci`       | CI/CD config                         |
| `revert`   | revert a previous commit             |

Config: `commitlint.config.mjs`

## Linting & Formatting

### ESLint

Config: `eslint.config.mjs` — extends `eslint-config-next` (flat config array) + `eslint-config-prettier`.

```bash
pnpm lint           # check
pnpm lint --fix     # auto-fix  (use: pnpm exec eslint src/ --fix)
```

`eslint-config-next` v16 already exports a native flat config array; no `FlatCompat` needed. Do **not** upgrade ESLint to v10 — `eslint-plugin-react@7` uses the deprecated `context.getFilename()` API that v10 removed.

### Prettier

Config: `.prettierrc` — single quotes, no semi, 100 char width, `prettier-plugin-tailwindcss` for class ordering.

```bash
pnpm format         # format everything
```

## Pre-commit Hook (Husky + lint-staged)

Husky v9 runs `lint-staged` on every `git commit`. Hook file: `.husky/pre-commit`.

`lint-staged` config in `package.json`:

- `*.{ts,tsx,js,mjs}` → `eslint --fix` then `prettier --write`
- `*.{json,css,md,mdx}` → `prettier --write`

The `prepare` script (`"husky"`) runs automatically on `pnpm install` to activate the hooks.

## Architecture

### What is built

```
src/
  app/
    globals.css                     ← Tailwind 4 design tokens + dark mode CSS vars
    layout.tsx                      ← Root layout: fonts, ThemeProvider, Navbar, Footer, easter eggs; site-wide metadata + viewport (themeColor) + WebSite JSON-LD, all sourced from lib/site.ts
    page.tsx                        ← Home: Hero + ActivityFeed + SelectedWork + RecentPosts; JSON-LD Person schema
    robots.ts                       ← Crawl rules + sitemap pointer (reads lib/site.ts)
    sitemap.ts                      ← Auto-generated sitemap from static routes + blog posts (reads lib/site.ts)
    manifest.ts                     ← PWA web manifest (name, theme colors, icons) from lib/site.ts
    icon.svg                        ← SVG favicon (Next.js App Router file-based, overrides favicon.ico)
    apple-icon.tsx                  ← 180×180 apple-touch-icon generated via next/og ImageResponse
    og/route.tsx                    ← Dynamic OG image (next/og ImageResponse 1200×630); ?title=&type=page|blog&description=
    feed.xml/route.ts               ← RSS 2.0 feed of blog posts (reads lib/site.ts)
    about/page.tsx                  ← Bio, skills grid, career timeline, principles
    work/page.tsx                   ← Redirect → /work/projects (until more sub-sections exist)
    work/projects/page.tsx          ← Filter pills + ProjectCard grid
    writing/page.tsx                ← Redirect → /writing/blog (until garden/building are live)
    writing/blog/page.tsx           ← Category tabs (URL-synced) + PostCard list
    writing/blog/[slug]/page.tsx    ← MDX post: reading progress, sticky TOC, generateStaticParams
    travel/page.tsx                 ← Interactive 3D globe, stats strip, destination + wishlist grids
    play/page.tsx                   ← Tabs: "Where on Earth" geo-guesser + "Comet Run" arcade game
    api/landsat/route.ts            ← Presigned R2 URLs for Landsat letter tiles (rate-limited)
  components/
    providers.tsx                   ← next-themes ThemeProvider (client wrapper)
    layout/
      Navbar.tsx                    ← Sticky, backdrop-blur, dark mode toggle, Sheet mobile menu; SSLogo uses outlined two-tone SVG (accent border + split S/S colors) + full name on sm+
      Footer.tsx                    ← Secondary nav + social icons
      PageWrapper.tsx               ← Framer Motion fade-up, respects prefers-reduced-motion
    home/
      Hero.tsx                      ← Animated gradient orbs, CTA links, CursorTrail; min-h 68dvh (not full screen)
      CursorTrail.tsx               ← Canvas cursor trail (pointer: fine only, ssr: false)
      ActivityFeed.tsx              ← Latest post / featured project / travel teaser cards
      SelectedWork.tsx              ← Grid of featured ProjectCards with "All projects →" link
      RecentPosts.tsx               ← Horizontal list of latest blog posts with date + category badge
    work/
      ExperienceItem.tsx            ← Timeline entry with Framer Motion stagger
      ProjectCard.tsx               ← Cover image, tech pills, GitHub/live links
      ProjectFilter.tsx             ← Client-side tag filter pills
    writing/
      PostCard.tsx                  ← Category badge, date, reading time, tag pills
      CategoryFilter.tsx            ← URL-synced tabs (useRouter + useSearchParams)
      MDXComponents.tsx             ← Custom h2/h3/p/a/ul/blockquote, Callout, Aside; img → MdxImage
      MdxImage.tsx                  ← Client component: inline MDX images with loading skeleton + error fallback (ImageOffIcon)
      ReadingProgress.tsx           ← Fixed 2px accent bar tracking scroll position
      TableOfContents.tsx           ← Prop-driven (headings from server), IntersectionObserver active
    travel/
      Globe.tsx                     ← cobe WebGL globe: auto-spin, drag-to-rotate, HTML marker dots, click-to-focus; pauses rAF off-screen / tab hidden; colors read from CSS tokens, rebuilt on theme change
      GlobeClient.tsx               ← ssr:false wrapper for Globe (circular skeleton)
      GlobeMarkerCard.tsx           ← Hover/tap card for a destination pin
      TravelStats.tsx               ← Visited / continents / wishlist stat strip
      DestinationCard.tsx           ← Visited card (collapsible recs) / compact wishlist card
    play/
      GeoGuesser.tsx                ← 5-round "Where on Earth": clue image → click map → haversine distance → score
      GeoGuesserClient.tsx          ← ssr:false wrapper for GeoGuesser
      GuessMap.tsx                  ← react-simple-maps geoEquirectangular; click→lat/lng is a pure linear inverse
    games/
      CometGame.tsx                 ← 2D canvas comet dodger. variant="overlay" (Konami) | "inline" (/play)
    easter-eggs/
      EasterEggs.tsx                ← Client wrapper; owns Konami→CometGame overlay state
      KonamiListener.tsx            ← Takes onTrigger(); opens the comet game
      DevConsoleArt.tsx
    ui/                             ← shadcn components: button, badge, card, separator, tooltip, tabs, sheet
                                       cloud-image.tsx — CloudImage: next/image wrapper with loading skeleton + error fallback; use for R2/CDN images
  hooks/
    use-best-score.ts               ← localStorage high score via useSyncExternalStore (no mount gate, syncs across tabs). Use this instead of a setState-in-effect hydration gate.
  lib/
    site.ts                         ← Single source of truth for site identity/URLs/social + brand colors; absoluteUrl(), ogImageUrl(). URL from NEXT_PUBLIC_SITE_URL (falls back to prod). Never hardcode the domain elsewhere.
    geo.ts                          ← haversineKm(), scoreFromDistanceKm()
    utils.ts                        ← cn() helper (clsx + tailwind-merge)
    mdx.ts                          ← getAllPosts(), getPostBySlug() + headings, mdxOptions, extractHeadings()
    garden.ts                       ← getBacklinks(), getAllGardenLinks() — wiki-link [[slug]] graph
    storage/
      index.ts                      ← Provider-agnostic blob storage (StorageProvider interface + factory); env: STORAGE_PROVIDER=r2|blob|local
    db/
      index.ts                      ← Drizzle client; Neon HTTP driver by default; swap to postgres-js via 2-line change for local/self-hosted
      schema.ts                     ← guestbook_entries, post_views tables; pgvector embeddings stub for Phase 5
  types/
    index.ts                        ← Post, Project, Destination, Book extends MediaBase, Film extends MediaBase, GuestbookEntry, ExperienceItem
    play.ts                         ← GeoRound, GuessResult, LatLng
    react-simple-maps.d.ts          ← Hand-written type declarations (includes projection, Line, ZoomableGroup center/onMoveEnd)
public/
  geo/countries-110m.json          ← Self-hosted world-atlas topojson (was fetched from the jsdelivr CDN at runtime)
  play/rounds/                     ← Clue images for the geo-guesser, named {round.id}.jpg
content/
  blog/hello-world.mdx
  garden/
    what-is-a-digital-garden.mdx
    learning-in-public.mdx
  travel/destinations.json         ← 4 visited + 6 wishlist destinations (typed as Destination[])
  play/geo-rounds.json             ← GeoRound[]; falls back to the text hint when an image is missing
  data/
    projects.ts                     ← Project[] + featuredProjects export
    experience.ts                   ← ExperienceItem[]
    books.ts                        ← Book[]
    films.ts                        ← Film[]
eslint.config.mjs
.prettierrc
.husky/pre-commit
```

### Path aliases

| Alias        | Resolves to   | Use for                           |
| ------------ | ------------- | --------------------------------- |
| `@/*`        | `./src/*`     | All source files                  |
| `@content/*` | `./content/*` | Static data and MDX content files |

### MDX pipeline

- `getAllPosts(type)` reads `content/<type>/`, filters `published: true`, sorts newest-first
- `getPostBySlug(type, slug)` returns `{ frontmatter, source, headings }` — `headings` is extracted server-side via remark AST + `GithubSlugger`, matching `rehype-slug` IDs exactly (including duplicate handling)
- `mdxOptions` configures: remark-gfm, rehype-slug, rehype-autolink-headings (wrap), rehype-pretty-code (github-dark/light)
- `TableOfContents` receives `headings` as a prop — no DOM reading, no client-side effect needed
- Garden `[[slug]]` wiki-links parsed at build time; backlinks via `getBacklinks(slug)`
- Content data in `content/data/` is plain TypeScript — import via `@content/data/...`, no file I/O

### Blog images

**Storage**: `public/images/blog/<post-slug>/` for inline images, `public/images/blog/covers/` for cover images. Next.js serves these from Vercel's edge at no extra cost; `next/image` handles format conversion (WebP) and resizing at request time.

**In MDX**: Standard markdown image syntax — `![caption](./image.jpg)` or `![caption](/images/blog/slug/image.jpg)`. The `img` key in `mdxComponents` renders them as lazy-loaded `<figure>` with the alt text as a visible caption. Do **not** use `<img>` JSX directly in MDX — use the markdown syntax so the component override applies.

**Cover image**: Add `coverImage: /images/blog/covers/slug.jpg` to the MDX frontmatter. The `Post.coverImage` field carries this through; wire it into PostCard and the blog post page header when needed.

**Scale-up path**: When repo images exceed ~150MB, migrate to Vercel Blob (`@vercel/blob`) — the `put()` API returns a URL, swap `/public/` paths for blob URLs, zero other changes needed.

### URL structure — writing and work

`/writing` and `/work` are **section hubs** that redirect to their single live sub-section today. When a second sub-section ships, the redirect becomes a proper landing page.

```
/writing            ← hub (redirects → /writing/blog today)
  /writing/blog     ← polished long-form essays  ✅ live
  /writing/garden   ← digital garden notes        ⬜ Phase 4
  /writing/building ← building-in-public logs     ⬜ Phase 4

/work               ← hub (redirects → /work/projects today)
  /work/projects    ← portfolio listing            ✅ live
  /work/experience  ← career timeline              ⬜ Phase 4
  /work/architecture ← system design writeups      ⬜ Phase 4
```

Nav links always point to `/writing` and `/work` — never to sub-pages — so no nav changes are needed when new sub-sections launch.

### Metadata & SEO

- **`lib/site.ts` is the single source of truth** for the domain, identity, social handles, and brand
  colors. Never hardcode `https://souhardsingh.com` — import `siteConfig`, `absoluteUrl()`, or
  `ogImageUrl()`. The base URL comes from `NEXT_PUBLIC_SITE_URL` (falls back to prod), so previews get
  correct canonicals/OG/sitemap/feed automatically.
- **Root `layout.tsx`** sets `metadataBase`, a title template, default OG/Twitter cards, `alternates`
  (canonical + RSS), `robots`, `appleWebApp`, and a `WebSite` JSON-LD block.
- **Per-page metadata**: export `metadata` (or `generateMetadata`) with `title` + `description`; add an
  OG image via `ogImageUrl(title, 'page' | 'blog', description)`. Title inherits the layout template.
- **`themeColor` / `colorScheme` / `width` live in the `viewport` export, NOT `metadata`** — Next
  ignores them in `metadata`. The two `themeColor` entries must match `--bg` (light/dark) in globals.css.
- **`/og`** renders the card with `next/og` `ImageResponse` (1200×630); it auto-sizes long titles.
  `apple-icon.tsx` and `manifest.ts` are likewise generated from `siteConfig.brand` — no binary assets.

### ssr:false pattern

Next.js 16: `next/dynamic` with `ssr: false` **cannot** be called in Server Components. Wrap in a `'use client'` component first (see `GlobeClient`, `GeoGuesserClient`, `EasterEggs`).

Components that need `ssr: false`:

- `Globe` — WebGL via cobe
- `GeoGuesser` — pulls in `react-simple-maps` (browser SVG APIs)
- `CursorTrail` — uses canvas + `window.matchMedia`

### What is NOT built yet

| Item                                 | Notes                    |
| ------------------------------------ | ------------------------ |
| CI/CD (GitHub Actions)               | See 07-infra §2          |
| `/ask` RAG, Pagefind, CommandPalette | Phase 5 — needs DB first |
| Garden graph, `/writing/garden`      | Phase 4                  |
| Guestbook, `/shelf`, `/now`, `/uses` | Phase 4 — needs DB       |
| Tests (Jest, Playwright)             | Phase 6                  |

See `PLANS.md` for priority order and full status table.

### Tailwind 4 — CSS-first tokens

Design tokens live in `src/app/globals.css`, not a config file:

```css
:root {
  --bg: 42 100% 97%;
  --accent: 38 61% 57%; /* etc. */
}
.dark {
  --bg: 30 40% 7%; /* dark overrides */
}

@theme inline {
  --color-bg: hsl(var(--bg));
  --color-accent: hsl(var(--accent));
  /* ... registers bg-bg, text-accent, etc. as Tailwind utilities */
}
```

Dark mode uses `@custom-variant dark (&:where(.dark, .dark *))` — activated by next-themes adding `class="dark"` to `<html>`.

Never hardcode hex values in components. Use `bg-bg`, `text-text`, `text-text-muted`, `bg-accent`, `bg-surface`, `bg-surface-2`, `border-border`, `text-terracotta`, `text-green`.

### shadcn base-nova (key difference from classic shadcn)

Components use `@base-ui/react` primitives, not Radix UI. Implications:

- **No `asChild` prop** — use `render` prop instead, or pass className/children directly to the primitive
- `SheetTrigger`, `Dialog.Trigger`, etc. render `<button>` by default and accept className directly
- Component files are in `src/components/ui/`
- **Button as link**: do NOT use `<Button render={<Link />}>` — Base UI warns when a non-`<button>` is rendered with `nativeButton: true`. Instead apply `buttonVariants()` directly on `<Link>`:
  ```tsx
  import { buttonVariants } from '@/components/ui/button'
  ;<Link href="..." className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
    Label
  </Link>
  ```

### Fonts

Three font variables injected on `<html>` by the root layout:

| Variable           | Font             | Tailwind class            |
| ------------------ | ---------------- | ------------------------- |
| `--font-playfair`  | Playfair Display | `font-display`            |
| `--font-inter`     | Inter            | `font-body` / `font-sans` |
| `--font-jetbrains` | JetBrains Mono   | `font-mono`               |

### Animation

All Framer Motion animations must check `useReducedMotion()`. Use `PageWrapper` for page-level transitions.

**Never branch SSR-rendered markup on `useReducedMotion()`.** It returns `false` on the server, so
`initial={reduced ? {} : {...}}` or `{!reduced && <Orbs/>}` makes the server HTML disagree with a
reduced-motion client and throws a React hydration error. Keep `initial` and the rendered tree
constant; express the preference through `transition={{ duration: reduced ? 0 : 0.4 }}` (and a
resting `animate` value). `whileHover`/`whileTap` are safe to branch — they never affect SSR output.
Components rendered only behind `ssr: false` are exempt.

### Easter Eggs

`EasterEggs` is a client component mounted once in `src/app/layout.tsx`. It owns the Konami →
`CometGame` overlay state; `KonamiListener` just calls `onTrigger()`. Easter egg logic stays out of
page files. In Next.js 16, `ssr: false` with `next/dynamic` cannot be used in Server Components —
wrap in a `'use client'` component first.

## Key Constraints

- pnpm only — no npm or yarn
- No hardcoded colors — use CSS variable tokens
- All images must use `next/image` — no bare `<img>` tags
- All interactive elements must be keyboard-accessible
- `prefers-reduced-motion` must be respected in every animated component
- Tailwind 4: no `tailwind.config.ts` — extend tokens in `globals.css` `@theme inline` block
- shadcn components use `@base-ui/react` — check component source before assuming Radix UI API
- ESLint stays on v9 — do not upgrade to v10

## Responsive Design Rules

The site must be presentable on mobile (375px+), tablet (768px+), and desktop (1280px+).

- **Touch targets**: Icon-only buttons must be `size-11` (44px) on mobile, `md:size-8` on desktop. Text links in dense lists need `py-1.5` minimum. Never use `size-8` alone on an interactive element that's visible on mobile.
- **No horizontal scroll**: Every page must fit within its viewport width at 375px. Test by checking `document.body.scrollWidth <= 375`.
- **Breakpoint pattern**: Mobile-first. Write base styles for 375px, override at `sm:` (640px), `md:` (768px), `lg:` (1024px). See `docs/plan/03-pages.md` and `docs/plan/04-features.md` for per-component breakpoint tables.
- **Dynamic viewport height**: Use `dvh` (not `vh`) for full-screen layouts that must avoid the mobile browser chrome and virtual keyboard. Example: `min-h-[calc(100dvh-3.5rem)]` for page content below the navbar.
- **Touch-hostile interactions**: Force-directed graphs (GardenGraph), canvas cursor trails, and hover-only states must be disabled or replaced on touch devices. Use `@media (pointer: coarse)` or `useMediaQuery('(pointer: coarse)')`.
- **Grids**: Default to 1 col on mobile, 2 cols at `md:`, 3 cols at `lg:`. See per-feature tables in the plan docs for exceptions.

## pnpm workspace config

`pnpm-workspace.yaml` suppresses build scripts for `msw`, `sharp`, `unrs-resolver`:

```yaml
allowBuilds:
  msw: false
  sharp: false
  unrs-resolver: false
onlyBuiltDependencies: []
```

pnpm rewrites this file on each `pnpm install` — keep `false` values intact.
