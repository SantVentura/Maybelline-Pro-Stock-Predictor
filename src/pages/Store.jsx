import { useEffect, useState } from "react";

import {
  Search,
  Truck,
  CreditCard,
  Bell,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import AppHeader from "../components/AppHeader";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

import "./Store.css";

function Store({
  onNavigate,
  onAddToCart,
  onBuyNow,
  onOpenProduct,
  selectedShades = {},
  onShadeSelect,
  restockProductId,
  restockShadeId,
  onRestockApplied,
}) {
  const initialRestockProduct = products.find((product) => product.id === restockProductId);
  const [search, setSearch] = useState(initialRestockProduct?.name ?? "");
  const [category, setCategory] =
    useState("Todos");


  const categories = [
    "Todos",
    "Rostro",
    "Ojos",
    "Labios",
  ];

  useEffect(() => {
    if (!restockProductId) return;

    const productToRestock = products.find(
      (product) =>
        product.id === restockProductId
    );

    if (!productToRestock) return;

    const frame = requestAnimationFrame(() => {
      document
        .getElementById("catalogo")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      onRestockApplied?.();
    });
    return () => cancelAnimationFrame(frame);
  }, [
    restockProductId,
    restockShadeId,
    onRestockApplied,
  ]);

  const handleShadeSelect = (
    productId,
    shadeId
  ) => {
    onShadeSelect?.(productId, shadeId);
  };

  const filteredProducts = products.filter(
    (product) => {
      const searchText = search
        .trim()
        .toLowerCase();

      const matchesCategory =
        category === "Todos" ||
        product.category === category;

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.brand
          .toLowerCase()
          .includes(searchText) ||
        product.category
          .toLowerCase()
          .includes(searchText);

      return (
        matchesCategory &&
        matchesSearch
      );
    }
  );

  return (
    <main className="store-page">
      <AppHeader
        activePage="store"
        onNavigate={onNavigate}
      />

      <div className="store-content">
        {/* HERO */}
        <section className="store-hero">
          <div className="store-hero-copy">
            <div className="store-hero-badge">
              <Sparkles size={14} />
              BEAUTY STORE
            </div>

            <h1>
              Todo lo que
              <br />
              tu kit necesita.
            </h1>

            <p>
              Descubre productos para reponer,
              completar y llevar tu kit al
              siguiente nivel.
            </p>

            <button
              type="button"
              className="store-hero-button"
              onClick={() => {
                document
                  .getElementById("catalogo")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Explorar productos
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="store-hero-visual">
            <div className="store-hero-circle">
              <span>NEW</span>

              <strong>
                Beauty
                <br />
                Essentials
              </strong>

              <small>
                Para tu kit profesional
              </small>
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="store-benefits">
          <div>
            <Truck size={19} />

            <span>
              <strong>
                Entrega
              </strong>

              Inmediata o por ciclos
            </span>
          </div>

          <div>
            <CreditCard size={19} />

            <span>
              <strong>
                Pago
              </strong>

              Simulación segura
            </span>
          </div>

          <div>
            <Bell size={19} />

            <span>
              <strong>
                Reposición
              </strong>

              Alertas inteligentes
            </span>
          </div>
        </section>

        {/* BUSCADOR Y FILTROS */}
        <section
          className="store-toolbar"
          id="catalogo"
        >
          <div className="store-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar marca o producto..."
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );
              }}
            />
          </div>

          <div className="store-categories">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`store-category ${
                  category === item
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setCategory(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* CATÁLOGO */}
        <section className="store-products">
          <div className="store-section-title">
            <div>
              <p>
                CATÁLOGO
              </p>

              <h2>
                Productos destacados
              </h2>
            </div>

            <span>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "producto"
                : "productos"}
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(
                (product) => {
                  const selectedShadeId =
                    selectedShades[
                      product.id
                    ] ??
                    product.shades?.[0]
                      ?.id ??
                    null;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      mode="store"
                      selectedShadeId={
                        selectedShadeId
                      }
                      onShadeSelect={
                        handleShadeSelect
                      }
                      onOpenDetail={() =>
                        onOpenProduct?.(
                          product.id, selectedShadeId
                        )
                      }
                      onBuy={(product) => onAddToCart?.(product, selectedShadeId)}
                      onBuyNow={(product) => onBuyNow?.(product, selectedShadeId)}
                    />
                  );
                }
              )}
            </div>
          ) : (
            <div className="store-empty">
              <p className="store-empty-title">
                No encontramos productos
              </p>

              <p className="store-empty-text">
                Prueba con otra búsqueda o
                cambia la categoría.
              </p>

              <button
                type="button"
                className="store-empty-button"
                onClick={() => {
                  setSearch("");
                  setCategory("Todos");
                }}
              >
                Ver todos
              </button>
            </div>
          )}
        </section>

        {/* PRÓXIMAMENTE */}
        <section className="store-coming-section">
          <div className="store-coming-heading">
            <p>
              EXPERIENCIA MAYBELLINE
            </p>

            <h2>
              Todo conectado con tu kit.
            </h2>
          </div>

          <div className="store-coming-soon">
            <div>
              <div className="store-coming-icon">
                <CreditCard size={21} />
              </div>

              <h3>
                Pagos reales
              </h3>

              <p>
                Compra tus productos usando
                diferentes métodos de pago.
              </p>

              <span className="coming-badge">
                Próximamente
              </span>
            </div>

            <div>
              <div className="store-coming-icon">
                <Truck size={21} />
              </div>

              <h3>
                Entregas flexibles
              </h3>

              <p>
                Elige entrega inmediata o por ciclos en checkout y consulta el pedido desde Mis pedidos.
              </p>

              <span className="coming-badge">
                Disponible · Simulación
              </span>
            </div>

            <div>
              <div className="store-coming-icon">
                <Bell size={21} />
              </div>

              <h3>
                Reposición inteligente
              </h3>

              <p>
                Configura mínimos por tono, recibe alertas y repón desde Mi Kit.
              </p>

              <span className="coming-badge">
                Disponible
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Store;