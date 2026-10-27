import { cleanMeta } from "../clean";

const STORAGE_KEY = "shirma_attr_v1";

export type Attribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  referrer: string;
};

export const emptyAttribution: Attribution = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  referrer: "",
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

function readStored(): Attribution {
  if (typeof window === "undefined") return { ...emptyAttribution };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyAttribution };
    const parsed = JSON.parse(raw) as Partial<Attribution>;
    return {
      utm_source: cleanMeta(parsed.utm_source, 200),
      utm_medium: cleanMeta(parsed.utm_medium, 200),
      utm_campaign: cleanMeta(parsed.utm_campaign, 200),
      utm_content: cleanMeta(parsed.utm_content, 200),
      referrer: cleanMeta(parsed.referrer, 500),
    };
  } catch {
    return { ...emptyAttribution };
  }
}

/** Забирает utm из URL и document.referrer. Не хранит имя, контакт и текст заявки. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return { ...emptyAttribution };
  const next = readStored();
  const params = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const value = cleanMeta(params.get(key), 200);
    if (value) next[key] = value;
  }
  if (!next.referrer) next.referrer = cleanMeta(document.referrer, 500);
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // sessionStorage может быть недоступен. Метки всё равно вернутся из URL.
  }
  return next;
}

export function readUtmSource(): string {
  return captureAttribution().utm_source;
}
