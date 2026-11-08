import { getCollection, type CollectionEntry } from "astro:content";

export type NowEntry = CollectionEntry<"now">;

/** /now entries, newest first. */
export async function getNowEntries(): Promise<NowEntry[]> {
  const entries = await getCollection("now");
  return entries.sort((a, b) => b.data.month.localeCompare(a.data.month));
}

/** "2026-11" → "November 2026" */
export function monthLabel(month: string): string {
  const [year, m] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, m - 1, 1)));
}
