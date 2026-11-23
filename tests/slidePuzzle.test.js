import test from "node:test";
import assert from "node:assert/strict";
import { clampPuzzleOffset, isPuzzleComplete } from "../src/data/slidePuzzle.js";

test("el desplazamiento se limita al espacio disponible", () => {
  assert.equal(clampPuzzleOffset(-20, 300), 0);
  assert.equal(clampPuzzleOffset(150, 300), 150);
  assert.equal(clampPuzzleOffset(480, 300), 300);
});

test("solo se completa el puzle al llegar al extremo derecho", () => {
  assert.equal(isPuzzleComplete(0, 300), false);
  assert.equal(isPuzzleComplete(260, 300), false);
  assert.equal(isPuzzleComplete(279, 300), true);
  assert.equal(isPuzzleComplete(100, 0), false);
});
