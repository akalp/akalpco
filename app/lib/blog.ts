import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "@/app/types/blog";

const postsDirectory = path.join(process.cwd(), "app/content/blog");

export function getAllPosts(includeDrafts = false): BlogPost[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        content,
        tags: data.tags || [],
        draft: data.draft || false,
      };
    })
    .filter((post) => includeDrafts || !post.draft);

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(
  slug: string,
  includeDrafts = false
): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    if (!includeDrafts && data.draft) {
      return null;
    }

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      content,
      tags: data.tags || [],
      draft: data.draft || false,
    };
  } catch {
    return null;
  }
}
