# Maybelline Pro Stock Predictor · modos demo y app

## Alternar entre demo y app (una línea)

Abre `src/config/access.js` y cambia la propiedad general:

```js
mode: "app", // Flujo 1.0 habilitado (sin pagos ni entregas reales).
```

por:

```js
mode: "demo", // Activa permisos y límites de presentación.
```

Para volver a la experiencia 1.0, restablece `mode: "app"`.

Todas las pantallas están inicialmente en `mode: "inherit"`: por eso **no hace falta editar nada más** para alternar entre demo y app. Cambiar a `app` **no implementa pagos, despacho, seguimiento, inventario en tiempo real ni factura electrónica**. El checkout y el comprobante siguen siendo simulaciones sin cobro.

## Restringir pantallas individualmente

En el mismo archivo, cada pantalla tiene `mode`:

| Modo | Qué significa |
|---|---|
| `"inherit"` | Utiliza el modo general (`"demo"` o `"app"`). |
| `"demo"` | Mantiene sus permisos de demostración aunque el general sea `"app"`. |
| `"app"` | Habilita sus acciones implementadas aunque el general sea `"demo"`. |
| `"blocked"` | Muestra una pantalla bloqueada y no monta su contenido. |

Por ejemplo, `screens.checkout.mode = "blocked"` bloquea el checkout aunque el modo general sea `"app"`. Para desbloquearlo, vuelve a `"inherit"`.

Los valores `demo` bajo cada pantalla definen sus permisos **solo cuando esa pantalla está en modo demo**. Por defecto la demo limita el kit a 3 variantes y el carrito a 5 unidades; en inventario restringe aumentar y reponer, en checkout restringe confirmar y en comprobante restringe imprimir. En modo `app`, estas restricciones se levantan, salvo pantallas marcadas expresamente como `"demo"` o `"blocked"`.

La configuración de demo usa claves de `localStorage` distintas (`makeup-demo-*`) de la app (`makeup-*`) para evitar mezclar datos; la app no utiliza backend. Los permisos en frontend son **solo para presentación**, no protección de seguridad contra alguien que modifique el código.

## Mapa de distribuidores Maybelline

En la página `ProductDetail` ahora aparece un mapa Leaflet con sucursales concretas de Farmatodo y Éxito en Bogotá, tomando sus direcciones de los localizadores de cada comercio. Los comercios venden artículos de la marca pero **no son tiendas exclusivas ni se confirma stock del producto o tono concreto**. Los datos se encuentran en `src/data/retailPoints.js`, con enlaces a las fuentes.

Leaflet 1.9.4 se carga desde su CDN oficial a través de `index.html`, evitando modificar dependencias y `package-lock.json`. Las teselas vienen de OpenStreetMap. **Requiere internet**, tanto en la web como en la WebView de Android. Si falla el mapa, la lista de direcciones y enlaces sigue visible. El enlace «localizador oficial» lleva al buscador de Maybelline. No hay API de inventario o sincronización con Maybelline.

En el checkout puedes elegir entrega inmediata (estimación ilustrativa de 3 horas) o uno de los ciclos estimados (martes y viernes), guardar esa modalidad en el pedido y marcarlo como recibido desde el historial para actualizar Mi Kit. Las fechas son de ejemplo: la app no coordina entregas ni cobra dinero.

## Probar y compilar

```sh
npm ci
npm test
npm run lint
npm run build
```

Para actualizar Capacitor después de revisar la web, dentro del proyecto:

```sh
npx cap sync android
```

**El ZIP recibido no contenía una carpeta `android/` en la raíz**, por lo que esta entrega tampoco la incluye ni modifica. Si tienes esa carpeta en tu proyecto local, conserva esa versión y haz `npx cap sync android` allí después de copiar los cambios web y compilar. Comprueba la conexión a internet desde Android antes de probar los mapas.

## Easter egg: reiniciar demo

En modo `demo`, da **7 toques seguidos a la estrella ✦ del encabezado** (máximo 1,8 segundos entre toques). Acepta la confirmación para limpiar únicamente los datos de la sesión demo. Si cancelas, no cambia nada. El gesto no está activo en modo `app`.
