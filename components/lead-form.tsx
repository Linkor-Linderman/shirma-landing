"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { captureAttribution, type Attribution } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/track";
import { consentCopy, formCopy } from "@/lib/content";
import type { FieldErrors, LeadApiResult } from "@/lib/lead/types";
import { validateLead } from "@/lib/lead/validate";

const FIELD_IDS: Record<keyof FieldErrors, string> = {
  name: "lead-name",
  contactMethod: "lead-telegram",
  contactValue: "lead-contact",
  message: "lead-message",
  consent: "lead-consent",
};

type LeadFormProps = {
  submissionsOpen: boolean;
};

function writeAttribution(form: HTMLFormElement | null, attribution: Attribution) {
  if (!form) return;
  const values: Record<string, string> = {
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    referrer: attribution.referrer,
  };
  for (const [name, value] of Object.entries(values)) {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement) field.value = value;
  }
}

export function LeadForm({ submissionsOpen }: LeadFormProps) {
  const hintId = useId();
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<"" | "telegram" | "email">("");
  const [contactValue, setContactValue] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    writeAttribution(formRef.current, captureAttribution());
  }, []);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    track("form_start");
  }

  function clearError(field: keyof FieldErrors) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSummary("");
    setErrorMessage("");

    const fresh = captureAttribution();
    writeAttribution(formRef.current, fresh);

    const result = validateLead({
      name,
      contactMethod,
      contactValue,
      message,
      consent,
      utmSource: fresh.utm_source,
      utmMedium: fresh.utm_medium,
      utmCampaign: fresh.utm_campaign,
      utmContent: fresh.utm_content,
      referrer: fresh.referrer,
    });

    if (!result.ok) {
      setErrors(result.fields);
      setSummary(formCopy.errorSummary);
      const first = (Object.keys(FIELD_IDS) as Array<keyof FieldErrors>).find((key) => result.fields[key]);
      if (first) document.getElementById(FIELD_IDS[first])?.focus();
      return;
    }

    setErrors({});

    if (!submissionsOpen) {
      document.getElementById("form-closed")?.focus();
      return;
    }

    if (honeypot) {
      setStatus("error");
      setErrorMessage(formCopy.badRequest);
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.lead.name,
          contactMethod: result.lead.contactMethod,
          contactValue: result.lead.contactValue,
          message: result.lead.message,
          consent: true,
          hp_website: honeypot,
          utm_source: result.lead.utmSource,
          utm_medium: result.lead.utmMedium,
          utm_campaign: result.lead.utmCampaign,
          utm_content: result.lead.utmContent,
          referrer: result.lead.referrer,
        }),
      });
      const data = (await response.json()) as LeadApiResult;
      if (data.ok) {
        track("form_submit_success");
        setStatus("success");
        document.getElementById("form-status")?.focus();
        return;
      }
      if (data.error === "validation" && data.fields) {
        setStatus("idle");
        setErrors(data.fields);
        setSummary(data.message);
        return;
      }
      if (data.error === "disabled") {
        setStatus("idle");
        document.getElementById("form-closed")?.focus();
        return;
      }
      setStatus("error");
      setErrorMessage(data.message || formCopy.generic);
      document.getElementById("form-status")?.focus();
    } catch {
      setStatus("error");
      setErrorMessage(formCopy.network);
      document.getElementById("form-status")?.focus();
    }
  }

  const contactLabel =
    contactMethod === "email"
      ? formCopy.emailLabel
      : contactMethod === "telegram"
        ? formCopy.telegramLabel
        : formCopy.contactLabel;

  return (
    <form
      ref={formRef}
      className="lead-form"
      onSubmit={onSubmit}
      onFocus={markStarted}
      noValidate
      aria-busy={status === "submitting"}
    >
      {submissionsOpen ? null : (
        <div className="closed-banner" id="form-closed" tabIndex={-1} role="status">
          <strong>{formCopy.disabledTitle}</strong>
          <p>{formCopy.disabled}</p>
        </div>
      )}

      {status === "success" ? (
        <p className="form-success" id="form-status" tabIndex={-1} role="status">
          {formCopy.success}
        </p>
      ) : (
        <>
          <div className="form-status" id="form-status" tabIndex={-1} role="status" aria-live="polite">
            {summary ? <p className="field-error">{summary}</p> : null}
            {status === "error" ? <p className="field-error">{errorMessage}</p> : null}
          </div>

          <div className="field">
            <label htmlFor="lead-name">
              {formCopy.nameLabel}
              <span className="req" aria-hidden="true"> *</span>
            </label>
            <input
              id="lead-name"
              name="name"
              className="control"
              autoComplete="name"
              maxLength={80}
              value={name}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "lead-name-error" : undefined}
              onChange={(event) => {
                setName(event.target.value);
                clearError("name");
              }}
            />
            {errors.name ? (
              <p className="field-error" id="lead-name-error">{errors.name}</p>
            ) : null}
          </div>

          <fieldset className="field" aria-describedby={errors.contactMethod ? "lead-method-error" : undefined}>
            <legend>
              {formCopy.contactLegend}
              <span className="req" aria-hidden="true"> *</span>
            </legend>
            <div className="choices">
              <label className="choice">
                <input
                  id="lead-telegram"
                  type="radio"
                  name="contactMethod"
                  value="telegram"
                  checked={contactMethod === "telegram"}
                  onChange={() => {
                    setContactMethod("telegram");
                    clearError("contactMethod");
                    clearError("contactValue");
                  }}
                />
                <span>{formCopy.telegram}</span>
              </label>
              <label className="choice">
                <input
                  id="lead-email"
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={contactMethod === "email"}
                  onChange={() => {
                    setContactMethod("email");
                    clearError("contactMethod");
                    clearError("contactValue");
                  }}
                />
                <span>{formCopy.email}</span>
              </label>
            </div>
            {errors.contactMethod ? (
              <p className="field-error" id="lead-method-error">{errors.contactMethod}</p>
            ) : null}
          </fieldset>

          <div className="field">
            <label htmlFor="lead-contact">
              {contactLabel}
              <span className="req" aria-hidden="true"> *</span>
            </label>
            <input
              id="lead-contact"
              name="contactValue"
              className="control"
              inputMode={contactMethod === "email" ? "email" : "text"}
              autoComplete={contactMethod === "email" ? "email" : "off"}
              placeholder={contactMethod === "email" ? formCopy.emailPlaceholder : contactMethod === "telegram" ? formCopy.telegramPlaceholder : ""}
              maxLength={254}
              value={contactValue}
              aria-invalid={errors.contactValue ? true : undefined}
              aria-describedby={errors.contactValue ? "lead-contact-error" : undefined}
              onChange={(event) => {
                setContactValue(event.target.value);
                clearError("contactValue");
              }}
            />
            {errors.contactValue ? (
              <p className="field-error" id="lead-contact-error">{errors.contactValue}</p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="lead-message">{formCopy.messageLabel}</label>
            <textarea
              id="lead-message"
              name="message"
              className="control control-area"
              rows={5}
              maxLength={2000}
              value={message}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={`${hintId}${errors.message ? " lead-message-error" : ""}`}
              onChange={(event) => {
                setMessage(event.target.value);
                clearError("message");
              }}
            />
            <p className="fine" id={hintId}>{formCopy.messageHint}</p>
            {errors.message ? (
              <p className="field-error" id="lead-message-error">{errors.message}</p>
            ) : null}
          </div>

          <div className="field">
            <label className="consent" htmlFor="lead-consent">
              <input
                id="lead-consent"
                name="consent"
                type="checkbox"
                checked={consent}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "lead-consent-error consent-note" : "consent-note"}
                onChange={(event) => {
                  setConsent(event.target.checked);
                  clearError("consent");
                }}
              />
              <span>
                {consentCopy.text}{" "}
                <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                  {consentCopy.link}
                  <span className="visually-hidden"> (откроется в новой вкладке)</span>
                </Link>
                <span className="req" aria-hidden="true"> *</span>
              </span>
            </label>
            <p className="draft-note" id="consent-note">{consentCopy.temporaryNote}</p>
            {errors.consent ? (
              <p className="field-error" id="lead-consent-error">{errors.consent}</p>
            ) : null}
          </div>

          <div className="hp" aria-hidden="true">
            <label htmlFor="hp-website">Сайт</label>
            <input
              id="hp-website"
              name="hp_website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          <input type="hidden" name="utm_source" defaultValue="" />
          <input type="hidden" name="utm_medium" defaultValue="" />
          <input type="hidden" name="utm_campaign" defaultValue="" />
          <input type="hidden" name="utm_content" defaultValue="" />
          <input type="hidden" name="referrer" defaultValue="" />

          <button className="btn btn-primary" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? formCopy.submitting : formCopy.submit}
          </button>
          <noscript>
            <p className="fine">{formCopy.noscript}</p>
          </noscript>
        </>
      )}
    </form>
  );
}
