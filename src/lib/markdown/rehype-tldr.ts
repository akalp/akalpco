import type { Root, RootContent } from "hast";
import { toString } from "hast-util-to-string";
import { addClass, h, isElement } from "./hast";

const TLDR = /^tl;?\s?dr:?$/i;

/**
 * Wraps the first `## TL;DR` section (the heading and everything up to the
 * next h2) in a paper card.
 */
export function rehypeTldr() {
  return (tree: Root) => {
    const start = tree.children.findIndex(
      (node) => isElement(node, "h2") && TLDR.test(toString(node).trim())
    );
    if (start === -1) return;

    let end = start + 1;
    while (end < tree.children.length && !isElement(tree.children[end], "h2")) {
      end++;
    }

    const section = tree.children.slice(start, end) as RootContent[];
    const heading = section[0];
    if (isElement(heading)) addClass(heading, "tldr__title");

    const card = h(
      "div",
      { className: ["tldr", "tilt"], style: "--tilt: -0.6deg" },
      section.filter((node) => node.type !== "doctype") as never
    );
    tree.children.splice(start, end - start, card);
  };
}
