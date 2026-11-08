/**
 * Desktop nicety: move each margin note down to the line of its reference.
 *
 * Notes start at the top of their row (the block that contains the ref). In
 * a long paragraph, list item or TL;DR card that can be far from the ref, so
 * each note is pushed down with margin-top. While aligned, a notes column
 * takes no height of its own (notes may hang past the end of their block,
 * like real margin notes), so collisions are resolved across the whole
 * article: a note never starts above the bottom of the previous one.
 * When the notes have wrapped below the text (phones), nothing changes.
 */
const NUDGE = 6; // Kalam sits a little high next to the serif baseline.
const GAP = 18; // Matches the gap between stacked notes.

function align(rows: HTMLElement[]) {
  const notes: HTMLElement[] = [];

  for (const row of rows) {
    row.classList.remove("is-aligned");
    const column = row.querySelector<HTMLElement>(".mn-notes");
    column
      ?.querySelectorAll<HTMLElement>(".margin-note")
      .forEach((note) => (note.style.marginTop = ""));
  }

  for (const row of rows) {
    const main = row.firstElementChild as HTMLElement | null;
    const column = row.querySelector<HTMLElement>(".mn-notes");
    if (!main || !column) continue;
    const sideBySide =
      column.getBoundingClientRect().left >= main.getBoundingClientRect().right;
    if (!sideBySide) continue;
    row.classList.add("is-aligned");
    notes.push(...column.querySelectorAll<HTMLElement>(".margin-note"));
  }

  let lastBottom = -Infinity;
  for (const note of notes) {
    const ref = document.getElementById(note.id.replace(/^mn-/, "mn-ref-"));
    const natural = note.getBoundingClientRect().top;
    const wanted = Math.max(
      ref ? ref.getBoundingClientRect().top - NUDGE : natural,
      lastBottom + GAP
    );
    const delta = wanted - natural;
    if (delta > 0) note.style.marginTop = `${delta}px`;
    lastBottom = note.getBoundingClientRect().bottom;
  }
}

export function alignMarginNotes() {
  const rows = [...document.querySelectorAll<HTMLElement>(".mn-row")];
  if (rows.length === 0) return;

  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => align(rows));
  };

  schedule();
  document.fonts?.ready.then(schedule);
  const observer = new ResizeObserver(schedule);
  rows.forEach((row) => observer.observe(row.firstElementChild as Element));
}
