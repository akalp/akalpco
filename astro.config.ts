import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import {
  marginaliaTheme,
  rehypeCodeFigure,
  rehypeMarginNotes,
  rehypeQuotes,
  rehypeTldr,
  remarkHighlight,
  transformerTitle,
} from "./src/lib/markdown";

// Static output with no adapter: Cloudflare Workers serves `dist/` as static
// assets. Worker code (src/worker/) only handles /api/* routes.
export default defineConfig({
  site: "https://akalp.co",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
  },
  vite: {
    build: {
      // Never inline scripts or assets: keeps the CSP free of inline scripts
      // and 'data:' sources.
      assetsInlineLimit: 0,
    },
  },
  markdown: {
    // remark/rehype pipeline (rather than the default Sätteri processor) so
    // the margin-note, TL;DR and code-figure plugins can restructure the tree.
    processor: unified({
      remarkPlugins: [remarkHighlight],
      // Order matters: TL;DR wraps its section first, so a note on the
      // TL;DR lands beside the whole card.
      rehypePlugins: [
        rehypeTldr,
        rehypeQuotes,
        rehypeCodeFigure,
        rehypeMarginNotes,
      ],
    }),
    shikiConfig: {
      theme: marginaliaTheme,
      transformers: [transformerTitle],
    },
  },
});
