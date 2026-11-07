import defaults from "@/data/ticket.json";
import type { TicketRow } from "@/components/Ticket.astro";

const TIME_ZONE = "Europe/Istanbul";

/** Rows for today's ticket, from the build-time defaults. */
export function ticketRows(): TicketRow[] {
  return [
    { label: "Brewing", value: defaults.brewing, field: "brewing" },
    { label: "Playing", value: defaults.playing, field: "playing" },
    { label: "Building", value: defaults.building, field: "building" },
    { label: "Reading", value: defaults.reading, field: "reading" },
    {
      label: "Last push",
      value: `${defaults.lastPush.repo} · [2h] ago`,
      field: "lastPush",
    },
  ];
}

/** "thu · 05 nov · 14:12" in Ankara time. */
export function ticketStamp(date = new Date()): string {
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, ...options })
      .format(date)
      .toLowerCase();
  return [
    part({ weekday: "short" }),
    part({ day: "2-digit", month: "short" }),
    part({ hour: "2-digit", minute: "2-digit", hour12: false }),
  ].join(" · ");
}

/** Ticket number: the day of the year, like a receipt roll. */
export function ticketNumber(date = new Date()): string {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((date.valueOf() - start) / 86_400_000);
  return `no. ${String(day).padStart(4, "0")}`;
}
