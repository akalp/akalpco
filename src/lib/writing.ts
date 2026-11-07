import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"writing">;

const WORDS_PER_MINUTE = 200;
const TIME_ZONE = "Europe/Istanbul";

/** Published posts, newest first. Drafts show up in dev only. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection(
    "writing",
    ({ data }) => import.meta.env.DEV || !data.draft
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function readingMinutes(body: string | undefined): number {
  const words = body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** "20 Dec 2025" */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString();
}

export function postYear(date: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      timeZone: TIME_ZONE,
    }).format(date)
  );
}
