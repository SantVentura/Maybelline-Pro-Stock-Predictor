import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Check, CreditCard, MapPin, PackageCheck, CalendarDays,
  Zap, Store, ClipboardCheck, ShoppingBag,
} from "lucide-react";
import AppHeader from "../components/AppHeader";
import AccessButton from "../components/AccessButton";
import MaybellineMap from "../components/MaybellineMap";
import SlidePuzzleCaptcha from "../components/SlidePuzzleCaptcha";
import products from "../data/products";
import retailPoints from "../data/retailPoints";
import { canUse } from "../access/policy.js";
import {
  getUpcomingCycles, getImmediateDelivery, getPickupDelivery,
  formatCycleDate, deliveryMethodLabel, formatDeliveryEstimate,
} from "../data/deliveryCycles.js";
import { findFulfillmentPoint } from "../data/fulfillment.js";
import { calculateOrderTotals, cop } from "../data/orderTotals.js";
import "./Checkout.css";

const paymentLabels = {
  pse: "PSE (simulado)", card: "Tarjeta (simulada)", cash: "Efectivo (simulado)",
};

export default function Checkout({
  userName = "", cart = [], onNavigate, onCompleteOrder,
  isDirectPurchase = false, initialPickupPointId = "",
}) {
  const [form, setForm] = useState({
    name: userName.trim(), phone: "", address: "", city: "Bogotá",
  });
  const [cycles] = useState(() => getUpcomingCycles());
  const [immediate] = useState(() => getImmediateDelivery());
  const [deliveryMethod, setDeliveryMethod] = useState(initialPickupPointId ? "pickup" : "immediate");
  const [cycleId, setCycleId] = useState(cycles[0]?.id ?? "");
  // El mismo punto sirve para recogida o como origen previsto de la entrega a domicilio.
  const [fulfillmentPointId, setFulfillmentPointId] = useState(initialPickupPointId);
  const [paymentMethod, setPaymentMethod] = useState("pse");
  const [bank, setBank] = useState("");
  const [card, setCard] = useState({ holder: "", number: "", expiry: "", cvv: "" });
  const [reviewedStamp, setReviewedStamp] = useState(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [error, setError] = useState("");

  const cartProducts = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? {
      ...item, product, shade: product.shades?.find((s) => s.id === item.shadeId),
    } : null;
  }).filter(Boolean);
  const totals = calculateOrderTotals(cartProducts, deliveryMethod);
  const fulfillmentPoint = findFulfillmentPoint(fulfillmentPointId);
  const selectedDelivery = deliveryMethod === "pickup"
    ? getPickupDelivery(fulfillmentPointId)
    : deliveryMethod === "immediate" ? immediate : cycles.find((cycle) => cycle.id === cycleId);

  const formComplete = Boolean(form.name.trim() && form.phone.replace(/\D/g, "").length >= 7 &&
    (deliveryMethod === "pickup" || (form.address.trim() && form.city.trim())));
  // Solo tarjeta ficticia: el número y CVV no se incluyen en el pedido persistido.
  const cardComplete = paymentMethod !== "card" || Boolean(card.holder.trim() &&
    card.number.replace(/\s/g, "") === "4242424242424242" && card.expiry === "12/30" && card.cvv === "123");
  const bankComplete = paymentMethod !== "pse" || bank.trim().length >= 2;
  const canSubmit = Boolean(formComplete && fulfillmentPoint && cardComplete && bankComplete &&
    selectedDelivery && cartProducts.length > 0);

  // La revisión queda invalidada automáticamente si cambian los datos.
  // Nunca guardamos número ni CVV de tarjeta en este resumen, solo su validez.
  const reviewStamp = JSON.stringify({ form, deliveryMethod, cycleId, fulfillmentPointId,
    paymentMethod, bank, cardHolder: card.holder, cardExpiry: card.expiry,
    cardNumberValid: card.number.replace(/\s/g, "") === "4242424242424242", cardCvvValid: card.cvv === "123" });
  const reviewOpen = reviewedStamp !== null && reviewedStamp === reviewStamp;
  const lastInputStamp = useRef(reviewStamp);
  useEffect(() => {
    if (lastInputStamp.current !== reviewStamp) {
      lastInputStamp.current = reviewStamp;
      setReviewedStamp(null);
      setCaptchaVerified(false);
    }
  }, [reviewStamp]);

  const validationMessage = () => {
    if (cartProducts.length === 0) return "Elige al menos un producto antes de confirmar.";
    if (!formComplete) return "Completa el nombre, teléfono y los datos de entrega necesarios.";
    if (!fulfillmentPoint) return "Elige un distribuidor de origen o recogida antes de continuar.";
    if (!selectedDelivery) return "Selecciona una modalidad y, si corresponde, un ciclo válido.";
    if (!bankComplete) return "Escribe el nombre del banco para PSE.";
    if (!cardComplete) return "Utiliza únicamente los datos de tarjeta ficticia indicados en el formulario.";
    return "";
  };
  const back = () => onNavigate?.(isDirectPurchase ? "store" : "cart");
  const review = () => {
    const message = validationMessage();
    setError(message);
    if (!message) {
      setCaptchaVerified(false);
      setReviewedStamp(reviewStamp);
    }
  };
  const submit = (event) => {
    event.preventDefault();
    setError("");
    if (!canUse("checkout", "confirm")) {
      setError("Esta acción no está habilitada en el modo actual.");
      return;
    }
    const message = validationMessage();
    if (!reviewOpen || !canSubmit || message) {
      setError(message || "Primero revisa tu pedido para confirmar los datos.");
      return;
    }
    if (!captchaVerified) {
      setError("Arrastra la pieza del rompecabezas hasta el final antes de confirmar.");
      return;
    }
    const order = onCompleteOrder?.({
      customer: form, deliveryCycle: selectedDelivery, fulfillmentPointId,
      pickupPointId: deliveryMethod === "pickup" ? fulfillmentPointId : null,
      paymentMethod, paymentLabel: paymentLabels[paymentMethod],
      paymentBank: paymentMethod === "pse" ? bank.trim() : null,
      totalItems: totals.totalItems, totalPrice: totals.total, totals,
    });
    if (order) {
      setCard({ holder: "", number: "", expiry: "", cvv: "" });
      setConfirmedOrder(order);
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      setError("No se pudo registrar el pedido. Comprueba los permisos de esta sesión.");
    }
  };

  if (confirmedOrder) return (
    <main className="checkout-page">
      <AppHeader onNavigate={onNavigate}/>
      <div className="checkout-success">
        <div className="checkout-success-icon"><Check size={30}/></div>
        <p className="checkout-eyebrow">PEDIDO REGISTRADO</p>
        <h1>Todo listo.</h1>
        {confirmedOrder.orderNumber && <p className="checkout-order-number">Pedido {confirmedOrder.orderNumber}</p>}
        <p>Modalidad: <strong>{deliveryMethodLabel(selectedDelivery)}</strong>.</p>
        {fulfillmentPoint && <p className="checkout-confirmed-origin">
          {deliveryMethod === "pickup" ? "Recogida" : "Origen previsto"}: <strong>{fulfillmentPoint.name}</strong>
        </p>}
        <div className="checkout-demo-notice">
          Compra y {deliveryMethod === "pickup" ? "recogida" : "entrega"} simuladas.
          No se realizó ningún cobro ni se solicitó un envío real.
        </div>
        <div className="checkout-success-actions">
          <button type="button" className="checkout-success-secondary" onClick={() => onNavigate?.("inventory")}>Volver a Mi Kit</button>
          <button type="button" className="checkout-success-primary" onClick={() => onNavigate?.("invoice")}>Ver comprobante</button>
        </div>
      </div>
    </main>
  );

  if (cartProducts.length === 0) return (
    <main className="checkout-page">
      <AppHeader onNavigate={onNavigate}/>
      <section className="checkout-empty-state">
        <ShoppingBag size={34} aria-hidden="true"/>
        <h1>Aún no hay productos para pagar</h1>
        <p>Visita la tienda y elige un producto antes de finalizar tu pedido.</p>
        <button type="button" onClick={() => onNavigate?.("store")}>Explorar tienda</button>
      </section>
    </main>
  );

  return (
    <main className="checkout-page">
      <AppHeader onNavigate={onNavigate}/>
      <div className="checkout-content">
        <button type="button" className="checkout-back-button" onClick={back}>
          <ArrowLeft size={16}/> {isDirectPurchase ? "Volver a la tienda" : "Volver al carrito"}
        </button>
        <section className="checkout-heading">
          <p className="checkout-eyebrow">FINALIZAR PEDIDO</p>
          <h1>Finaliza tu pedido.</h1>
          <p>Elige la entrega, el distribuidor de origen y un método de pago de prueba. Sin transacciones reales.</p>
        </section>
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={submit}>
            <section className="checkout-section">
              <div className="checkout-section-title">
                <div className="checkout-section-icon"><MapPin size={18}/></div>
                <div><p>ENTREGA</p><h2>Datos del cliente</h2></div>
              </div>
              <div className="checkout-fields">
                <div className="checkout-field">
                  <label htmlFor="buyer-name">Nombre completo</label>
                  <input id="buyer-name" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} placeholder="Nombre" />
                </div>
                <div className="checkout-field">
                  <label htmlFor="buyer-phone">Teléfono</label>
                  <input id="buyer-phone" type="tel" value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} placeholder="300 000 0000"/>
                </div>
                {deliveryMethod !== "pickup" && <>
                  <div className="checkout-field checkout-field-full">
                    <label htmlFor="buyer-address">Dirección de entrega</label>
                    <input id="buyer-address" value={form.address} onChange={(e) => setForm((v) => ({ ...v, address: e.target.value }))} placeholder="Calle, carrera, número..." />
                  </div>
                  <div className="checkout-field checkout-field-full">
                    <label htmlFor="buyer-city">Ciudad</label>
                    <input id="buyer-city" value={form.city} onChange={(e) => setForm((v) => ({ ...v, city: e.target.value }))}/>
                  </div>
                </>}
              </div>
              <div className="checkout-cycle-area">
                <div className="checkout-cycle-heading">
                  <CalendarDays size={18}/>
                  <div><strong>Modalidad de entrega</strong><p>Elige cómo prefieres recibir tu pedido.</p></div>
                </div>
                <div className="checkout-method-grid" role="radiogroup" aria-label="Modalidad de entrega">
                  {[
                    ["immediate", "Entrega inmediata", "Estimación ilustrativa de 3 horas", Zap],
                    ["cycle", "Entrega por ciclos", "Fechas programadas", CalendarDays],
                    ["pickup", "Recoger en punto", "Seleccionar un distribuidor", Store],
                  ].map(([key, title, detail, Icon]) => (
                    <label key={key} className={`checkout-method-option ${deliveryMethod === key ? "selected" : ""}`}>
                      <input type="radio" name="deliveryMethod" value={key} checked={deliveryMethod === key} onChange={() => setDeliveryMethod(key)}/>
                      <Icon size={20}/><span><strong>{title}</strong><small>{detail}</small></span>
                    </label>
                  ))}
                </div>
                {deliveryMethod === "cycle" && (
                  <div className="checkout-cycle-grid" role="radiogroup" aria-label="Elegir ciclo de entrega">
                    {cycles.map((cycle) => (
                      <label key={cycle.id} className={`checkout-cycle-option ${cycleId === cycle.id ? "selected" : ""}`}>
                        <input type="radio" name="deliveryCycle" checked={cycleId === cycle.id} onChange={() => setCycleId(cycle.id)}/>
                        <span className="checkout-cycle-copy">
                          <strong>{cycle.label} · {formatCycleDate(cycle.dispatchDate)}</strong>
                          <small>Estimación: {formatCycleDate(cycle.estimatedDate)}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {deliveryMethod === "immediate" && (
                  <div className="checkout-immediate-estimate" role="status">
                    <Zap size={17}/> Estimación: <strong>{formatDeliveryEstimate(immediate)}</strong>
                  </div>
                )}
                <div className="checkout-pickup-block checkout-origin-block">
                  <label htmlFor="checkout-origin-point">
                    {deliveryMethod === "pickup" ? "¿Dónde quieres recoger?" : "¿Desde qué punto se enviaría tu pedido?"}
                  </label>
                  <p>Selecciona un comercio que vende Maybelline en Bogotá. La asignación es ilustrativa, no una confirmación de despacho ni de existencias.</p>
                  <select id="checkout-origin-point" value={fulfillmentPointId} onChange={(e) => setFulfillmentPointId(e.target.value)}>
                    <option value="">Seleccionar un punto de venta</option>
                    {retailPoints.map((point) => <option key={point.id} value={point.id}>{point.name}</option>)}
                  </select>
                  {fulfillmentPoint && (
                    <p className="checkout-selected-point">{fulfillmentPoint.name} · {fulfillmentPoint.address}</p>
                  )}
                  <details className="checkout-origin-map" key={deliveryMethod}>
                    <summary>{deliveryMethod === "pickup" ? "Elegir recogida en el mapa" : "Elegir origen en el mapa"}</summary>
                    <MaybellineMap selectedPickupId={fulfillmentPointId} onSelectPickup={setFulfillmentPointId}
                      selectionMode={deliveryMethod === "pickup" ? "pickup" : "origin"}/>
                  </details>
                </div>
                <p className="checkout-cycle-disclaimer">
                  Tiempos, cobro, entrega y recogida son simulados. El comercio no ha confirmado un pedido real.
                </p>
              </div>
            </section>
            <section className="checkout-section">
              <div className="checkout-section-title">
                <div className="checkout-section-icon"><CreditCard size={18}/></div>
                <div><p>PAGO</p><h2>Selecciona el método</h2></div>
              </div>
              <div className="checkout-payment-options" role="radiogroup" aria-label="Método de pago simulado">
                {[["pse", "PSE"], ["card", "Tarjeta"], ["cash", "Efectivo"]].map(([key, label]) => (
                  <label key={key} className={paymentMethod === key ? "selected" : ""}>
                    <input type="radio" name="payment" checked={paymentMethod === key} onChange={() => setPaymentMethod(key)}/>{label}
                  </label>
                ))}
              </div>
              {paymentMethod === "pse" && (
                <div className="checkout-payment-extra">
                  <label>Nombre del banco
                    <input type="text" autoComplete="off" maxLength={70} value={bank} onChange={(e) => setBank(e.target.value)} placeholder="Escribe el nombre de tu banco"/>
                  </label>
                  <small>No solicita credenciales ni conecta con PSE.</small>
                </div>
              )}
              {paymentMethod === "card" && (
                <div className="checkout-payment-extra">
                  <p className="checkout-test-note">Solo datos ficticios: tarjeta 4242 4242 4242 4242, vencimiento 12/30 y CVV 123. No uses datos bancarios reales.</p>
                  <label>Nombre<input autoComplete="off" value={card.holder} onChange={(e) => setCard((v) => ({ ...v, holder: e.target.value }))} placeholder="Nombre de la persona"/></label>
                  <label>Número de prueba<input autoComplete="off" inputMode="numeric" value={card.number} onChange={(e) => setCard((v) => ({ ...v, number: e.target.value.slice(0, 23) }))} placeholder="4242 4242 4242 4242"/></label>
                  <div className="checkout-card-row">
                    <label>Vencimiento (prueba)<input autoComplete="off" value={card.expiry} onChange={(e) => setCard((v) => ({ ...v, expiry: e.target.value.slice(0, 5) }))} placeholder="12/30"/></label>
                    <label>CVV de prueba<input autoComplete="off" type="password" inputMode="numeric" value={card.cvv} maxLength={4} onChange={(e) => setCard((v) => ({ ...v, cvv: e.target.value.replace(/\D/g, "") }))} placeholder="•••"/></label>
                  </div>
                </div>
              )}
              {paymentMethod === "cash" && <p className="checkout-payment-extra">Efectivo de ejemplo: no se solicita ni recibe dinero real.</p>}
            </section>

            {error && <p className="checkout-form-error" role="alert">{error}</p>}
            {!reviewOpen ? (
              <button type="button" className="checkout-confirm-button" onClick={review}>
                <ClipboardCheck size={18}/> Revisar pedido
              </button>
            ) : (
              <section className="checkout-review-panel" aria-label="Revisión final del pedido">
                <div className="checkout-review-heading">
                  <ClipboardCheck size={20}/>
                  <div><strong>Revisa antes de confirmar</strong><span>Comprueba los datos de esta compra simulada.</span></div>
                </div>
                <ul className="checkout-review-items">
                  {cartProducts.map((item) => <li key={`${item.productId}-${item.shadeId}`}>
                    <span>{item.product.name} · {item.shade?.name ?? "Sin tono"} × {item.quantity}</span>
                    <strong>{cop(item.product.price * item.quantity)}</strong>
                  </li>)}
                </ul>
                <dl className="checkout-review-data">
                  <div><dt>Cliente</dt><dd>{form.name}</dd></div>
                  <div><dt>Modalidad</dt><dd>{deliveryMethodLabel(selectedDelivery)} · {formatDeliveryEstimate(selectedDelivery)}</dd></div>
                  <div><dt>{deliveryMethod === "pickup" ? "Recogida" : "Origen previsto"}</dt><dd>{fulfillmentPoint?.name} · {fulfillmentPoint?.address}</dd></div>
                  {deliveryMethod !== "pickup" && <div><dt>Destino</dt><dd>{form.address}, {form.city}</dd></div>}
                  <div><dt>Pago</dt><dd>{paymentLabels[paymentMethod]}{paymentMethod === "pse" ? ` · ${bank.trim()}` : ""}</dd></div>
                  <div><dt>Envío</dt><dd>{totals.shipping ? cop(totals.shipping) : "Gratis"}</dd></div>
                  <div className="checkout-review-final"><dt>Total</dt><dd>{cop(totals.total)}</dd></div>
                </dl>
                <SlidePuzzleCaptcha verified={captchaVerified} onVerified={() => setCaptchaVerified(true)} />
                <div className="checkout-review-actions">
                  <button type="button" className="checkout-review-edit" onClick={() => { setReviewedStamp(null); setCaptchaVerified(false); }}>Editar datos</button>
                  <AccessButton screen="checkout" action="confirm" type="submit" className="checkout-confirm-button" disabled={!captchaVerified}>
                    <PackageCheck size={18}/> Confirmar pedido simulado
                  </AccessButton>
                </div>
              </section>
            )}
          </form>
          <aside className="checkout-summary">
            <p className="checkout-summary-eyebrow">TU PEDIDO</p>
            <h2>Resumen</h2>
            <div className="checkout-summary-products">
              {cartProducts.map((item) => <div key={`${item.productId}-${item.shadeId}`} className="checkout-summary-product">
                <div><strong>{item.product.name}</strong><span>{item.shade?.name ?? "Sin tono"} · x{item.quantity}</span></div>
                <strong>{cop(item.product.price * item.quantity)}</strong>
              </div>)}
            </div>
            <div className="checkout-summary-row"><span>Productos</span><strong>{totals.totalItems}</strong></div>
            <div className="checkout-summary-row"><span>Subtotal antes de IVA</span><strong>{cop(totals.base)}</strong></div>
            <div className="checkout-summary-row"><span>IVA incluido (19 %)</span><strong>{cop(totals.iva)}</strong></div>
            {totals.savings > 0 && <div className="checkout-summary-row"><span>Ahorraste en productos</span><strong className="checkout-saving">{cop(totals.savings)}</strong></div>}
            <div className="checkout-summary-row"><span>Entrega</span><strong>{totals.shipping ? cop(totals.shipping) : "Gratis"}</strong></div>
            <div className="checkout-summary-row"><span>Modalidad</span><strong>{deliveryMethodLabel(selectedDelivery)}</strong></div>
            {fulfillmentPoint && <div className="checkout-summary-row"><span>{deliveryMethod === "pickup" ? "Recogida" : "Origen"}</span><strong>{fulfillmentPoint.name}</strong></div>}
            <div className="checkout-summary-total"><span>TOTAL</span><strong>{cop(totals.total)}</strong></div>
            <div className="checkout-summary-demo">Pago simulado. El IVA ya está incluido en el precio; no se suma dos veces.</div>
          </aside>
        </div>
      </div>
    </main>
  );
}
