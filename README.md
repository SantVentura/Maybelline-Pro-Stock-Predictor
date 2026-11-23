# Maybelline Pro Stock Predictor

Aplicación React/Vite con inventario por tono, alertas de reposición, tienda, carrito, checkout simulado, comprobante y mapa Leaflet de comercios que venden Maybelline en Bogotá.

- Configuración de modos y pantallas: [README-DEMO.md](README-DEMO.md).
- Para alternar demo/app, cambia solo `APP_ACCESS.mode` en `src/config/access.js` de `"app"` a `"demo"` (o viceversa).
- Las sucursales del mapa están en `src/data/retailPoints.js`.
- El ZIP recibido no traía una carpeta `android/` en la raíz; no se crea ni modifica aquí. Si la tienes en tu equipo, sincronízala después en tu proyecto local.

```sh
npm ci
npm run dev
```

Los productos, precios y compras son ilustrativos. La app no está afiliada ni representa a Maybelline, Farmatodo o Éxito. No procesa pagos ni confirma inventarios o entregas reales.

## Nombre de usuario

- El nombre introducido al comenzar se guarda localmente para la sesión del modo configurado (`demo` o `app`).
- Personaliza el saludo de bienvenida y **Mi Kit**, y se sugiere en el formulario de checkout. El nombre del pedido puede editarse antes de confirmar la compra simulada.

## Inventario y pedidos

- En **Mi Kit**, cada tono puede tener su propio nivel de alerta (de 0 a 10 unidades; 0 avisa solo al agotarse). Los ajustes se guardan localmente.
- El botón **Mis pedidos** abre el historial de compras simuladas en este dispositivo. Desde allí se reabre cualquier comprobante guardado, incluso tras recargar.
- Los pedidos se guardan en `localStorage`, separados entre los modos `demo` y `app` cuando corresponda. No se envían a un servidor ni equivalen a facturas electrónicas o pagos reales.
- Los pedidos de ejemplo se pueden confirmar cuando `checkout.confirm` está permitido; la configuración actual admite confirmación simulada también en `demo`.


## Entrega inmediata, ciclos, recepción y continuidad de tonos (versión final)

- En checkout se elige **entrega inmediata** (estimación ilustrativa de 3 horas) o uno de los tres **ciclos** siguientes (martes y viernes, con estimación de recepción dos días después). No se coordina una entrega física real.
- La modalidad y la fecha estimada seleccionadas quedan guardadas en el historial y comprobante. Un pedido pendiente se puede marcar como recibido posteriormente.
- En **Mis pedidos**, «Marcar como recibido» cambia el estado a `received` y agrega cada cantidad al tono correspondiente en Mi Kit (crea esa variante si no existe). No se puede aplicar dos veces.
- La variante seleccionada en Tienda permanece seleccionada al abrir el detalle y al volver.
- Las alertas de inventario se disparan al cruzar el mínimo configurado o llegar a cero; no se repiten por cada uso bajo el umbral.
- `APP_ACCESS.mode = "demo"` mantiene las restricciones configuradas. Cambia solo a `"app"` para habilitar el flujo completo de **simulación**: no existen cobros, entregas ni facturación fiscal reales.
- Solo se cambió el nombre de presentación; **no se cambió el `appId` de Capacitor**, que identifica la instalación existente. Se actualizó `capacitor.config.json` con el nombre visible pero no se sincronizó ningún proyecto Android.

## Reinicio oculto de la demostración

- Solo al configurar `APP_ACCESS.mode = "demo"`, toca la **estrella ✦ del encabezado siete veces seguidas** (sin tardar más de ~1,8 s entre toques).
- La aplicación pedirá confirmación antes de reiniciar los datos locales **de la sesión demo** (nombre, inventario, carrito e historial). Este reinicio no afecta los datos almacenados de la sesión `app`.
- En `app` la estrella es solo decorativa y no ejecuta ningún reinicio.


## Novedades de la versión 1.1

- **En la tarjeta del producto y en su página de detalle** hay dos acciones: «Agregar al carrito» y «Comprar ahora». La compra directa paga **solo esa variante**, sin vaciar el carrito existente. El carrito se puede comprar después como siempre.
- Registro manual de productos con categoría, tono, existencias, mínimo de alerta, descripción y proveedor. Se guarda en el dispositivo y no se presenta como producto oficial de Maybelline.
- Mini ficha en Mi Kit, notificaciones de producto añadido y aviso «Por agotarse» con borde rojo.
- Modal compacto (ancho máximo 360 px, alto máximo 640 px), Roboto, tarjetas de esquina recta e imágenes centradas de 120 × 120 px.
- Checkouts con modalidad inmediata, ciclos o **recogida en punto**; pagos PSE, tarjeta y efectivo ilustrativos. El formulario de tarjeta solo acepta número ficticio **4242 4242 4242 4242**, fecha **12/30** y CVV **123**, oculto al teclear. No guardamos los datos de tarjeta.
- Comprobante, carrito y checkout usan el mismo cálculo: precios IVA incluido (19 % ilustrativo), diferencia de precio de oferta como ahorro, envío $4.500 para compras de hasta $200.000 y gratis si son superiores a $200.000 o si se recoge en punto.
- 50 ubicaciones listadas en Bogotá (Farmatodo y Éxito), con indicadores naranjas `#e96300`, navegación y selección de punto. Las direcciones sin coordenadas se buscan al elegir la sucursal. Las coordenadas que no están verificadas se solicitan mediante geocodificación cuando hay conexión; si falla, se muestra la dirección.

**Importante:** las ubicaciones no garantizan stock ni permiten reservar recogidas reales. Para un servicio de producción se requeriría integración oficial con inventario, logística y una pasarela de pagos.

```sh
npm ci
npm test
npm run lint
npm run build
```

En esta entrega no se incluyen dependencias instaladas ni la carpeta Android nativa. Cuando las dependencias estén instaladas y el build funcione, sincroniza tu proyecto Android local mediante `npx cap sync android`.

## Mejoras de cierre — versión 1.2

- En checkout se exige elegir un **punto de origen** tanto para entrega inmediata como para ciclos, y un **punto de recogida** al retirar en tienda. Se puede seleccionar de la lista o desde el mapa Leaflet. La selección se conserva al cambiar de modalidad.
- Cada pedido guarda el identificador y una instantánea del punto seleccionado; su nombre aparece en el historial y la dirección en el comprobante. Un punto es solo **origen previsto de simulación**, no confirmación de existencias ni despacho.
- El botón **Revisar pedido** presenta productos y tonos, cliente, entrega, distribuidor, método de pago y total. Solo después se habilita la confirmación de la compra simulada. Si se cambia algún dato, se solicita revisar nuevamente.
- Los avisos de **producto añadido al carrito** son notificaciones discretas que desaparecen automáticamente y no interrumpen la navegación.
- Mi Kit vacío, la búsqueda inicial sin coincidencias y el checkout sin productos ofrecen acciones para continuar. Los estados vacíos existentes de tienda, carrito e historial se conservan.
- Al registrar el pedido se muestra su número, modalidad y punto seleccionado. Se conservan IVA y envío calculados desde `src/data/orderTotals.js`.

**La versión 1.2 sigue siendo una simulación local:** no realiza pagos, asignación de proveedores, recogidas ni entregas reales. Los puntos del catálogo no garantizan disponibilidad de un producto o tono.

# Maybelline Pro Stock Predictor 💜

**Versión 1.2 · 2026**

Maybelline Pro Stock Predictor es una aplicación web y móvil creada para facilitar la organización, gestión y seguimiento del inventario de productos de maquillaje.

La plataforma permite crear kits personalizados, registrar productos y tonalidades, controlar existencias, configurar alertas de stock mínimo y gestionar la reposición de productos. También incluye un catálogo interactivo, carrito de compras, pedidos simulados y un mapa de puntos de venta.

El proyecto nace de una **idea original propuesta por el equipo contratante**, que planteó la necesidad y el concepto inicial de la solución.

A partir de esta propuesta, **Meg & Stv** estuvieron a cargo del diseño de la experiencia, la implementación técnica y el desarrollo de las funcionalidades de la aplicación.

## Créditos

**Idea original y concepto:** Equipo contratante.

**Diseño y desarrollo de software:** Meg & Stv.

**Año:** 2026.

*Proyecto independiente. Maybelline y las demás marcas mencionadas pertenecen a sus respectivos titulares.*