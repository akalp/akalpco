import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import type { ImageMetadata } from "astro";
import type { Root } from "hast";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { remarkHighlight } from "@/lib/markdown/remark-highlight";
import { getPosts } from "@/lib/writing";

/** Post images, keyed by file name, so feed <img> tags get real URLs. */
const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/writing/*.{png,jpg,jpeg,webp,gif}",
  { eager: true }
);
const imageByName = new Map(
  Object.entries(images).map(([path, mod]) => [
    path.split("/").pop(),
    mod.default.src,
  ])
);

/**
 * Feed HTML uses a plain pipeline: footnotes stay as regular footnotes
 * (readers have no margin), and relative links become absolute.
 */
function rehypeAbsoluteUrls(options: { site: URL }) {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      const attr =
        node.tagName === "img" ? "src" : node.tagName === "a" ? "href" : null;
      if (!attr) return;
      const value = node.properties[attr];
      if (typeof value !== "string" || value.startsWith("#")) return;
      const local = imageByName.get(value.split("/").pop());
      const resolved = node.tagName === "img" && local ? local : value;
      node.properties[attr] = new URL(resolved, options.site).href;
    });
  };
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ?? new URL("https://akalp.co");
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHighlight)
    .use(remarkRehype)
    .use(rehypeAbsoluteUrls, { site: siteUrl })
    .use(rehypeStringify);

  const posts = await getPosts();
  const items = await Promise.all(
    posts.map(async (post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/writing/${post.id}`,
      categories: post.data.tags,
      content: String(await processor.process(post.body ?? "")),
      customData: `<dc:language>${post.data.lang}</dc:language>`,
    }))
  );

  return rss({
    title: "Hasan Akalp — Writing",
    description:
      "Notes from building small tools and larger systems, in English and sometimes Turkish.",
    site: siteUrl,
    items,
    trailingSlash: false,
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    customData: "<language>en</language>",
  });
};
