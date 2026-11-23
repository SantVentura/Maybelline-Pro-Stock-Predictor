import { canUse, getVariantLimit } from "../access/policy.js";
import AccessButton from "../components/AccessButton";
import { useState } from "react";
import ManualProductModal from "../components/ManualProductModal";
import { Search } from "lucide-react";

import AppHeader from "../components/AppHeader";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import "./SetupInventory.css";

function SetupInventory({
  initialInventory = [],
  onContinue,
  onRestricted,
  onManualAdd,
  onProductAdded,
}) {
  const [selectedProducts, setSelectedProducts] =
    useState(initialInventory);

  const [search, setSearch] = useState("");
  const [manualOpen, setManualOpen] = useState(false);

  const [activeShades, setActiveShades] =
    useState(() => {
      const initial = {};

      products.forEach((product) => {
        initial[product.id] =
          product.shades?.[0]?.id ?? null;
      });

      initialInventory.forEach((item) => {
        initial[item.productId] =
          item.shadeId ??
          initial[item.productId];
      });

      return initial;
    });

  const toggleProduct = (
    productId,
    shadeId
  ) => {
    if (!canUse("setup", "select")) return;
    const removing = selectedProducts.some((item) => item.productId === productId && item.shadeId === shadeId);
    if (!removing && selectedProducts.length >= getVariantLimit()) {
      onRestricted?.(`El kit demo permite hasta ${getVariantLimit()} variantes. Quita una para probar otra.`);
      return;
    }
    if (!removing) onProductAdded?.(products.find((p) => p.id === productId)?.name ?? "Producto");
    setSelectedProducts((current) => {
      const exists = current.some(
        (item) =>
          item.productId === productId &&
          item.shadeId === shadeId
      );

      if (exists) {
        return current.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.shadeId === shadeId
            )
        );
      }

      return [
        ...current,
        {
          productId,
          shadeId,
          quantity: 1,
          minStock: 1,
        },
      ];
    });
  };

  const handleShadeSelect = (
    productId,
    shadeId
  ) => {
    setActiveShades((current) => ({
      ...current,
      [productId]: shadeId,
    }));
  };

  const filteredProducts = products.filter(
    (product) => {
      const searchText = search
        .trim()
        .toLowerCase();

      return (
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.brand
          .toLowerCase()
          .includes(searchText) ||
        product.category
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  return (
    <main className="setup-page">
      <AppHeader showProgress />

      <section className="setup-content">
        <div className="setup-intro">
          <p className="setup-eyebrow">
            CREA TU INVENTARIO
          </p>

          <h1>
            Construyamos
            <br />
            tu kit.
          </h1>

          <p>
            Selecciona los productos que tienes
            actualmente en tu kit de maquillaje.
          </p>
        </div>

        <div className="setup-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <div className="selected-counter">
            <strong>
              {selectedProducts.length}
            </strong>

            <span>
              seleccionados
            </span>
          </div>
        </div>

        <div className="manual-register-row">
          <span>¿No encuentras tu producto?</span>
          <button type="button" onClick={() => setManualOpen(true)}>+ Registrarlo manualmente</button>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="setup-search-empty">
            <h2>No encontramos ese maquillaje</h2>
            <p>Prueba otra búsqueda o registra tu propio producto.</p>
            <button type="button" onClick={() => setSearch("")}>Ver todos los productos</button>
          </div>
        ) : <div className="products-grid">
          {filteredProducts.map(
            (product) => {
              const currentShadeId =
                activeShades[product.id] ??
                product.shades?.[0]?.id ??
                null;

              const isSelected =
                selectedProducts.some(
                  (item) =>
                    item.productId ===
                      product.id &&
                    item.shadeId ===
                      currentShadeId
                );

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  mode="setup"
                  selected={isSelected}
                  selectedShadeId={
                    currentShadeId
                  }
                  onSelect={
                    toggleProduct
                  }
                  onShadeSelect={
                    handleShadeSelect
                  }
                />
              );
            }
          )}
        </div>}
      </section>

      <footer className="setup-footer">
        <AccessButton screen="setup" action="save"
          className="continue-button"
          disabled={
            selectedProducts.length === 0 || selectedProducts.length > getVariantLimit()
          }
          onClick={() =>
            onContinue(
              selectedProducts
            )
          }
        >
          <span>
            Guardar kit

            {selectedProducts.length > 0 &&
              ` · ${selectedProducts.length}`}
          </span>
        </AccessButton>
      </footer>
      {manualOpen && <ManualProductModal onClose={() => setManualOpen(false)} onSave={(data) => {
        const entry = onManualAdd?.(data);
        if (entry) setSelectedProducts((current) => [...current.filter((item) =>
          !(item.productId === entry.productId && item.shadeId === entry.shadeId)), entry]);
        return entry;
      }}/>} 
    </main>
  );
}

export default SetupInventory;