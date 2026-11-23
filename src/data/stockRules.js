export function normalizeMinStock(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 0 && numeric <= 10 ? numeric : 1;
}

export function isLowStock(quantity, minimum) {
  return quantity > 0 && quantity <= normalizeMinStock(minimum);
}

export function needsStockAlert(quantity, minimum) {
  return quantity === 0 || isLowStock(quantity, minimum);
}

// Evita repetir la alerta por cada uso mientras ya está bajo el umbral.
export function shouldShowStockAlert(previous, next, minimum) {
  const limit = normalizeMinStock(minimum);
  return (previous > limit && next <= limit) || (previous > 0 && next === 0);
}
