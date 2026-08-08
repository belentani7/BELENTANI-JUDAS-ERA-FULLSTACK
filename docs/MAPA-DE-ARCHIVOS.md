# Mapa de archivos — BELENTANI / JUDAS ERA

- Actualizado: 2026-08-08
- Raíz canónica: `C:\Users\USER\Desktop\BELENTANI-JUDAS-ERA-FULLSTACK`
- Rama de trabajo: `codex/omega-studio-20260808`
- Base funcional anterior al mapa: `afd47d9`

Este documento describe el repositorio activo. No convierte archivos históricos, privados o de referencia en material publicable.

## Abrir primero

1. [`README.md`](../README.md): arranque, producción y verificación.
2. [`OMEGA-STUDIO-CUT-2026-08-08.md`](OMEGA-STUDIO-CUT-2026-08-08.md): alcance implementado, pruebas y límites del Studio.
3. [`award-patterns-2016-2026.md`](../research/award-patterns-2016-2026.md): síntesis de patrones premiados.
4. [`SESSION-COMPACTA-2026-08-08.md`](SESSION-COMPACTA-2026-08-08.md): contexto operativo interno; contiene referencias locales y no es documentación pública.

## Inventario controlado

- 97 archivos versionados, contando este mapa.
- 63 archivos bajo `src/`.
- 13 archivos de OMEGA Studio.
- 7 archivos del recorrido JUDAS.
- 6 archivos del Home cinematográfico.
- 2 pruebas E2E y 3 archivos de pruebas unitarias.
- Sin remoto Git configurado.

Comando de verdad para el inventario exacto:

```powershell
git ls-files
```

## Árbol operativo

```text
BELENTANI-JUDAS-ERA-FULLSTACK/
├── README.md                       Entrada operativa
├── package.json                    Scripts y dependencias
├── bun.lock                        Resolución reproducible
├── index.html                      Entrada HTML de Vite
├── vite.config.ts                  Build web
├── playwright.config.ts            Matriz E2E escritorio/móvil
├── eslint.config.js                Reglas estáticas
├── tsconfig*.json                  TypeScript web, Node y servidor
│
├── server/
│   └── index.ts                    Estáticos, CSP y API JUDAS
│
├── src/
│   ├── App.tsx                     Router y carga diferida
│   ├── main.tsx                    Providers y estilos globales
│   ├── components/                 Piezas visuales compartidas
│   ├── data/                       Rutas, temas, Atlas y referencias
│   ├── features/
│   │   ├── home/                   Cuatro direcciones y diamante vivo
│   │   ├── judas-era/              Obra sellada, copy y escena
│   │   └── studio/                 OMEGA Studio y motores locales
│   ├── pages/                      Adaptadores de ruta
│   ├── shell/                      Navegación, mundos y movimiento
│   ├── styles/                     Sistema visual por experiencia
│   └── test/                       Setup de Vitest
│
├── public/media/                   Medios publicados por el build
├── tests/e2e/                      Flujos Playwright
├── tools/                          Inventarios y recuperación
├── docs/                           Handoffs y este mapa
├── research/                       Investigación, no runtime
└── artifacts/                      Referencias históricas controladas
```

## Núcleos de código

### Home

- `src/features/home/CinematicHome.tsx`: composición principal.
- `src/features/home/HomeArtifactScene.tsx`: escenas ritual, archivo y cuerpo.
- `src/features/home/LivingDiamondWorld.tsx`: mundo R3F del Portal.
- `src/features/home/homeDirections.ts`: copy y parámetros de las cuatro direcciones.
- `src/features/home/living-diamond.vertex.glsl`: transformación de partículas.
- `src/features/home/living-diamond.fragment.glsl`: acabado lumínico.

### JUDAS

- `src/features/judas-era/JudasEraExperience.tsx`: recorrido continuo.
- `src/features/judas-era/JudasEraScene.tsx`: escena visual.
- `src/features/judas-era/judasEra.copy.ts`: copy ES/EN/PT/CA.
- `src/features/judas-era/judasEra.types.ts`: contratos.
- `src/features/judas-era/judasEraApi.ts`: cliente de sesión/señal.
- `src/features/judas-era/useJudasEra.ts`: estado y sincronización.
- `src/features/judas-era/judasEra.test.ts`: prueba del sello y contratos.

### OMEGA Studio

- `src/features/studio/StudioWorld.tsx`: composición de la experiencia.
- `src/features/studio/StudioField.tsx`: campo Canvas 2D adaptativo.
- `src/features/studio/StudioWorkbench.tsx`: banco de trabajo.
- `src/features/studio/ToolIndex.tsx`: catálogo paginado.
- `src/features/studio/toolCatalog.ts`: 100 recetas declaradas.
- `src/features/studio/studioEngine.ts`: diez familias deterministas.
- `src/features/studio/studio.types.ts`: tipos y modos de verdad.
- `src/features/studio/ArtifactStage.tsx`: resultados y exportación PNG/WAV/JSON.
- `src/features/studio/ImageTransmuter.tsx`: conversión PNG/JPEG/WebP local.
- `src/features/studio/NarrativeConstellation.tsx`: siete cámaras narrativas.
- `src/features/studio/RitualHunt.tsx`: minijuego y Cámara 00.
- `src/features/studio/useStudioMemory.ts`: memoria local tolerante a fallos.
- `src/features/studio/studioEngine.test.ts`: determinismo, cantidad y contratos.

## Rutas y shell

- `src/App.tsx`: declara rutas especiales y fallback editorial.
- `src/data/routes.ts`: contrato de rutas, relaciones y estado editorial.
- `src/pages/`: diez entradas de página; `/art-lab` carga OMEGA Studio.
- `src/shell/AppShell.tsx`: barra, rail, footer y transición de página.
- `src/shell/MotionProvider.tsx`: GSAP, CustomEase, ScrollTrigger y Lenis.
- `src/shell/WorldProvider.tsx`: veinte mundos visuales y selección de tema.

## Datos y referencias

- `src/data/themes.ts`: veinte temas.
- `src/data/html-atlas.generated.json`: Atlas sanitizado de 691 registros.
- `src/data/htmlAtlas.ts`: acceso tipado al Atlas.
- `src/data/judasVersions.ts`: doce estudios visuales JUDAS.
- `src/data/awwwards-references.json`: referencias estructuradas.
- `research/award-patterns-2016-2026.md`: síntesis profunda.
- `research/awwwards-100.md`: listado amplio; profundidad desigual.

## Medios y artefactos

- `public/media/diamond_scene.png`: imagen del mundo diamante.
- `public/media/judas/*.webp`: tres imágenes visuales autorizadas para la experiencia.
- `artifacts/BELENTANI-NOMBRE-VIVO.html`: experimento autónomo; no sustituye Home, Portal ni JUDAS.
- `artifacts/references/`: capturas históricas; referencia, no runtime.
- `artifacts/portal-maximum-illumination-clicked.png`: evidencia visual puntual.

`artifacts/` está ignorado para nuevas salidas, aunque cuatro piezas históricas permanecen versionadas deliberadamente.

## Pruebas y herramientas

- `src/data/data.test.ts`: rutas, temas, Atlas y referencias.
- `src/features/judas-era/judasEra.test.ts`: privacidad y sello.
- `src/features/studio/studioEngine.test.ts`: catálogo y determinismo.
- `tests/e2e/app.spec.ts`: rutas, accesibilidad, Studio, Portal y API.
- `tests/e2e/maximum-illumination.spec.ts`: crescendo del diamante.
- `tools/build-html-atlas.ps1`: reconstrucción del Atlas.
- `tools/collect-awwwards.ps1`: recopilación de referencias.
- `tools/extract-mtp-corpus.ps1`, `index-mtp.ps1`, `select-mobile-corpus.ps1`: inventario local; no publican materiales.

## Generado o local, fuera del código fuente

- `node_modules/`: dependencias.
- `dist/`: build web.
- `dist-server/`: build del servidor.
- `runtime/`: eventos locales de sesión; tratar como dato privado.
- `test-results/`, `playwright-report/`, `coverage/`: evidencias temporales.
- `.env*`: secretos locales, excepto un futuro `.env.example` sin claves.
- `research/private-corpus/`: investigación privada excluida.
- `public/media/candidates/`: candidatos sin autorización de publicación.

## Fronteras

- JUDAS permanece sellado: el frontend no contiene audio, letra, waveform, master ni URL de reproducción privada.
- `SESSION-COMPACTA-2026-08-08.md` y `runtime/` son internos.
- El Atlas representa archivos históricos sin ejecutarlos ni publicar rutas locales.
- Las variantes preservadas fuera de esta raíz no se fusionan automáticamente.
- Ningún cambio se publica o despliega desde este mapa.

## Estado verificado más reciente

- `bun run lint`: aprobado.
- `bun run build`: aprobado con advertencia heredada del chunk R3F/Drei.
- `bun run test`: 12/12.
- E2E focal de memoria/cámaras: 4/4.
- E2E focal CSP/API: 2/2.
- Matriz E2E completa pendiente de repetición; último registro: 79 aprobados, 2 omitidos y 7 fallidos.
