import assert from "node:assert/strict";
import test from "node:test";
import schema from "../src/appmeta/settings.json" with { type: "json" };
import { AppModel } from "../src/model.ts";
import { schemaDefaults, type Settings } from "../src/lib.ts";
const NOW = 1700000000000;
const make = (values: Settings = {}, saved: Settings = {}, now = NOW) =>
  new AppModel({ ...schemaDefaults(schema.fields), ...values }, saved, now);

test("battery value and firmware details come from their own records", () => {
  const a = make();
  a.receive(
    {
      power: { battery_charge: 42, state: "charging" },
      system: { api_semver: "1.2.3" },
      firmware: { version: "4.5.6" },
    },
    NOW,
    "status",
  );
  assert.equal(a.view(NOW).value, "42%");
  a.key("wheel", 2, NOW);
  assert.equal(a.view(NOW).value, "4.5.6");
});
test("serial page is opt-in and request rotation stays local", () => {
  const a = make();
  assert.equal(a.request(NOW).url, "http://localhost/api/status");
  assert.equal(a.request(NOW).url, "http://localhost/api/wifi/status");
  a.key("wheel", 3, NOW);
  assert.equal(a.page, 0);
});
