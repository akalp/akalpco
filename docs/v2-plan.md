# akalp.co v2 — "Marginalia" handoff

Working notes for Claude Code: migrate akalp.co from Next.js to Astro on Cloudflare Workers. Suggested home in the repo: `docs/v2-plan.md`. Design references are in `akalpco-design-reference.zip` (`design-reference/*.dc.html`). Treat them as **visual and measurement references**, not code to copy verbatim. Read colors, type sizes, spacing and component structure from them.

---

## 1. Goals and tone

- A personal site that puts the person first, doesn't read like a CV, and won't look dated in a year.
- **No hire-me funnel.** No "Contact me" button, no CTAs, no forms. Contact is a quiet "say hi" with links in the footer.
- Voice: first person, warm. UI in English. Each post stays in its own language, and Turkish posts get a `TR` label.
- Concept: **Marginalia**. The site is a paper page annotated in blue ballpoint and marked with a highlighter. Margin notes belong to the site owner only. There is deliberately no guestbook.

## 2. Design system

### Colors (`src/styles/tokens.css`)

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F1EADF` | page background |
| `--paper-raised` | `#FBF7EF` | ticket card, input background |
| `--paper-card` | `#F6F0E6` | project cards, palette footer |
| `--paper-tint` | `#E6DCCB` | inline code background |
| `--photo` | `#E2D7C5` | image placeholder, inside of the polaroid |
| `--ink` | `#221E1A` | text, heavy rules |
| `--ink-soft` | `#3B352E` | secondary body text |
| `--muted` | `#665D52` | meta, dates, labels (passes 4.5:1) |
| `--rule` | `#CFC3B0` | thin dividers |
| `--rule-dash` | `#8A7F70` / `#A89C8A` | dashed rules (ticket, lists) |
| `--pen` | `#2747C4` | margin notes (blue ballpoint) |
| `--highlighter` | `#F2D36B` | highlighter |
| `--code-bg` | `#26211C` | code block background |

Ink options, from ⌘K → "Change the ink":

| Ink | Hex |
|---|---|
| blue | `#2747C4` |
| red | `#B23A1E` |
| green | `#2F6A4D` |
| purple | `#5B3A8C` |

The chosen ink is stored in `localStorage` (always wrapped in `try/catch`). It sets `<html data-ink="…">`, which swaps `--pen`.

Dark mode: not in the first v2 release, because it doesn't fit the paper concept. If wanted later, it gets its own design (a "night desk" theme).

### Typography

- **Fraunces** (variable, `SOFT` 100, automatic `opsz`) for headings and body.
  - H1: `clamp(48px, 7vw, 92px)`, weight 350, line-height 1, letter-spacing -0.02em.
  - Section headings: 40–44px, italic, weight 400.
  - Post body: 21px / 1.65, measure ≤ 700px.
- **Kalam** 300/400 for margin notes, the signature, and `(ha-SAHN)` only. Always in `--pen`, rotated slightly (−2° to +2°).
- **JetBrains Mono** 400/500 for dates, labels, nav, the ticket, and code.
- Self-host the fonts with **Fontsource** (`@fontsource-variable/fraunces`, `@fontsource/kalam`, `@fontsource-variable/jetbrains-mono`). No requests to Google Fonts. Fraunces' `SOFT` axis may need the full variable file, so check that the package includes it.

### Signature components

- **Highlight**: `background: linear-gradient(transparent 58%, var(--highlighter) 58%)`.
- **Margin note**: a `<sup>` number in the text, with the matching Kalam note in the right column at the same height.
  - Desktop: two columns using `flex-wrap`. Content is `flex: 999 1 560px`, the note is `flex: 1 1 220px`.
  - Phone: the note drops below its paragraph.
- **Ticket**: `--paper-raised` background, mono 13px, dashed dividers, rotated about 1.5°, soft shadow. Rows: BREWING / PLAYING / BUILDING / READING / LAST PUSH.
- **Project entry**: large name (44–64px), mono tech line, description, links. On the home page it becomes a museum-tag card with a punched hole.
- **Header**: italic "Hasan Akalp" plus Kalam `(ha-SAHN)`. Nav is `writing · made · now · about` and a `⌘K` button. The active page is underlined (`aria-current="page"`).
- Avoid AI tropes: no gradient backgrounds, no emoji in the UI, no left-border accent cards. Touch targets are at least 44px.

## 3. Pages

| Route | Content | Reference |
|---|---|---|
| `/` | "Hi, I'm Hasan." with a highlighted paragraph and 4 margin notes · Writing list + Today's ticket · Things I've made (4 cards) · Off the keyboard (coffee / games / kitchen) · say-hi footer | `Main.dc.html` |
| `/writing` | all posts, grouped by year, with the TR label | list style in Main |
| `/writing/[slug]` | meta, title, description as subtitle, tags, one-line contents, TL;DR card, margin notes, pull quote, code block, "— Hasan, Ankara" signature, newer/older links | `Post.dc.html` |
| `/made` | open-source projects + an "And for other people" list | `Made.dc.html` |
| `/now` | monthly text (Working on / Learning / Away from the desk) + large ticket + "Previously" archive | `Now.dc.html` |
| `/now/[month]` | archived /now pages | — |
| `/about` | "The longer version." + polaroid portrait + narrative paragraphs + "What I reach for" + "Route so far" ticket | `About.dc.html` |
| `/colophon` | type specimens, color swatches, moving parts, earlier versions (v1 → the `v1` git tag) | `Colophon.dc.html` |
| `/404` | paper-themed, short, with a Kalam note | — |
| ⌘K | on every page: search across pages, posts, projects and commands. Hidden: `coffee` → "418 — I'm a teapot." | `Palette.dc.html` |

Text in square brackets (`[bean · method]`, `[portrait]`, `[email]` and so on) is a placeholder for real content. The margin notes and the "Off the keyboard" lines are drafts, and Hasan will rewrite them in his own voice.

## 4. What moves from the current repo

| Today | v2 |
|---|---|
| `content/blog/*.md` (title, date, description, tags) | Moves to `src/content/writing/*.md`. Add `lang: 'en' \| 'tr'` (default `en`) and an optional `draft` to the schema. Set `lang: tr` on `cs-okumak` and `yatay-gecis`. Slugs stay the same. |
| `public/images/*.png` + `next-image-export-optimizer` + `public/images/optimized/` | Images move to `src/assets/writing/` and are referenced by relative paths from the markdown. `astro:assets` optimizes them. Delete `optimized/` and the hash JSON. |
| `scripts/generate-og-images.mjs` (satori + resvg) | Becomes a `src/pages/og/[slug].png.ts` endpoint with a template in the new design: paper background, Fraunces title, mono meta. Keep TTF font files in the repo for OG. |
| Shiki (github-light/dark) | Use Astro's built-in Shiki with a custom warm-dark theme on `--code-bg`: keywords `#F2D36B`, strings `#A9D3B5`, comments `#9C917F`. |
| `marked` + `sanitize-html` | Not needed. Use Astro's markdown pipeline (remark/rehype). |
| `src/app/rss.xml/route.ts` | Use `@astrojs/rss` at `/rss.xml` (same URL). Links point to `/writing/…`. |
| `sitemap.ts`, `robots.ts` | Use `@astrojs/sitemap` (`/sitemap-index.xml`) + `public/robots.txt`. |
| `src/data/projects.ts`, `experience.ts`, `contacts.ts` | Become `src/data/projects.yaml`, `route.yaml` and `links.yaml`, loaded as Zod-validated collections with the `file()` loader. |
| Tailwind, motion, react, react-icons, twemoji-parser, date-fns | Removed. Plain CSS with custom properties, no framework islands. |
| `public/favicon*`, `apple-touch-icon`, `site.webmanifest`, `hasan.webp` | Kept. The favicon can be redrawn for the new design later. |

### Markdown plugins

- **Margin notes**: standard footnote syntax (`[^1]`). A rehype plugin turns each footnote reference into a `<sup>` plus an adjacent `<aside class="margin-note">`. RSS output keeps normal footnotes.
- **Highlight**: `==text==` → `<mark>` (remark plugin), styled with the highlighter gradient.
- **TL;DR**: wrap the first section headed `## TL;DR` in the ticket card automatically, or use a `:::tldr` directive, whichever is cleaner.
- **Contents**: generated from `h2`s and numbered (`01 TL;DR · 02 …`).

## 5. Infrastructure: Cloudflare Workers + static assets

No Pages. Everything runs as one Worker project:

```jsonc
// wrangler.jsonc
{
  "name": "akalpco",                 // must exactly match the Worker name in Workers Builds
  "main": "./src/worker/index.ts",
  "compatibility_date": "<build day>",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
    "run_worker_first": ["/api/*"]    // the Worker only runs for the API; pages are free assets
  },
  "kv_namespaces": [{ "binding": "TICKET", "id": "<id>" }],
  "triggers": { "crons": ["0 * * * *"] }
}
```

- Astro uses `output: 'static'` with **no adapter**. Bindings are used only inside `src/worker/`.
- `public/_redirects` (natively supported by Workers static assets):
  ```
  /blog            /writing           301
  /blog/*          /writing/:splat    301
  /portfolio       /made              301
  /contact         /about             301
  /sitemap.xml     /sitemap-index.xml 301
  ```
- `public/_headers`:
  - `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*`.
  - General security headers: `X-Content-Type-Options`, `Referrer-Policy`, and a CSP. The CSP can stay strict if ⌘K and the ticket avoid inline scripts.

### Ticket Worker (`src/worker/index.ts`)

- **`GET /api/ticket`** returns the KV `ticket` JSON: `{ brewing, playing, building, reading, lastPush: { repo, at }, updatedAt }`. The response is cached with the Cache API for about 5 minutes to protect the KV read quota.
- **`POST /api/ticket`** requires `Authorization: Bearer <TICKET_TOKEN>` and merges the fields it receives. A small CLI script or alias goes with it: `ticket brew "…"`, `ticket play "…"`.
- **`scheduled`** (hourly cron) reads `akalp`'s latest PushEvent from the GitHub public events API into `lastPush`. An optional `GITHUB_TOKEN` secret raises the rate limit.
- **Client**: the HTML renders the ticket with build-time or empty defaults. A small script then updates it with `fetch('/api/ticket')`. On error it silently stays static.
- **Secrets**: `TICKET_TOKEN` (required) and `GITHUB_TOKEN` (optional), set with `wrangler secret put`.

### Free plan limits (enough)

- Static asset requests: free and unlimited.
- Worker: 100,000 requests/day and 10 ms CPU per request, used only by `/api/*`.
- KV: 100,000 reads and 1,000 writes/day, plenty for the ticket. Don't put frequent writes such as counters in KV.
- Cron: 5 per account.

## 6. pnpm

- Delete `package-lock.json`. Either run `pnpm import` to generate `pnpm-lock.yaml`, or simply run `pnpm install`, since v2 starts from a clean install.
- In `package.json`, add `"packageManager": "pnpm@<version>"` (pinned through Corepack: `corepack use pnpm@latest`) and `"engines": { "node": ">=<version>" }`. Add an `.nvmrc`.
- Workers Builds detects pnpm from the lockfile. Build command: `pnpm build`. Deploy command: `pnpm wrangler deploy`, with wrangler as a devDependency.
- Scripts:

  | Script | Does |
  |---|---|
  | `dev` | `astro dev` |
  | `build` | `astro build` |
  | `preview` | `wrangler dev`, Worker and assets together |
  | `check` | `astro check` |
  | `lint` | lint |
  | `format` | format |
  | `deploy` | deploy |

## 7. Cloudflare setup (with Claude Code, via dashboard + wrangler)

1. **DNS**: confirm akalp.co's nameservers are on Cloudflare. Workers custom domains require it.
2. **KV namespace**: create it (`wrangler kv namespace create TICKET`) and put the id in `wrangler.jsonc`.
3. **Worker + Workers Builds**: connect GitHub `akalp/akalpco`.
   - Production branch `main`, root `/`.
   - Build `pnpm build`, deploy `pnpm wrangler deploy`.
   - Keep preview builds on for non-production branches. The v2 branch's preview URL comes from here.
4. **Secrets**: `TICKET_TOKEN` and, optionally, `GITHUB_TOKEN`. Set them separately for production and for preview if needed.
5. **Cutover**, after v2 is merged:
   - Remove the akalp.co custom domain from the Pages project.
   - Add it to the Worker as a custom domain.
   - If `www` exists, 301 it to the apex with a Redirect Rule.
6. **Zone settings**:
   - Always Use HTTPS on, minimum TLS 1.2, and HSTS once confident.
   - Email Obfuscation can stay on for the footer email, or the address can be protected another way (Worker or `mailto`). Decide.
7. **Analytics (optional)**: Cloudflare Web Analytics (cookieless) if wanted, mentioned on the colophon. If not, the colophon says "no analytics".
8. Once everything is in place, delete the old Pages project.

## 8. Google Search Console

1. **Add a Domain property** (`akalp.co`) and verify it with a DNS TXT record in Cloudflare DNS. Prefer a domain property even if a URL-prefix property already exists.
2. **Submit the new sitemap** after cutover: `https://akalp.co/sitemap-index.xml`. The old `/sitemap.xml` 301s to the new one; remove the old sitemap entry.
3. **Test with URL Inspection**: `/`, `/writing/ten-hours-one-click`, and one old URL (confirm `/blog/ten-hours-one-click` returns a 301). Use "Request indexing" for the new post pages.
4. **No Change of Address is needed**, because the domain doesn't change. The 301s are enough.
5. **Watch the Pages (Indexing) report** for a few weeks for 404s and "Page with redirect". Add any missing redirect to `_redirects`.
6. **Meta on every page**: a canonical URL, `og:` / `twitter:` meta, `lang` (`lang="tr"` at the article level for Turkish posts), and an RSS `<link rel="alternate">`.

## 9. Phases

0. **Prep**
   - Tag `main` as `v1`.
   - Create the `v2` branch.
   - Check DNS.
1. **Skeleton**
   - Remove the Next.js files.
   - Set up pnpm + Astro.
   - Add an assets-only `wrangler.jsonc`.
   - Connect Workers Builds and get the v2 preview URL working.
2. **Design system**: tokens, fonts, Base layout, Header/Footer, MarginNote, Ticket (static), Highlight.
3. **Content**
   - Collections and schemas.
   - Migrate posts and images.
   - Markdown plugins and the Shiki theme.
   - Post page.
4. **Pages**: home, writing, made, about, now (+ archive), colophon, 404.
5. **Extras**: RSS, sitemap, robots, OG images, ⌘K palette, ink switcher.
6. **Worker**: `/api/ticket` GET/POST, cron, KV, secrets, the `ticket` CLI.
7. **Quality**
   - Accessibility: contrast, keyboard, ⌘K focus trap, rotations off under `prefers-reduced-motion`.
   - Lighthouse.
   - Phone widths.
   - Redirect tests.
8. **Cutover**: merge, move the domain, run the Search Console steps, delete the Pages project.

## 10. Open decisions

- Footer email address and how it's shown.
- First `/now` content and the ticket's initial values.
- Portrait photo: the existing `hasan.webp` or a new one.
- Whether to turn on Web Analytics.
- Refreshing the favicon and OG template for the new design.
