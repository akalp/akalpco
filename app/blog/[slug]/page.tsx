import { getPostBySlug, getAllPosts } from "@/app/lib/blog";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { SocialShare } from "../components/social-share";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
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

  const content = marked(post.content);

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
          <span>
            {Math.ceil(post.content.split(/\s+/).length / 200)} min read
          </span>
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
