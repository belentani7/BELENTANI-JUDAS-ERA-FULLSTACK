# BELENTANI / OMEGA Studio — corte vertical 2026-08-08

## Resultado

`/art-lab` dejó de ser un formulario de tres sliders. Ahora es una experiencia inmersiva local-first que funciona como estudio diegético dentro de BELENTANI:

- hero procedural OMEGA con Canvas 2D adaptativo;
- tesis espacial y grafo narrativo de siete cámaras;
- registro tipado de 100 instrumentos en diez familias;
- diez motores locales deterministas, sin solicitudes de red;
- artefactos reproducibles con exportación JSON, PNG y WAV;
- conversión real de imágenes PNG, JPEG y WebP en navegador;
- progreso narrativo local y reiniciable;
- minijuego de siete fragmentos;
- Cámara 00 desbloqueable mediante una secuencia clásica de teclado;
- audio únicamente por gesto explícito;
- JUDAS presente como símbolo sellado, sin medio reproducible.

Los 100 instrumentos no se presentan como 100 modelos de IA. Cada definición declara `LOCAL_DETERMINISTIC` y `network: never`. El registro se pagina en bloques de 20 para evitar 100 paradas consecutivas de teclado.

## Archivos principales

- `src/features/studio/toolCatalog.ts`: 100 instrumentos y diez familias.
- `src/features/studio/studioEngine.ts`: motor puro, estable por semilla.
- `src/features/studio/StudioWorld.tsx`: recorrido y coreografía GSAP.
- `src/features/studio/StudioField.tsx`: campo procedural pausado fuera de viewport o pestaña oculta.
- `src/features/studio/StudioWorkbench.tsx`: máquina creativa.
- `src/features/studio/ImageTransmuter.tsx`: conversor real sin upload.
- `src/features/studio/NarrativeConstellation.tsx`: siete cámaras narrativas.
- `src/features/studio/RitualHunt.tsx`: juego y Cámara 00.
- `src/styles/studio-world.css`: sistema visual responsive y reduced motion.
- `tests/e2e/app.spec.ts`: contratos de catálogo, persistencia, audio, teclado, red y exportación.
- `research/award-patterns-2016-2026.md`: síntesis de archivos de premios y case studies.

## Verificación fresca

- `bun run typecheck`: código 0.
- `bun run lint`: código 0, cero warnings.
- `bun run test`: 12/12 tests aprobados en tres archivos.
- `bun run build`: código 0; Studio `14,26 KB gzip`.
- `bunx playwright test tests/e2e/app.spec.ts --grep "OMEGA Studio" --workers=2`: 10/10 aprobados, escritorio y Pixel 7.
- Captura escritorio final: `artifacts/omega-studio-final-full.png`.
- Captura móvil revisada: `artifacts/omega-studio-mobile-full.png`.
- HTTP local `/art-lab`: 200.

## Verificación global parcial

La matriz completa produjo 88 casos: 79 aprobados, 2 omitidos y 7 fallidos tras 8,2 minutos.

- Los diez casos OMEGA aprobaron dentro de la matriz.
- Tres fallos móviles de API fueron `ECONNREFUSED` después de morir el listener reutilizado en `8787`; las tres pruebas API de escritorio habían aprobado antes.
- Cuatro fallos fueron timeouts de Home/JUDAS bajo cuatro workers: carga de Home escritorio, máxima iluminación escritorio, carga JUDAS móvil y el bucle móvil de 20 mundos.
- El primer intento completo superó 368,8 segundos sin resumen.

Estado: `[PARTIAL: matriz E2E global heredada]`. No se declara regresión global cerrada.

## Presupuestos y deuda conocida

- Studio está aislado por lazy loading y pesa `14,26 KB gzip`.
- Bundle común: `143,27 KB gzip`, por encima del objetivo canónico de 110 KB.
- Chunk R3F/Drei heredado: `242,16 KB gzip`; mantiene warning de Vite.
- No se midieron FPS p75, draw calls ni memoria GPU en hardware objetivo.
- El sitio completo aún no cumple la arquitectura multilingüe/HTML sin JavaScript del canon.
- Generación neural remota de imagen, música o vídeo no está conectada. La interfaz no finge que lo está.

## Siguiente corte recomendado

Expandir un pack cada vez con fixtures reales: crop/resize/duotone de imagen, secuenciador y exportación de audio, storyboard/animatic, herramientas de datos/código y QA de accesibilidad. Cada instrumento cambia de receta creativa a operación especializada únicamente cuando su salida y prueba estén implementadas.

No hubo push, despliegue, publicación, subida de archivos ni acceso a credenciales.
