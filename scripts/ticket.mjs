#!/usr/bin/env node
/**
 * Update today's ticket on akalp.co.
 *
 *   pnpm ticket                    show the current ticket
 *   pnpm ticket brew "Ethiopia · V60"
 *   pnpm ticket play "Civilization VI"
 *   pnpm ticket build "akalp.co v2"
 *   pnpm ticket read "The Pragmatic Programmer"
 *   pnpm ticket brew --clear       empty a field
 *   pnpm ticket --preview brew "…" target the v2 preview instead
 *
 * Needs TICKET_TOKEN in the environment or in .dev.vars at the repo root.
 * TICKET_URL overrides the target (default https://akalp.co).
 *
 * Handy alias:
 *   alias ticket="pnpm --silent --dir ~/Workspaces/personal/akalpco ticket"
 */
import { readFileSync } from "node:fs";

const FIELDS = {
  brew: "brewing",
  brewing: "brewing",
  play: "playing",
  playing: "playing",
  build: "building",
  building: "building",
  read: "reading",
  reading: "reading",
};
const PREVIEW_URL = "https://v2-akalpco.hasan-akalp.workers.dev";

const args = process.argv.slice(2);
const preview = takeFlag("--preview");
const clear = takeFlag("--clear");
const base = (
  process.env.TICKET_URL ?? (preview ? PREVIEW_URL : "https://akalp.co")
).replace(/\/$/, "");
const endpoint = `${base}/api/ticket`;

function takeFlag(name) {
  const i = args.indexOf(name);
  if (i === -1) return false;
  args.splice(i, 1);
  return true;
}

function fail(message) {
  console.error(`ticket: ${message}`);
  process.exit(1);
}

function token() {
  if (process.env.TICKET_TOKEN) return process.env.TICKET_TOKEN;
  try {
    const vars = readFileSync(new URL("../.dev.vars", import.meta.url), "utf8");
    const match = /^TICKET_TOKEN=(.+)$/m.exec(vars);
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  } catch {
    // No .dev.vars: fall through.
  }
  fail("TICKET_TOKEN is not set (env or .dev.vars).");
}

function print(ticket) {
  const rows = [
    ["BREWING", ticket.brewing],
    ["PLAYING", ticket.playing],
    ["BUILDING", ticket.building],
    ["READING", ticket.reading],
    [
      "LAST PUSH",
      ticket.lastPush ? `${ticket.lastPush.repo} · ${ticket.lastPush.at}` : "",
    ],
  ];
  for (const [label, value] of rows) {
    console.log(`${label.padEnd(10)} ${value || "—"}`);
  }
  if (ticket.updatedAt) console.log(`\nupdated ${ticket.updatedAt}`);
}

async function main() {
  if (args.length === 0) {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) fail(`GET ${endpoint} → ${response.status}`);
    print(await response.json());
    return;
  }

  const [name, ...rest] = args;
  const field = FIELDS[name];
  if (!field) {
    fail(`unknown field "${name}". Use brew, play, build or read.`);
  }
  const value = clear ? "" : rest.join(" ").trim();
  if (!clear && !value) fail(`give a value, or use --clear.`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ [field]: value }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) fail(body.error ?? `POST ${endpoint} → ${response.status}`);
  print(body);
}

main().catch((error) => fail(error.message));
