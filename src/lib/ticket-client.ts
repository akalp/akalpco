/**
 * Refreshes rendered tickets from /api/ticket. The HTML ships with
 * build-time defaults; if the request fails, the ticket silently stays as is.
 */
interface TicketData {
  brewing?: string;
  playing?: string;
  building?: string;
  reading?: string;
  lastPush?: { repo: string; at: string } | null;
}

const TIME_ZONE = "Europe/Istanbul";

function ago(iso: string): string {
  const minutes = Math.max(
    0,
    Math.round((Date.now() - Date.parse(iso)) / 60_000)
  );
  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function stamp(date: Date): string {
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

export async function refreshTickets() {
  const tickets = document.querySelectorAll<HTMLElement>("[data-ticket]");
  if (tickets.length === 0) return;

  // The printed time is "now" for the reader, not the build time.
  for (const ticket of tickets) {
    const meta = ticket.querySelector(".ticket__meta");
    if (meta) meta.textContent = stamp(new Date());
  }

  let data: TicketData;
  try {
    const response = await fetch("/api/ticket", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    data = (await response.json()) as TicketData;
  } catch {
    return;
  }

  const values: Record<string, string | undefined> = {
    brewing: data.brewing,
    playing: data.playing,
    building: data.building,
    reading: data.reading,
    lastPush: data.lastPush
      ? `${data.lastPush.repo} · ${ago(data.lastPush.at)}`
      : undefined,
  };

  for (const ticket of tickets) {
    for (const el of ticket.querySelectorAll<HTMLElement>(
      "[data-ticket-field]"
    )) {
      const value = values[el.dataset.ticketField ?? ""];
      if (value) el.textContent = value;
    }
  }
}
