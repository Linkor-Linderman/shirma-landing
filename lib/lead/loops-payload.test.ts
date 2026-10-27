import assert from "node:assert/strict";
import test from "node:test";
import { buildLoopsBody } from "./loops-payload.ts";
import type { Lead } from "./types.ts";

const lead: Lead = {
  name: "Анна",
  contactMethod: "telegram",
  contactValue: "@buh_anna",
  message: "три клиента, ОСВ",
  utmSource: "tg_buhgalter_chat",
  utmMedium: "post",
  utmCampaign: "",
  utmContent: "",
  referrer: "https://t.me/example",
  submittedAt: "2026-10-27T12:00:00.000Z",
};

test("кладёт поля заявки и не подписывает контакт на рассылку", () => {
  const body = buildLoopsBody(
    { ...lead, contactMethod: "email", contactValue: "anna@example.com" },
    undefined,
  );
  assert.equal(body.email, "anna@example.com");
  assert.equal(body.userId, "email:anna@example.com");
  assert.equal(body.firstName, "Анна");
  assert.equal(body.contact, "email: anna@example.com");
  assert.equal(body.message, "три клиента, ОСВ");
  assert.equal(body.utmSource, "tg_buhgalter_chat");
  assert.equal(body.referrer, "https://t.me/example");
  assert.equal(body.submittedAt, "2026-10-27T12:00:00.000Z");
  assert.equal(body.subscribed, false);
});

test("telegram без ящика уходит только с userId", () => {
  const body = buildLoopsBody(lead, undefined);
  assert.equal(body.userId, "tg:buh_anna");
  assert.equal(body.email, undefined);
  assert.equal(body.contact, "telegram: @buh_anna");
});

test("telegram с ящиком получает plus-address", () => {
  const body = buildLoopsBody(lead, "linar@example.com");
  assert.equal(body.email, "linar+tg_buh_anna@example.com");
});
