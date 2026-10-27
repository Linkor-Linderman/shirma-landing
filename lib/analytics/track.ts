"use client";

import { readUtmSource } from "./attribution";
import { buildEventProps, type EventProps } from "./payload";
import { sanitizeYmId } from "./ym";

export type AnalyticsEvent =
  | "page_view"
  | "cta_click"
  | "form_start"
  | "form_submit_success"
  | "scroll_depth";

type YmFn = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };

declare global {
  interface Window {
    ym?: YmFn;
  }
}

const seenPageViews = new Set<string>();

function ymId(): string | null {
  return sanitizeYmId(process.env.NEXT_PUBLIC_YM_ID);
}

function callYm(id: string, event: AnalyticsEvent, props: Record<string, string | number | boolean>): void {
  const ym = window.ym;
  if (typeof ym !== "function") return;
  ym(Number(id), "reachGoal", event, props);
}

/** События Метрики. Без NEXT_PUBLIC_YM_ID ничего не отправляет. Имя, контакт и текст заявки отбрасываются. */
export function track(event: AnalyticsEvent, props?: EventProps): void {
  if (typeof window === "undefined") return;
  const id = ymId();
  if (!id) return;
  const payload = buildEventProps(readUtmSource(), props);
  callYm(id, event, payload);
}

export function trackPageView(path: string): void {
  if (seenPageViews.has(path)) return;
  seenPageViews.add(path);
  track("page_view", { path });
}
