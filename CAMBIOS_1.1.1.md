# Maybelline Pro Stock Predictor · ajustes 1.1.1

## Cambios
- El registro de un artículo desde el catálogo inicial o desde el formulario manual muestra una confirmación centrada, con cierre y desaparición automática.
- La navegación utiliza pestañas de subrayado morado, en lugar de píldoras; los botones de acción conservan el estilo redondeado.
- Checkout: ahora se puede escribir el nombre del banco en PSE y el campo del titular de tarjeta dice «Nombre».
- El modo `demo` permite confirmar pedidos **simulados** (`screens.checkout.demo.confirm = true`), sin activar transacciones reales; mantiene las demás restricciones individuales.
- El mapa cuenta con 50 sucursales (20 anteriores + 30 sucursales Farmatodo publicadas por el distribuidor), búsqueda y filtro por cadena.
- Al tocar una tarjeta en la lista, la página se desplaza suavemente al mapa y el mapa intenta ubicar la sucursal; al tocar un marcador, se hace visible la tarjeta de esa sucursal.

## Geolocalización de las sucursales
Las 30 direcciones de Farmatodo se extrajeron de https://www.farmatodo.com.co/tiendas . Las direcciones de Éxito se consultan en https://www.exito.com/almacenes-exito . Los nombres y direcciones de sucursales son distintos de un inventario verificado; no se garantiza la disponibilidad Maybelline ni un servicio real de recogida.

Los puntos sin latitud/longitud comprobadas se mantienen en la lista. Al seleccionar una sucursal se intenta ubicarla mediante una consulta individual al servicio Nominatim (https://operations.osmfoundation.org/policies/nominatim/); no se realizan consultas masivas al abrir el mapa. Se cachean resultados localmente para reducir consultas. Si no es posible geocodificar el punto, el enlace «Cómo llegar» funciona igualmente.

### Consideraciones para publicación
El servicio público Nominatim tiene límites de uso estrictos y no debe utilizarse para geocodificación masiva ni alto tráfico. Antes de distribuir a muchos usuarios, generar un catálogo propio de coordenadas verificadas o usar un proveedor de geocodificación compatible con la escala del proyecto. El mapa base usa teselas de OpenStreetMap y requiere conexión.

## Probar localmente
```bash
npm ci
npm test
npm run dev
npm run build
```

El proyecto descargado no incluye `node_modules` ni la carpeta nativa `android/`. No instalar ni sincronizar Android hasta verificar el build web. Los pagos y las entregas siguen siendo simulados.
