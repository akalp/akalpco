# akalp.co

Personal site of Hasan Akalp. Built with [Astro](https://astro.build) as a fully static site and served from Cloudflare Workers static assets.

> v2 ("Marginalia") is in progress on the `v2` branch. See [`docs/v2-plan.md`](docs/v2-plan.md). The previous Next.js site is preserved at the [`v1`](https://github.com/akalp/akalpco/tree/v1) tag.

## Requirements

- Node.js 26 (see `.nvmrc`)
- pnpm (version pinned in `package.json` → `packageManager`)

## Getting started

```bash
pnpm install
pnpm dev
```

## Scripts

| Script    | Does                                                |
| --------- | --------------------------------------------------- |
| `dev`     | Start the Astro dev server                          |
| `build`   | Build the static site into `dist/`                  |
| `preview` | Build, then serve `dist/` through `wrangler dev`    |
| `check`   | Type-check `.astro` and `.ts` files (`astro check`) |
| `lint`    | Run ESLint                                          |
| `format`  | Format with Prettier                                |
| `deploy`  | Build and deploy with `wrangler deploy`             |

## Deployment

Cloudflare Workers Builds is connected to this repository:

- Build command: `pnpm build`
- Deploy command: `pnpm wrangler deploy`

Configuration lives in `wrangler.jsonc`.

## License

The source code is released under the [MIT License](LICENSE).

The writing in `src/content/`, the photos and images in `src/assets/` and the
design references in `docs/design-reference/` are © Hasan Akalp, all rights
reserved. The fonts are under the SIL Open Font License (see
`src/assets/og-fonts/README.md` and the Fontsource packages).
