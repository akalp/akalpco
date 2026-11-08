/**
 * Tiny inline-markdown renderer for short data strings (project
 * descriptions, notes): `code` and [text](href) only. Everything else is
 * escaped.
 */
export function inline(source: string): string {
  return escapeHtml(source)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      (_m, label: string, href: string) => `<a href="${href}">${label}</a>`
    );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
