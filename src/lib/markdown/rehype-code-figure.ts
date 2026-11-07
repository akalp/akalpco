import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { h, hasClass, isElement, text } from "./hast";

const LABELS: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  sh: "shell",
};

/**
 * Wraps highlighted code blocks in a <figure> with a caption bar showing the
 * file name (```js title="console.js"```) or the language, plus a copy
 * button that stays hidden until the page script enables it.
 */
export function rehypeCodeFigure() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (!isElement(node, "pre") || !hasClass(node, "astro-code")) return;
      if (isElement(parent as never, "figure")) return;

      const props = node.properties;
      const title = props.dataTitle ?? props["data-title"];
      const lang = String(props.dataLanguage ?? props["data-language"] ?? "");
      const label =
        typeof title === "string" && title
          ? title
          : lang && lang !== "plaintext"
            ? (LABELS[lang] ?? lang)
            : "";

      const figure = h("figure", { className: ["code-block"] }, [
        h("figcaption", { className: ["code-block__bar"] }, [
          h("span", {}, [text(label)]),
          h(
            "button",
            {
              type: "button",
              className: ["code-block__copy"],
              hidden: true,
              ariaLabel: label ? `Copy ${label} code` : "Copy code",
            },
            [text("copy")]
          ),
        ]),
        node,
      ]);

      parent.children[index] = figure;
      return "skip";
    });
  };
}
