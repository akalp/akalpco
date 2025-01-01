"use client";

import Link from "next/link";
import { BlogPost } from "@/app/types/blog";
import { formatDistance } from "date-fns";
import { motion } from "motion/react";

function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function BlogCard({ post }: { post: BlogPost }) {
  const readingTime = getReadingTime(post.content);

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-muted bg-background p-6 hover:border-primary"
      >
        <div className="mb-4">
          <motion.h2 
            className="text-xl font-semibold"
            layout
          >
            {post.title}
          </motion.h2>
          <motion.div 
            className="text-secondary mt-2 flex items-center gap-3 text-sm"
            layout
          >
            <time>
              {formatDistance(new Date(post.date), new Date(), {
                addSuffix: true,
              })}
            </time>
            <span>·</span>
            <span>{readingTime} min read</span>
          </motion.div>
        </div>

        <motion.p 
          className="text-secondary mb-4 text-sm"
          layout
        >
          {post.description}
        </motion.p>

        <motion.div
          className="mt-auto flex flex-wrap gap-2"
          layout
        >
          {post.tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted text-secondary rounded-full px-3 py-1 text-xs"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </motion.article>
    </Link>
  );
} 