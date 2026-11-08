import type { Root } from "hast";
import { toString } from "hast-util-to-string";
import { addClass, isBlank, isElement } from "./hast";

const PULL_QUOTE_MAX = 180;

/**
 * A blockquote with one short paragraph is a pull quote: bigger and italic,
 * no box. Anything longer is styled as a regular quotation.
 */
export function rehypeQuotes() {
  return (tree: Root) => {
    for (const node of tree.children) {
      if (!isElement(node, "blockquote")) continue;
      const blocks = node.children.filter((child) => !isBlank(child));
      const isPull =
        blocks.length === 1 &&
        isElement(blocks[0], "p") &&
        toString(node).trim().length <= PULL_QUOTE_MAX;
      addClass(node, isPull ? "pull-quote" : "quote");
    }
  };
}
