// Calendario ilustrativo de entregas: martes y viernes, con una recepción
// estimada dos días después. No representa un servicio logístico real.
export const CYCLE_DAYS = [2, 5]; // 0 = domingo
export const ESTIMATED_DELIVERY_DAYS = 2;

export function getUpcomingCycles(from = new Date(), count = 3) {
  const cycles = [];
  const start = new Date(from);
  if (Number.isNaN(start.getTime())) return cycles;
  for (let daysAhead = 0; daysAhead < 35 && cycles.length < count; daysAhead += 1) {
    const dispatch = new Date(start.getFullYear(), start.getMonth(), start.getDate() + daysAhead, 9);
    if (!CYCLE_DAYS.includes(dispatch.getDay()) || dispatch <= start) continue;
    const arrival = new Date(dispatch.getFullYear(), dispatch.getMonth(), dispatch.getDate() + ESTIMATED_DELIVERY_DAYS, 18);
    cycles.push({
      id: `${dispatch.getFullYear()}-${String(dispatch.getMonth() + 1).padStart(2, "0")}-${String(dispatch.getDate()).padStart(2, "0")}`,
      type: "cycle",
      label: `Ciclo ${cycles.length + 1}`,
      dispatchDate: dispatch.toISOString(),
      estimatedDate: arrival.toISOString(),
    });
  }
  return cycles;
}

export function formatCycleDate(value) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function isValidDeliveryCycle(cycle) {
  if (cycle?.type === "immediate" && cycle?.id !== "immediate") return false;
  if (cycle?.id === "immediate" && cycle?.type !== "immediate") return false;
  if (cycle?.type && !["immediate", "cycle", "pickup"].includes(cycle.type)) return false;
  if (cycle?.type === "pickup" && (cycle?.id !== "pickup" || !cycle?.pointId)) return false;
  return !!cycle && typeof cycle.id === "string" &&
    typeof cycle.dispatchDate === "string" && Number.isFinite(Date.parse(cycle.dispatchDate)) &&
    typeof cycle.estimatedDate === "string" && Number.isFinite(Date.parse(cycle.estimatedDate));
}

// Modalidad prioritaria ilustrativa, sin integración con logística real.
export const IMMEDIATE_ESTIMATE_HOURS = 3;
export function getImmediateDelivery(from = new Date()) {
  const created = new Date(from);
  if (Number.isNaN(created.getTime())) return null;
  return {
    id: "immediate",
    type: "immediate",
    label: "Entrega inmediata",
    dispatchDate: created.toISOString(),
    estimatedDate: new Date(created.getTime() + IMMEDIATE_ESTIMATE_HOURS * 60 * 60 * 1000).toISOString(),
  };
}

export function isImmediateDelivery(delivery) {
  return delivery?.type === "immediate" || delivery?.id === "immediate";
}

export function deliveryMethodLabel(delivery) {
  if (!delivery) return "Sin modalidad";
  return delivery.type === "pickup" ? "Recoger en el punto" : isImmediateDelivery(delivery) ? "Entrega inmediata" : "Entrega por ciclos";
}

export function formatDeliveryEstimate(delivery) {
  if (!delivery) return "Sin fecha";
  if (delivery.type === "pickup") return "Por coordinar en el punto · simulación";
  if (!isImmediateDelivery(delivery)) return formatCycleDate(delivery.estimatedDate);
  const date = new Date(delivery.estimatedDate);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
  }).format(date);
}

// Selección de recogida únicamente ilustrativa: no genera reservas reales.
export function getPickupDelivery(pointId, from = new Date()) {
  const created = new Date(from);
  if (!pointId || Number.isNaN(created.getTime())) return null;
  return { id: "pickup", type: "pickup", label: "Recoger en punto de venta",
    pointId, dispatchDate: created.toISOString(), estimatedDate: created.toISOString() };
}
