import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

/** Open Graph card: paper background, Fraunces title, mono meta. */
export type OgCard = {
  title: string;
  /** Mono line above the title, e.g. "20 DEC 2025 · 6 MIN READ". */
  meta?: string;
  lang?: string;
};

const WIDTH = 1200;
const HEIGHT = 630;
const PAD_X = 80;
const PAD_TOP = 64;
const PAD_BOTTOM = 56;

const COLORS = {
  paper: "#F1EADF",
  ink: "#221E1A",
  muted: "#665D52",
  rule: "#CFC3B0",
  pen: "#2747C4",
  highlighter: "#F2D36B",
};

// Resolved from the project root: this module is bundled before it runs.
const fontDir = join(process.cwd(), "src/assets/og-fonts");
let fonts: Promise<Parameters<typeof satori>[1]["fonts"]> | undefined;
let mark: Promise<string> | undefined;

/** The "ha" favicon, inlined as a data URI for Satori. */
function loadMark() {
  mark ??= readFile(join(process.cwd(), "public/favicon.svg")).then(
    (svg) => `data:image/svg+xml;base64,${svg.toString("base64")}`
  );
  return mark;
}

function loadFonts() {
  fonts ??= Promise.all([
    readFile(join(fontDir, "Fraunces-350-Soft.ttf")),
    readFile(join(fontDir, "JetBrainsMono-Regular.ttf")),
    readFile(join(fontDir, "Kalam-Regular.ttf")),
  ]).then(([fraunces, mono, kalam]) => [
    { name: "Fraunces", data: fraunces, weight: 400, style: "normal" },
    { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
    { name: "Kalam", data: kalam, weight: 400, style: "normal" },
  ]);
  return fonts;
}

type Node = {
  type: string;
  props: { style?: Record<string, unknown>; children?: unknown };
};

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown
): Node => ({ type, props: { style, children } });

function titleSize(title: string): number {
  if (title.length > 90) return 56;
  if (title.length > 60) return 66;
  if (title.length > 32) return 78;
  return 96;
}

export async function renderOg({ title, meta, lang }: OgCard) {
  // Satori lays padding out differently from CSS, so the content box gets
  // explicit dimensions inside a full-bleed background.
  const content = el(
    "div",
    {
      width: WIDTH - PAD_X * 2,
      height: HEIGHT - PAD_TOP - PAD_BOTTOM,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    [
      el(
        "div",
        {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 22,
          borderBottom: `1.5px solid ${COLORS.rule}`,
        },
        [
          el("div", { display: "flex", alignItems: "center", gap: 18 }, [
            {
              type: "img",
              props: { src: await loadMark(), width: 56, height: 56 },
            },
            el("div", { fontSize: 34 }, "Hasan Akalp"),
          ]),
          el(
            "div",
            {
              fontFamily: "JetBrains Mono",
              fontSize: 20,
              color: COLORS.muted,
              letterSpacing: 1,
            },
            lang === "tr" ? "akalp.co · TR" : "akalp.co"
          ),
        ]
      ),
      el("div", { display: "flex", flexDirection: "column", gap: 28 }, [
        meta
          ? el(
              "div",
              {
                fontFamily: "JetBrains Mono",
                fontSize: 22,
                color: COLORS.muted,
                letterSpacing: 1,
              },
              meta.toUpperCase()
            )
          : null,
        el(
          "div",
          {
            fontSize: titleSize(title),
            lineHeight: 1.06,
            letterSpacing: -1.5,
            maxWidth: 1000,
          },
          title
        ),
      ]),
      el(
        "div",
        {
          display: "flex",
          justifyContent: "flex-end",
          fontFamily: "Kalam",
          fontSize: 36,
          color: COLORS.pen,
          transform: "rotate(-2deg)",
        },
        "— Hasan, Ankara"
      ),
    ]
  );

  const tree = el(
    "div",
    {
      width: WIDTH,
      height: HEIGHT,
      display: "flex",
      paddingTop: PAD_TOP,
      paddingLeft: PAD_X,
      background: COLORS.paper,
      color: COLORS.ink,
      fontFamily: "Fraunces",
    },
    [content]
  );

  const svg = await satori(tree as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: await loadFonts(),
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
    .render()
    .asPng();
}
