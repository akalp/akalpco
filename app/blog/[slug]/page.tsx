import { getPostBySlug, getAllPosts } from "@/app/lib/blog";
import { notFound } from "next/navigation";
import { SocialShare } from "@/app/components/social-share";
import { renderMarkdown } from "@/app/lib/markdown";
import type { Metadata } from "next";
import ogImages from "@/public/og/og-images.json";
import { getReadingTime } from "@/app/lib/reading-time";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const canonicalPath = `/blog/${post.slug}`;
  const ogImageMap = ogImages as Record<string, string>;
  const ogImagePath =
    ogImageMap[post.slug] ?? ogImageMap["__default"] ?? "/images/hasan.webp";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      url: canonicalPath,
      title: post.title,
      description: post.description,
      publishedTime: new Date(post.date).toISOString(),
      authors: ["Hasan Akalp"],
      tags: post.tags,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImagePath],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = await renderMarkdown(post.content);

  return (
    <article className="container-width py-6 md:py-12">
      <header className="mb-12">
        <h1 className="heading-1 mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-secondary">
          <time>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{getReadingTime(post.content)} min read</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-sm text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="pt-8">
        <SocialShare
          url={`https://akalp.co/blog/${post.slug}`}
          title={post.title}
        />
      </div>
    </article>
  );
}
