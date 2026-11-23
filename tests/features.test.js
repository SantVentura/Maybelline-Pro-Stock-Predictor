import test from "node:test";
import assert from "node:assert/strict";
import { normalizeMinStock, isLowStock, needsStockAlert } from "../src/data/stockRules.js";
import { readOrderHistory, saveOrderHistory } from "../src/data/orderHistory.js";

test("cada tono admite un mínimo de alerta distinto", () => {
  assert.equal(normalizeMinStock(undefined), 1);
  assert.equal(normalizeMinStock(-2), 1);
  assert.equal(normalizeMinStock(3), 3);
  assert.equal(isLowStock(2, 3), true);
  assert.equal(isLowStock(2, 1), false);
  assert.equal(needsStockAlert(0, 0), true);
  assert.equal(needsStockAlert(1, 0), false);
});

test("el historial persiste y se recupera por sesión", () => {
  const map = new Map();
  const storage = { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => map.set(k,v) };
  const order = {
    orderNumber: "MA-123", createdAt: new Date().toISOString(), customer: {name:"Demo"},
    cart: [{productId:1,shadeId:"120",quantity:1,unitPrice:45900}], totalPrice:45900,
  };
  assert.equal(saveOrderHistory(storage,[order]), true);
  assert.deepEqual(readOrderHistory(storage),[order]);
  map.set([...map.keys()][0], "broken");
  assert.deepEqual(readOrderHistory(storage), []);
});

import { shouldShowStockAlert } from "../src/data/stockRules.js";
import { receiveOrderIntoInventory } from "../src/data/receiveOrder.js";
import { getUpcomingCycles, getImmediateDelivery, isImmediateDelivery, deliveryMethodLabel, formatDeliveryEstimate, isValidDeliveryCycle } from "../src/data/deliveryCycles.js";

test("solo alerta al cruzar el umbral o agotarse", () => {
  assert.equal(shouldShowStockAlert(4, 3, 3), true);
  assert.equal(shouldShowStockAlert(3, 2, 3), false);
  assert.equal(shouldShowStockAlert(2, 1, 3), false);
  assert.equal(shouldShowStockAlert(1, 0, 3), true);
  assert.equal(shouldShowStockAlert(1, 0, 0), true);
});

test("los ciclos se calculan en fechas futuras y validas", () => {
  const when = new Date(2026, 9, 23, 10); // viernes a las 10, siguiente es martes
  const cycles = getUpcomingCycles(when);
  assert.equal(cycles.length, 3);
  assert.ok(cycles.every((c) => isValidDeliveryCycle(c)));
  assert.ok(cycles.every((c) => new Date(c.dispatchDate) > when));
  assert.equal(isValidDeliveryCycle({ id: "1", dispatchDate: "x", estimatedDate: "z" }), false);
});

test("al recibir suma cantidad por tono y crea variantes faltantes", () => {
  const before = [{ productId: 1, shadeId: "120", quantity: 1, minStock: 3 }];
  const order = { status: "scheduled", cart: [
    { productId: 1, shadeId: "120", quantity: 2 },
    { productId: 1, shadeId: "125", quantity: 1 },
  ] };
  const after = receiveOrderIntoInventory(before, order);
  assert.equal(after[0].quantity, 3);
  assert.equal(after[0].minStock, 3);
  assert.deepEqual(after[1], { productId: 1, shadeId: "125", quantity: 1, minStock: 1 });
  assert.equal(before[0].quantity, 1);
  assert.deepEqual(receiveOrderIntoInventory(after, { ...order, status: "received" }), after);
});

test("la entrega inmediata se puede registrar y distinguir de los ciclos", () => {
  const from = new Date(2026, 9, 23, 12);
  const immediate = getImmediateDelivery(from);
  assert.equal(immediate.id, "immediate");
  assert.equal(immediate.type, "immediate");
  assert.equal(new Date(immediate.estimatedDate).getTime() - from.getTime(), 3 * 60 * 60 * 1000);
  assert.equal(isValidDeliveryCycle(immediate), true);
  assert.equal(isImmediateDelivery(immediate), true);
  assert.equal(deliveryMethodLabel(immediate), "Entrega inmediata");
  assert.ok(formatDeliveryEstimate(immediate).length > 5);
  const cycle = getUpcomingCycles(from)[0];
  assert.equal(cycle.type, "cycle");
  assert.equal(deliveryMethodLabel(cycle), "Entrega por ciclos");
  assert.equal(isValidDeliveryCycle({ ...immediate, id: "other" }), false);
});
