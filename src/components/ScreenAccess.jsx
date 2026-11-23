import { APP_ACCESS } from "../config/access.js";
import { ACTION_LABELS, getScreenMode, isDemoSession, getVariantLimit } from "../access/policy.js";
import "../access/access.css";

export default function ScreenAccess({ screen, onNavigate, notice, onDismiss, children }) {
  const mode = getScreenMode(screen);
  const entry = APP_ACCESS.screens[screen];
  const restricted = mode === "demo" ? Object.entries(entry.demo)
    .filter(([, allowed]) => !allowed).map(([action]) => ACTION_LABELS[action]) : [];
  const kitLimit = getVariantLimit();
  const showBar = mode !== "app" || isDemoSession();
  return (
    <>
      {showBar && <aside className="access-banner" aria-label="Estado de acceso">
        <div>
          <strong>{mode === "blocked" ? "🔒 Pantalla bloqueada" : mode === "demo" ? "VERSIÓN DEMO" : "Pantalla habilitada · sesión demo"} · {entry?.label ?? "Pantalla no disponible"}</strong>
          {isDemoSession() && <p>Datos de prueba separados de tu versión completa.</p>}
          {mode === "demo" && <p>
            {restricted.length > 0 ? `Restringido: ${restricted.join(", ")}. ` : "Puedes probar las funciones de esta pantalla. "}
            {screen === "setup" && Number.isFinite(kitLimit) && `Máximo ${kitLimit} variantes en el kit. `}
            {["store", "product-detail", "cart"].includes(screen) && `Carrito demo: hasta ${APP_ACCESS.demoCartUnits} unidades en total.`}
          </p>}
        </div>
        <details key={screen} className="access-navigation">
          <summary>Pantallas</summary>
          <nav aria-label="Explorar pantallas">
            {Object.entries(APP_ACCESS.screens).map(([id, item]) => <button key={id}
              type="button" aria-current={screen === id ? "page" : undefined}
              onClick={() => onNavigate(id)}>
              {item.label}{getScreenMode(id) === "blocked" ? " 🔒" : ""}
            </button>)}
          </nav>
        </details>
      </aside>}
      {notice && <div className="access-notice" role="status">
        <span>{notice}</span><button type="button" onClick={onDismiss} aria-label="Cerrar aviso">×</button>
      </div>}
      {mode === "blocked" ? <main className="access-blocked">
        <span aria-hidden="true">🔒</span>
        <h1>{entry?.label ?? "Pantalla"} no está disponible</h1>
        <p>Esta sección está bloqueada en la configuración de esta versión.</p>
        <p>Puedes seguir explorando las pantallas habilitadas:</p>
        <nav aria-label="Pantallas disponibles">
          {Object.entries(APP_ACCESS.screens).filter(([id]) => getScreenMode(id) !== "blocked")
            .map(([id, item]) => <button key={id} type="button" onClick={() => onNavigate(id)}>{item.label}</button>)}
        </nav>
      </main> : children}
    </>
  );
}
