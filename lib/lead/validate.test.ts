import assert from "node:assert/strict";
import test from "node:test";
import { validateLead } from "./validate.ts";

const base = {
  name: "Анна",
  contactMethod: "email",
  contactValue: "Anna@Example.com",
  message: "",
  consent: true,
  utmSource: "tg_buhgalter_chat",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  referrer: "",
};

test("принимает email и приводит его к нижнему регистру", () => {
  const result = validateLead(base);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.lead.contactValue, "anna@example.com");
  assert.equal(result.lead.utmSource, "tg_buhgalter_chat");
});

test("принимает telegram @username и ссылку t.me", () => {
  const at = validateLead({ ...base, contactMethod: "telegram", contactValue: "@Buh_Anna" });
  const link = validateLead({
    ...base,
    contactMethod: "telegram",
    contactValue: "https://t.me/Buh_Anna",
  });
  assert.equal(at.ok && at.lead.contactValue, "@buh_anna");
  assert.equal(link.ok && link.lead.contactValue, "@buh_anna");
});

test("требует имя, способ связи, формат контакта и согласие", () => {
  const result = validateLead({
    ...base,
    name: "  ",
    contactMethod: "",
    contactValue: "не контакт",
    consent: false,
    message: "x".repeat(2001),
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.ok(result.fields.name);
  assert.ok(result.fields.contactMethod);
  assert.ok(result.fields.consent);
  assert.ok(result.fields.message);
  assert.equal(result.fields.contactValue, undefined);
});

test("отрезает управляющие символы в метках", () => {
  const result = validateLead({ ...base, utmSource: "tg\nchat\u0000" });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.lead.utmSource, "tgchat");
});
