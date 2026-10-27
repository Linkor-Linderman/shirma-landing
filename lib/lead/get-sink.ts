import "server-only";

import { submissionsEnabled } from "../site";
import { LoopsLeadSink } from "./loops";
import type { LeadSink } from "./types";

class DisabledLeadSink implements LeadSink {
  async send(): Promise<void> {
    throw new Error("lead_sink_disabled");
  }
}

/** Единственное место, где выбирается сервис заявок. */
export function getLeadSink(): LeadSink {
  const apiKey = process.env.LOOPS_API_KEY?.trim();
  if (!submissionsEnabled() || !apiKey) return new DisabledLeadSink();
  return new LoopsLeadSink(apiKey);
}
