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

| Package        | Version | Note                                                                              |
| -------------- | ------- | --------------------------------------------------------------------------------- |
| next           | 16.2.7  | App Router, Turbopack                                                             |
| react          | 19.2.4  |                                                                                   |
| tailwindcss    | 4.x     | CSS-first config — **no `tailwind.config.ts`**                                    |
| @base-ui/react | 1.x     | Used by shadcn base-nova components                                               |
| framer-motion  | 12.x    |                                                                                   |
| next-themes    | 0.4.6   | Class-based dark mode                                                             |
| lucide-react   | 1.17.0  | No brand icons (GitHub/X/LinkedIn are inline SVGs)                                |
| eslint         | 9.x     | Flat config (`eslint.config.mjs`), **not** v10 — v10 breaks `eslint-plugin-react` |
| prettier       | 3.x     | With `prettier-plugin-tailwindcss` for class sorting                              |

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

### What is built (Phase 1 — Foundation + Phase 2 — Content)

```
src/
  app/
    globals.css         ← Tailwind 4 design tokens + dark mode CSS vars
    layout.tsx          ← Root layout: fonts, ThemeProvider, Navbar, Footer, easter eggs
    page.tsx            ← Placeholder home page
  components/
    providers.tsx       ← next-themes ThemeProvider (client wrapper)
    layout/
      Navbar.tsx        ← Sticky, backdrop-blur, dark mode toggle, Sheet mobile menu
      Footer.tsx        ← Secondary nav + social icons
      PageWrapper.tsx   ← Framer Motion fade-up, respects prefers-reduced-motion
    easter-eggs/
      EasterEggs.tsx    ← Client wrapper (Next.js 16: ssr:false must be in client component)
      KonamiListener.tsx
      DevConsoleArt.tsx
    ui/                 ← shadcn components: button, badge, card, separator, tooltip, tabs, sheet
  lib/
    utils.ts            ← cn() helper (clsx + tailwind-merge)
    mdx.ts              ← getAllPosts(), getPostBySlug(), mdxOptions (rehype/remark plugins)
    garden.ts           ← getBacklinks(), getAllGardenLinks() — wiki-link [[slug]] graph builder
  types/
    index.ts            ← Post, Project, Destination, Book, Film, GuestbookEntry, ExperienceItem
content/
  blog/
    hello-world.mdx
  garden/
    what-is-a-digital-garden.mdx
    learning-in-public.mdx
  travel/
    destinations.json   ← 5 visited + 5 wishlist destinations
  data/
    projects.ts         ← Project[] with featuredProjects export
    experience.ts       ← ExperienceItem[]
    books.ts            ← Book[]
    films.ts            ← Film[]
eslint.config.mjs       ← ESLint flat config
.prettierrc             ← Prettier config
.husky/pre-commit       ← lint-staged hook
```

### MDX pipeline notes

- `getAllPosts(type)` reads from `content/<type>/`, filters `published: true`, sorts newest-first
- `getPostBySlug(type, slug)` returns `{ frontmatter, source }` — pass `source` to `next-mdx-remote`
- `mdxOptions` configures: remark-gfm, rehype-slug, rehype-autolink-headings, rehype-pretty-code (github-dark/light)
- Garden `[[slug]]` wiki-links are parsed at build time; backlinks available via `getBacklinks(slug)`
- Content data files in `content/data/` are plain TypeScript — import directly, no file I/O

### What is NOT built yet

All pages beyond `/`, `/ask` API, search/CommandPalette, scripts, tests, CI/CD — see `PLANS.md`.

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

### Fonts

Three font variables injected on `<html>` by the root layout:

| Variable           | Font             | Tailwind class            |
| ------------------ | ---------------- | ------------------------- |
| `--font-playfair`  | Playfair Display | `font-display`            |
| `--font-inter`     | Inter            | `font-body` / `font-sans` |
| `--font-jetbrains` | JetBrains Mono   | `font-mono`               |

### Animation

All Framer Motion animations must check `useReducedMotion()`. Use `PageWrapper` for page-level transitions.

### Easter Eggs

`EasterEggs` is a client component mounted once in `src/app/layout.tsx`. Easter egg logic stays out of page files. In Next.js 16, `ssr: false` with `next/dynamic` cannot be used in Server Components — wrap in a `'use client'` component first.

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
