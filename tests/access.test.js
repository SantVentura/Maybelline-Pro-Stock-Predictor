import test from "node:test";
import { resetDemoStorage } from "../src/data/demoReset.js";
import assert from "node:assert/strict";
import { APP_ACCESS } from "../src/config/access.js";
import {
  canUse, getScreenMode, isDemoSession, storageKey, getVariantLimit,
  fitsKitLimit, canAddCartUnit, readStored,
} from "../src/access/policy.js";

const config = () => ({ ...structuredClone(APP_ACCESS), mode: "demo" });
const appConfig = () => {
  const c = config();
  c.mode = "app";
  for (const screen of Object.values(c.screens)) screen.mode = "inherit";
  return c;
};

test("demo applies per-screen restrictions", () => {
  const c = config();
  assert.equal(canUse("inventory", "increase", c), false);
  assert.equal(canUse("inventory", "decrease", c), true);
  assert.equal(canUse("inventory", "restock", c), false);
  assert.equal(canUse("checkout", "confirm", c), true);
  assert.equal(canUse("store", "addToCart", c), true);
});
test("blocked screen denies every configured action", () => {
  const c = config();
  for (const id of Object.keys(c.screens)) {
    c.screens[id].mode = "blocked";
    for (const action of Object.keys(c.screens[id].demo)) assert.equal(canUse(id, action, c), false);
  }
});
test("app restores all existing configured actions", () => {
  const c = appConfig();
  for (const [id, screen] of Object.entries(c.screens)) {
    for (const action of Object.keys(screen.demo)) assert.equal(canUse(id, action, c), true);
  }
  assert.equal(isDemoSession(c), false);
});
test("mixed modes respect overrides without sharing production data", () => {
  const c = appConfig();
  c.screens.inventory.mode = "demo";
  c.screens.checkout.mode = "blocked";
  assert.equal(canUse("inventory", "increase", c), false);
  assert.equal(canUse("cart", "increase", c), true);
  assert.equal(canUse("checkout", "confirm", c), false);
  assert.equal(storageKey("inventory", c), "makeup-demo-inventory");
  // Shared demo cart cannot bypass its limit through an app screen.
  assert.equal(canAddCartUnit([{ quantity: c.demoCartUnits }], c), false);
});
test("unknown screens, invalid modes and undeclared actions fail closed", () => {
  const c = appConfig();
  assert.equal(getScreenMode("missing", c), "blocked");
  assert.equal(getScreenMode("__proto__", c), "blocked");
  assert.equal(canUse("cart", "missing", c), false);
  c.screens.store.mode = "typo";
  assert.equal(getScreenMode("store", c), "blocked");
});
test("kit accepts its exact limit and app removes that limit", () => {
  const c = config();
  assert.equal(fitsKitLimit(Array(3), c), true);
  assert.equal(fitsKitLimit(Array(4), c), false);
  assert.equal(getVariantLimit("setup", appConfig()), Infinity);
  assert.equal(fitsKitLimit(Array(100), appConfig()), true);
});
test("cart counts all units across lines, including increments", () => {
  const c = config();
  assert.equal(canAddCartUnit([{ quantity: 3 }, { quantity: 1 }], c), true);
  assert.equal(canAddCartUnit([{ quantity: 3 }, { quantity: 2 }], c), false);
  assert.equal(canAddCartUnit([{ quantity: 6 }], c), false);
  assert.equal(canAddCartUnit([{ quantity: 100 }], appConfig()), true);
});
test("demo storage does not read production data", () => {
  const storage = new Map([["makeup-user-name", "Original"], ["makeup-inventory", '[{"productId":1,"quantity":99}]']]);
  const adapter = { getItem: (key) => storage.get(key) ?? null };
  assert.equal(readStored(adapter, "user-name", "", config()), "");
  assert.deepEqual(readStored(adapter, "inventory", [], config()), []);
  assert.equal(readStored(adapter, "user-name", "", appConfig()), "Original");
  assert.equal(storageKey("cart", appConfig()), "makeup-cart");
});
test("storage errors and corrupted data fall back without crashing", () => {
  assert.deepEqual(readStored({ getItem: () => "broken" }, "cart", []), []);
  assert.deepEqual(readStored({ getItem: () => '[null]' }, "cart", []), []);
  assert.deepEqual(readStored({ getItem: () => '[{"productId":1,"quantity":-1}]' }, "cart", []), []);
  assert.equal(readStored({ getItem: () => { throw Error("Unavailable"); } }, "user-name", ""), "");
});

test("el easter egg solo reinicia la sesión demo sin borrar la app", () => {
  const c = config();
  const data = new Map([
    ["makeup-demo-user-name", "Prueba"], ["makeup-demo-inventory", "[]"],
    ["makeup-demo-orders", "[]"], ["makeup-demo-cart", "[]"],
    ["makeup-user-name", "Nombre real"], ["otro-dato", "intacto"],
  ]);
  const storage = { removeItem: (key) => data.delete(key) };
  assert.equal(resetDemoStorage(storage, appConfig()), false);
  assert.equal(data.get("makeup-demo-user-name"), "Prueba");
  assert.equal(resetDemoStorage(storage, c), true);
  for (const k of ["makeup-demo-user-name", "makeup-demo-inventory", "makeup-demo-cart", "makeup-demo-orders"]) {
    assert.equal(data.has(k), false);
  }
  assert.equal(data.get("makeup-user-name"), "Nombre real");
  assert.equal(data.get("otro-dato"), "intacto");
});
