import { canUse, ACTION_LABELS } from "../access/policy.js";

export default function AccessButton({ screen, action, children, disabled, title, ...props }) {
  const allowed = canUse(screen, action);
  return (
    <button {...props} disabled={disabled || !allowed}
      title={allowed ? title : `${ACTION_LABELS[action] ?? action}: función restringida en esta versión.`}>
      {children}
      {!allowed && <span className="access-button-lock" aria-label="Función restringida"> 🔒</span>}
    </button>
  );
}
