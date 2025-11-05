import type { MetadataRoute } from "next";
import { getAllPosts } from "@/app/lib/blog";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akalp.co";
const staticLastModified = new Date().toISOString();

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${siteUrl}/`,
    lastModified: staticLastModified,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${siteUrl}/about`,
    lastModified: staticLastModified,
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    url: `${siteUrl}/portfolio`,
    lastModified: staticLastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${siteUrl}/contact`,
    lastModified: staticLastModified,
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    url: `${siteUrl}/blog`,
    lastModified: staticLastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date).toISOString() : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
