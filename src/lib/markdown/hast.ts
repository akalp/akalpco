import type { Element, ElementContent, Properties, RootContent } from "hast";

export function h(
  tagName: string,
  properties: Properties = {},
  children: ElementContent[] = []
): Element {
  return { type: "element", tagName, properties, children };
}

export function text(value: string): ElementContent {
  return { type: "text", value };
}

export function isElement(
  node: RootContent | ElementContent | undefined,
  tagName?: string
): node is Element {
  return (
    node?.type === "element" &&
    (tagName === undefined || node.tagName === tagName)
  );
}

/** Whitespace-only text between block elements. */
export function isBlank(node: RootContent | ElementContent): boolean {
  return node.type === "text" && node.value.trim() === "";
}

/** Class list, whether set as hast `className` or a raw `class` string (Shiki). */
export function classList(node: Element): string[] {
  const { className, class: raw } = node.properties;
  if (Array.isArray(className)) return className.map(String);
  if (typeof raw === "string") return raw.split(/\s+/);
  return [];
}

export function hasClass(node: Element, className: string): boolean {
  return classList(node).includes(className);
}

export function addClass(node: Element, ...classNames: string[]): void {
  const list = classList(node);
  delete node.properties.class;
  node.properties.className = [...list, ...classNames];
}
