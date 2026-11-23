import AccessButton from "../components/AccessButton";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import AppHeader from "../components/AppHeader";
import products from "../data/products";
import { calculateOrderTotals, cop } from "../data/orderTotals.js";

import "./Cart.css";

function Cart({
  cart,
  onNavigate,
  onIncreaseCart,
  onDecreaseCart,
  onRemoveFromCart,
}) {
  const cartProducts = cart
    .map((item) => {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product) return null;

      const shade = product.shades?.find(
        (shade) => shade.id === item.shadeId
      );

      return {
        ...item,
        product,
        shade,
      };
    })
    .filter(Boolean);

  const totalItems = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totals = calculateOrderTotals(cartProducts, "immediate");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="cart-page">
      <AppHeader
        activePage="cart"
        onNavigate={onNavigate}
      />

      <div className="cart-content">
        <button
          type="button"
          className="cart-back-button"
          onClick={() => onNavigate?.("store")}
        >
          <ArrowLeft size={16} />
          Volver a la tienda
        </button>

        <section className="cart-heading">
          <p>CARRITO</p>

          <h1>Tu selección.</h1>

          <span>
            {totalItems}{" "}
            {totalItems === 1
              ? "producto"
              : "productos"}
          </span>
        </section>

        {cartProducts.length === 0 ? (
          <section className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={26} />
            </div>

            <h2>Tu carrito está vacío</h2>

            <p>
              Explora la tienda y agrega productos
              para comenzar tu compra.
            </p>

            <button
              type="button"
              onClick={() => onNavigate?.("store")}
            >
              Ir a la tienda
            </button>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items">
              {cartProducts.map((item) => (
                <article
                  key={`${item.productId}-${item.shadeId}`}
                  className="cart-item"
                >
                  <div className="cart-item-image">
                    <img
                      src={
                        item.shade?.image ??
                        `https://picsum.photos/seed/cart-${item.productId}/400/450`
                      }
                      alt={item.product.name}
                    />
                  </div>

                  <div className="cart-item-info">
                    <span className="cart-item-brand">
                      {item.product.brand}
                    </span>

                    <h2>
                      {item.product.name}
                    </h2>

                    {item.shade && (
                      <div className="cart-item-shade">
                        <span
                          style={{
                            backgroundColor:
                              item.shade.color,
                          }}
                        />

                        <p>
                          Tono:{" "}
                          <strong>
                            {item.shade.name}
                          </strong>
                        </p>
                      </div>
                    )}

                    <strong className="cart-item-price">
                      {formatPrice(
                        item.product.price
                      )}
                    </strong>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-quantity">
                      <AccessButton screen="cart" action="decrease"
                        type="button"
                        onClick={() =>
                          onDecreaseCart?.(
                            item.productId,
                            item.shadeId
                          )
                        }
                      >
                        <Minus size={14} />
                      </AccessButton>

                      <span>
                        {item.quantity}
                      </span>

                      <AccessButton screen="cart" action="increase"
                        type="button"
                        onClick={() =>
                          onIncreaseCart?.(
                            item.productId,
                            item.shadeId
                          )
                        }
                      >
                        <Plus size={14} />
                      </AccessButton>
                    </div>

                    <AccessButton screen="cart" action="remove"
                      type="button"
                      className="cart-remove-button"
                      onClick={() =>
                        onRemoveFromCart?.(
                          item.productId,
                          item.shadeId
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </AccessButton>
                  </div>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <p className="cart-summary-eyebrow">
                RESUMEN
              </p>

              <h2>Tu pedido</h2>

              <div className="cart-summary-row">
                <span>Productos</span>
                <strong>{totalItems}</strong>
              </div>

              <div className="cart-summary-row">
                <span>Subtotal</span>

                <strong>
                  {cop(totals.productsTotal)}
                </strong>
              </div>

              <div className="cart-summary-row muted"><span>IVA incluido (19 %)</span><strong>{cop(totals.iva)}</strong></div>
              {totals.savings > 0 && <div className="cart-summary-row"><span>Ahorraste</span><strong>{cop(totals.savings)}</strong></div>}
              <div className="cart-summary-row muted"><span>Entrega estimada a domicilio</span><strong>{totals.shipping ? cop(totals.shipping) : "Gratis"}</strong></div>

              <div className="cart-summary-total">
                <span>Total</span>

                <strong>
                  {cop(totals.total)}
                </strong>
              </div>

              <button
                type="button"
                className="cart-checkout-button"
                onClick={() => onNavigate?.("checkout")}
              >
                Continuar al pago
              </button>

              <small>Envío gratuito por compras superiores a $200.000 o recogida en punto. El importe final se confirma en checkout. No hay cobro real.</small>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;