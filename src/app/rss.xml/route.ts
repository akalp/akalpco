import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akalp.co";
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const link = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const categories = (post.tags || [])
        .map((t) => `<category>${xmlEscape(String(t))}</category>`) // ensure string
        .join("");

      return `
        <item>
          <title>${xmlEscape(post.title)}</title>
          <link>${link}</link>
          <guid isPermaLink="true">${link}</guid>
          <description>${xmlEscape(post.description || "")}</description>
          <pubDate>${pubDate}</pubDate>
          ${categories}
        </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Hasan Akalp — Blog</title>
    <link>${siteUrl}</link>
    <description>Posts by Hasan Akalp</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
