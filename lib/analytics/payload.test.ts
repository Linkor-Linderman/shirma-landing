import assert from "node:assert/strict";
import test from "node:test";
import { buildEventProps } from "./payload.ts";

test("во всех событиях есть utm_source и нет персональных полей", () => {
  const props = buildEventProps("tg_buhgalter_chat", {
    location: "hero",
    name: "Анна",
    contact: "@buh_anna",
    contactValue: "anna@example.com",
    message: "осв",
    email: "anna@example.com",
  });
  assert.equal(props.utm_source, "tg_buhgalter_chat");
  assert.equal(props.location, "hero");
  assert.equal("name" in props, false);
  assert.equal("contact" in props, false);
  assert.equal("contactValue" in props, false);
  assert.equal("message" in props, false);
  assert.equal("email" in props, false);
});

test("пустой источник всё равно присутствует", () => {
  assert.deepEqual(buildEventProps(""), { utm_source: "" });
});
