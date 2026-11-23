// El pago directo usa únicamente el tono elegido. No modifica el carrito normal.
export function createDirectPurchase(product, shadeId) {
  if (!product || !Number.isInteger(product.id) || product.manual ||
    typeof shadeId !== "string" ||
    !product.shades?.some((shade) => shade.id === shadeId)) return null;
  return [{ productId: product.id, shadeId, quantity: 1 }];
}
