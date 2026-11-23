import { ArrowLeft, ReceiptText, ShoppingBag, CheckCircle2, PackageCheck, CalendarDays, Zap } from "lucide-react";
import AppHeader from "../components/AppHeader";
import "./OrderHistory.css";
import AccessButton from "../components/AccessButton";
import { pointForOrder } from "../data/fulfillment.js";
import { formatCycleDate, isImmediateDelivery, formatDeliveryEstimate } from "../data/deliveryCycles.js";

const formatPrice = (amount) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", maximumFractionDigits: 0,
}).format(amount);

function OrderHistory({ orders = [], onNavigate, onViewOrder, onReceiveOrder }) {
  const formatDate = (date) => {
    const d = new Date(date);
    return Number.isNaN(d.getTime()) ? "Fecha no disponible" :
      new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(d);
  };

  return (
    <main className="orders-page">
      <AppHeader onNavigate={onNavigate} />
      <div className="orders-content">
        <button type="button" className="orders-back" onClick={() => onNavigate?.("inventory")}>
          <ArrowLeft size={16} /> Volver a Mi Kit
        </button>
        <div className="orders-heading">
          <p>HISTORIAL DE PEDIDOS</p>
          <h1>Mis compras.</h1>
          <span>Programa tus pedidos, consulta los ciclos y confirma cuándo llegan a tu kit. Sin cobros ni entregas reales.</span>
        </div>
        {orders.length === 0 ? (
          <section className="orders-empty">
            <ReceiptText size={35} />
            <h2>Aún no tienes pedidos.</h2>
            <p>Los pedidos que programes aparecerán aquí.</p>
            <button type="button" onClick={() => onNavigate?.("store")}>Explorar tienda</button>
          </section>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="orders-card" key={order.orderNumber}>
                <div className="orders-card-icon"><ShoppingBag size={20} /></div>
                <div className="orders-card-info">
                  <span>{formatDate(order.createdAt)}</span>
                  <h2>Pedido {order.orderNumber}</h2>
                  <p>{order.totalItems ?? order.cart.reduce((sum, item) => sum + item.quantity, 0)} unidades · {order.status === "received" ? "Recibido" : "Pendiente de recibir"}</p>
                  <p className="orders-payment-note">{order.paymentLabel ?? "Pago simulado"}</p>
                  {(order.fulfillmentPoint?.name || pointForOrder(order)?.name) && <p className="orders-origin-note">
                    {order.deliveryCycle?.type === "pickup" ? "Recoger en" : "Origen previsto"}: {order.fulfillmentPoint?.name ?? pointForOrder(order).name}
                  </p>}
                  <p className="orders-cycle-note">
                    {order.deliveryCycle?.type === "pickup" ? <CalendarDays size={13}/> : isImmediateDelivery(order.deliveryCycle) ? <Zap size={13} /> : <CalendarDays size={13} />}
                    {order.deliveryCycle ? (order.deliveryCycle.type === "pickup"
                      ? "Recoger en punto seleccionado · simulación" : isImmediateDelivery(order.deliveryCycle)
                      ? `Entrega inmediata · Est. ${formatDeliveryEstimate(order.deliveryCycle)}`
                      : `Ciclo ${formatCycleDate(order.deliveryCycle.dispatchDate)} · Est. ${formatDeliveryEstimate(order.deliveryCycle)}`)
                      : "Pedido anterior · sin modalidad registrada"}
                  </p>
                </div>
                <div className="orders-card-actions">
                  <strong>{formatPrice(order.totalPrice)}</strong>
                  <button type="button" onClick={() => onViewOrder?.(order.orderNumber)}>
                    Ver comprobante
                  </button>
                  {order.status === "received" ? (
                    <span className="orders-received"><CheckCircle2 size={15} /> Recibido</span>
                  ) : (
                    <AccessButton screen="orders" action="receive" type="button"
                      className="orders-receive-button" onClick={() => onReceiveOrder?.(order.orderNumber)}>
                      <PackageCheck size={15} /> Marcar como recibido
                    </AccessButton>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default OrderHistory;
