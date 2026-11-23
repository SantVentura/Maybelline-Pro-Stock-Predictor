# Maybelline Pro Stock Predictor 1.1 — Cambios finales

- Tarjetas de tienda y vista de detalle con **Agregar al carrito** y **Comprar ahora** separados. Comprar ahora abre un checkout con una sola variante y **no borra el carrito anterior**.
- Registro manual de productos personales en Mi Kit, almacenados aparte del catálogo Maybelline y con su propio tono, descripción, proveedor y cantidad.
- Mini ficha de producto dentro del inventario, y confirmaciones de agregado.
- IVA general del 19 % **desglosado del precio ya incluido** (ilustrativo), descuentos y ahorro; $4.500 de envío cuando productos ≤ $200.000; envío gratuito por compras superiores a $200.000 o recogida en tienda.
- Elección de entrega inmediata, por ciclos o recogida en punto (simuladas). PSE, tarjeta ficticia y efectivo simulados. El CVV se oculta y no se guardan datos de tarjeta.
- Mapa Leaflet con 20 sucursales listadas (3 iniciales + 17 adicionales), con nombres/direcciones del directorio público de Éxito; geocodificación progresiva sin inventar coordenadas, indicaciones y selección de recogida.
- Roboto, imágenes de tarjeta centradas en 120 × 120 px, tarjetas rectas, botones redondeados, alertas con borde rojo y modales compactos.
- No se han modificado archivos Android.

## Seguridad y alcance

**No hay pagos ni entregas reales**. El catálogo, los precios, el IVA y los plazos son ilustrativos. Las tiendas mencionadas comercializan Maybelline, pero no son tiendas propias y **no se ha comprobado existencias por tono ni servicios de recogida**. Maybelline y las marcas de comercios son marcas de sus titulares; este proyecto es una demostración no afiliada.

## Verificación

Ejecutar `npm ci`, `npm test`, `npm run lint`, `npm run build` y después revisar responsive en móvil y Capacitor. El mapa necesita conexión para Leaflet y las teselas de OpenStreetMap.

---

# Maybelline Pro Stock Predictor 1.0

## Mejoras incluidas

- Identidad de aplicación actualizada en bienvenida, Mi Kit, comprobante, pestaña web y configuración Capacitor.
- Modo `app` activo por defecto; cambiar `APP_ACCESS.mode` a `demo` recupera las restricciones por pantalla.
- Selector de ciclos en checkout (martes y viernes), con fecha estimada calculada y guardada en los pedidos.
- Historial con estado Programado / Recibido, botón para registrar la recepción y actualización del inventario por producto y tono. Se impiden dobles recepciones del mismo pedido.
- Selección de tonos coherente entre Tienda y Detalle del producto.
- Alertas de reposición al cruzar el umbral o llegar a cero, y sección de reposición prioritaria en Mi Kit.
- Descripciones particulares para los seis productos del catálogo.
- Ajustes adaptativos de encabezado, selección de ciclos e historial para pantallas pequeñas.
- Mapa Leaflet y enlaces a comercios Maybelline preservados. No se garantiza stock físico por sucursal.

## Alcance y limitaciones

La aplicación realiza una **simulación local**. No se procesan pagos, no se programa transporte real ni se genera facturación fiscal. Los datos y pedidos se guardan en el navegador/dispositivo mediante `localStorage`.

La carpeta nativa `android/` no está incluida y no fue modificada. El nombre visible se actualizó en `capacitor.config.json`, conservando el `appId` existente.

## Verificaciones

- `npm test`: 14 pruebas aprobadas.
- Sintaxis JS/JSX e imports relativos: validados.
- `npm run lint` y `npm run build`: pendientes de ejecutar después de `npm ci`, ya que este entorno carece de las dependencias de npm instaladas.

## Cierre final · Entrega flexible y reinicio oculto

- Checkout con **Entrega inmediata** (estimación ilustrativa de 3 horas) y **Entrega por ciclos** (fechas existentes).
- Historial y comprobantes reconocen ambas modalidades; los pedidos siguen sin cobros ni envíos reales.
- UI móvil para ambas opciones de entrega.
- En modo `demo`, 7 toques rápidos en ✦ del encabezado activan una confirmación para reiniciar exclusivamente los datos demo.
