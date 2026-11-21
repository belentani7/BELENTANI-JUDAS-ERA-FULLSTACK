# BELENTANI — Referencias de diseño verificadas

Investigación pública: 2026-08-13. Este documento registra decisiones de traducción, no una licencia para copiar marcas, fuentes propietarias, ilustraciones o código.

## Principio de síntesis

BELENTANI sigue siendo una obra digital viva: cinematográfica, espacial, monumental y cambiante. Las referencias se usan para afinar jerarquía, densidad, movimiento y comportamiento del shell. La escena conserva el protagonismo; la interfaz orienta y desaparece. JUDAS permanece sellado y no incorpora audio, letra, waveform, master, descarga ni URL de reproducción.

## Referencias Refero Styles

### Active Theory — cosmic void

- Refero: https://styles.refero.design/style/3416bd14-96bb-4c23-bd01-b2ea178ba5ce
- Sitio enlazado por la ficha: https://activetheory.net
- Observado en Refero: negro absoluto, escena WebGL protagonista, portal luminoso, chrome translúcido, bordes finos y acento cromático muy restringido.
- Tomado: shell como marco silencioso; escena a sangre; atmósfera/constelación detrás del menú; superficies ghost con hairlines; una única fuente de luz dominante.
- Descartado: Times como voz de cuerpo, sitio de una sola pantalla, reproducción sonora y copia literal del portal circular/cian-magenta.

### Monad — editorial tech journal

- Refero: https://styles.refero.design/style/fc84e9f0-2058-4a0a-8d26-9cc1ba84ec9c
- Sitio enlazado por la ficha: https://www.monad.com
- Observado en Refero: contraste entre display editorial y anotación mono, hairlines, separación generosa, jerarquía tranquila y un acento funcional reservado.
- Tomado: microtexto mono para coordenadas, estados y grupos; espacio como jerarquía; bordes en lugar de sombras; una sola acción prioritaria por momento.
- Descartado: pergamino claro como canvas, serif dominante, azul Lake Blue, pills y cards redondeadas como lenguaje general. BELENTANI no se convierte en revista ni SaaS.

### GSAP — animated chalkboard

- Refero: https://styles.refero.design/style/00537a20-e99e-4ef2-b119-c6f532c44cc9
- Sitio enlazado por la ficha: https://gsap.com
- Observado en Refero: off-black cálido, crema en vez de blanco puro, títulos desbordados, ghost controls y color usado como taxonomía de movimiento.
- Tomado: crema cálida para lectura; titulares a escala de escena; animación de entrada con `CustomEase`; secuencia escalonada y reversible mediante `gsap.context()`; labels cromáticos vinculados a territorios.
- Descartado: paleta verde/naranja/rosa/azul de GSAP, llaves tipográficas recurrentes y botones pill universales.

### Portal — violet singularity

- Refero: https://styles.refero.design/style/632b65d0-17de-4972-a3d1-63d5ab062ab8
- Observado en Refero: negro/obsidiana, singularidad violeta, titular monumental, luz teatral y portal como motivo principal.
- Tomado: reserva del violeta/luz emisiva para el territorio Portal; profundidad mediante halo localizado; título que actúa como masa visual.
- Descartado: ilustración anime/gaming, cards de features, badges de estados y sombra violeta aplicada a toda la UI.

### Apple España — cathedral whitespace

- Refero: https://styles.refero.design/style/022cf675-42d1-44e7-953a-68facc802117
- Sitio enlazado por la ficha: https://www.apple.com/airpods-pro
- Observado en Refero: un objeto aislado, enorme espacio negativo, jerarquía por escala y pocos controles esenciales.
- Tomado: una pieza central por escena; respiración alrededor del artefacto; reducción de opciones visibles; acciones secundarias dentro del menú-escena.
- Descartado: canvas gris claro, CTA azul, cards de 28 px, imitación de producto comercial y tipografía SF Pro.

### Dala — constellation on black velvet

- Refero: https://styles.refero.design/style/e5f5f8cf-e68d-4ed1-bbf5-6b67569af648
- Sitio enlazado por la ficha: https://dala.craftedbygc.com
- Observado en Refero: constelación procedural, negro puro, escala tipográfica, dos columnas espaciosas y ausencia de panels/cards.
- Tomado: constelación generada con CSS/DOM en el menú; nodos como mapa de territorios; tipografía flotante; profundidad por espacio, no por sombras.
- Descartado: forma cerebral, paleta iris/violeta de marca, fuente PPNeueMontreal y copia de su composición exacta.

## Aplicación en el repositorio

- `src/shell/AppShell.tsx`: menú-escena, mapa de territorios, preview contextual, foco atrapado y animación scoped.
- `src/shell/MotionProvider.tsx`: Lenis único, lock real cuando se abre el menú, CustomEase compartida, reacción al ajuste del sistema y cleanup.
- `src/styles/global.css`: void/crema, constelación procedural, hairlines, foco visible, targets de 44 px y estados reduced motion.
- `src/styles/home-experience.css`: el Home conserva objeto/escena dominante y chrome mínimo.
- `src/data/judasVersions.ts`: la obra sellada mantiene solo reconocimiento simbólico.

## Límites

- Las fichas Refero son análisis de diseño, no prueba de la implementación interna de los sitios enlazados.
- No se descargaron fuentes, imágenes, vídeos, modelos ni código de las referencias.
- No se crearon imágenes nuevas ni se modificaron assets privados.
- La aceptación final exige typecheck, lint, unit tests, build, navegador desktop/móvil, teclado, contraste y reduced motion.
