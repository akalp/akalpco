// @ts-check
import { defineConfig } from "astro/config";

// Static output with no adapter: Cloudflare Workers serves `dist/` as static
// assets. Worker code (src/worker/) only handles /api/* routes.
export default defineConfig({
  site: "https://akalp.co",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
  },
});
