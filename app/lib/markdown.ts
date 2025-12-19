import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import type { Highlighter } from "shiki";
import {
  BLOG_IMAGE_SIZES,
  DEVICE_SIZES,
  IMAGE_SIZES,
} from "@/config/image-sizes";

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const { createHighlighter } = await import("shiki");
      // Configure for Shiki v1
      return await createHighlighter({
        themes: ["github-light", "github-dark"],
        langs: [
          "javascript",
          "typescript",
          "tsx",
          "jsx",
          "bash",
          "shell",
          "json",
          "markdown",
          "yaml",
          "html",
          "css",
          "scss",
          "python",
          "go",
          "rust",
          "csharp",
          "xml",
          "zsh",
        ],
      });
    })();
  }
  return await highlighterPromise;
}

function escapeHtml(value: unknown) {
  const str = typeof value === "string" ? value : String(value ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SUPPORTED_OPTIMIZED_FORMATS = new Set([
  "JPG",
  "JPEG",
  "WEBP",
  "PNG",
  "AVIF",
  "GIF",
]);
const IMAGE_WIDTH_CANDIDATES = Array.from(
  new Set([...DEVICE_SIZES, ...IMAGE_SIZES])
).sort((a, b) => a - b);
const EXPORT_FOLDER_NAME =
  process.env.nextImageExportOptimizer_exportFolderName ||
  "nextImageExportOptimizer";
const STORE_IMAGES_IN_WEBP =
  process.env.nextImageExportOptimizer_storePicturesInWEBP !== undefined
    ? process.env.nextImageExportOptimizer_storePicturesInWEBP === "true"
    : true;

function normalizeImageSrc(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  if (trimmed.startsWith("./")) {
    return `/${trimmed.slice(2)}`;
  }
  return `/${trimmed}`;
}

function splitFilePath(filePath: string) {
  const normalized = filePath.replace(/\\/g, "/");
  const noQuery = normalized.split("?")[0]?.split("#")[0] ?? normalized;
  const lastSlash = noQuery.lastIndexOf("/");
  const dir = lastSlash >= 0 ? noQuery.slice(0, lastSlash + 1) : "/";
  const filenameWithExtension =
    lastSlash >= 0 ? noQuery.slice(lastSlash + 1) : noQuery;
  const lastDot = filenameWithExtension.lastIndexOf(".");
  const extension =
    lastDot >= 0 ? filenameWithExtension.slice(lastDot + 1) : "";
  const filename =
    lastDot >= 0
      ? filenameWithExtension.slice(0, lastDot)
      : filenameWithExtension;
  return {
    dir: dir || "/",
    filename,
    extension,
  };
}

function buildOptimizedDirectory(dir: string) {
  const normalizedDir = dir.endsWith("/") ? dir : `${dir}/`;
  if (normalizedDir === "/") {
    return `/${EXPORT_FOLDER_NAME}/`;
  }
  return `${normalizedDir}${EXPORT_FOLDER_NAME}/`;
}

function getOptimizedImageAttributes(src: string) {
  if (!src.startsWith("/") || src.startsWith("//")) {
    return null;
  }

  const { dir, filename, extension } = splitFilePath(src);
  if (!filename || !extension) {
    return null;
  }

  const upperExtension = extension.toUpperCase();
  if (!SUPPORTED_OPTIMIZED_FORMATS.has(upperExtension)) {
    return null;
  }

  const outputExtension =
    STORE_IMAGES_IN_WEBP &&
    ["JPG", "JPEG", "PNG", "GIF"].includes(upperExtension)
      ? "WEBP"
      : upperExtension;
  const baseDir = buildOptimizedDirectory(
    dir.startsWith("/") ? dir : `/${dir}`
  );
  const urlForWidth = (width: number) =>
    `${baseDir}${filename}-opt-${width}.${outputExtension}`;
  const srcSet = IMAGE_WIDTH_CANDIDATES.map(
    (width) => `${urlForWidth(width)} ${width}w`
  ).join(", ");

  return {
    srcSet,
    src: urlForWidth(IMAGE_WIDTH_CANDIDATES[IMAGE_WIDTH_CANDIDATES.length - 1]),
  };
}

export async function renderMarkdown(markdown: string) {
  const highlighter = await getHighlighter();

  const renderer = new marked.Renderer();
  // Marked v15+ passes a token object; older versions pass (code, infostring).
  renderer.code = (arg1: unknown, arg2?: unknown) => {
    let codeText = "";
    let lang = "";

    if (typeof arg1 === "object" && arg1 !== null) {
      const token = arg1 as { text?: unknown; lang?: unknown };
      codeText =
        typeof token.text === "string" ? token.text : String(token.text ?? "");
      lang = typeof token.lang === "string" ? token.lang : "";
    } else {
      const code = arg1;
      codeText = typeof code === "string" ? code : String(code ?? "");
      lang = typeof arg2 === "string" ? arg2 : "";
    }

    const rawLang = (lang || "").split(/\s+/)[0]?.toLowerCase() || "";
    const safeCode = codeText;
    try {
      const loaded = highlighter.getLoadedLanguages?.() || [];
      const resolvedLang = loaded.includes(rawLang) ? rawLang : "text";

      const labelBase = rawLang || "";
      const prettyLabel = (() => {
        const map: Record<string, string> = {
          typescript: "ts",
          javascript: "js",
        };
        return map[labelBase] || labelBase;
      })();

      // Generate both light and dark themed HTML and toggle via CSS classes
      const lightHtml = highlighter
        .codeToHtml(safeCode, { lang: resolvedLang, theme: "github-light" })
        .replace(/<pre class="shiki/g, '<pre class="shiki light-only');
      const darkHtml = highlighter
        .codeToHtml(safeCode, { lang: resolvedLang, theme: "github-dark" })
        .replace(/<pre class="shiki/g, '<pre class="shiki dark-only');
      const labelAttr = escapeHtml(prettyLabel);
      return `<div class="code-block shiki-code dual" data-lang="${labelAttr}">${lightHtml}${darkHtml}</div>`;
    } catch {
      return `<pre><code>${escapeHtml(safeCode)}</code></pre>`;
    }
  };

  renderer.image = (arg1: unknown, arg2?: unknown, arg3?: unknown) => {
    let href = "";
    let title = "";
    let text = "";

    if (typeof arg1 === "object" && arg1 !== null) {
      const token = arg1 as { href?: unknown; title?: unknown; text?: unknown };
      href = typeof token.href === "string" ? token.href : "";
      title = typeof token.title === "string" ? token.title : "";
      text = typeof token.text === "string" ? token.text : "";
    } else {
      href = typeof arg1 === "string" ? arg1 : "";
      title = typeof arg2 === "string" ? arg2 : "";
      text = typeof arg3 === "string" ? arg3 : "";
    }

    const normalizedSrc = normalizeImageSrc(href);
    if (!normalizedSrc) {
      return "";
    }

    const safeAlt = escapeHtml(text);
    const safeTitle = title ? ` title="${escapeHtml(title)}"` : "";
    const baseAttributes = `alt="${safeAlt}"${safeTitle} loading="lazy" decoding="async" class="markdown-image"`;
    const optimized = getOptimizedImageAttributes(normalizedSrc);

    if (optimized) {
      return `<img src="${escapeHtml(optimized.src)}" srcset="${escapeHtml(optimized.srcSet)}" sizes="${escapeHtml(BLOG_IMAGE_SIZES)}" ${baseAttributes} />`;
    }

    return `<img src="${escapeHtml(normalizedSrc)}" ${baseAttributes} />`;
  };

  const rawHtml = (await marked.parse(markdown, { renderer })) as string;

  // Sanitize the HTML output from marked to prevent XSS.
  // Keep allowances for Shiki's output (classes, spans with limited styles, etc.).
  const cleanHtml = sanitizeHtml(rawHtml, {
    allowedTags: [
      // Start with library defaults and add a few needed wrappers
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "pre",
      "code",
      "div",
      "span",
      "hr",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: [
        "src",
        "srcset",
        "sizes",
        "alt",
        "title",
        "width",
        "height",
        "loading",
        "decoding",
        "class",
      ],
      div: ["class", "data-lang"],
      pre: ["class"],
      code: ["class"],
      span: ["class", "style"],
      p: ["class"],
      h1: ["id", "class"],
      h2: ["id", "class"],
      h3: ["id", "class"],
      h4: ["id", "class"],
      h5: ["id", "class"],
      h6: ["id", "class"],
      ul: ["class"],
      ol: ["class"],
      li: ["class"],
      table: ["class"],
      thead: ["class"],
      tbody: ["class"],
      tr: ["class"],
      th: ["class"],
      td: ["class"],
      blockquote: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: true,
    // Preserve minimal inline styles used by Shiki for token coloring.
    allowedStyles: {
      span: {
        color: [
          /^#[0-9a-fA-F]{3,8}$/,
          /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
          /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/,
          /^hsl\(/,
          /^var\(--shiki-[^)]+\)$/,
        ],
        "background-color": [
          /^#[0-9a-fA-F]{3,8}$/,
          /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
          /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/,
          /^hsl\(/,
          /^var\(--shiki-[^)]+\)$/,
        ],
        "text-decoration-color": [
          /^#[0-9a-fA-F]{3,8}$/,
          /^rgb\(/,
          /^rgba\(/,
          /^hsl\(/,
          /^var\(--shiki-[^)]+\)$/,
        ],
        "font-weight": [/^(normal|bold|[1-9]00)$/],
        "font-style": [/^(normal|italic|oblique)$/],
      },
    },
    // Discard content inside dangerous non-text tags entirely.
    nonTextTags: ["style", "script", "textarea", "option", "noscript"],
  });

  return cleanHtml;
}
