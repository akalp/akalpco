/**
 * The tiny Worker behind today's ticket. Everything else on the site is
 * static assets; `run_worker_first` sends only /api/* here.
 *
 *   GET  /api/ticket   current ticket (edge-cached ~5 minutes)
 *   POST /api/ticket   merge fields; needs `Authorization: Bearer <TICKET_TOKEN>`
 *   cron (hourly)      refresh `lastPush` from GitHub
 */
import { EMPTY_TICKET, parseUpdate, type Ticket } from "./ticket";

const KEY = "ticket";
const CACHE_SECONDS = 300;
const GITHUB_USER = "akalp";

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== "/api/ticket") {
      return json({ error: "Not found." }, 404);
    }

    switch (request.method) {
      case "GET":
      case "HEAD":
        return getTicket(request, env, ctx);
      case "POST":
        return postTicket(request, env);
      case "OPTIONS":
        return new Response(null, { status: 204, headers: { Allow: ALLOW } });
      default:
        return json({ error: "Method not allowed." }, 405, { Allow: ALLOW });
    }
  },

  async scheduled(_controller, env): Promise<void> {
    const push = await latestPush(env);
    if (!push) return;

    const ticket = await readTicket(env);
    if (ticket.lastPush?.repo === push.repo && ticket.lastPush.at === push.at) {
      return; // Nothing new: skip the KV write.
    }
    await writeTicket(env, { ...ticket, lastPush: push });
  },
} satisfies ExportedHandler<Env>;

const ALLOW = "GET, HEAD, POST, OPTIONS";

async function getTicket(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  // The Cache API keeps KV reads well under the free-plan quota. It is a
  // no-op on workers.dev, which is fine for previews.
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/ticket", request.url), {
    method: "GET",
  });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const response = json(await readTicket(env), 200, {
    "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
  });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

async function postTicket(request: Request, env: Env): Promise<Response> {
  if (!env.TICKET_TOKEN) {
    return json({ error: "TICKET_TOKEN is not configured." }, 503);
  }
  if (!(await authorized(request, env.TICKET_TOKEN))) {
    return json({ error: "Unauthorized." }, 401, {
      "WWW-Authenticate": "Bearer",
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be JSON." }, 400);
  }

  const parsed = parseUpdate(body);
  if (!parsed.ok) return json({ error: parsed.error }, 400);

  const ticket = await writeTicket(env, {
    ...(await readTicket(env)),
    ...parsed.update,
  });

  // Drop this colo's cached copy so the change shows up right away here.
  await caches.default.delete(new URL("/api/ticket", request.url).href);
  return json(ticket, 200);
}

async function authorized(request: Request, token: string): Promise<boolean> {
  const header = request.headers.get("Authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  // Compare digests so the comparison is constant-time and length-safe.
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(given)),
    crypto.subtle.digest("SHA-256", encoder.encode(token)),
  ]);
  return crypto.subtle.timingSafeEqual(a, b);
}

async function readTicket(env: Env): Promise<Ticket> {
  const stored = await env.TICKET.get<Partial<Ticket>>(KEY, "json");
  return { ...EMPTY_TICKET, ...stored };
}

async function writeTicket(env: Env, ticket: Ticket): Promise<Ticket> {
  const next = { ...ticket, updatedAt: new Date().toISOString() };
  await env.TICKET.put(KEY, JSON.stringify(next));
  return next;
}

interface GitHubRepo {
  full_name: string;
  pushed_at: string;
}

/**
 * Most recently pushed public repo. The repos endpoint is used rather than
 * the events feed, which often omits PushEvents.
 */
async function latestPush(env: Env): Promise<Ticket["lastPush"]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "akalpco-ticket-worker",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=pushed&per_page=1`,
    { headers }
  );
  if (!response.ok) {
    console.warn(`GitHub repos: ${response.status} ${response.statusText}`);
    return null;
  }

  const [repo] = (await response.json()) as GitHubRepo[];
  return repo ? { repo: repo.full_name, at: repo.pushed_at } : null;
}

function json(
  data: unknown,
  status: number,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}
