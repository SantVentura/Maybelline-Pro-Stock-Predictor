import { useEffect, useRef } from "react";
import { Sparkles, X } from "lucide-react";
import "./AuthorCredits.css";

export default function AuthorCredits({ onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        // El único control del diálogo es el botón para cerrarlo.
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="author-credits-overlay" onPointerDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="author-credits-modal" role="dialog" aria-modal="true"
        aria-labelledby="author-credits-title" aria-describedby="author-credits-description">
        <button ref={closeRef} type="button" className="author-credits-close"
          aria-label="Cerrar créditos" onClick={onClose}><X size={18} /></button>
        <div className="author-credits-icon"><Sparkles size={26} aria-hidden="true" /></div>
        <p className="author-credits-eyebrow">CRÉDITOS DEL PROYECTO</p>
        <h2 id="author-credits-title">Maybelline Pro Stock Predictor</h2>
        <p className="author-credits-version">Versión 1.2 · 2026</p>
        <div className="author-credits-divider" />
        <p className="author-credits-label">DISEÑO Y DESARROLLO</p>
        <p className="author-credits-authors">Meg &amp; Stv</p>
        <p className="author-credits-copyright">© 2026 Meg &amp; Stv. Derechos reservados sobre el desarrollo original.</p>
        <p id="author-credits-description" className="author-credits-disclaimer">
          Proyecto independiente. Maybelline y las demás marcas y materiales de terceros
          pertenecen a sus respectivos titulares. Esta mención no implica afiliación oficial.
        </p>
      </section>
    </div>
  );
}
