import { marked } from "marked";

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

  return (await marked.parse(markdown, { renderer })) as string;
}
