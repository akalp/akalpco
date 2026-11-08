import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(["en", "tr"]).default("en"),
    draft: z.boolean().default(false),
  }),
});

/** Monthly /now pages. The newest is /now, older ones are archived. */
const now = defineCollection({
  loader: glob({ base: "./src/content/now", pattern: "*.md" }),
  schema: z.object({
    /** "2026-11" */
    month: z.string().regex(/^\d{4}-\d{2}$/),
    /** One line for the "Previously" list. */
    summary: z.string(),
  }),
});

const projects = defineCollection({
  loader: file("src/data/projects.yaml"),
  schema: z.object({
    order: z.number().int(),
    /** "mine" = open source on /made, "others" = work for other people. */
    kind: z.enum(["mine", "others"]),
    name: z.string(),
    tech: z.array(z.string()),
    description: z.string().optional(),
    repo: z.url().optional(),
    /** Live site or app, if there is one. */
    site: z.url().optional(),
    post: reference("writing").optional(),
    note: z.string().optional(),
    /** Placeholder (or, later, real media) shown under the description. */
    media: z
      .object({
        kind: z.enum(["terminal", "photo"]),
        label: z.string(),
      })
      .optional(),
    /** Short version for the home page cards. Omit to leave it off home. */
    card: z
      .object({
        tech: z.string(),
        description: z.string(),
      })
      .optional(),
  }),
});

const route = defineCollection({
  loader: file("src/data/route.yaml"),
  schema: z.object({
    order: z.number().int(),
    year: z.number().int(),
    place: z.string(),
  }),
});

const links = defineCollection({
  loader: file("src/data/links.yaml"),
  schema: z.object({
    order: z.number().int(),
    label: z.string(),
    href: z.string().regex(/^(https:\/\/|mailto:)/),
  }),
});

export const collections = { writing, now, projects, route, links };
