# Sprint final · Meg & Stv

- Checkout: minipuzle deslizable, compatible con ratón, pantalla táctil y teclado.
- El rompecabezas aparece después de revisar el pedido y debe completarse antes de confirmar una compra simulada.
- Si se editan datos de entrega o pago y se debe revisar de nuevo, el reto se reinicia.
- Estilo definitivo de botones: fondo blanco, borde y texto negros; al pasar el cursor, fondo negro y texto blanco. Incluye la pieza del minipuzle. Los estados seleccionados y acentos de marca conservan el morado.
- Los créditos Meg & Stv y el resto del proyecto no cambian.

**Seguridad:** Este minipuzle es solamente una interacción de demostración en el navegador. No evita bots ni supone autenticación, no tiene verificación en servidor. Si se habilitan pagos reales, se necesita un CAPTCHA real con token validado en el backend, controles de seguridad y una integración certificada de pagos.

**Android:** Tras recompilar el frontend (`npm run build`), ejecutar `npx cap sync android` para actualizar los recursos de la aplicación antes de generar el APK.

## Entrega y compilación

Se entrega el **código fuente actualizado**, junto con el proyecto nativo de Android y los créditos originales. No se incluyen dependencias de `node_modules`, el `dist` anterior ni los recursos web Android compilados previamente, porque serían versiones anteriores al minipuzle.

En el equipo de desarrollo (con Node.js y Android Studio):

```bash
npm ci
npm test
npm run build
npx cap sync android
npx cap open android
```

Desde Android Studio, generar y probar el APK. Para una publicación definitiva, firmar la compilación con una clave privada almacenada fuera del repositorio.

**Nota de validación:** en el entorno de entrega se verificaron 31 pruebas unitarias, sintaxis JSX/JavaScript/CSS y ESLint para los componentes editados. No se pudo completar el build de producción porque faltan los bindings Linux de Rolldown y el entorno no puede descargar dependencias nuevas. El resultado aún requiere la compilación final y prueba visual en dispositivo.
