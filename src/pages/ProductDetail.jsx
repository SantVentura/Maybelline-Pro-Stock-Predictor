import AccessButton from "../components/AccessButton";
import { canUse } from "../access/policy.js";
import { useState } from "react";

import {
  ArrowLeft,
  Star,
  ShoppingBag,
  MapPin,
  Check,
} from "lucide-react";

import AppHeader from "../components/AppHeader";
import products from "../data/products";
import MaybellineMap from "../components/MaybellineMap";

import "./ProductDetail.css";

function ProductDetail({
  productId,
  initialShadeId = null,
  onShadeChange,
  onNavigate,
  onAddToCart,
  onBuyNow,
  onSelectPickup,
  selectedPickupId,
}) {
  const product = products.find(
    (product) => product.id === productId
  );

  const [selectedShadeId, setSelectedShadeId] =
    useState(
      product?.shades?.some((shade) => shade.id === initialShadeId)
        ? initialShadeId : product?.shades?.[0]?.id ?? null
    );

  const [addedToCart, setAddedToCart] =
    useState(false);

  if (!product) {
    return (
      <main className="product-detail-page">
        <AppHeader
          activePage="store"
          onNavigate={onNavigate}
        />

        <div className="product-detail-empty">
          <h1>Producto no encontrado</h1>

          <button
            type="button"
            onClick={() =>
              onNavigate?.("store")
            }
          >
            Volver a la tienda
          </button>
        </div>
      </main>
    );
  }

  const selectedShade =
    product.shades?.find(
      (shade) =>
        shade.id === selectedShadeId
    ) ?? product.shades?.[0];

  const productImage =
    selectedShade?.image ??
    `https://picsum.photos/seed/detail-${product.id}/800/900`;

  const formatPrice = (price) => {
    return new Intl.NumberFormat(
      "es-CO",
      {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }
    ).format(price);
  };

  const hasDiscount =
    product.oldPrice &&
    product.oldPrice > product.price;

  const discountPercentage =
    hasDiscount
      ? Math.round(
          ((product.oldPrice -
            product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  const handleAddToCart = () => {
    if (!canUse("product-detail", "addToCart")) return;
    if (onAddToCart?.(product, selectedShade?.id) === false) return;

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 1400);
  };

  return (
    <main className="product-detail-page">
      <AppHeader
        activePage="store"
        onNavigate={onNavigate}
      />

      <div className="product-detail-page-content">
        <button
          type="button"
          className="product-detail-back"
          onClick={() =>
            onNavigate?.("store")
          }
        >
          <ArrowLeft size={16} />
          Volver a la tienda
        </button>

        <section className="product-detail-main">
          <div className="product-detail-image">
            {hasDiscount && (
              <span className="product-detail-discount">
                -{discountPercentage}%
              </span>
            )}

            <img
              src={productImage}
              alt={`${product.name} ${
                selectedShade?.name ?? ""
              }`}
            />
          </div>

          <div className="product-detail-content">
            <span className="product-detail-brand">
              {product.brand}
            </span>

            <h1>
              {product.name}
            </h1>

            <div className="product-detail-rating">
              <div>
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={14}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  )
                )}
              </div>

              <span>
                {product.rating}
              </span>
            </div>

            <div className="product-detail-price">
              <strong>
                {formatPrice(
                  product.price
                )}
              </strong>

              {hasDiscount && (
                <span>
                  {formatPrice(
                    product.oldPrice
                  )}
                </span>
              )}
            </div>

            <small className="product-detail-tax">
              IVA incluido
            </small>

            <div className="product-detail-divider" />

            <div className="product-detail-section">
              <span className="product-detail-label">
                TONO
              </span>

              <strong className="product-detail-shade-name">
                {selectedShade?.name}
              </strong>

              <div className="product-detail-shades">
                {product.shades?.map(
                  (shade) => {
                    const isActive =
                      shade.id ===
                      selectedShade?.id;

                    return (
                      <button
                        key={shade.id}
                        type="button"
                        className={`product-detail-shade ${
                          isActive
                            ? "active"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            shade.color,
                        }}
                        title={shade.name}
                        onClick={() => {
                          setSelectedShadeId(shade.id);
                          onShadeChange?.(product.id, shade.id);
                        }}
                      />
                    );
                  }
                )}
              </div>
            </div>

            <div className="product-detail-section">
              <span className="product-detail-label">
                DESCRIPCIÓN
              </span>

              <p className="product-detail-description">
                {product.description ?? "Selecciona tu tono y agrégalo al carrito."}
              </p>
            </div>

            <AccessButton screen="product-detail" action="addToCart"
              type="button"
              className={`product-detail-cart-button ${
                addedToCart
                  ? "is-added"
                  : ""
              }`}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <Check size={17} />
                  Añadido al carrito
                </>
              ) : (
                <>
                  <ShoppingBag
                    size={17}
                  />
                  Agregar al carrito
                </>
              )}
            </AccessButton>
            <AccessButton screen="product-detail" action="buyNow" type="button"
              className="product-detail-cart-button product-detail-buy-now"
              onClick={() => onBuyNow?.(product, selectedShade?.id)}>
              Comprar ahora <ArrowLeft size={16} className="icon-forward" />
            </AccessButton>
          </div>
        </section>

        <section className="product-detail-provider-section">
          <div className="product-detail-provider-heading">
            <div>
              <span>
                MAYBELLINE · DISTRIBUIDORES
              </span>

              <h2>
                Encuentra puntos de venta.
              </h2>

              <p>
                Explora sucursales concretas de comercios que venden Maybelline en Bogotá.
              </p>
            </div>

            <div className="product-detail-provider-icon">
              <MapPin size={22} />
            </div>
          </div>

          <MaybellineMap selectedPickupId={selectedPickupId} onSelectPickup={onSelectPickup} />
        </section>
      </div>
    </main>
  );
}

export default ProductDetail;