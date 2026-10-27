import { formCopy } from "../content";
import { cleanMeta } from "../clean";
import type { FieldErrors, LeadDraft, ValidatedLead } from "./types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEGRAM_NAME = /^[a-zA-Z0-9_]{5,32}$/;

export function normalizeTelegram(value: string): string | null {
  const trimmed = value.trim();
  const link = trimmed.match(
    /^(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]{5,32})\/?$/i,
  );
  if (link?.[1] && TELEGRAM_NAME.test(link[1])) {
    return `@${link[1].toLowerCase()}`;
  }
  const at = trimmed.match(/^@?([a-zA-Z0-9_]{5,32})$/);
  if (at?.[1] && TELEGRAM_NAME.test(at[1])) {
    return `@${at[1].toLowerCase()}`;
  }
  return null;
}

export function normalizeEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return null;
  return email;
}

export function validateLead(
  draft: LeadDraft,
): { ok: true; lead: ValidatedLead } | { ok: false; fields: FieldErrors } {
  const fields: FieldErrors = {};
  const name = cleanMeta(draft.name, 80);
  if (!name) fields.name = formCopy.errors.name;

  let contactMethod: ValidatedLead["contactMethod"] | null = null;
  let contactValue = "";
  if (draft.contactMethod === "telegram") contactMethod = "telegram";
  else if (draft.contactMethod === "email") contactMethod = "email";
  else fields.contactMethod = formCopy.errors.contactMethod;

  if (contactMethod === "telegram") {
    const telegram = normalizeTelegram(draft.contactValue);
    if (!telegram) fields.contactValue = formCopy.errors.telegram;
    else contactValue = telegram;
  } else if (contactMethod === "email") {
    const email = normalizeEmail(draft.contactValue);
    if (!email) fields.contactValue = formCopy.errors.email;
    else contactValue = email;
  }

  const message = cleanMeta(draft.message, 4000);
  if (message.length > 2000) fields.message = formCopy.errors.message;

  if (draft.consent !== true) fields.consent = formCopy.errors.consent;

  if (!contactMethod || Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    lead: {
      name,
      contactMethod,
      contactValue,
      message,
      utmSource: cleanMeta(draft.utmSource, 200),
      utmMedium: cleanMeta(draft.utmMedium, 200),
      utmCampaign: cleanMeta(draft.utmCampaign, 200),
      utmContent: cleanMeta(draft.utmContent, 200),
      referrer: cleanMeta(draft.referrer, 500),
    },
  };
}
