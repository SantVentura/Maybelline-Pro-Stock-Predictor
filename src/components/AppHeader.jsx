import { useEffect, useRef, useState } from "react";
import AuthorCredits from "./AuthorCredits";
import { APP_ACCESS } from "../config/access.js";
import { resetDemoStorage } from "../data/demoReset.js";
import "./AppHeader.css";
function AppHeader({
  activePage = null,
  showProgress = false,
  onNavigate,
}) {
  const [creditsOpen, setCreditsOpen] = useState(false);
  const creditsTimer = useRef(null);
  const taps = useRef(0);

  const cancelCreditsHold = () => {
    if (creditsTimer.current !== null) {
      window.clearTimeout(creditsTimer.current);
      creditsTimer.current = null;
    }
  };

  const startCreditsHold = (event) => {
    if (event.button !== 0) return;
    cancelCreditsHold();
    creditsTimer.current = window.setTimeout(() => {
      creditsTimer.current = null;
      setCreditsOpen(true);
    }, 3000);
  };

  useEffect(() => () => {
    if (creditsTimer.current !== null) window.clearTimeout(creditsTimer.current);
  }, []);
  const lastTap = useRef(0);
  const handleSecretTap = () => {
    if (APP_ACCESS.mode !== "demo") return;
    const now = Date.now();
    taps.current = now - lastTap.current < 1800 ? taps.current + 1 : 1;
    lastTap.current = now;
    if (taps.current < 7) return;
    taps.current = 0;
    const confirmed = window.confirm(
      "¿Reiniciar la demostración? Se borrarán nombre, inventario, carrito e historial de esta sesión demo. No se puede deshacer."
    );
    if (confirmed && resetDemoStorage(window.localStorage)) window.location.reload();
  };

  return (
    <header className="setup-header">
      <div className="setup-brand">
        {APP_ACCESS.mode === "demo" ? (
          <button type="button" className="setup-brand-mark setup-brand-secret"
            aria-label="Marca de Maybelline Pro Stock Predictor" onClick={handleSecretTap}>✦</button>
        ) : (
          <span className="setup-brand-mark">✦</span>
        )}
        <button
          type="button"
          className="setup-brand-title-secret"
          aria-label="Ver créditos de autoría: mantener presionado tres segundos o pulsar Enter"
          onPointerDown={startCreditsHold}
          onPointerUp={cancelCreditsHold}
          onPointerLeave={cancelCreditsHold}
          onPointerCancel={cancelCreditsHold}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setCreditsOpen(true);
            }
          }}
        >
          Maybelline Pro Stock Predictor
        </button>
      </div>

      {showProgress ? (
        <div className="setup-progress">
          <span>1</span>
          <div className="progress-line"></div>
          <span className="progress-muted">2</span>
        </div>
      ) : (
        <nav className="app-nav">
          <button
            className={`app-nav-link ${
              activePage === "inventory" ? "active" : ""
            }`}
            onClick={() => onNavigate?.("inventory")}
          >
            Mi Kit
          </button>

          <button
            className={`app-nav-link ${
              activePage === "store" ? "active" : ""
            }`}
            onClick={() => onNavigate?.("store")}
          >
            Tienda
          </button>

          <button
            className={`app-nav-link ${
              activePage === "cart" ? "active" : ""
            }`}
            onClick={() => onNavigate?.("cart")}
          >
            Carrito
          </button>
        </nav>
      )}
      {creditsOpen && <AuthorCredits onClose={() => setCreditsOpen(false)} />}
    </header>
  );
}

export default AppHeader;