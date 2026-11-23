import { storageKey } from "../access/policy.js";

export function readOrderHistory(storage) {
  try {
    const raw = storage.getItem(storageKey("orders"));
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((order) =>
      order && typeof order.orderNumber === "string" &&
      typeof order.createdAt === "string" &&
      order.customer && typeof order.customer === "object" &&
      Array.isArray(order.cart) &&
      order.cart.every((item) => item && Number.isInteger(item.productId) &&
        typeof item.shadeId === "string" && Number.isInteger(item.quantity) && item.quantity > 0) &&
      typeof order.totalPrice === "number" && Number.isFinite(order.totalPrice)
    );
  } catch {
    return [];
  }
}

export function saveOrderHistory(storage, orders) {
  try {
    storage.setItem(storageKey("orders"), JSON.stringify(orders));
    return true;
  } catch {
    return false;
  }
}
