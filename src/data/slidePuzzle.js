// Utilidades de la verificación visual simulada. No constituyen protección antibots.
export const clampPuzzleOffset = (value, max) =>
  Math.max(0, Math.min(Math.max(0, max), value));

export const isPuzzleComplete = (value, max) =>
  max > 0 && clampPuzzleOffset(value, max) >= max * 0.93;
