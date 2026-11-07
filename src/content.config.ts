import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const links = defineCollection({
  loader: file("src/data/links.yaml"),
  schema: z.object({
    order: z.number().int(),
    label: z.string(),
    href: z.string().regex(/^(https:\/\/|mailto:)/),
  }),
});

export const collections = { links };
