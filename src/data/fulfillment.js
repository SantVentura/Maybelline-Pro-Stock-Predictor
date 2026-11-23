import retailPoints from "./retailPoints.js";

// Tanto los pedidos a domicilio como la recogida deben indicar un punto real del catálogo.
// Las sucursales son referencias ilustrativas: no se confirma stock ni despacho real.
export const findFulfillmentPoint = (pointId) =>
  retailPoints.find((point) => point.id === pointId) ?? null;

export const isValidFulfillmentPoint = (pointId) => Boolean(findFulfillmentPoint(pointId));

export const pointForOrder = (order) =>
  findFulfillmentPoint(order?.fulfillmentPointId ?? order?.pickupPointId);

export function validOrderFulfillment(deliveryCycle, fulfillmentPointId, pickupPointId) {
  if (!isValidFulfillmentPoint(fulfillmentPointId)) return false;
  if (deliveryCycle?.type === "pickup") {
    return pickupPointId === fulfillmentPointId && deliveryCycle.pointId === fulfillmentPointId;
  }
  return pickupPointId == null;
}
