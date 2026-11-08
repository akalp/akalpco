/**
 * Keeps the email address out of the HTML so scrapers can't read it.
 *
 * Cloudflare's Email Address Obfuscation only rewrites HTML that passes
 * through the zone, and Workers static assets skip it, so the site does the
 * same thing at build time: the address is XOR-encoded as hex, first byte
 * being the key (Cloudflare's format), and a small script turns it back into
 * a mailto: link in the browser.
 */

export function encodeEmail(address: string): string {
  const key = 1 + Math.floor(Math.random() * 254);
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  let out = hex(key);
  for (const char of address) out += hex(char.charCodeAt(0) ^ key);
  return out;
}

export function decodeEmail(hex: string): string {
  const key = parseInt(hex.slice(0, 2), 16);
  let out = "";
  for (let i = 2; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  }
  return out;
}

/** Turns every `a[data-email]` into a working mailto: link. */
export function revealEmails() {
  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    "a[data-email]"
  )) {
    link.href = `mailto:${decodeEmail(link.dataset.email ?? "")}`;
  }
}
