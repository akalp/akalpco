import type { APIRoute, GetStaticPaths } from "astro";
import { renderOg, type OgCard } from "@/lib/og";
import { formatDate, getPosts, readingMinutes } from "@/lib/writing";

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const cards: { slug: string; card: OgCard }[] = [
    {
      slug: "default",
      card: {
        title: "Hi, I’m Hasan.",
        meta: "Ankara · writing, small tools, larger systems",
      },
    },
    ...posts.map((post) => ({
      slug: post.id,
      card: {
        title: post.data.title,
        meta: `${formatDate(post.data.date)} · ${readingMinutes(post.body)} min read`,
        lang: post.data.lang,
      },
    })),
  ];
  return cards.map(({ slug, card }) => ({ params: { slug }, props: card }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props as OgCard);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
