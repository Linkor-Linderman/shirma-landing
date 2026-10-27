const BLOCKED_KEYS = new Set([
  "name",
  "contact",
  "contactvalue",
  "message",
  "email",
  "telegram",
  "freetext",
  "answer",
]);

export type EventProps = Record<string, string | number | boolean | null | undefined>;

export function buildEventProps(utmSource: string, props?: EventProps): Record<string, string | number | boolean> {
  const safe: Record<string, string | number | boolean> = {
    utm_source: utmSource,
  };
  if (!props) return safe;
  for (const [key, value] of Object.entries(props)) {
    if (BLOCKED_KEYS.has(key.toLowerCase())) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      safe[key] = value;
    }
  }
  safe.utm_source = utmSource;
  return safe;
}
