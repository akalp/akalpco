import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/app/lib/blog";
import { BlogCard } from "@/app/components/blog-card";

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 5);

  return (
    <div className="container-width py-6 md:py-12">
      <section className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="heading-1 mb-6">Full-Stack Software Engineer</h1>
          <p className="body-text mb-8">
            Results-driven engineer with 4+ years of experience in designing and
            deploying scalable web applications. Passionate about leading
            technical initiatives and fostering collaboration in dynamic,
            high-impact projects.
          </p>
          <div className="flex gap-4">
            <Link
              href="/portfolio"
              className="hover:bg-primary/90 rounded-lg bg-primary px-6 py-3 text-white transition-colors"
            >
              View Portfolio
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-secondary px-6 py-3 transition-colors hover:border-primary hover:text-primary"
            >
              Contact Me
            </Link>
          </div>
        </div>
        <div className="relative aspect-square">
          <Image
            src="/hasan.webp"
            alt="Hasan Akalp - Full-Stack Software Engineer"
            fill
            priority
            quality={85}
            className="rounded-2xl object-cover object-center"
          />
          <div className="from-primary/20 to-accent/20 absolute inset-0 rounded-2xl bg-gradient-to-br" />
        </div>
      </section>

      {/* Recent Blog Posts Section - Only visible on larger screens */}
      <section className="hidden lg:block">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="heading-2">Recent Blog Posts</h2>
          <Link
            href="/blog"
            className="text-sm text-secondary transition-colors hover:text-primary"
          >
            View all posts →
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
