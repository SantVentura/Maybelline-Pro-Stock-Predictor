# Maybelline Pro Stock Predictor — 1.2

Se añadieron: selector de punto de origen para domicilio y por ciclos, conservación del punto al cambiar de modalidad, registro del punto en pedidos e historial, paso de revisión previo a confirmación, aviso no invasivo al añadir al carrito, estados vacíos útiles y número de pedido en la pantalla de confirmación.

El catálogo, las fotos y las 50 sucursales anteriores se conservaron. El mapa depende de recursos en línea para cargar teselas y resolver direcciones sin coordenadas; no se promete disponibilidad en tienda. Las compras y entregas siguen siendo ilustrativas.

Validaciones: `npm test` ejecuta 25 pruebas (incluidas las nuevas reglas de punto de origen). La compilación de producción debe ejecutarse con `npm ci && npm run build` en un entorno con dependencias instalables. No se incluye ni modifica código nativo Android.
