import { canUse } from "../access/policy.js";
import AccessButton from "../components/AccessButton";
import {
    ArrowLeft,
    CheckCircle2,
    FileText,
} from "lucide-react";

import AppHeader from "../components/AppHeader";
import products from "../data/products";
import { pointForOrder } from "../data/fulfillment.js";
import { totalsForOrder } from "../data/orderTotals.js";
import { deliveryMethodLabel, formatDeliveryEstimate, isImmediateDelivery } from "../data/deliveryCycles.js";

import "./Invoice.css";

function Invoice({
    order,
    onNavigate,
}) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(price ?? 0);
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Intl.DateTimeFormat(
            "es-CO",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        ).format(new Date(date));
    };

    if (!order) {
        return (
            <main className="invoice-page">
                <AppHeader
                    onNavigate={onNavigate}
                />

                <div className="invoice-empty">
                    <div className="invoice-empty-icon">
                        <FileText size={28} />
                    </div>

                    <h1>
                        No hay un comprobante disponible.
                    </h1>

                    <p>
                        Programa un pedido
                        para generar tu comprobante.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            onNavigate?.("store")
                        }
                    >
                        Ir a la tienda
                    </button>
                </div>
            </main>
        );
    }

    const totals = totalsForOrder(order);
    const fulfillmentPoint = pointForOrder(order) ?? order.fulfillmentPoint ?? null;
    const isPickup = order.deliveryCycle?.type === "pickup";
    const orderProducts = order.cart
        .map((item) => {
            const product = products.find(
                (product) =>
                    product.id === item.productId
            );

            const productSnapshot = product ?? {
                name: item.productName ?? "Producto",
                brand: item.brandName ?? "Maybelline",
                price: item.unitPrice ?? 0,
            };

            const shade = product?.shades?.find(
                (shade) => shade.id === item.shadeId
            ) ?? (item.shadeName ? { name: item.shadeName } : null);

            return {
                ...item,
                product: productSnapshot,
                shade,
            };
        })
        .filter(Boolean);

    return (
        <main className="invoice-page">
            <AppHeader
                onNavigate={onNavigate}
            />

            <div className="invoice-content">
                <button
                    type="button"
                    className="invoice-back-button"
                    onClick={() =>
                        onNavigate?.("inventory")
                    }
                >
                    <ArrowLeft size={16} />
                    Volver a Mi Kit
                </button>

                <section className="invoice-document">
                    {/* CABECERA */}
                    <div className="invoice-header">
                        <div>
                            <div className="invoice-brand">
                                <span>✦</span>
                                Maybelline Pro Stock Predictor
                            </div>

                            <p className="invoice-demo-label">
                                COMPROBANTE · PEDIDO SIMULADO
                            </p>
                        </div>

                        <div className="invoice-status">
                            <CheckCircle2 size={18} />

                            <span>
                                {order.status === "received" ? "Pedido recibido" : order.deliveryCycle?.type === "pickup" ? "Recogida pendiente" : isImmediateDelivery(order.deliveryCycle) ? "Entrega inmediata · pendiente" : "Pedido programado"}
                            </span>
                        </div>
                    </div>

                    {/* INFORMACIÓN DEL PEDIDO */}
                    <div className="invoice-info">
                        <div>
                            <span>
                                Número de pedido
                            </span>

                            <strong>
                                {order.orderNumber}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Fecha
                            </span>

                            <strong>
                                {formatDate(
                                    order.createdAt
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Estado
                            </span>

                            <strong>
                                {order.status === "received" ? "Recibido" : "Pendiente de recibir"}
                            </strong>
                        </div>

                        <div>
                            <span>Modalidad de entrega</span>
                            <strong>{deliveryMethodLabel(order.deliveryCycle)}</strong>
                        </div>
                        <div>
                            <span>{isImmediateDelivery(order.deliveryCycle) ? "Fecha orientativa" : "Entrega estimada"}</span>
                            <strong>{formatDeliveryEstimate(order.deliveryCycle)}</strong>
                        </div>
                        <div>
                            <span>
                                Pago
                            </span>
                            <strong>{order.paymentLabel ?? "Simulado"}</strong>
                        </div>
                    </div>

                    {/* CLIENTE */}
                    <section className="invoice-section">
                        <p className="invoice-section-eyebrow">
                            CLIENTE
                        </p>

                        <h2>
                            Datos de entrega
                        </h2>

                        <div className="invoice-customer">
                            <div>
                                <span>
                                    Nombre
                                </span>

                                <strong>
                                    {order.customer?.name}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Teléfono
                                </span>

                                <strong>
                                    {order.customer?.phone}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Dirección
                                </span>

                                <strong>{isPickup && fulfillmentPoint ? `Recoger: ${fulfillmentPoint.name} · ${fulfillmentPoint.address}` : order.customer?.address || "No indicada"}</strong>
                            </div>

                            <div>
                                <span>
                                    Ciudad
                                </span>

                                <strong>
                                    {order.customer?.city ?? "Bogotá"}
                                </strong>
                            </div>
                            {fulfillmentPoint && <div className="invoice-origin-field">
                                <span>{isPickup ? "Punto de recogida" : "Punto de origen (simulado)"}</span>
                                <strong>{fulfillmentPoint.name} · {fulfillmentPoint.address}</strong>
                            </div>}
                        </div>
                    </section>

                    {/* PRODUCTOS */}
                    <section className="invoice-section">
                        <p className="invoice-section-eyebrow">
                            DETALLE DEL PEDIDO
                        </p>

                        <h2>
                            Productos
                        </h2>

                        <div className="invoice-products">
                            <div className="invoice-product-header">
                                <span>
                                    Producto
                                </span>

                                <span>
                                    Cantidad
                                </span>

                                <span>
                                    Precio
                                </span>

                                <span>
                                    Total
                                </span>
                            </div>

                            {orderProducts.map((item) => (
                                <div
                                    key={`${item.productId}-${item.shadeId}`}
                                    className="invoice-product-row"
                                >
                                    <div className="invoice-product-name">
                                        <strong>
                                            {item.product.name}
                                        </strong>

                                        <span>
                                            {item.product.brand}
                                        </span>

                                        {item.shade && (
                                            <small>
                                                Tono:{" "}
                                                {item.shade.name}
                                            </small>
                                        )}
                                    </div>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <span>
                                        {formatPrice(
                                            item.unitPrice ?? item.product.price
                                        )}
                                    </span>

                                    <strong>
                                        {formatPrice(
                                            (item.unitPrice ?? item.product.price) *
                                            item.quantity
                                        )}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* TOTALES: IVA incluido, descuento y envío calculados al cerrar pedido */}
                    <div className="invoice-totals">
                        <div className="invoice-total-row"><span>Productos</span><strong>{order.totalItems ?? totals.totalItems}</strong></div>
                        <div className="invoice-total-row"><span>Subtotal sin IVA</span><strong>{formatPrice(totals.base)}</strong></div>
                        <div className="invoice-total-row"><span>IVA incluido (19 %)</span><strong>{formatPrice(totals.iva)}</strong></div>
                        <div className="invoice-total-row"><span>Productos con IVA</span><strong>{formatPrice(totals.productsTotal)}</strong></div>
                        {totals.savings > 0 && <div className="invoice-total-row"><span>Ahorraste en descuentos</span><strong>{formatPrice(totals.savings)}</strong></div>}
                        <div className="invoice-total-row"><span>{isPickup ? "Recogida" : "Envío"}</span><strong>{totals.shipping ? formatPrice(totals.shipping) : "Gratis"}</strong></div>
                        <div className="invoice-grand-total"><span>TOTAL</span><strong>{formatPrice(totals.total)}</strong></div>
                    </div>

                    {/* AVISO DEMO */}
                    <div className="invoice-legal">
                        <FileText size={18} />

                        <div>
                            <strong>
                                Documento de demostración
                            </strong>

                            <p>
                                Este comprobante forma parte de
                                una simulación. El IVA es ilustrativo y está incluido en los precios. No se realizó
                                ningún cobro real y este documento
                                no constituye una factura
                                electrónica con validez fiscal.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="invoice-actions">
                    <button type="button" className="invoice-secondary-button"
                        onClick={() => onNavigate?.("orders")}>
                        Mis pedidos
                    </button>
                    <button
                        type="button"
                        className="invoice-secondary-button"
                        onClick={() =>
                            onNavigate?.("inventory")
                        }
                    >
                        Volver a Mi Kit
                    </button>

                    <AccessButton screen="invoice" action="print"
                        type="button"
                        className="invoice-primary-button"
                        onClick={() =>
                            canUse("invoice", "print") && window.print()
                        }
                    >
                        Descargar comprobante
                    </AccessButton>
                </div>
            </div>
        </main>
    );
}

export default Invoice;