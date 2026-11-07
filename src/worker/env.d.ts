// Secrets are not declared in wrangler.jsonc, so `wrangler types` does not
// see them. Both are optional at runtime: the Worker degrades gracefully.
interface Env {
  /** Bearer token for POST /api/ticket. */
  TICKET_TOKEN?: string;
  /** Optional GitHub token to raise the events API rate limit. */
  GITHUB_TOKEN?: string;
}
