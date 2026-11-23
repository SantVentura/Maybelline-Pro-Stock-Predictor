import { storageKey } from "../access/policy.js";

export function readManualProducts(storage) {
  try {
    const value = JSON.parse(storage.getItem(storageKey("manual-products")) ?? "[]");
    return Array.isArray(value) ? value.filter((p) => Number.isInteger(p?.id) && p.id >= 100000 &&
      typeof p.name === "string" && typeof p.brand === "string" &&
      Array.isArray(p.shades) && p.shades.every((shade) => typeof shade.id === "string")) : [];
  } catch { return []; }
}
export function saveManualProducts(storage, products) {
  try { storage.setItem(storageKey("manual-products"), JSON.stringify(products)); return true; }
  catch { return false; }
}
export function createManualProduct(form, existingProducts = []) {
  const name = String(form.name ?? "").trim().slice(0, 90);
  const brand = String(form.brand ?? "").trim().slice(0, 60);
  const shadeName = String(form.shade ?? "").trim().slice(0, 60);
  const description = String(form.description ?? "").trim().slice(0, 300);
  const provider = String(form.provider ?? "").trim().slice(0, 90);
  const quantity = Number(form.quantity);
  const minStock = Number(form.minStock);
  if (!name || !brand || !shadeName || !Number.isInteger(quantity) || quantity < 0 || quantity > 9999 ||
    !Number.isInteger(minStock) || minStock < 0 || minStock > 10) return null;
  const category = ["Rostro", "Ojos", "Labios", "Otros"].includes(form.category) ? form.category : "Otros";
  let id = Math.max(100000, Date.now());
  while (existingProducts.some((product) => product.id === id)) id += 1;
  return { id, name, brand, category, description: description || "Producto añadido por ti al inventario personal.",
    provider: provider || "Registro personal", manual: true, rating: null, price: 0, oldPrice: 0,
    shades: [{ id: `manual-${id}`, name: shadeName, color: form.color || "#d5b5b9", image: "" }],
    inventoryEntry: { productId: id, shadeId: `manual-${id}`, quantity, minStock } };
}
