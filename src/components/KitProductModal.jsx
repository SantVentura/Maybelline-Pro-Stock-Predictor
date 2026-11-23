import { useEffect } from "react";
import { X, MapPin } from "lucide-react";
import "./KitModals.css";

export default function KitProductModal({ product, onClose }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!product) return null;
  const shade = product.shades?.find(s=>s.id===product.selectedShadeId) ?? product.shades?.[0];
  return <div className="kit-modal-overlay" onMouseDown={e=>{ if(e.target===e.currentTarget)onClose?.(); }}>
    <section className="kit-mini-modal" role="dialog" aria-modal="true" aria-labelledby="kit-detail-title">
      <header className="kit-modal-head"><div><span>MI KIT · DETALLE</span><h2 id="kit-detail-title">{product.name}</h2></div>
        <button type="button" onClick={onClose} aria-label="Cerrar"><X size={20}/></button></header>
      <div className="kit-modal-photo">{shade?.image ? <img src={shade.image} alt={product.name}/>:<span>✦</span>}</div>
      <div className="kit-modal-info"><span>{product.brand} · {product.category}</span>
        <p><strong>Tono:</strong> {shade?.name ?? "Sin tono"}</p>
        <p><strong>En tu kit:</strong> {product.quantity} {product.quantity === 1 ? "unidad" : "unidades"}</p>
        <p className="kit-modal-description">{product.description || "Producto de tu kit de maquillaje."}</p>
        <p className="kit-modal-provider"><MapPin size={15}/><span><strong>Proveedor:</strong> {product.manual ? product.provider : "Distribuidores de Maybelline (consultar disponibilidad en tienda)"}</span></p>
      </div>
      <button className="kit-modal-primary" type="button" onClick={onClose}>Volver a Mi Kit</button>
    </section>
  </div>;
}
