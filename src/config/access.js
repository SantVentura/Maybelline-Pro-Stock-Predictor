// Cambia SOLO `mode` entre "demo" y "app" para elegir la experiencia general.
// Las pantallas pueden usar "inherit" (hereda mode), "demo", "app" o "blocked".
// "app" habilita las funciones de la aplicación, pero NO activa pagos reales.
export const APP_ACCESS = {
  mode: "app", // Cambia a "demo" para habilitar restricciones de presentación.
  screens: {
    "user-setup": {
      label: "Tu nombre", mode: "inherit",
      demo: { saveName: true },
    },
    welcome: { label: "Bienvenida", mode: "inherit", demo: {} },
    setup: {
      label: "Crear kit", mode: "inherit",
      demo: { select: true, save: true, manualAdd: true },
      limits: { variants: 3 },
    },
    inventory: {
      label: "Mi Kit", mode: "inherit",
      demo: { increase: false, decrease: true, restock: false, setMinStock: true, manualAdd: true },
    },
    store: {
      label: "Tienda", mode: "inherit",
      demo: { addToCart: true, buyNow: true },
    },
    "product-detail": {
      label: "Detalle del producto", mode: "inherit",
      demo: { addToCart: true, buyNow: true },
    },
    cart: {
      label: "Carrito", mode: "inherit",
      demo: { increase: true, decrease: true, remove: true },
    },
    checkout: {
      label: "Finalizar pedido", mode: "inherit",
      demo: { confirm: true},
    },
    invoice: {
      label: "Comprobante", mode: "inherit",
      demo: { print: true },
    },
    orders: {
      label: "Mis pedidos", mode: "inherit",
      demo: { receive: true },
    },
  },
  demoCartUnits: 5,
};
