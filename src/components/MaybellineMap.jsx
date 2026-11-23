import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ExternalLink, MapPin, Navigation, Search, Store } from "lucide-react";
import retailPoints, { MAYBELLINE_STORE_LOCATOR } from "../data/retailPoints";
import { featuredPointIds, isFeaturedPoint } from "../data/mapMarkers";
import "./MaybellineMap.css";

const directionsUrl = (point) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(point.address)}`;
const CACHE_KEY = "makeup-geocoded-retailpoints-v12";

function readCoordinates() {
  try { return JSON.parse(window.localStorage.getItem(CACHE_KEY) || "{}"); }
  catch { return {}; }
}
function validPoint(coord) {
  return Array.isArray(coord) && Number.isFinite(coord[0]) && Number.isFinite(coord[1]) &&
    coord[0] > 4.3 && coord[0] < 5.1 && coord[1] > -74.5 && coord[1] < -73.7;
}
const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "auto" : "smooth";

export default function MaybellineMap({ selectedPickupId = "", onSelectPickup, selectionMode = "pickup" }) {
  const containerRef = useRef(null);
  const surfaceRef = useRef(null);
  const pointRefs = useRef({});
  const mapRef = useRef(null);
  const markerForRef = useRef(null);
  const markersRef = useRef({});
  const selectedPointRef = useRef(selectedPickupId || "");
  const extraMarkerIdRef = useRef(null);
  const clearExtraMarkerRef = useRef(null);
  const highlightMarkerRef = useRef(null);
  const selectPointRef = useRef(null);
  const lastLookupRef = useRef(0);
  const lookupBusyRef = useRef(false);
  const cancelledRef = useRef(false);
  const [selectedId, setSelectedId] = useState(selectedPickupId || retailPoints[0]?.id);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [located, setLocated] = useState(3);
  const [mapHint, setMapHint] = useState("");
  const [search, setSearch] = useState("");
  const [retailer, setRetailer] = useState("Todos");
  const [leafletReady, setLeafletReady] = useState(Boolean(window.L));

  const visiblePoints = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("es");
    return retailPoints.filter((point) =>
      (retailer === "Todos" || point.retailer === retailer) &&
      (!q || `${point.name} ${point.address}`.toLocaleLowerCase("es").includes(q))
    );
  }, [search, retailer]);

  useEffect(() => {
    if (leafletReady) return undefined;
    let attempts = 0;
    const timer = setInterval(() => {
      if (window.L) { setLeafletReady(true); clearInterval(timer); }
      else if (++attempts >= 40) { setMapError(true); clearInterval(timer); }
    }, 300);
    return () => clearInterval(timer);
  }, [leafletReady]);

  useEffect(() => {
    const L = window.L;
    const container = containerRef.current;
    if (!L || !container) return undefined;
    cancelledRef.current = false;
    const map = L.map(container, { scrollWheelZoom: false }).setView([4.675, -74.06], 11);
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Solo tres marcadores permanecen siempre en el mapa. Un cuarto es temporal.
    const clearExtraMarker = () => {
      const id = extraMarkerIdRef.current;
      if (!id) return;
      markersRef.current[id]?.remove();
      delete markersRef.current[id];
      extraMarkerIdRef.current = null;
      setLocated(Object.keys(markersRef.current).length);
    };
    clearExtraMarkerRef.current = clearExtraMarker;

    const highlightMarker = (id) => {
      Object.entries(markersRef.current).forEach(([markerId, marker]) => {
        marker.setStyle({ fillColor: markerId === id ? "#0a0a0a" : "#e96300" });
      });
    };
    highlightMarkerRef.current = highlightMarker;

    const markerFor = (point, coords) => {
      if (!validPoint(coords) || cancelledRef.current) return null;
      if (markersRef.current[point.id]) return markersRef.current[point.id];
      if (!isFeaturedPoint(point.id)) {
        clearExtraMarker();
        extraMarkerIdRef.current = point.id;
      }
      const marker = L.circleMarker(coords, {
        radius: 9, color: "#fff", weight: 3, fillColor: "#e96300", fillOpacity: 1,
      });
      const popup = document.createElement("div");
      const title = document.createElement("strong"); title.textContent = point.name;
      const address = document.createElement("p"); address.textContent = point.address;
      popup.append(title, address);
      marker.bindPopup(popup);
      marker.on("click", () => {
        selectedPointRef.current = point.id;
        setSelectedId(point.id);
        setSearch(""); setRetailer("Todos");
        if (isFeaturedPoint(point.id)) clearExtraMarker();
        highlightMarker(point.id);
        window.requestAnimationFrame(() => pointRefs.current[point.id]
          ?.scrollIntoView({ behavior: prefersReducedMotion(), block: "nearest" }));
      });
      marker.addTo(map);
      markersRef.current[point.id] = marker;
      setLocated(Object.keys(markersRef.current).length);
      return marker;
    };
    markerForRef.current = markerFor;

    // NO dibujar de forma masiva los puntos geocodificados anteriormente.
    // Las otras 47 sucursales están en la lista y se dibujan solo al seleccionarlas.
    featuredPointIds.forEach((id) => {
      const point = retailPoints.find((entry) => entry.id === id);
      if (point) markerFor(point, [point.lat, point.lng]);
    });
    map.fitBounds([[4.55, -74.19], [4.78, -74.0]], { padding: [25, 25] });
    setMapReady(true);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    observer?.observe(container);
    return () => {
      cancelledRef.current = true;
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      map.remove(); mapRef.current = null; markerForRef.current = null;
      clearExtraMarkerRef.current = null; highlightMarkerRef.current = null;
      extraMarkerIdRef.current = null; markersRef.current = {};
    };
  }, [leafletReady]);

  const showOnMap = (point, scroll = true) => {
    const marker = markersRef.current[point.id];
    if (!marker || !mapRef.current) return false;
    const map = mapRef.current;
    map.invalidateSize();
    map.flyTo(marker.getLatLng(), 15, { duration: 0.9 });
    marker.openPopup();
    highlightMarkerRef.current?.(point.id);
    if (scroll) window.requestAnimationFrame(() => surfaceRef.current
      ?.scrollIntoView({ behavior: prefersReducedMotion(), block: "nearest" }));
    return true;
  };

  const selectPoint = async (point, scroll = true) => {
    selectedPointRef.current = point.id;
    setSelectedId(point.id);
    setMapHint("");
    // Al seleccionar otra sucursal, retirar el marcador temporal anterior.
    if (extraMarkerIdRef.current !== point.id) clearExtraMarkerRef.current?.();
    highlightMarkerRef.current?.(point.id);
    if (showOnMap(point, scroll)) return;
    if (scroll) surfaceRef.current?.scrollIntoView({ behavior: prefersReducedMotion(), block: "nearest" });
    if (!mapRef.current || lookupBusyRef.current) {
      setMapHint("Puedes abrir «Cómo llegar» para consultar la dirección exacta.");
      return;
    }
    // La geocodificación NO es masiva: solo se realiza al elegir una dirección.
    // El servicio público Nominatim exige uso moderado, caché y máximo 1 petición/segundo.
    // https://operations.osmfoundation.org/policies/nominatim/
    const cached = readCoordinates();
    if (validPoint(cached[point.address])) {
      if (selectedPointRef.current !== point.id) return;
      markerForRef.current?.(point, cached[point.address]);
      showOnMap(point, false);
      return;
    }
    if (Date.now() - lastLookupRef.current < 1200) {
      setMapHint("Selecciona nuevamente el punto en un momento, o usa «Cómo llegar».");
      return;
    }
    lookupBusyRef.current = true;
    lastLookupRef.current = Date.now();
    setMapHint("Buscando esta dirección en el mapa…");
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=co&viewbox=-74.35%2C4.85%2C-73.85%2C4.4&bounded=1&q=${encodeURIComponent(point.address)}`,
        { headers: { Accept: "application/json" } }
      );
      if (!response.ok) throw new Error("No disponible");
      const hits = await response.json();
      const coords = [Number(hits?.[0]?.lat), Number(hits?.[0]?.lon)];
      if (!validPoint(coords)) throw new Error("Sin coincidencia");
      if (cancelledRef.current) return;
      cached[point.address] = coords;
      try { window.localStorage.setItem(CACHE_KEY, JSON.stringify(cached)); } catch { /* Caché opcional */ }
      // Evitar que una búsqueda tardía dibuje un punto que ya no está seleccionado.
      if (selectedPointRef.current !== point.id) return;
      markerForRef.current?.(point, coords);
      showOnMap(point, false);
      setMapHint("");
    } catch {
      if (!cancelledRef.current && selectedPointRef.current === point.id) setMapHint("No fue posible ubicar el marcador. Usa «Cómo llegar» para consultar la dirección.");
    } finally { lookupBusyRef.current = false; }
  };

  // Permite sincronizar la selección hecha desde el desplegable del checkout.
  useEffect(() => {
    selectPointRef.current = selectPoint;
  });
  useEffect(() => {
    if (!mapReady || !selectedPickupId) return;
    const point = retailPoints.find((entry) => entry.id === selectedPickupId);
    if (!point) return;
    selectPointRef.current?.(point, false);
  }, [mapReady, selectedPickupId]);

  return <div className="retail-map-section">
    <div className="retail-map-intro">
      <span>BOGOTÁ · {retailPoints.length} PUNTOS DE VENTA</span>
      <p>Farmatodo y Éxito comercializan Maybelline. Son distribuidores, no boutiques propias; la disponibilidad por tono no está confirmada.</p>
    </div>
    <div className="retail-map-tools">
      <label className="retail-map-visually-hidden" htmlFor="retail-search">Buscar punto de venta</label>
      <div className="retail-map-search-wrap"><Search size={15}/><input id="retail-search" className="retail-map-search" type="search"
        value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar sucursal o dirección…" /></div>
      <select className="retail-map-filter" aria-label="Filtrar por distribuidor" value={retailer} onChange={(event) => setRetailer(event.target.value)}>
        <option value="Todos">Todos</option><option value="Farmatodo">Farmatodo</option><option value="Éxito">Éxito</option>
      </select>
    </div>
    <p className="retail-map-count">{visiblePoints.length} puntos encontrados · selecciona uno para ubicarlo</p>
    <div className="retail-map-layout">
      <div className="retail-map-surface" ref={surfaceRef}>
        <div className="retail-map-canvas" ref={containerRef} role="application" aria-label="Mapa de puntos de venta en Bogotá" />
        {!mapReady && <div className="retail-map-status" role="status"><MapPin size={25}/>{mapError ? "Mapa no disponible: consulta la lista y direcciones." : "Cargando mapa…"}</div>}
        {mapReady && <div className="retail-map-counter" role="status">{located} marcadores visibles · 3 principales y tu selección</div>}
        {mapHint && <div className="retail-map-hint" role="status">{mapHint}</div>}
      </div>
      <div className="retail-map-list" aria-label="Distribuidores disponibles">
        {visiblePoints.map((point) => <div className={`retail-point ${selectedId === point.id ? "selected" : ""}`}
          key={point.id} ref={(node) => { if (node) pointRefs.current[point.id] = node; else delete pointRefs.current[point.id]; }}>
          <button type="button" className="retail-point-select" onClick={() => selectPoint(point)} aria-pressed={selectedId === point.id}>
            <Store size={18}/><span><strong>{point.name}</strong><small>{point.address}</small></span>
          </button>
          <div className="retail-point-links">
            <a href={directionsUrl(point)} target="_blank" rel="noopener noreferrer"><Navigation size={13}/> Cómo llegar</a>
            <a href={point.retailerUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={13}/> Ver Maybelline</a>
          </div>
          {onSelectPickup && <button type="button" className={`retail-pickup-button ${selectedPickupId === point.id ? "chosen" : ""}`}
            onClick={() => { selectPoint(point); onSelectPickup(point.id); }}>
            {selectedPickupId === point.id ? <><Check size={14}/> Punto seleccionado</> : <><MapPin size={14}/> {selectionMode === "pickup" ? "Dónde quiero recoger" : "Enviar desde este punto"}</>}
          </button>}
        </div>)}
        {visiblePoints.length === 0 && <p className="retail-map-empty">No se encontraron sucursales con esa búsqueda.</p>}
      </div>
    </div>
    <p className="retail-map-disclaimer">
      Sucursales y direcciones publicadas por los distribuidores; no se confirma inventario ni servicio de recogida real.
      El mapa muestra tres puntos principales y solo un marcador adicional al elegir otra sucursal.
      Consulta los directorios de <a href="https://www.farmatodo.com.co/tiendas" target="_blank" rel="noopener noreferrer">Farmatodo</a> y
      <a href="https://www.exito.com/almacenes-exito" target="_blank" rel="noopener noreferrer"> Éxito</a>, o el
      <a href={MAYBELLINE_STORE_LOCATOR} target="_blank" rel="noopener noreferrer"> localizador Maybelline</a>.
    </p>
  </div>;
}
