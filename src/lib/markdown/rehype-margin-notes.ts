import type { Element, ElementContent, Root, RootContent } from "hast";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";
import { h, isBlank, isElement, text } from "./hast";

/** Hand-placed notes sit a little crooked; cycle through these. */
const TILTS = [-1, 1.2, -0.6, 1.4, -1.2, 0.8];

/**
 * Turns GFM footnotes into margin notes.
 *
 * Every top-level block that references a footnote is wrapped in a two-column
 * row: the block on the left, its notes in an <aside> on the right. On narrow
 * screens the aside wraps below the block. The footnotes section at the end
 * of the document is removed.
 */
export function rehypeMarginNotes() {
  return (tree: Root) => {
    const sectionIndex = tree.children.findIndex(
      (node) => isElement(node, "section") && "dataFootnotes" in node.properties
    );
    if (sectionIndex === -1) return;

    const definitions = collectDefinitions(
      tree.children[sectionIndex] as Element
    );
    tree.children.splice(sectionIndex, 1);

    const rendered = new Set<string>();
    let noteCount = 0;

    tree.children = tree.children.map((block): RootContent => {
      if (!isElement(block)) return block;

      const notes: Element[] = [];
      visit(block, "element", (node, _index, parent) => {
        if (node.tagName !== "a" || !("dataFootnoteRef" in node.properties)) {
          return;
        }
        const target = String(node.properties.href ?? "").replace(/^#/, "");
        const n = toString(node).trim();

        node.properties = {
          href: `#mn-${n}`,
          ariaLabel: `Margin note ${n}`,
        };
        if (parent && isElement(parent as Element, "sup")) {
          (parent as Element).properties = {
            className: ["note-ref"],
            id: rendered.has(target) ? undefined : `mn-ref-${n}`,
          };
        }

        const content = definitions.get(target);
        if (!content || rendered.has(target)) return;
        rendered.add(target);

        const tilt = TILTS[noteCount++ % TILTS.length];
        notes.push(
          h(
            "p",
            {
              className: ["margin-note", "tilt"],
              id: `mn-${n}`,
              style: `--tilt: ${tilt}deg`,
            },
            [
              h("span", { className: ["margin-note__n"] }, [text(`${n} —`)]),
              text(" "),
              ...content,
            ]
          )
        );
      });

      if (notes.length === 0) return block;

      return h("div", { className: ["mn-row"] }, [
        block,
        h(
          "aside",
          { className: ["mn-notes"], ariaLabel: "Margin notes" },
          notes
        ),
      ]);
    });
  };
}

/** Footnote id → inline content, without the "↩" back-references. */
function collectDefinitions(section: Element): Map<string, ElementContent[]> {
  const definitions = new Map<string, ElementContent[]>();

  visit(section, "element", (li) => {
    if (li.tagName !== "li" || typeof li.properties.id !== "string") return;

    const paragraphs = li.children.filter((child) => !isBlank(child));
    const inline: ElementContent[] = [];
    paragraphs.forEach((block, i) => {
      if (i > 0) inline.push(text(" "));
      const children = isElement(block, "p") ? block.children : [block];
      inline.push(...children.filter((child) => !isBackref(child)));
    });

    // Drop the whitespace gfm leaves before the removed back-reference.
    while (inline.length > 0) {
      const last = inline[inline.length - 1];
      if (last.type !== "text") break;
      last.value = last.value.trimEnd();
      if (last.value) break;
      inline.pop();
    }

    definitions.set(li.properties.id, inline);
    return "skip";
  });

  return definitions;
}

function isBackref(node: ElementContent): boolean {
  return isElement(node, "a") && "dataFootnoteBackref" in node.properties;
}
