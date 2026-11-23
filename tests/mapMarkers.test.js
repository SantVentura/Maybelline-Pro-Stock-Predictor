import test from "node:test";
import assert from "node:assert/strict";
import retailPoints from "../src/data/retailPoints.js";
import { featuredPointIds, isFeaturedPoint, visibleMarkerIds } from "../src/data/mapMarkers.js";

test("el mapa inicia solamente con tres marcadores fijos", () => {
  assert.equal(retailPoints.length, 50);
  assert.equal(featuredPointIds.length, 3);
  assert.deepEqual(visibleMarkerIds(), featuredPointIds);
});

test("la selección de un punto fijo no crea un cuarto marcador", () => {
  for (const id of featuredPointIds) {
    assert.equal(isFeaturedPoint(id), true);
    assert.deepEqual(visibleMarkerIds(id), featuredPointIds);
  }
});

test("una sucursal adicional aparece como único marcador temporal", () => {
  const extra = retailPoints[10].id;
  assert.equal(isFeaturedPoint(extra), false);
  assert.deepEqual(visibleMarkerIds(extra), [...featuredPointIds, extra]);
  const other = retailPoints[20].id;
  assert.deepEqual(visibleMarkerIds(other), [...featuredPointIds, other]);
  assert.equal(visibleMarkerIds(other).includes(extra), false);
});

test("los puntos inexistentes no se muestran", () => {
  assert.deepEqual(visibleMarkerIds("punto-inexistente"), featuredPointIds);
});
