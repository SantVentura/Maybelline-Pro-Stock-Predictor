# Ajuste final del mapa · Maybelline Pro Stock Predictor 1.2

- El mapa Leaflet dibuja **tres marcadores principales** al abrirlo: Farmatodo Parque 93, Éxito Chapinero y Éxito Country.
- Los **50 puntos de venta** siguen en el buscador, listado y selector del checkout.
- Al elegir uno de los otros 47 puntos, se crea **solo un marcador adicional** (morado), centrándolo en el mapa. Si se elige otro, desaparece el marcador temporal anterior.
- Los tres marcadores principales son de color naranja; el marcador seleccionado se resalta en morado.
- Si una dirección no tiene coordenadas almacenadas, se intenta ubicar **solo al seleccionarla**, con caché local y sin hacer solicitudes masivas. Si falla, se conserva el enlace de indicaciones «Cómo llegar».
- No se alteraron las reglas de carrito, inventario, ciclos, pago simulado ni recogida.

## Comprobación

Ejecutar desde la raíz del proyecto:

```bash
npm ci
npm test
npm run build
```

Probar manualmente: abrir mapa sin selección (3 marcadores), elegir una sucursal adicional (4), elegir otra (siguen 4), volver a un punto principal (3), escogerla para recogida y comprobar el checkout.

**Nota:** La disponibilidad de productos, tonos y servicios de entrega/recogida en esas sucursales no está verificada por la aplicación. Se trata de una simulación.
