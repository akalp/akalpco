/** The daily ticket, as stored in KV under `ticket`. */
export interface Ticket {
  brewing: string;
  playing: string;
  building: string;
  reading: string;
  lastPush: { repo: string; at: string } | null;
  updatedAt: string | null;
}

/** Fields that `POST /api/ticket` may change. */
export const EDITABLE = ["brewing", "playing", "building", "reading"] as const;
export type EditableField = (typeof EDITABLE)[number];

export const MAX_LENGTH = 120;

export const EMPTY_TICKET: Ticket = {
  brewing: "",
  playing: "",
  building: "",
  reading: "",
  lastPush: null,
  updatedAt: null,
};

/**
 * Validates a partial update. Unknown keys are rejected so typos in the CLI
 * surface as errors instead of silently doing nothing.
 */
export function parseUpdate(
  body: unknown
):
  | { ok: true; update: Partial<Record<EditableField, string>> }
  | { ok: false; error: string } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "Expected a JSON object." };
  }

  const update: Partial<Record<EditableField, string>> = {};
  for (const [key, value] of Object.entries(body)) {
    if (!EDITABLE.includes(key as EditableField)) {
      return {
        ok: false,
        error: `Unknown field "${key}". Use one of: ${EDITABLE.join(", ")}.`,
      };
    }
    if (typeof value !== "string") {
      return { ok: false, error: `"${key}" must be a string.` };
    }
    const trimmed = value.trim();
    if (trimmed.length > MAX_LENGTH) {
      return {
        ok: false,
        error: `"${key}" is longer than ${MAX_LENGTH} characters.`,
      };
    }
    update[key as EditableField] = trimmed;
  }

  if (Object.keys(update).length === 0) {
    return { ok: false, error: "Nothing to update." };
  }
  return { ok: true, update };
}
