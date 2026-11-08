#!/usr/bin/env node
/**
 * Smoke-test a deployed akalp.co: routes, v1 redirects, headers and the
 * ticket API. Run against production after cutover, or the v2 preview:
 *
 *   pnpm check:site                       # https://akalp.co
 *   pnpm check:site https://v2-akalpco.hasan-akalp.workers.dev
 */
const base = (process.argv[2] ?? "https://akalp.co").replace(/\/$/, "");

const routes = [
  "/",
  "/writing",
  "/writing/ten-hours-one-click",
  "/writing/yatay-gecis",
  "/made",
  "/about",
  "/now",
  "/colophon",
  "/rss.xml",
  "/sitemap-index.xml",
  "/robots.txt",
  "/og/default.png",
  "/og/ten-hours-one-click.png",
  "/api/ticket",
];

const redirects = [
  ["/blog", "/writing"],
  ["/blog/ten-hours-one-click", "/writing/ten-hours-one-click"],
  ["/blog/cs-okumak", "/writing/cs-okumak"],
  ["/portfolio", "/made"],
  ["/contact", "/about"],
  ["/sitemap.xml", "/sitemap-index.xml"],
];

const headers = {
  "content-security-policy": /script-src 'self'/,
  "x-content-type-options": /nosniff/,
  "referrer-policy": /strict-origin/,
  "x-frame-options": /DENY/,
};

let failures = 0;
function check(ok, passMsg, failMsg = passMsg) {
  if (ok) {
    console.log(`  ✓ ${passMsg}`);
  } else {
    failures++;
    console.log(`  ✗ ${failMsg}`);
  }
}

console.log(`\n${base}\n\nroutes`);
for (const path of routes) {
  const res = await fetch(base + path, { redirect: "manual" });
  check(res.status === 200, `${path} 200`, `${path} ${res.status}`);
}

const missing = await fetch(`${base}/definitely-not-here`, {
  redirect: "manual",
});
check(
  missing.status === 404,
  "unknown path 404",
  `unknown path ${missing.status}`
);

console.log("\nredirects");
for (const [from, to] of redirects) {
  const res = await fetch(base + from, { redirect: "manual" });
  const location = res.headers.get("location") ?? "";
  const target = new URL(location, base).pathname;
  check(
    res.status === 301 && target === to,
    `${from} → ${to}`,
    `${from} → ${res.status} ${location || "(no location)"}`
  );
}

console.log("\nheaders");
const home = await fetch(`${base}/`);
for (const [name, pattern] of Object.entries(headers)) {
  check(
    pattern.test(home.headers.get(name) ?? ""),
    name,
    `${name}: ${home.headers.get(name) ?? "missing"}`
  );
}
const html = await home.text();
const asset = /\/_astro\/[^"]+\.js/.exec(html)?.[0];
if (asset) {
  const res = await fetch(base + asset);
  check(
    /immutable/.test(res.headers.get("cache-control") ?? ""),
    "/_astro/* immutable",
    `/_astro/* cache-control: ${res.headers.get("cache-control")}`
  );
}

console.log(failures ? `\n${failures} failed\n` : "\nall good\n");
process.exit(failures ? 1 : 0);
