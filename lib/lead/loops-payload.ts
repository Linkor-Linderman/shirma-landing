import type { Lead } from "./types";

export const LOOPS_CONTACT_PROPERTIES = [
  { name: "contact", type: "string" },
  { name: "contactMethod", type: "string" },
  { name: "message", type: "string" },
  { name: "utmSource", type: "string" },
  { name: "utmMedium", type: "string" },
  { name: "utmCampaign", type: "string" },
  { name: "utmContent", type: "string" },
  { name: "referrer", type: "string" },
  { name: "submittedAt", type: "date" },
] as const;

export type LoopsContactBody = {
  email?: string;
  userId: string;
  firstName: string;
  source: string;
  userGroup: string;
  subscribed: false;
  contact: string;
  contactMethod: string;
  message: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  referrer: string;
  submittedAt: string;
};

function plusAddress(inbox: string, token: string): string | undefined {
  const match = inbox.trim().match(/^([^@\s+]+)@([^@\s]+)$/);
  if (!match?.[1] || !match[2]) return undefined;
  const slug = token.replace(/[^a-z0-9_]/gi, "").slice(0, 40);
  if (!slug) return undefined;
  return `${match[1]}+${slug}@${match[2]}`;
}

export function loopsIdentity(
  lead: Lead,
  inboxEmail: string | undefined,
): { email?: string; userId: string } {
  if (lead.contactMethod === "email") {
    const email = lead.contactValue.toLowerCase();
    return { email, userId: `email:${email}` };
  }
  const username = lead.contactValue.replace(/^@/, "").toLowerCase();
  const userId = `tg:${username}`;
  const email = inboxEmail ? plusAddress(inboxEmail, `tg_${username}`) : undefined;
  return email ? { email, userId } : { userId };
}

/** Тело upsert-запроса в Loops. Контакт не подписывается на рассылки. */
export function buildLoopsBody(lead: Lead, inboxEmail: string | undefined): LoopsContactBody {
  const identity = loopsIdentity(lead, inboxEmail);
  return {
    ...identity,
    firstName: lead.name,
    source: (lead.utmSource || "landing").slice(0, 200),
    userGroup: "custdev",
    subscribed: false,
    contact: `${lead.contactMethod}: ${lead.contactValue}`,
    contactMethod: lead.contactMethod,
    message: lead.message,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    utmContent: lead.utmContent,
    referrer: lead.referrer,
    submittedAt: lead.submittedAt,
  };
}
