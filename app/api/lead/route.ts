import { NextResponse } from "next/server";
import { formCopy } from "@/lib/content";
import { getLeadSink } from "@/lib/lead/get-sink";
import { LeadDeliveryError } from "@/lib/lead/loops";
import { leadRateLimit } from "@/lib/lead/rate-limit";
import type { LeadApiResult, LeadDraft } from "@/lib/lead/types";
import { validateLead } from "@/lib/lead/validate";
import { submissionsEnabled } from "@/lib/site";

function json(body: LeadApiResult, status: number, extra?: Record<string, string>) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const raw = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return raw.slice(0, 64);
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host.split(",")[0]?.trim();
  } catch {
    return false;
  }
}

function textField(payload: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string") return value;
  }
  return "";
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return json({ ok: false, error: "bad_request", message: formCopy.badRequest }, 400);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "bad_request", message: formCopy.badRequest }, 415);
  }

  const raw = await request.text();
  if (raw.length > 20_000) {
    return json({ ok: false, error: "bad_request", message: formCopy.badRequest }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return json({ ok: false, error: "bad_request", message: formCopy.badRequest }, 400);
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "bad_request", message: formCopy.badRequest }, 400);
  }

  const limit = leadRateLimit.check(clientIp(request));
  if (!limit.ok) {
    return json({ ok: false, error: "rate_limit", message: formCopy.rateLimit }, 429, {
      "Retry-After": String(limit.retryAfterSec),
    });
  }

  const honeypot = payload.hp_website;
  if (!(honeypot === undefined || honeypot === "")) {
    return json({ ok: false, error: "bad_request", message: formCopy.badRequest }, 400);
  }

  const draft: LeadDraft = {
    name: textField(payload, ["name"]),
    contactMethod: textField(payload, ["contactMethod"]),
    contactValue: textField(payload, ["contactValue"]),
    message: textField(payload, ["message"]),
    consent: payload.consent === true,
    utmSource: textField(payload, ["utmSource", "utm_source"]),
    utmMedium: textField(payload, ["utmMedium", "utm_medium"]),
    utmCampaign: textField(payload, ["utmCampaign", "utm_campaign"]),
    utmContent: textField(payload, ["utmContent", "utm_content"]),
    referrer: textField(payload, ["referrer"]),
  };

  const validated = validateLead(draft);
  if (!validated.ok) {
    return json(
      {
        ok: false,
        error: "validation",
        message: formCopy.errorSummary,
        fields: validated.fields,
      },
      400,
    );
  }

  if (!submissionsEnabled()) {
    return json({ ok: false, error: "disabled", message: formCopy.disabled }, 403);
  }

  try {
    await getLeadSink().send({
      ...validated.lead,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    const status = error instanceof LeadDeliveryError ? error.status : 0;
    console.error("lead_sink_failed", status);
    return json({ ok: false, error: "sink", message: formCopy.generic }, 502);
  }

  return json({ ok: true }, 200);
}
