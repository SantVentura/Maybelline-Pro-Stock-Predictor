import retailPoints from "./retailPoints.js";

// Los tres puntos de venta del inicio del catálogo se mantienen en el mapa.
export const featuredPointIds = retailPoints.slice(0, 3).map((point) => point.id);
export const isFeaturedPoint = (id) => featuredPointIds.includes(id);

// La selección de un punto adicional sustituye al marcador temporal anterior.
export function visibleMarkerIds(selectedId = null) {
  return selectedId && !isFeaturedPoint(selectedId) && retailPoints.some((point) => point.id === selectedId)
    ? [...featuredPointIds, selectedId]
    : [...featuredPointIds];
}
