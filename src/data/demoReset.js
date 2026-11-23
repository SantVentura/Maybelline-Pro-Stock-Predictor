import { APP_ACCESS } from "../config/access.js";
import { storageKey } from "../access/policy.js";

// El reinicio oculto solo afecta los datos locales del modo demo.
export const RESET_DATA_KEYS = ["user-name", "inventory", "cart", "orders"];
export function resetDemoStorage(storage, config = APP_ACCESS) {
  if (config.mode !== "demo") return false;
  try {
    for (const key of RESET_DATA_KEYS) storage.removeItem(storageKey(key, config));
    return true;
  } catch {
    return false;
  }
}
