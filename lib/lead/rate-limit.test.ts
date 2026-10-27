import assert from "node:assert/strict";
import test from "node:test";
import { createRateLimiter } from "./rate-limit.ts";

test("пропускает лимит и потом просит подождать", () => {
  const limit = createRateLimiter(2, 10_000);
  assert.equal(limit.check("a", 0).ok, true);
  assert.equal(limit.check("a", 1000).ok, true);
  const blocked = limit.check("a", 2000);
  assert.equal(blocked.ok, false);
  if (blocked.ok) return;
  assert.ok(blocked.retryAfterSec > 0);
  assert.equal(limit.check("b", 2000).ok, true);
});
