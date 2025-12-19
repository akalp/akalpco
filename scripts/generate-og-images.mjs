import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import matter from "gray-matter";
import { parse as parseEmoji } from "twemoji-parser";

const FONT_REGULAR = fs.readFileSync(
  path.join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf")
);
const FONT_BOLD = fs.readFileSync(
  path.join(process.cwd(), "src/assets/fonts/Geist-Bold.ttf")
);
const FONT_MONO = fs.readFileSync(
  path.join(process.cwd(), "src/assets/fonts/GeistMono-Medium.ttf")
);

const emojiDataUriCache = new Map();

const faviconPath = path.join(process.cwd(), "public/favicon-32x32.png");
let FAVICON_DATA_URI = null;

try {
  const faviconBuffer = fs.readFileSync(faviconPath);
  FAVICON_DATA_URI = `data:image/png;base64,${faviconBuffer.toString(
    "base64"
  )}`;
} catch {
  FAVICON_DATA_URI = null;
}

const OUTPUT_DIR = path.join(process.cwd(), "public/og");
const DEFAULT_KEY = "__default";

const size = {
  width: 1200,
  height: 630,
};

function hashForInput(key, input) {
  const hash = createHash("sha256");
  hash.update(key ?? "");
  hash.update("|");
  hash.update(input.title ?? "");
  hash.update("|");
  hash.update(input.description ?? "");
  hash.update("|");
  hash.update(input.date ?? "");
  hash.update("|");
  hash.update(String(input.readingTime ?? ""));
  hash.update("|");
  hash.update(input.footerLeft ?? "");
  hash.update("|");
  hash.update(input.footerRight ?? "");
  return hash.digest("hex").slice(0, 10);
}

const TWEMOJI_BASE_URL = "https://twemoji.maxcdn.com/v/latest/svg";

async function getEmojiDataUri(entity) {
  const cacheKey = entity.url ?? entity.text;
  if (emojiDataUriCache.has(cacheKey)) {
    return emojiDataUriCache.get(cacheKey);
  }

  let svgContent = null;
  const requestUrl = entity.url ?? `${TWEMOJI_BASE_URL}/${entity.text}.svg`;

  try {
    const response = await fetch(requestUrl);
    if (response.ok) {
      svgContent = await response.text();
    }
  } catch {
    // ignore network failures; we'll use fallback
  }

  if (!svgContent) {
    svgContent =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="3" fill="#1f2937"/><text x="8" y="12" text-anchor="middle" font-size="10" fill="#f9fafb">?</text></svg>';
  }

  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString(
    "base64"
  )}`;
  emojiDataUriCache.set(cacheKey, dataUri);
  return dataUri;
}

async function createEmojiNode(entity, size) {
  const dataUri = await getEmojiDataUri(entity);
  if (!dataUri) {
    return entity.text;
  }

  return {
    type: "span",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${size}px`,
        height: `${size}px`,
      },
      children: {
        type: "img",
        props: {
          src: dataUri,
          width: size,
          height: size,
          alt: entity.text,
          style: {
            width: `${size}px`,
            height: `${size}px`,
          },
        },
      },
    },
  };
}

async function createRichTextNodes(text, emojiSize) {
  if (!text) {
    return "";
  }

  const parsed = parseEmoji(text, { assetType: "svg" });
  if (parsed.length === 0) {
    return text;
  }

  const nodes = [];
  let lastIndex = 0;

  for (const entity of parsed) {
    const [start, end] = entity.indices;
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }
    nodes.push(await createEmojiNode(entity, emojiSize));
    lastIndex = end;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  if (nodes.length === 1) {
    return nodes[0];
  }

  return nodes;
}

async function buildOgTree(input) {
  const formattedDate = input.date
    ? new Date(input.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const footerItems = [
    input.footerLeft ?? "Hasan Akalp",
    formattedDate,
    input.readingTime ? `${input.readingTime} min read` : null,
    input.footerRight ?? null,
  ].filter(Boolean);

  const footerChildren = [];
  for (let index = 0; index < footerItems.length; index += 1) {
    const item = footerItems[index];
    footerChildren.push({
      type: "span",
      props: { children: await createRichTextNodes(item, 24) },
    });
    if (index !== footerItems.length - 1) {
      footerChildren.push({
        type: "span",
        props: {
          style: { margin: "0 18px" },
          children: "•",
        },
      });
    }
  }

  const brandIcon = FAVICON_DATA_URI
    ? {
        type: "img",
        props: {
          src: FAVICON_DATA_URI,
          alt: "Hasan Akalp",
          width: 30,
          height: 30,
          style: {
            width: "30px",
            height: "30px",
            borderRadius: "8px",
          },
        },
      }
    : {
        type: "div",
        props: {
          style: {
            width: "30px",
            height: "30px",
            borderRadius: "10px",
            backgroundColor: "#6366f1",
          },
        },
      };

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "linear-gradient(135deg, #312e81, #0f172a)",
        color: "#f8fafc",
        fontFamily: "Geist",
        gap: "36px",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              gap: "18px",
              alignItems: "center",
            },
            children: [
              brandIcon,
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "32px",
                    fontWeight: 600,
                    letterSpacing: -0.5,
                  },
                  children: "akalp.co",
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            },
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: "72px",
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: -1.5,
                    lineHeight: 1.05,
                    whiteSpace: "pre-line",
                  },
                  children: await createRichTextNodes(input.title, 60),
                },
              },
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "34px",
                    lineHeight: 1.35,
                    color: "rgba(226,232,240,0.85)",
                    maxWidth: "820px",
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  },
                  children: await createRichTextNodes(input.description, 34),
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              gap: "18px",
              fontSize: "28px",
              color: "rgba(148,163,184,0.95)",
              fontFamily: "Geist Mono",
            },
            children: footerChildren,
          },
        },
      ],
    },
  };
}

async function renderOgImage(input) {
  const tree = await buildOgTree(input);
  const svg = await satori(tree, {
    width: size.width,
    height: size.height,
    fonts: [
      {
        name: "Geist",
        data: FONT_REGULAR,
        weight: 400,
        style: "normal",
      },
      {
        name: "Geist",
        data: FONT_BOLD,
        weight: 700,
        style: "normal",
      },
      {
        name: "Geist Mono",
        data: FONT_MONO,
        weight: 500,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: size.width,
    },
  });
  const pngData = resvg.render().asPng();
  return Buffer.from(pngData);
}

async function ensureImage(key, input) {
  const hash = hashForInput(key, input);
  const fileName = `${key}-${hash}.png`;
  const filePath = path.join(OUTPUT_DIR, fileName);

  const created = !fs.existsSync(filePath);

  if (created) {
    const image = await renderOgImage(input);
    fs.writeFileSync(filePath, image);
    console.log(`Generated OG image: ${fileName}`);
  } else {
    console.log(`OG image up-to-date: ${fileName}`);
  }

  const existingFiles = fs
    .readdirSync(OUTPUT_DIR)
    .filter(
      (name) =>
        name.startsWith(`${key}-`) && name.endsWith(".png") && name !== fileName
    );

  for (const obsolete of existingFiles) {
    fs.unlinkSync(path.join(OUTPUT_DIR, obsolete));
    console.log(`Removed outdated OG image: ${obsolete}`);
  }

  return `/og/${fileName}`;
}

async function main() {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });

  const manifest = {};

  const defaultImagePath = await ensureImage(DEFAULT_KEY, {
    title: "Hasan Akalp\nFull-Stack Software Engineer",
    description:
      "TypeScript, React, Next.js, Python, distributed systems, and pragmatic engineering.",
    footerLeft: "Ankara, Turkey",
  });

  manifest[DEFAULT_KEY] = defaultImagePath;

  const posts = readAllPosts();

  for (const post of posts) {
    const readingTime = getReadingTime(post.content);
    const imagePath = await ensureImage(post.slug, {
      title: post.title,
      description: post.description,
      date: post.date,
      readingTime,
    });
    manifest[post.slug] = imagePath;
  }

  const manifestPath = path.join(OUTPUT_DIR, "og-images.json");
  await fs.promises.writeFile(
    manifestPath,
    JSON.stringify(manifest, null, 2) + "\n"
  );
  console.log(`OG manifest updated: ${manifestPath}`);
}

const postsDirectory = path.join(process.cwd(), "content/blog");

main().catch((error) => {
  console.error("Failed to generate OG images:", error);
  process.exitCode = 1;
});

function readAllPosts() {
  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"));

  return fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      date: data.date ?? "",
      tags: data.tags ?? [],
      content,
    };
  });
}

function getReadingTime(content) {
  const WORDS_PER_MINUTE = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
