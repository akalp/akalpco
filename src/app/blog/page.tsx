import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog-card";
import { blogMetadata } from "@/config/metadata";

export const metadata = blogMetadata;

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container-width py-6 md:py-12">
      <div className="mb-12">
        <h1 className="heading-1 mb-6">Blog</h1>
        <p className="body-text max-w-2xl">
          Thoughts, insights, and experiences from my journey. I write about
          anything that comes to mind.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
