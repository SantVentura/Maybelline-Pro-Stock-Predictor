// Función pura: suma cada variante comprada a su inventario, o la crea si falta.
// La protección contra aplicar dos veces el pedido se gestiona con su estado.
export function receiveOrderIntoInventory(inventory, order) {
  if (!order || !Array.isArray(order.cart) || order.status === "received") return inventory;
  const next = inventory.map((item) => ({ ...item }));
  for (const item of order.cart) {
    if (!Number.isInteger(item.productId) || typeof item.shadeId !== "string" ||
      !Number.isInteger(item.quantity) || item.quantity <= 0) continue;
    const existing = next.find((stored) => stored.productId === item.productId && stored.shadeId === item.shadeId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      next.push({ productId: item.productId, shadeId: item.shadeId, quantity: item.quantity, minStock: 1 });
    }
  }
  return next;
}
