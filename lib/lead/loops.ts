import "server-only";

import { LOOPS_CONTACT_PROPERTIES, buildLoopsBody } from "./loops-payload";
import type { Lead, LeadSink } from "./types";

const LOOPS_ORIGIN = "https://app.loops.so/api/v1";

export class LeadDeliveryError extends Error {
  readonly status: number;

  constructor(status: number) {
    super("lead_delivery_failed");
    this.name = "LeadDeliveryError";
    this.status = status;
  }
}

type LoopsResult = { ok: boolean; status: number; message: string };

async function loopsFetch(
  apiKey: string,
  path: string,
  init?: { method?: string; body?: string },
): Promise<LoopsResult> {
  const response = await fetch(`${LOOPS_ORIGIN}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: init?.body,
    signal: AbortSignal.timeout(10_000),
  });

  let message = "";
  let ok = response.ok;
  try {
    const data = (await response.json()) as { success?: boolean; message?: string };
    if (typeof data.message === "string") message = data.message;
    if (data.success === false) ok = false;
  } catch {
    ok = response.ok;
  }
  return { ok, status: response.status, message };
}

function alreadyExists(status: number, message: string): boolean {
  if (status === 409) return true;
  return /already|exist|duplicate/i.test(message);
}

function propertyProblem(message: string): boolean {
  return /propert/i.test(message);
}

/**
 * Loops.so. Заменяется целиком, форма и route handler про него не знают.
 * PUT /contacts/update создаёт контакт, если его ещё нет.
 * Email обязателен API только когда нет userId: Telegram уходит с userId `tg:…`.
 * LOOPS_INBOX_EMAIL необязателен: если задан ящик с plus-addressing, к Telegram-контакту
 * добавится адрес вида name+tg_user@domain, чтобы контакт было видно в аудитории Loops.
 */
export class LoopsLeadSink implements LeadSink {
  private ready: Promise<void> | null = null;

  constructor(
    private readonly apiKey: string,
    private readonly inboxEmail = process.env.LOOPS_INBOX_EMAIL,
  ) {}

  async send(lead: Lead): Promise<void> {
    await this.ensureProperties();
    const first = await this.update(lead);
    if (first.ok) return;
    if (first.status === 401 || first.status === 403) {
      throw new LeadDeliveryError(first.status);
    }
    if (propertyProblem(first.message)) {
      await this.createProperties();
      const second = await this.update(lead);
      if (second.ok) return;
      throw new LeadDeliveryError(second.status);
    }
    throw new LeadDeliveryError(first.status);
  }

  private async update(lead: Lead): Promise<LoopsResult> {
    const body = buildLoopsBody(lead, this.inboxEmail);
    return loopsFetch(this.apiKey, "/contacts/update", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  private ensureProperties(): Promise<void> {
    if (!this.ready) {
      this.ready = this.createProperties().catch((error: unknown) => {
        this.ready = null;
        throw error;
      });
    }
    return this.ready;
  }

  private async createProperties(): Promise<void> {
    for (const property of LOOPS_CONTACT_PROPERTIES) {
      const result = await loopsFetch(this.apiKey, "/contacts/properties", {
        method: "POST",
        body: JSON.stringify(property),
      });
      if (result.ok || alreadyExists(result.status, result.message)) continue;
      if (result.status === 401 || result.status === 403) {
        throw new LeadDeliveryError(result.status);
      }
      throw new LeadDeliveryError(result.status);
    }
  }
}
