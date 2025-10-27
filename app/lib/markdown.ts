import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

let highlighterPromise: Promise<any> | null = null;

async function getHighlighter() {
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
          shell: "bash",
          sh: "bash",
          zsh: "bash",
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
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
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
