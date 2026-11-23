// Los precios del catálogo son precios finales de ejemplo, IVA incluido.
// El 19 % se DESGLOSA (no se añade de nuevo). Los envíos no representan un servicio real.
export const VAT_RATE = 0.19;
export const SHIPPING_FEE = 4500;
export const FREE_SHIPPING_THRESHOLD = 200000;

export const cop = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", maximumFractionDigits: 0,
}).format(Number(value) || 0);

export function calculateOrderTotals(items, deliveryType = "immediate") {
  const lines = Array.isArray(items) ? items : [];
  const productsTotal = lines.reduce((sum, item) => {
    const unitPrice = Number(item.unitPrice ?? item.product?.price ?? item.price ?? 0);
    return sum + Math.max(0, unitPrice) * Math.max(0, Number(item.quantity) || 0);
  }, 0);
  const savings = lines.reduce((sum, item) => {
    const unitPrice = Number(item.unitPrice ?? item.product?.price ?? item.price ?? 0);
    const oldPrice = Number(item.oldPrice ?? item.product?.oldPrice ?? unitPrice);
    return sum + Math.max(0, oldPrice - unitPrice) * Math.max(0, Number(item.quantity) || 0);
  }, 0);
  const pickup = deliveryType === "pickup";
  const shipping = pickup || productsTotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const base = Math.round(productsTotal / (1 + VAT_RATE));
  const iva = productsTotal - base;
  const totalItems = lines.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0);
  return { productsTotal, base, iva, savings, shipping, total: productsTotal + shipping, totalItems,
    freeShipping: shipping === 0 };
}

export function totalsForOrder(order) {
  if (order?.totals && Number.isFinite(order.totals.total)) return order.totals;
  // Compatibilidad con comprobantes guardados por versiones anteriores.
  const items = (order?.cart ?? []).map((item) => ({ ...item, unitPrice: item.unitPrice ?? 0 }));
  const result = calculateOrderTotals(items, "pickup");
  return { ...result, productsTotal: order?.totalPrice ?? result.productsTotal,
    total: order?.totalPrice ?? result.total, shipping: 0, savings: 0,
    base: Math.round((order?.totalPrice ?? result.total) / 1.19),
    iva: (order?.totalPrice ?? result.total) - Math.round((order?.totalPrice ?? result.total) / 1.19) };
}
