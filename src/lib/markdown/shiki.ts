import type { ShikiTransformer, ThemeRegistration } from "shiki";

/**
 * Warm-dark code theme on --code-bg. Keywords take the highlighter yellow,
 * strings a soft green, comments a muted paper brown.
 */
export const marginaliaTheme: ThemeRegistration = {
  name: "marginalia",
  type: "dark",
  colors: {
    "editor.background": "#26211C",
    "editor.foreground": "#F1EADF",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#9C917F" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.operator.logical",
        "variable.language",
        "constant.language",
        "entity.name.tag",
      ],
      settings: { foreground: "#F2D36B" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "punctuation.definition.string",
        "markup.inline.raw",
      ],
      settings: { foreground: "#A9D3B5" },
    },
    {
      scope: ["constant.numeric", "constant.character.escape"],
      settings: { foreground: "#F4B7A3" },
    },
    {
      scope: [
        "support.type.property-name",
        "meta.object-literal.key",
        "entity.other.attribute-name",
        "variable.parameter",
      ],
      settings: { foreground: "#E6DCCB" },
    },
  ],
};

/** Copies `title="…"` from the code fence meta onto <pre data-title>. */
export const transformerTitle: ShikiTransformer = {
  name: "marginalia:title",
  pre(node) {
    const raw = this.options.meta?.__raw ?? "";
    const title = /title=["']([^"']+)["']/.exec(raw)?.[1];
    if (title) node.properties["data-title"] = title;
  },
};
