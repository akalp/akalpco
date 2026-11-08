import type { Element, ElementContent, Root, RootContent } from "hast";
import { toString } from "hast-util-to-string";
import { EXIT, visit } from "unist-util-visit";
import { h, isBlank, isElement, text } from "./hast";

/** Hand-placed notes sit a little crooked; cycle through these. */
const TILTS = [-1, 1.2, -0.6, 1.4, -1.2, 0.8];

/**
 * Turns GFM footnotes into margin notes.
 *
 * Every top-level block that references a footnote is wrapped in a two-column
 * row: the block on the left, its notes on the right. On narrow
 * screens the notes wrap below the block. The footnotes section at the end
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

    /** Rewrites refs inside `block` and returns the notes they point to. */
    function collectNotes(block: Element): Element[] {
      const notes: Element[] = [];
      visit(block, "element", (node, _index, parent) => {
        if (!isRef(node)) return;
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
      return notes;
    }

    function withNotes(block: Element): Element {
      const notes = collectNotes(block);
      if (notes.length === 0) return block;
      return h("div", { className: ["mn-row"] }, [
        block,
        // Not an <aside>: many notes per page would mean many landmarks.
        h("div", { className: ["mn-notes"] }, notes),
      ]);
    }

    tree.children = tree.children.flatMap((block): RootContent[] => {
      if (!isElement(block)) return [block];
      // A note on item 5 of a long list would otherwise sit beside item 1.
      if ((block.tagName === "ul" || block.tagName === "ol") && hasRef(block)) {
        return splitList(block).map(withNotes);
      }
      return [withNotes(block)];
    });
  };
}

function isRef(node: Element): boolean {
  return node.tagName === "a" && "dataFootnoteRef" in node.properties;
}

function hasRef(node: Element): boolean {
  let found = false;
  visit(node, "element", (child) => {
    if (isRef(child)) {
      found = true;
      return EXIT;
    }
  });
  return found;
}

/**
 * Splits a list so every item with a footnote ref becomes its own list
 * (and so its own margin-note row). Ordered lists keep their numbering via
 * `start`.
 */
function splitList(list: Element): Element[] {
  const items = list.children.filter((child) => isElement(child, "li"));
  const base = Number(list.properties.start ?? 1);
  const segments: Element[] = [];
  let pending: Element[] = [];
  let pendingStart = 0;

  const flush = () => {
    if (pending.length === 0) return;
    const properties = { ...list.properties };
    if (list.tagName === "ol") properties.start = base + pendingStart;
    segments.push(h(list.tagName, properties, pending));
    pending = [];
  };

  items.forEach((item, i) => {
    if (pending.length === 0) pendingStart = i;
    if (hasRef(item as Element)) {
      flush();
      pendingStart = i;
      pending = [item as Element];
      flush();
    } else {
      pending.push(item as Element);
    }
  });
  flush();
  return segments;
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
