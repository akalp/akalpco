import type { PhrasingContent, Root } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";

/**
 * `==text==` → <mark>text</mark>.
 * Only plain text is matched, so code spans and code blocks are left alone.
 */
export function remarkHighlight() {
  return (tree: Root) => {
    findAndReplace(tree, [
      /==([^=\n](?:[^\n]*?[^=\n])?)==/g,
      (_match: string, text: string) =>
        ({
          type: "mark",
          data: { hName: "mark" },
          children: [{ type: "text", value: text }],
        }) as unknown as PhrasingContent,
    ]);
  };
}
