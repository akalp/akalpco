akalp.co — personal website and blog for Hasan Akalp. Built with Next.js (App Router) and TypeScript. Includes portfolio, blog, and contact pages.

## Getting Started

Run the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser to view the site. Edit `src/app/page.tsx` (and other files under `src/`) to iterate; changes hot‑reload during development.

## Scripts

- `dev` — start the development server
- `generate:og` — generate Open Graph images in `public/og/`
- `build` — generate OG images, build, and optimize images for static export
- `start` — run the production server
- `lint` — run lint checks
- `format` — apply Prettier formatting to the codebase
- `typecheck` — run the TypeScript compiler without emitting files

## Project Structure

- `src/app/` — Next.js App Router routes, layouts, and route-level UI
- `src/components/` — shared UI components
- `src/lib/` — shared utilities (Markdown rendering, blog helpers, reading time)
- `src/config/` — app configuration (metadata, fonts, image sizes)
- `src/data/` — navigation and other site data
- `src/types/` — TypeScript types
- `src/assets/fonts/` — local font files (used by `next/font/local` and OG generation)
- `content/blog/` — Markdown posts with front‑matter: `title`, `date`, `description`, `tags`
- `public/` — static assets (including generated `public/og/` images)

## Configuration

Create a `.env.local` file in the project root (or configure environment variables in your hosting provider) and set:

- `NEXT_PUBLIC_SITE_URL` — canonical base URL used for metadata, sitemap, RSS, and social previews. Example: `https://akalp.co`.

When deploying to Cloudflare Pages (or any static hosting), configure the same variable in the project settings so SSG uses the correct value.

## Deployment

Build the app and run it in any Node.js environment:

```bash
npm run build
npm start
```

### Cloudflare Pages (static export)

This project is configured for static export via `output: "export"` in `next.config.ts`.

- Build command: `next build`
- Output directory: `out`
- Note: Do not use `next start` with static export. Deploy the contents of `out`.
- Optional local preview of the static export:

```bash
npm run build
npx serve out
```

Refer to the official Next.js documentation for hosting options and production best practices: https://nextjs.org/docs/app/building-your-application/deploying

## Learn More

- Next.js documentation: https://nextjs.org/docs
- Learn Next.js (tutorial): https://nextjs.org/learn
