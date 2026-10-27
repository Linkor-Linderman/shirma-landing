export type ContactMethod = "telegram" | "email";

export type LeadDraft = {
  name: string;
  contactMethod: string;
  contactValue: string;
  message: string;
  consent: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  referrer: string;
};

export type FieldName =
  | "name"
  | "contactMethod"
  | "contactValue"
  | "message"
  | "consent";

export type FieldErrors = Partial<Record<FieldName, string>>;

export type ValidatedLead = {
  name: string;
  contactMethod: ContactMethod;
  contactValue: string;
  message: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  referrer: string;
};

export type Lead = ValidatedLead & {
  submittedAt: string;
};

export type LeadApiFailure = {
  ok: false;
  error: "disabled" | "validation" | "rate_limit" | "bad_request" | "sink";
  message: string;
  fields?: FieldErrors;
};

export type LeadApiResult = { ok: true } | LeadApiFailure;

export interface LeadSink {
  /** Отправить уже проверенную заявку. Не логировать персональные данные. */
  send(lead: Lead): Promise<void>;
}
