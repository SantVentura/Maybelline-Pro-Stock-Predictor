import test from "node:test";
import assert from "node:assert/strict";
import retailPoints from "../src/data/retailPoints.js";
import {
  findFulfillmentPoint, isValidFulfillmentPoint, pointForOrder,
  validOrderFulfillment,
} from "../src/data/fulfillment.js";
import {
  getImmediateDelivery, getUpcomingCycles, getPickupDelivery,
} from "../src/data/deliveryCycles.js";
import { calculateOrderTotals } from "../src/data/orderTotals.js";

const first = retailPoints[0];
const second = retailPoints[1];

test("el checkout permite origen en domicilio inmediato o por ciclos", () => {
  const now = new Date("2026-11-12T14:00:00Z");
  const immediate = getImmediateDelivery(now);
  const cycle = getUpcomingCycles(now, 1)[0];
  assert.ok(cycle);
  assert.equal(validOrderFulfillment(immediate, first.id, null), true);
  assert.equal(validOrderFulfillment(cycle, second.id, null), true);
  assert.equal(validOrderFulfillment(immediate, "", null), false);
  assert.equal(validOrderFulfillment(cycle, "sucursal-inventada", null), false);
});

test("la recogida requiere que el punto coincida con el del ciclo", () => {
  const delivery = getPickupDelivery(first.id);
  assert.equal(validOrderFulfillment(delivery, first.id, first.id), true);
  assert.equal(validOrderFulfillment(delivery, first.id, second.id), false);
  assert.equal(validOrderFulfillment(delivery, second.id, second.id), false);
  assert.equal(validOrderFulfillment(getImmediateDelivery(), first.id, first.id), false);
});

test("el comprobante recupera el origen tanto de pedidos nuevos como anteriores", () => {
  assert.equal(isValidFulfillmentPoint(first.id), true);
  assert.equal(isValidFulfillmentPoint("inexistente"), false);
  assert.equal(findFulfillmentPoint(first.id)?.address, first.address);
  assert.equal(pointForOrder({ fulfillmentPointId: second.id, pickupPointId: first.id })?.id, second.id);
  assert.equal(pointForOrder({ pickupPointId: first.id })?.id, first.id);
});

test("recogida gratis y envío a domicilio mantienen el cálculo único", () => {
  const items = [{ unitPrice: 125000, quantity: 1, oldPrice: 145000 }];
  assert.equal(calculateOrderTotals(items, "pickup").shipping, 0);
  assert.equal(calculateOrderTotals(items, "immediate").shipping, 4500);
  assert.equal(calculateOrderTotals(items, "cycle").shipping, 4500);
});
