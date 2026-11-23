# Guía de imágenes · Maybelline Pro Stock Predictor

**Objetivo:** incorporar 26 productos adicionales sin alterar los seis existentes.

Las fichas oficiales se enlazan para que descargues las fotos de las variantes que elijas. Guarda cada archivo en `src/assets/img/` con el **nombre exacto** indicado a continuación.

> Los nombres de tonos/variantes provienen de fichas oficiales cuando fueron accesibles. Los colores hex son aproximaciones visuales, no muestras certificadas. Para el producto Teddy Tint se contrastaron los nombres de tonos con el catálogo regional de Maybelline Perú; verifica su disponibilidad local.

> Los precios y calificaciones del archivo JS son **solo de ejemplo**, porque el sitio colombiano no publica una lista de precios de venta directa ni reseñas con calificaciones comparables. No son cotizaciones oficiales.

## Integración posterior

1. Copia `extraProducts.js` en `src/data/`.
2. Conserva tal cual tus seis objetos originales en `src/data/products.js`.
3. Agrega arriba de `products.js`: `import additionalProducts from "./extraProducts";`
4. Reemplaza **únicamente** la línea final `export default products;` por `export default [...products, ...additionalProducts];`
5. Una vez descargadas las imágenes con sus nombres correctos, ejecuta `npm run dev`. Las imágenes que aún falten aparecerán vacías hasta que las agregues.

## Productos y archivos

### 7. Cloudtopia Rubor en Mousse — Rostro

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-rostro/rubor-y-bronceador/cloudtopia-cheek-and-lip-blush-mousse

Rubor en mousse para mejillas y labios con textura ligera, acabado mate y color modulable. Útil para registrar las variantes de tu kit.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Divine Crimson | `CloudtopiaRuborenMousseDivineCrimson.jpg` |
| Coral Illusion | `CloudtopiaRuborenMousseCoralIllusion.jpg` |
| Enchanted Mauve | `CloudtopiaRuborenMousseEnchantedMauve.jpg` |

### 8. Sunkisser Rubor Multiuso y Bronzer — Rostro

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-rostro/rubor-y-bronceador/sunkisser-hazy-matte-blush

Producto líquido para aportar color y efecto bronceado a las mejillas. Se puede difuminar por capas para regular la intensidad.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Clouds | `SunkisserRuborMultiusoyBronzerClouds.jpg` |
| Berry | `SunkisserRuborMultiusoyBronzerBerry.jpg` |
| Peachy | `SunkisserRuborMultiusoyBronzerPeachy.jpg` |

### 9. Sunkisser Blush Rubor Líquido — Rostro

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-rostro/rubor-y-bronceador/sunkisser-blush

Rubor líquido con vitamina E y aplicador amplio para crear un acabado luminoso. Agrega la variante que utilices a tu inventario.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Sol Search | `SunkisserBlushRuborLiquidoSolSearch.jpg` |

### 10. Superstay Lumi-Matte Base de Maquillaje — Rostro

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-rostro/base-de-maquillaje/superstay-lumi-matte

Base líquida de cobertura alta con sensación ligera y acabado luminoso-mate. Diseñada para resistir agua y sudor.

| Tono / variante | Archivo que debes guardar |
|---|---|
| 120 | `SuperstayLumiMatteBasedeMaquillaje120.jpg` |
| 125 | `SuperstayLumiMatteBasedeMaquillaje125.jpg` |
| 128 | `SuperstayLumiMatteBasedeMaquillaje128.jpg` |

### 11. Facestudio Lasting Fix Spray Mate — Rostro

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-rostro/prebase/spray-fijador-acabado-mate-facestudio-lasting-fix

Spray fijador que ayuda a prolongar el maquillaje y a mantener un acabado mate durante el día.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Presentación única | `FacestudioLastingFixSprayMatePresentacionunica.jpg` |

### 12. Instant Age Rewind Corrector — Rostro

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-rostro/corrector/instant-age-rewind-corrector-eraser

Corrector con aplicador en esponja para disimular ojeras e imperfecciones y aportar luminosidad al contorno de ojos.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Light | `InstantAgeRewindCorrectorLight.jpg` |
| Sand | `InstantAgeRewindCorrectorSand.jpg` |
| Medium | `InstantAgeRewindCorrectorMedium.jpg` |

### 13. Superstay Active Wear 30H Corrector — Rostro

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-rostro/corrector/super-stay-active-wear-30h

Corrector de alta cobertura y textura ligera, pensado para acompañar looks duraderos sin sensación pesada.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Tono 15 | `SuperstayActiveWear30HCorrectorTono15.jpg` |

### 14. Fit Me Fresh Tint SPF50 — Rostro

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-rostro/base-de-maquillaje/fit-me-fresh-tint

Tinte facial de cobertura natural con SPF 50 y vitamina C. Una opción ligera para registrar por numeración de tono.

| Tono / variante | Archivo que debes guardar |
|---|---|
| 01 | `FitMeFreshTintSPF5001.jpg` |
| 02 | `FitMeFreshTintSPF5002.jpg` |
| 03 | `FitMeFreshTintSPF5003.jpg` |

### 15. Lifter Liner Delineador de Labios — Labios

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-labios/lip-liner/lifter-liner

Lápiz para definir el contorno de los labios, con textura cremosa y fórmula que incorpora ácido hialurónico.

| Tono / variante | Archivo que debes guardar |
|---|---|
| FINE LINE | `LifterLinerDelineadordeLabiosFINELINE.jpg` |
| PEAKING | `LifterLinerDelineadordeLabiosPEAKING.jpg` |
| ON IT | `LifterLinerDelineadordeLabiosONIT.jpg` |

### 16. Superstay Teddy Tint Tinta de Labios — Labios

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-labios/labiales/superstay-teddy-tint

Tinta labial de acabado mate difuminado, textura suave y duración prolongada. Permite organizar tus colores favoritos.

| Tono / variante | Archivo que debes guardar |
|---|---|
| CURRENT MOOD | `SuperstayTeddyTintTintadeLabiosCURRENTMOOD.jpg` |
| BABY TEE | `SuperstayTeddyTintTintadeLabiosBABYTEE.jpg` |
| KNEEHIGH | `SuperstayTeddyTintTintadeLabiosKNEEHIGH.jpg` |

### 17. Lifter Plump Gloss Brillo Labial — Labios

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-labios/brillo-labial/lifter-plump

Brillo labial de efecto voluminizador con ingredientes como ácido hialurónico y chile; puede producir sensación de calor.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Hot Honey | `LifterPlumpGlossBrilloLabialHotHoney.jpg` |
| Blush Blaze | `LifterPlumpGlossBrilloLabialBlushBlaze.jpg` |
| Pink Sting | `LifterPlumpGlossBrilloLabialPinkSting.jpg` |

### 18. Lifter Gloss con Ácido Hialurónico — Labios

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-labios/brillo-labial/lifter-gloss-con-acido-hialuronico

Brillo labial con ácido hialurónico, pensado para aportar luminosidad y un aspecto hidratado a los labios.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Pearl | `LifterGlossconAcidoHialuronicoPearl.jpg` |
| Moon | `LifterGlossconAcidoHialuronicoMoon.jpg` |
| Rust | `LifterGlossconAcidoHialuronicoRust.jpg` |

### 19. Super Stay Vinyl Ink Pinks — Labios

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-labios/labiales/super-stay-vinyl-ink-pinks

Colección de labiales líquidos en tonos rosados con acabado brillante tipo vinilo y duración prolongada.

| Tono / variante | Archivo que debes guardar |
|---|---|
| EDGY | `SuperStayVinylInkPinksEDGY.jpg` |
| ROGUE | `SuperStayVinylInkPinksROGUE.jpg` |
| SULTRY | `SuperStayVinylInkPinksSULTRY.jpg` |

### 20. Superstay Vinyl Ink Labial Líquido — Labios

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-labios/labiales/super-stay-vinyl-ink

Labial líquido de color intenso y acabado vinilo brillante. Incluye diferentes opciones para combinar con el maquillaje.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Cheeky | `SuperstayVinylInkLabialLiquidoCheeky.jpg` |
| Coy | `SuperstayVinylInkLabialLiquidoCoy.jpg` |
| Red-Hot | `SuperstayVinylInkLabialLiquidoRedHot.jpg` |

### 21. Super Stay Matte Ink Labial Líquido — Labios

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-labios/labiales/super-stay-matte-ink-liquid-lipstick

Labial líquido mate con pigmentación intensa y aplicador de precisión. Puedes manejar cada tono como una variante de stock.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Dreamer | `SuperStayMatteInkLabialLiquidoDreamer.jpg` |
| Amazonian | `SuperStayMatteInkLabialLiquidoAmazonian.jpg` |
| Pioneer | `SuperStayMatteInkLabialLiquidoPioneer.jpg` |

### 22. Lash Sensational Body Máscara — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/mascara/lash-sensational-body-mascara-de-pestanas

Máscara de pestañas con cepillo de doble hélice para dar volumen y elevación mediante capas ligeras.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Waterproof | `LashSensationalBodyMascaraWaterproof.jpg` |
| Washable | `LashSensationalBodyMascaraWashable.jpg` |

### 23. Super Lock Clear Gel de Cejas — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/cejas/super-lock-gel-de-cejas

Gel transparente para peinar y fijar las cejas, con fórmula resistente al sudor y a las transferencias.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Transparente | `SuperLockClearGeldeCejasTransparente.jpg` |

### 24. Colossal Bubble Máscara de Pestañas — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/mascara/colossal-bubble

Máscara voluminizadora con cepillo diseñado para separar las pestañas y aportar un efecto de volumen ligero.

| Tono / variante | Archivo que debes guardar |
|---|---|
| A Prueba de Agua | `ColossalBubbleMascaradePestanasAPruebadeAgua.jpg` |
| Lavable | `ColossalBubbleMascaradePestanasLavable.jpg` |

### 25. Build A Brow 2 en 1 — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/cejas/build-a-brow

Rotulador para perfilar las cejas y gel fijador en un mismo producto, para definir trazos de apariencia natural.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Soft Brown | `BuildABrow2en1SoftBrown.jpg` |
| Medium Brown | `BuildABrow2en1MediumBrown.jpg` |
| Deep Brown | `BuildABrow2en1DeepBrown.jpg` |
 aca va mi amor lindo
### 26. Lash Sensational Sky High — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/mascara/lash-sensational-sky-high

Máscara para alargar y dar volumen a las pestañas con cepillo flexible que ayuda a cubrirlas de raíz a puntas.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Waterproof | `LashSensationalSkyHighWaterproof.jpg` |
| Very Black | `LashSensationalSkyHighVeryBlack.jpg` |
| Cosmic Black | `LashSensationalSkyHighCosmicBlack.jpg` |

### 27. Volum Express The Colossal — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/mascara/mascara-volum-express-the-colossal

Máscara con megacepillo para lograr volumen destacado en las pestañas y una aplicación sin grumos.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Classic Black | `VolumExpressTheColossalClassicBlack.jpg` |
| Glam Black | `VolumExpressTheColossalGlamBlack.jpg` |

### 28. Lash Sensational Firework — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/mascara/lash-sensational-firework-mascara

Máscara con cepillo flexible de efecto 360 grados para alargar y aportar volumen a las pestañas.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Waterproof | `LashSensationalFireworkWaterproof.jpg` |
| Lavable | `LashSensationalFireworkLavable.jpg` |
| Electro Black WTP | `LashSensationalFireworkElectroBlackWTP.jpg` |

### 29. Tattoo Liner Dip In — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/delineador-de-ojos/tattoo-liner-dip-in

Delineador líquido de punta fina para trazos precisos y definidos con pigmentación negra intensa.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Negro | `TattooLinerDipInNegro.jpg` |

### 30. Color Rivals Duo Paleta de Sombras — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/sombra-de-ojos/color-rivals

Dúo de sombras de ojos que combina acabados mates y brillantes para construir looks de diferentes intensidades.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Assertive x Coy | `ColorRivalsDuoPaletadeSombrasAssertivexCoy.jpg` |
| Extra x Lowkey | `ColorRivalsDuoPaletadeSombrasExtraxLowkey.jpg` |
| Urban x Wild | `ColorRivalsDuoPaletadeSombrasUrbanxWild.jpg` |

### 31. Tattoo Brow Gel 3D — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/cejas/tattoo-brow-gel-3d

Gel con color para definir y estilizar las cejas con un aplicador de precisión y acabado natural.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Warm | `TattooBrowGel3DWarm.jpg` |
| Deep Brown | `TattooBrowGel3DDeepBrown.jpg` |
| Medium Brown | `TattooBrowGel3DMediumBrown.jpg` |

### 32. The Falsies Lash Lift Máscara — Ojos

Ficha oficial: https://www.maybelline.co/todos-los-productos/maquillaje-para-ojos/mascara/maquillaje-de-ojos-mascara-de-pestanas-a-prueba-de-agua-the-falsies-lash-lift

Máscara de pestañas con cepillo de doble curvatura para crear un efecto elevado, con longitud y volumen.

| Tono / variante | Archivo que debes guardar |
|---|---|
| Blackest Black | `TheFalsiesLashLiftMascaraBlackestBlack.jpg` |
