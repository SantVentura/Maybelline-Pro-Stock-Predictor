import AccessButton from "../components/AccessButton";
import { useState } from "react";
import ManualProductModal from "../components/ManualProductModal";
import KitProductModal from "../components/KitProductModal";
import {
  AlertTriangle,
  X,
  ShoppingBag,
  PackageOpen,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import products from "../data/products";
import AppHeader from "../components/AppHeader";

import "./Inventory.css";
import { isLowStock, normalizeMinStock } from "../data/stockRules.js";

function Inventory({
  userName,
  inventory,
  manualProducts = [],
  onManualAdd,
  onIncrease,
  onDecrease,
  onMinStockChange,
  onRestock,
  onNavigate,
  stockAlert,
  onCloseStockAlert,
  onAlertRestock,
}) {
  const [manualOpen,setManualOpen] = useState(false);
  const [detailProduct,setDetailProduct] = useState(null);
  const catalog = [...products, ...manualProducts];
  const inventoryProducts = inventory
    .map((item) => {
      const product = catalog.find(
        (product) =>
          product.id === item.productId
      );

      if (!product) return null;

      return {
        ...product,
        quantity: item.quantity,
        minStock: normalizeMinStock(item.minStock),
        selectedShadeId: item.shadeId,
      };
    })
    .filter(Boolean);

  const lowStockProducts =
    inventoryProducts.filter(
      (product) =>
        isLowStock(product.quantity, product.minStock)
    );

  const outOfStockProducts =
    inventoryProducts.filter(
      (product) =>
        product.quantity === 0
    );

  const variantsToRestock = inventoryProducts
    .filter((product) => product.quantity <= product.minStock)
    .sort((a, b) => a.quantity - b.quantity);

  const getAlertTitle = () => {
    if (!stockAlert) return "";

    if (stockAlert.quantity === 0) {
      return "Producto agotado";
    }

    if (stockAlert.quantity === 1) {
      return "Última unidad";
    }

    return "Por agotarse";
  };

  const getAlertText = () => {
    if (!stockAlert) return "";

    const shadeText =
      stockAlert.shadeName
        ? ` · ${stockAlert.shadeName}`
        : "";

    if (stockAlert.quantity === 0) {
      return `Te quedaste sin ${stockAlert.productName}${shadeText}.`;
    }

    if (stockAlert.quantity === 1) {
      return `Te queda 1 unidad de ${stockAlert.productName}${shadeText}.`;
    }

    return `Te quedan ${stockAlert.quantity} unidades de ${stockAlert.productName}${shadeText}.`;
  };

  return (
    <main className="inventory-page">
      <AppHeader
        activePage="inventory"
        onNavigate={onNavigate}
      />

      <div className="inventory-content">
        <p className="inventory-welcome">
          Hola, {userName} 👋
        </p>

        {/* HEADER */}
        <section className="inventory-header">
          <p className="inventory-eyebrow">
            MI KIT
          </p>

          <h1>
            Tu maquillaje, bajo control.
          </h1>

          <p className="inventory-description">
            Aquí puedes ver los productos que
            agregaste a tu inventario.
          </p>
        </section>

        {/* RESUMEN */}
        <section className="inventory-summary">
          <div>
            <strong>
              {inventoryProducts.length}
            </strong>

            <span>
              Productos
            </span>
          </div>

          <div>
            <strong>
              {lowStockProducts.length}
            </strong>

            <span>
              Por agotarse
            </span>
          </div>

          <div>
            <strong>
              {outOfStockProducts.length}
            </strong>

            <span>
              Agotados
            </span>
          </div>
        </section>

        {/* PRIORIDAD DE REPOSICIÓN */}
        {variantsToRestock.length > 0 && (
          <section className="inventory-restock-panel" aria-label="Productos que necesitan reposición">
            <div className="inventory-restock-heading">
              <div>
                <p>REPOSICIÓN RECOMENDADA</p>
                <h2>Estos tonos necesitan atención.</h2>
              </div>
              <span>{variantsToRestock.length} {variantsToRestock.length === 1 ? "variante" : "variantes"}</span>
            </div>
            <div className="inventory-restock-list">
              {variantsToRestock.map((product) => (
                <div className="inventory-restock-row" key={`${product.id}-${product.selectedShadeId}`}>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.shades?.find((shade) => shade.id === product.selectedShadeId)?.name ?? "Sin tono"}
                      {" · "}{product.quantity === 0 ? "Agotado" : `${product.quantity} ${product.quantity === 1 ? "unidad" : "unidades"}`}</span>
                  </div>
                  {!product.manual && <AccessButton screen="inventory" action="restock" type="button"
                    onClick={() => onRestock?.(product)}>Reponer</AccessButton>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PRODUCTOS */}
        <section className="inventory-products">
          <div className="inventory-section-title">
            <h2>
              Mis productos
            </h2>

            <div className="inventory-heading-actions">
              <button type="button" className="inventory-history-button"
                onClick={() => onNavigate?.("orders")}>
                Mis pedidos
              </button>
              <button type="button" className="inventory-add-button" onClick={() => setManualOpen(true)}>
                + Registro manual
              </button>
              <button type="button" className="inventory-add-button"
                onClick={() => onNavigate?.("setup")}>
                + Añadir producto
              </button>
            </div>
          </div>

          {inventoryProducts.length === 0 ? (
            <div className="inventory-empty-state">
              <PackageOpen size={32} aria-hidden="true" />
              <h3>Tu kit espera su primer producto</h3>
              <p>Elige maquillaje del catálogo o registra uno manualmente para comenzar a controlar tus existencias.</p>
              <button type="button" onClick={() => onNavigate?.("setup")}>Explorar productos</button>
            </div>
          ) : <div className="products-grid">
            {inventoryProducts.map(
              (product) => (
                <ProductCard
                  key={`${product.id}-${product.selectedShadeId}`}
                  product={product}
                  mode="inventory"
                  selectedShadeId={
                    product.selectedShadeId
                  }
                  onIncrease={
                    onIncrease
                  }
                  onDecrease={
                    onDecrease
                  }
                  onMinStockChange={onMinStockChange}
                  onUse={
                    onDecrease
                  }
                  onRestock={onRestock}
                  onOpenKitDetail={() => setDetailProduct(product)}
                />
              )
            )}
          </div>}
        </section>
      </div>

      {/* ALERTA DE STOCK */}
      {stockAlert && (
        <div className="stock-alert-overlay">
          <div className="stock-alert-modal">
            <button
              type="button"
              className="stock-alert-close"
              onClick={
                onCloseStockAlert
              }
              aria-label="Cerrar alerta"
            >
              <X size={18} />
            </button>

            <div className="stock-alert-icon">
              <AlertTriangle size={24} />
            </div>

            <p className="stock-alert-eyebrow">
              ALERTA DE INVENTARIO
            </p>

            <h2>
              {getAlertTitle()}
            </h2>

            <p className="stock-alert-text">
              {getAlertText()}
            </p>

            <div className="stock-alert-actions">
              <button
                type="button"
                className="stock-alert-secondary"
                onClick={
                  onCloseStockAlert
                }
              >
                Seguir usando
              </button>

              <AccessButton screen="inventory" action="restock"
                type="button"
                className="stock-alert-primary"
                onClick={
                  onAlertRestock
                }
              >
                <ShoppingBag
                  size={16}
                />
                Reponer ahora
              </AccessButton>
            </div>
          </div>
        </div>
      )}
      {manualOpen && <ManualProductModal onClose={() => setManualOpen(false)} onSave={onManualAdd}/>}
      {detailProduct && <KitProductModal product={detailProduct} onClose={() => setDetailProduct(null)}/>}
    </main>
  );
}

export default Inventory;