import { APP_ACCESS } from "../config/access.js";

export const ACTION_LABELS = {
  saveName: "Guardar nombre", select: "Seleccionar productos", save: "Guardar kit",
  increase: "Aumentar unidades", decrease: "Reducir unidades / usar producto",
  restock: "Reponer productos", setMinStock: "Configurar alerta mínima", addToCart: "Añadir al carrito",
  buyNow: "Comprar ahora", manualAdd: "Registrar producto manualmente",
  remove: "Eliminar del carrito", receive: "Marcar pedido como recibido", confirm: "Confirmar pedido", print: "Imprimir comprobante",
};

export function getScreenMode(screen, config = APP_ACCESS) {
  const entry = Object.hasOwn(config.screens, screen) ? config.screens[screen] : null;
  if (!entry) return "blocked";
  const mode = entry.mode === "inherit" ? config.mode : entry.mode;
  return ["app", "demo", "blocked"].includes(mode) ? mode : "blocked";
}

export function canUse(screen, action, config = APP_ACCESS) {
  const mode = getScreenMode(screen, config);
  const actions = config.screens[screen]?.demo;
  if (!actions || !Object.hasOwn(actions, action)) return false;
  return mode === "app" || (mode === "demo" && actions[action] === true);
}

export function isDemoSession(config = APP_ACCESS) {
  return config.mode === "demo" || Object.keys(config.screens).some(
    (screen) => getScreenMode(screen, config) === "demo"
  );
}

export function storageKey(name, config = APP_ACCESS) {
  return `makeup-${isDemoSession(config) ? "demo-" : ""}${name}`;
}

export function getVariantLimit(screen = "setup", config = APP_ACCESS) {
  return getScreenMode(screen, config) === "demo"
    ? config.screens[screen]?.limits?.variants ?? Infinity : Infinity;
}

export function fitsKitLimit(items, config = APP_ACCESS) {
  return items.length <= getVariantLimit("setup", config);
}

export function canAddCartUnit(cart, config = APP_ACCESS) {
  return !isDemoSession(config) || cart.reduce((sum, item) => sum + item.quantity, 0) < config.demoCartUnits;
}

export function readStored(storage, name, fallback, config = APP_ACCESS) {
  try {
    const value = storage.getItem(storageKey(name, config));
    if (value === null) return fallback;
    if (typeof fallback === "string") return value;
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) =>
      item && Number.isInteger(item.productId) && Number.isInteger(item.quantity) && item.quantity >= 0
    ) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
