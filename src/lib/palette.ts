import type { PaletteItem } from "@/components/Palette.astro";

const INKS = [
  { id: "blue", name: "blue pen" },
  { id: "red", name: "red pen" },
  { id: "green", name: "green pen" },
  { id: "purple", name: "purple pen" },
] as const;

const SECRET = /coffee|sudo|brew|teapot|418|kahve/;

const COFFEE: PaletteItem = {
  group: "Secret",
  label: "sudo make coffee",
  hint: "↵",
};

/** Lowercase, Turkish-aware, accent-free, for forgiving matching. */
function normalize(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function currentInk() {
  const id = document.documentElement.dataset.ink ?? "blue";
  return INKS.find((ink) => ink.id === id) ?? INKS[0];
}

function saveInk(id: string) {
  if (id === "blue") delete document.documentElement.dataset.ink;
  else document.documentElement.dataset.ink = id;
  try {
    if (id === "blue") localStorage.removeItem("ink");
    else localStorage.setItem("ink", id);
  } catch {
    // Storage unavailable: the ink still changes for this page view.
  }
}

/**
 * Reads the address from the hidden mailto: link in the palette. Behind
 * Cloudflare's Email Address Obfuscation the href is
 * /cdn-cgi/l/email-protection#<hex> until Cloudflare's script decodes it,
 * so that format is decoded here too (first byte is the XOR key).
 */
function readEmail(): string | undefined {
  const href =
    document
      .querySelector<HTMLAnchorElement>("[data-palette-email]")
      ?.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) return href.slice(7).split("?")[0];
  const hex = href.split("/cdn-cgi/l/email-protection#")[1];
  if (!hex) return undefined;
  const key = parseInt(hex.slice(0, 2), 16);
  let out = "";
  for (let i = 2; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  }
  return out;
}

export function initPalette() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-palette]");
  const dataEl = document.getElementById("palette-data");
  if (!dialog || !dataEl) return;

  const input = dialog.querySelector<HTMLInputElement>(".palette__input")!;
  const list = dialog.querySelector<HTMLElement>(".palette__results")!;
  const empty = dialog.querySelector<HTMLElement>(".palette__empty")!;
  const msg = dialog.querySelector<HTMLElement>(".palette__msg")!;

  const { items } = JSON.parse(dataEl.textContent ?? "{}") as {
    items: PaletteItem[];
  };
  const haystacks = new Map(
    items.map((item) => [
      item,
      normalize(`${item.label} ${item.group} ${item.keywords ?? ""}`),
    ])
  );

  let results: PaletteItem[] = [];
  let selected = 0;

  function filter(query: string): PaletteItem[] {
    const q = normalize(query.trim());
    const words = q.split(/\s+/).filter(Boolean);
    const matches = items.filter((item) =>
      words.every((word) => haystacks.get(item)!.includes(word))
    );
    return SECRET.test(q) ? [...matches, COFFEE] : matches;
  }

  function hintFor(item: PaletteItem): string {
    return item.action === "ink" ? currentInk().name : item.hint;
  }

  function render() {
    results = filter(input.value);
    selected = Math.min(selected, Math.max(0, results.length - 1));
    list.replaceChildren();

    let group: HTMLElement | null = null;
    let groupName = "";
    results.forEach((item, i) => {
      if (item.group !== groupName) {
        groupName = item.group;
        const id = `palette-g-${groupName.toLowerCase()}`;
        group = document.createElement("div");
        group.setAttribute("role", "group");
        group.setAttribute("aria-labelledby", id);
        const label = document.createElement("p");
        label.className = "palette__group-label";
        label.id = id;
        label.textContent = groupName;
        group.append(label);
        list.append(group);
      }

      const option = document.createElement("div");
      option.id = `palette-o-${i}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(i === selected));
      const label = document.createElement("span");
      label.textContent = item.label;
      if (item.lang) label.lang = item.lang;
      const hint = document.createElement("span");
      hint.className = "palette__hint";
      hint.textContent = hintFor(item);
      option.append(label, hint);
      option.addEventListener("click", () => run(item));
      option.addEventListener("pointermove", () => {
        if (selected !== i) select(i);
      });
      group!.append(option);
    });

    empty.hidden = results.length > 0;
    updateActive();
  }

  function select(index: number) {
    selected = index;
    list.querySelectorAll('[role="option"]').forEach((el, i) => {
      el.setAttribute("aria-selected", String(i === selected));
    });
    updateActive();
  }

  function updateActive() {
    const active = document.getElementById(`palette-o-${selected}`);
    if (active && results.length > 0) {
      input.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView({ block: "nearest" });
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function say(text: string) {
    msg.textContent = text;
  }

  async function run(item: PaletteItem | undefined) {
    if (!item) return;
    if (item === COFFEE) {
      say("418 — I’m a teapot. the coffee is on the home page ticket.");
    } else if (item.action === "ink") {
      const i = INKS.findIndex((ink) => ink.id === currentInk().id);
      const next = INKS[(i + 1) % INKS.length];
      saveInk(next.id);
      say(`switched to the ${next.name}`);
      render();
    } else if (item.action === "email") {
      const email = readEmail();
      if (!email) return;
      try {
        await navigator.clipboard.writeText(email);
        say(`copied ${email} to your clipboard`);
      } catch {
        say(`it’s ${email}`);
      }
    } else if (item.href) {
      dialog!.close();
      window.location.assign(item.href);
    }
  }

  function open() {
    if (dialog!.open) return;
    input.value = "";
    selected = 0;
    render();
    dialog!.showModal();
    input.focus();
  }

  input.addEventListener("input", () => {
    selected = 0;
    render();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      select(Math.min(selected + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      select(Math.max(selected - 1, 0));
    } else if (event.key === "Home" && event.ctrlKey) {
      select(0);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(results[selected]);
    } else if (event.key === "Escape" && input.value) {
      // First Esc clears the query, the second closes the palette.
      event.preventDefault();
      input.value = "";
      selected = 0;
      render();
    }
  });

  // Click on the backdrop closes.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open();
    }
  });

  document.querySelectorAll("[data-palette-open]").forEach((button) => {
    button.addEventListener("click", open);
  });
}
