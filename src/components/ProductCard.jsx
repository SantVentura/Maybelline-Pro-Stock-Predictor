import AccessButton from "../components/AccessButton";
import { canUse } from "../access/policy.js";
import { normalizeMinStock, isLowStock } from "../data/stockRules.js";
import { useState } from "react";

import {
  Check,
  Star,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import "../pages/Store.css";

function ProductCard({
  product,
  mode = "store",
  selected = false,
  selectedShadeId = null,
  onSelect,
  onShadeSelect,
  onBuy,
  onBuyNow,
  onOpenDetail,
  onOpenKitDetail,
  onRestock,
  onIncrease,
  onDecrease,
  onMinStockChange,
  onUse,
}) {
  const [addedToCart, setAddedToCart] =
    useState(false);

  const selectedShade =
    product.shades?.find(
      (shade) =>
        shade.id === selectedShadeId
    ) ?? product.shades?.[0];

  const handleAction = () => {
    if (mode === "setup" && onSelect && canUse("setup", "select")) {
      onSelect(
        product.id,
        selectedShade?.id
      );
    }

    if (mode === "store" && onBuy && canUse("store", "addToCart")) {
      if (onBuy(product) === false) return;

      setAddedToCart(true);

      setTimeout(() => {
        setAddedToCart(false);
      }, 1400);
    }
  };

  const productImage = selectedShade?.image || (product.manual ? "/manual-product.svg" :
    `https://picsum.photos/seed/product-${product.id}/600/700`);

  const stockStatus =
    product.quantity === 0
      ? "Agotado"
      : isLowStock(product.quantity, product.minStock)
        ? "Por agotarse"
        : "Disponible";

  const stockClass =
    product.quantity === 0
      ? "out"
      : isLowStock(product.quantity, product.minStock)
        ? "low"
        : "available";

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined
    ) {
      return "";
    }

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
    mode === "store" &&
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

  return (
    <article
      className={`product-card ${
        selected
          ? "is-selected"
          : ""
      }`}
    >
      {/* IMAGEN */}
      {mode === "store" &&
      onOpenDetail ? (
        <button
          type="button"
          className="product-card-image product-card-image-button"
          onClick={onOpenDetail}
          aria-label={`Ver detalles de ${product.name}`}
        >
          {hasDiscount && (
            <span className="store-discount-badge">
              -{discountPercentage}%
            </span>
          )}

          <img
            src={productImage}
            alt={`${product.name} ${
              selectedShade?.name ?? ""
            }`}
            className="product-card-photo"
          />
        </button>
      ) : mode === "inventory" && onOpenKitDetail ? (
        <button type="button" className="product-card-image product-card-image-button" onClick={onOpenKitDetail}
          aria-label={`Ver detalles en Mi Kit de ${product.name}`}>
          <img src={productImage} alt={product.name} className="product-card-photo"/>
        </button>
      ) : (
        <div className="product-card-image">
          {mode === "store" &&
            hasDiscount && (
              <span className="store-discount-badge">
                -{discountPercentage}%
              </span>
            )}

          <img
            src={productImage}
            alt={`${product.name} ${
              selectedShade?.name ?? ""
            }`}
            className="product-card-photo"
          />
        </div>
      )}

      {/* INFORMACIÓN */}
      <div className="product-card-content">
        <span className="product-card-brand">
          {product.brand}
        </span>

        {mode === "store" &&
        onOpenDetail ? (
          <button
            type="button"
            className="product-card-name product-card-name-button"
            onClick={onOpenDetail}
          >
            {product.name}
          </button>
        ) : mode === "inventory" && onOpenKitDetail ? (
          <button type="button" className="product-card-name product-card-name-button" onClick={onOpenKitDetail}>
            {product.name}
          </button>
        ) : (
          <h3 className="product-card-name">{product.name}</h3>
        )}

        {/* CALIFICACIÓN */}
        <div className="product-rating">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <Star
                  key={star}
                  size={13}
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

        {/* TONOS */}
        {product.shades?.length > 0 && (
          <div className="product-shades">
            {product.shades.map(
              (shade) => {
                const isActive =
                  selectedShade?.id ===
                  shade.id;

                return (
                  <button
                    key={shade.id}
                    className={`shade ${
                      isActive
                        ? "active"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        shade.color,
                    }}
                    title={shade.name}
                    type="button"
                    onClick={() =>
                      onShadeSelect?.(
                        product.id,
                        shade.id
                      )
                    }
                  />
                );
              }
            )}
          </div>
        )}

        {selectedShade && (
          <p className="selected-shade-name">
            Tono:{" "}
            <strong>
              {selectedShade.name}
            </strong>
          </p>
        )}

        {/* PRECIO */}
        {mode === "store" && (
          <div className="store-product-price">
            <div className="store-product-price-row">
              <strong className="store-current-price">
                {formatPrice(
                  product.price
                )}
              </strong>

              {hasDiscount && (
                <span className="store-old-price">
                  {formatPrice(
                    product.oldPrice
                  )}
                </span>
              )}
            </div>

            <span className="store-price-caption">
              IVA incluido
            </span>
          </div>
        )}

        {/* INVENTARIO */}
        {mode === "inventory" && (
          <div className="inventory-card-stock">
            <div className="inventory-card-stock-top">
              <span
                className={`stock-badge ${stockClass}`}
              >
                {stockStatus}
              </span>

              <span className="stock-count">
                {product.quantity}{" "}
                {product.quantity === 1
                  ? "unidad"
                  : "unidades"}
              </span>
            </div>

            <div className="quantity-control">
              <AccessButton screen="inventory" action="decrease"
                type="button"
                className="quantity-button"
                onClick={() =>
                  onDecrease?.(
                    product.id,
                    selectedShade?.id
                  )
                }
                disabled={
                  product.quantity === 0
                }
              >
                <Minus size={15} />
              </AccessButton>

              <span className="quantity-value">
                {product.quantity}
              </span>

              <AccessButton screen="inventory" action="increase"
                type="button"
                className="quantity-button"
                onClick={() =>
                  onIncrease?.(
                    product.id,
                    selectedShade?.id
                  )
                }
              >
                <Plus size={15} />
              </AccessButton>
            </div>
            <label className="inventory-minimum-row">
              <span>Avisarme cuando queden</span>
              <select
                aria-label={`Stock mínimo de ${product.name} · ${selectedShade?.name ?? "Sin tono"}`}
                value={normalizeMinStock(product.minStock)}
                disabled={!canUse("inventory", "setMinStock")}
                onChange={(event) => onMinStockChange?.(
                  product.id, selectedShade?.id, Number(event.target.value)
                )}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <option key={value} value={value}>
                    {value === 0 ? "Solo agotado" : `${value} ${value === 1 ? "unidad" : "unidades"}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* SETUP */}
        {mode === "setup" && (
          <AccessButton screen="setup" action="select"
            type="button"
            className="product-card-action setup"
            onClick={handleAction}
          >
            {selected ? (
              <>
                <Check size={16} />
                Agregado
              </>
            ) : (
              <>+ Agregar</>
            )}
          </AccessButton>
        )}

        {/* TIENDA */}
        {mode === "store" && (
          <AccessButton screen="store" action="addToCart"
            type="button"
            className={`product-card-action store store-buy-button ${
              addedToCart
                ? "is-added"
                : ""
            }`}
            onClick={handleAction}
          >
            {addedToCart ? (
              <>
                <Check size={16} />
                Añadido al carrito
              </>
            ) : (
              <>
                <ShoppingBag
                  size={16}
                />
                Agregar al carrito
              </>
            )}
          </AccessButton>
        )}

        {mode === "store" && onBuyNow && (
          <AccessButton screen="store" action="buyNow" type="button"
            className="product-card-action product-buy-now"
            onClick={() => onBuyNow(product, selectedShade?.id)}>
            Comprar ahora <ArrowRight size={15}/>
          </AccessButton>
        )}

        {/* INVENTARIO */}
        {mode === "inventory" && (
          <div className="inventory-actions">
            <AccessButton screen="inventory" action="decrease"
              type="button"
              className="use-product-button"
              disabled={
                product.quantity === 0
              }
              onClick={() =>
                onUse?.(
                  product.id,
                  selectedShade?.id
                )
              }
            >
              Usar producto
            </AccessButton>

            {!product.manual && <AccessButton screen="inventory" action="restock"
              type="button"
              className="restock-button"
              onClick={() =>
                onRestock?.({
                  ...product,
                  selectedShadeId:
                    selectedShade?.id,
                })
              }
            >
              Reponer
              <ArrowRight size={15} />
            </AccessButton>}
          </div>
        )}
      </div>
    </article>
  );
}

export default ProductCard;