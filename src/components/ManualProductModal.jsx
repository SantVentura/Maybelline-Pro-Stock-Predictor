import { useEffect, useState } from "react";
import { PackagePlus, X } from "lucide-react";
import "./KitModals.css";

const initial = { name:"", brand:"", category:"Rostro", shade:"", quantity:1, minStock:1,
  description:"", provider:"", color:"#d5b5b9" };

export default function ManualProductModal({ onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = (event) => {
    event.preventDefault();
    const created = onSave?.(form);
    if (!created) { setError("Completa nombre, marca, tono y cantidades válidas."); return; }
    onClose?.();
  };
  return <div className="kit-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
    <section className="kit-mini-modal" role="dialog" aria-modal="true" aria-labelledby="manual-title">
      <header className="kit-modal-head"><div><span>MI KIT · REGISTRO PERSONAL</span><h2 id="manual-title">Añadir producto</h2></div>
        <button type="button" onClick={onClose} aria-label="Cerrar"><X size={20}/></button></header>
      <p className="kit-modal-caption">¿No encuentras tu maquillaje? Agrégalo a tu kit. No aparecerá como producto oficial de la tienda.</p>
      <form className="kit-modal-form" onSubmit={save}>
        <label>Producto *<input required maxLength={90} value={form.name} onChange={e=>change("name",e.target.value)} placeholder="Ej. Rubor favorito"/></label>
        <label>Marca *<input required maxLength={60} value={form.brand} onChange={e=>change("brand",e.target.value)} placeholder="Marca del producto"/></label>
        <label>Categoría<select value={form.category} onChange={e=>change("category",e.target.value)}>
          {['Rostro','Ojos','Labios','Otros'].map(c=><option key={c}>{c}</option>)}
        </select></label>
        <label>Tono / presentación *<input required maxLength={60} value={form.shade} onChange={e=>change("shade",e.target.value)} placeholder="Ej. Rose 01"/></label>
        <div className="kit-modal-two"><label>Cantidad<input type="number" min="0" max="9999" required value={form.quantity} onChange={e=>change("quantity",e.target.value)}/></label>
          <label>Alerta mínima<input type="number" min="0" max="10" required value={form.minStock} onChange={e=>change("minStock",e.target.value)}/></label></div>
        <label>Proveedor (opcional)<input maxLength={90} value={form.provider} onChange={e=>change("provider",e.target.value)} placeholder="Ej. Mi distribuidor"/></label>
        <label>Descripción<textarea maxLength={300} rows={2} value={form.description} onChange={e=>change("description",e.target.value)} placeholder="Características del producto…"/></label>
        {error && <p className="kit-modal-error" role="alert">{error}</p>}
        <button className="kit-modal-primary" type="submit"><PackagePlus size={16}/> Guardar en Mi Kit</button>
      </form>
    </section>
  </div>;
}
