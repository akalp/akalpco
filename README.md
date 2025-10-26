akalp.co — personal website and blog for Hasan Akalp. Built with Next.js (App Router) and TypeScript. Includes portfolio, blog, and contact pages.

## Getting Started

Run the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser to view the site. Edit `app/page.tsx` (and other files under `app/`) to iterate; changes hot‑reload during development.

## Scripts

- `dev` — start the development server
- `build` — create a production build
- `start` — run the production server
- `lint` — run lint checks

## Project Structure

- `app/` — routes, layouts, and UI components
- `app/content/blog/` — Markdown posts with front‑matter: `title`, `date`, `description`, `tags`, `draft`
- `app/data/` — navigation and project data
- `app/fonts/` — local font files
- `public/` — static assets

## Configuration

- `NEXT_PUBLIC_SITE_URL` (optional) — sets the canonical base URL and Open Graph metadata.

Create a `.env` file in the project root if needed and define environment variables there.

## Deployment

Build the app and run it in any Node.js environment:

```bash
npm run build
npm start
```

Refer to the official Next.js documentation for hosting options and production best practices: https://nextjs.org/docs/app/building-your-application/deploying

## Learn More

- Next.js documentation: https://nextjs.org/docs
- Learn Next.js (tutorial): https://nextjs.org/learn
