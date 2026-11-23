import "./components/ProductAddedNotice.css";
import "./components/CartNotice.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Checkout from "./pages/Checkout";
import UserSetup from "./pages/UserSetup";
import Welcome from "./pages/Welcome";
import SetupInventory from "./pages/SetupInventory";
import Inventory from "./pages/Inventory";
import Store from "./pages/Store";
import Cart from "./pages/Cart";
import Invoice from "./pages/Invoice";
import ProductDetail from "./pages/ProductDetail";
import ScreenAccess from "./components/ScreenAccess";
import products from "./data/products";
import OrderHistory from "./pages/OrderHistory";
import { normalizeMinStock, shouldShowStockAlert } from "./data/stockRules.js";
import { receiveOrderIntoInventory } from "./data/receiveOrder.js";
import { isValidDeliveryCycle } from "./data/deliveryCycles.js";
import { calculateOrderTotals } from "./data/orderTotals.js";
import { readManualProducts, saveManualProducts, createManualProduct } from "./data/manualProducts.js";
import { validOrderFulfillment, findFulfillmentPoint } from "./data/fulfillment.js";
import { createDirectPurchase } from "./data/directPurchase.js";
import { readOrderHistory, saveOrderHistory } from "./data/orderHistory.js";
import { APP_ACCESS } from "./config/access.js";
import {
  ACTION_LABELS, canUse, canAddCartUnit, fitsKitLimit,
  getVariantLimit, isDemoSession, readStored, storageKey,
} from "./access/policy.js";

const demoInventory = [
  { productId: 1, shadeId: "120", quantity: 3, minStock: 1 },
  { productId: 4, shadeId: "Dark", quantity: 2, minStock: 1 },
];

function App() {
  const [userName, setUserName] = useState(() => readStored(localStorage, "user-name", ""));
  const [screen, setScreen] = useState(() =>
    readStored(localStorage, "user-name", "") ? "welcome" : "user-setup"
  );
  const [inventory, setInventory] = useState(() =>
    readStored(localStorage, "inventory", isDemoSession() ? demoInventory : [])
  );
  const [cart, setCart] = useState(() => readStored(localStorage, "cart", []));
  const [manualProducts, setManualProducts] = useState(() => readManualProducts(localStorage));
  const [directCheckout, setDirectCheckout] = useState(null);
  const [pickupPointId, setPickupPointId] = useState("");
  const [toast, setToast] = useState("");
  const [productAdded, setProductAdded] = useState("");
  const catalog = [...products, ...manualProducts];
  const [orders, setOrders] = useState(() => readOrderHistory(localStorage));
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);
  const [restockProductId, setRestockProductId] = useState(null);
  const [restockShadeId, setRestockShadeId] = useState(null);
  const [stockAlert, setStockAlert] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedShadeId, setSelectedShadeId] = useState(null);
  const [storeSelectedShades, setStoreSelectedShades] = useState({});
  // Guardia inmediata contra doble clic sobre un pedido recibido.
  const receivedOrderIds = useRef(new Set(orders.filter((item) => item.status === "received").map((item) => item.orderNumber)));
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try { localStorage.setItem(storageKey("inventory"), JSON.stringify(inventory)); }
    catch { /* La sesión sigue funcionando si el navegador no permite guardar. */ }
  }, [inventory]);
  useEffect(() => {
    try { localStorage.setItem(storageKey("cart"), JSON.stringify(cart)); }
    catch { /* La sesión sigue funcionando si el navegador no permite guardar. */ }
  }, [cart]);
  useEffect(() => {
    saveOrderHistory(localStorage, orders);
  }, [orders]);
  useEffect(() => { saveManualProducts(localStorage, manualProducts); }, [manualProducts]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!productAdded) return undefined;
    const timer = setTimeout(() => setProductAdded(""), 2800);
    return () => clearTimeout(timer);
  }, [productAdded]);

  const navigate = (target) => {
    setNotice("");
    setStockAlert(null);
    if (target === "checkout" && screen !== "store" && screen !== "product-detail") setDirectCheckout(null);
    setScreen(target);
  };

  // Los permisos también se comprueban en las acciones, además de los botones.
  const allow = (source, action) => {
    if (screen === source && canUse(source, action)) return true;
    setNotice(`${ACTION_LABELS[action] ?? action}: función restringida en esta versión.`);
    return false;
  };
  const allowCartGrowth = () => {
    if (canAddCartUnit(cart)) return true;
    setNotice(`El carrito demo permite hasta ${APP_ACCESS.demoCartUnits} unidades en total.`);
    return false;
  };

  const handleUserSetup = (name) => {
    if (!allow("user-setup", "saveName") || !name.trim()) return false;
    setUserName(name.trim());
    try { localStorage.setItem(storageKey("user-name"), name.trim()); }
    catch { /* Conservamos el nombre en memoria. */ }
    navigate("welcome");
    return true;
  };

  const handleInventorySetup = (selectedProducts) => {
    if (!allow("setup", "save")) return false;
    if (!fitsKitLimit(selectedProducts)) {
      setNotice(`El kit demo permite hasta ${getVariantLimit()} variantes.`);
      return false;
    }
    setInventory(selectedProducts);
    setToast("Kit guardado correctamente");
    navigate("inventory");
    return true;
  };

  const handleManualAdd = (form) => {
    if (!canUse(screen, "manualAdd") || !["inventory", "setup"].includes(screen)) return null;
    const created = createManualProduct(form, manualProducts);
    if (!created) return null;
    const { inventoryEntry, ...product } = created;
    setManualProducts((current) => [...current, product]);
    setInventory((current) => [...current, inventoryEntry]);
    setProductAdded(product.name);
    return inventoryEntry;
  };
  const productAddedNotice = (productName) => setProductAdded(productName);

  const updateMinStock = (productId, shadeId, nextMinimum) => {
    if (!allow("inventory", "setMinStock")) return false;
    const minimum = Number(nextMinimum);
    if (!Number.isInteger(minimum) || minimum < 0 || minimum > 10) return false;
    setInventory((current) => current.map((item) =>
      item.productId === productId && item.shadeId === shadeId
        ? { ...item, minStock: minimum } : item
    ));
    return true;
  };

  const increaseQuantity = (productId, shadeId) => {
    if (!allow("inventory", "increase")) return false;
    setInventory((current) => current.map((item) =>
      item.productId === productId && item.shadeId === shadeId
        ? { ...item, quantity: item.quantity + 1 } : item
    ));
    return true;
  };

  const decreaseQuantity = (productId, shadeId) => {
    if (!allow("inventory", "decrease")) return false;
    const item = inventory.find((entry) => entry.productId === productId && entry.shadeId === shadeId);
    if (!item || item.quantity === 0) return false;
    const quantity = item.quantity - 1;
    setInventory((current) => current.map((entry) =>
      entry.productId === productId && entry.shadeId === shadeId ? { ...entry, quantity } : entry
    ));
    if (shouldShowStockAlert(item.quantity, quantity, normalizeMinStock(item.minStock))) {
      const product = catalog.find((entry) => entry.id === productId);
      setStockAlert({ productId, shadeId, productName: product?.name ?? "Producto",
        shadeName: product?.shades?.find((shade) => shade.id === shadeId)?.name ?? "", quantity });
    }
    return true;
  };

  const handleRestock = (product) => {
    if (!allow("inventory", "restock")) return false;
    if (product.manual) { setToast("Producto personal: no disponible en la tienda de Maybelline."); return false; }
    setRestockProductId(product.id);
    setRestockShadeId(product.selectedShadeId ?? null);
    if (product.selectedShadeId) {
      setStoreSelectedShades((current) => ({ ...current, [product.id]: product.selectedShadeId }));
    }
    navigate("store");
    return true;
  };
  const handleAlertRestock = () => {
    if (stockAlert) handleRestock({ id: stockAlert.productId, selectedShadeId: stockAlert.shadeId });
  };
  const clearRestockProduct = useCallback(() => {
    setRestockProductId(null);
    setRestockShadeId(null);
  }, []);
  const handleStoreShadeSelect = useCallback((productId, shadeId) => {
    setStoreSelectedShades((current) => current[productId] === shadeId
      ? current : { ...current, [productId]: shadeId });
  }, []);
  const handleOpenProduct = (productId, shadeId) => {
    setSelectedProductId(productId);
    setSelectedShadeId(shadeId ?? storeSelectedShades[productId] ?? null);
    navigate("product-detail");
  };

  const buyNow = (product, shadeId) => {
    if (!["store", "product-detail"].includes(screen) || !allow(screen, "buyNow")) return false;
    const direct = createDirectPurchase(product, shadeId);
    if (!direct) return false;
    setDirectCheckout(direct);
    navigate("checkout");
    return true;
  };

  const addToCart = (product, shadeId) => {
    if (!["store", "product-detail"].includes(screen) || !allow(screen, "addToCart") || !allowCartGrowth()) return false;
    setCart((current) => {
      if (!canAddCartUnit(current)) return current;
      const exists = current.some((item) => item.productId === product.id && item.shadeId === shadeId);
      return exists ? current.map((item) => item.productId === product.id && item.shadeId === shadeId
        ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { productId: product.id, shadeId, quantity: 1 }];
    });
    const shadeName = product.shades?.find((shade) => shade.id === shadeId)?.name ?? "Presentación única";
    setToast({ type: "cart", title: "Producto añadido al carrito", detail: `${product.name} · ${shadeName}` });
    return true;
  };
  const increaseCartQuantity = (productId, shadeId) => {
    if (!allow("cart", "increase") || !allowCartGrowth()) return false;
    setCart((current) => !canAddCartUnit(current) ? current : current.map((item) =>
      item.productId === productId && item.shadeId === shadeId ? { ...item, quantity: item.quantity + 1 } : item
    ));
    return true;
  };
  const decreaseCartQuantity = (productId, shadeId) => {
    if (!allow("cart", "decrease")) return false;
    setCart((current) => current.map((item) => item.productId === productId && item.shadeId === shadeId
      ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0));
    return true;
  };
  const removeFromCart = (productId, shadeId) => {
    if (!allow("cart", "remove")) return false;
    setCart((current) => current.filter((item) => !(item.productId === productId && item.shadeId === shadeId)));
    return true;
  };
  const completeOrder = (orderData) => {
    const activeCart = directCheckout ?? cart;
    if (!allow("checkout", "confirm") || activeCart.length === 0 || !isValidDeliveryCycle(orderData?.deliveryCycle)) return false;
    if (!["pse", "card", "cash"].includes(orderData?.paymentMethod)) return false;
    if (!validOrderFulfillment(orderData.deliveryCycle,
      orderData.fulfillmentPointId, orderData.pickupPointId)) return false;
    const snapshot = activeCart.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const shade = product?.shades?.find((s) => s.id === item.shadeId);
      return {
        ...item, unitPrice: product?.price ?? 0, oldPrice: product?.oldPrice ?? product?.price ?? 0,
        productName: product?.name ?? "Producto", brandName: product?.brand ?? "Maybelline",
        shadeName: shade?.name ?? "",
      };
    });
    const totals = calculateOrderTotals(snapshot, orderData.deliveryCycle.type);
    const newOrder = {
      ...orderData,
      fulfillmentPoint: (() => {
        const point = findFulfillmentPoint(orderData.fulfillmentPointId);
        return { id: point.id, name: point.name, address: point.address, retailer: point.retailer };
      })(),
      status: "scheduled", cart: snapshot, totals,
      totalItems: totals.totalItems, totalPrice: totals.total,
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(), orderNumber: `MA-${Date.now()}`,
    };
    setOrders((current) => [newOrder, ...current]);
    setSelectedOrderNumber(newOrder.orderNumber);
    if (!directCheckout) setCart([]);
    setDirectCheckout(null);
    return newOrder;
  };

  const receiveOrder = (orderNumber) => {
    if (!allow("orders", "receive")) return false;
    const order = orders.find((item) => item.orderNumber === orderNumber);
    if (!order || order.status === "received" || receivedOrderIds.current.has(orderNumber)) return false;
    receivedOrderIds.current.add(orderNumber);
    setInventory((current) => receiveOrderIntoInventory(current, order));
    setOrders((current) => current.map((item) => item.orderNumber === orderNumber
      ? { ...item, status: "received", receivedAt: new Date().toISOString() } : item));
    return true;
  };

  const openOrder = (orderNumber) => {
    setSelectedOrderNumber(orderNumber);
    navigate("invoice");
  };

  const renderScreen = () => {
    switch (screen) {
      case "user-setup": return <UserSetup onContinue={handleUserSetup} />;
      case "welcome": return <Welcome userName={userName} onStart={() => navigate("setup")} />;
      case "setup": return <SetupInventory initialInventory={inventory} onContinue={handleInventorySetup}
        onManualAdd={handleManualAdd} onProductAdded={productAddedNotice} onRestricted={setNotice} />;
      case "inventory": return <Inventory userName={userName} inventory={inventory} manualProducts={manualProducts}
        onManualAdd={handleManualAdd}
        onIncrease={increaseQuantity} onDecrease={decreaseQuantity} onMinStockChange={updateMinStock} onRestock={handleRestock}
        onNavigate={navigate} stockAlert={stockAlert} onCloseStockAlert={() => setStockAlert(null)}
        onAlertRestock={handleAlertRestock} />;
      case "store": return <Store onNavigate={navigate} onAddToCart={addToCart} onBuyNow={buyNow}
        onOpenProduct={handleOpenProduct} selectedShades={storeSelectedShades}
        onShadeSelect={handleStoreShadeSelect} restockProductId={restockProductId}
        restockShadeId={restockShadeId} onRestockApplied={clearRestockProduct} />;
      case "product-detail": return <ProductDetail key={selectedProductId} productId={selectedProductId}
        initialShadeId={selectedShadeId} onShadeChange={handleStoreShadeSelect}
        onNavigate={navigate} onAddToCart={addToCart} onBuyNow={buyNow}
        onSelectPickup={(pointId) => { setPickupPointId(pointId); setToast("Punto de recogida seleccionado"); }}
        selectedPickupId={pickupPointId} />;
      case "cart": return <Cart cart={cart} onNavigate={navigate} onIncreaseCart={increaseCartQuantity}
        onDecreaseCart={decreaseCartQuantity} onRemoveFromCart={removeFromCart} />;
      case "checkout": return <Checkout userName={userName} cart={directCheckout ?? cart}
        isDirectPurchase={Boolean(directCheckout)} initialPickupPointId={pickupPointId}
        onNavigate={navigate} onCompleteOrder={completeOrder} />;
      case "invoice": return <Invoice
        order={orders.find((item) => item.orderNumber === selectedOrderNumber) ?? orders[0] ?? null}
        onNavigate={navigate} />;
      case "orders": return <OrderHistory orders={orders} onNavigate={navigate}
        onViewOrder={openOrder} onReceiveOrder={receiveOrder} />;
      default: return null;
    }
  };
  return <ScreenAccess screen={screen} onNavigate={navigate} notice={notice} onDismiss={() => setNotice("")}>
    {renderScreen()}
    {toast && <div className={`app-toast ${typeof toast === "object" ? "app-toast-cart" : ""}`} role="status" aria-live="polite">
      <span className="app-toast-check" aria-hidden="true">✓</span>
      <div className="app-toast-copy">
        <strong>{typeof toast === "object" ? toast.title : toast}</strong>
        {typeof toast === "object" && <span>{toast.detail}</span>}
      </div>
      <button type="button" onClick={() => setToast("")} aria-label="Cerrar aviso">×</button>
    </div>}
    {productAdded && <div className="product-added-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setProductAdded("");
    }}>
      <section className="product-added-popup" role="dialog" aria-modal="true" aria-labelledby="product-added-title">
        <span className="product-added-check" aria-hidden="true">✓</span>
        <h2 id="product-added-title">Producto añadido</h2>
        <p><strong>{productAdded}</strong> se agregó correctamente a Mi Kit.</p>
        <button type="button" onClick={() => setProductAdded("")}>Entendido</button>
      </section>
    </div>}
  </ScreenAccess>;
}
export default App;
