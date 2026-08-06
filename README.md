# BELENTANI / 20 WORLDS

Sistema creativo web para BELENTANI, JUDAS y NOIACORE. Una misma arquitectura
editorial se renderiza en veinte mundos visuales sin cambiar el canon ni la
procedencia del contenido.

Este repositorio es un workspace nuevo y aislado. No reemplaza ni modifica las
versiones BELENTANI ya publicadas.

## Estado

- 15 rutas principales.
- 20 mundos: 4 familias por 5 composiciones.
- Selector manual, variacion por sesion y URL compartible con `?v=`.
- Escena Three.js/R3F diferida, a pantalla completa y con movimiento reducible.
- Audio generativo local activado solo por accion del visitante.
- Cinco identidades del Portal con progreso en `localStorage`.
- Archivo, laboratorio local, formularios editoriales y estados de procedencia.
- Sin API remota, cuentas, perfiles ni recopilacion de datos.

## Ejecucion

Requisitos: Bun y Chromium de Playwright.

```powershell
bun install
bunx playwright install chromium
bun run dev --port 4173
```

Abrir `http://127.0.0.1:4173/`.

Ejemplos de mundos compartibles:

```text
http://127.0.0.1:4173/?v=paper-archive
http://127.0.0.1:4173/?v=black-mirror
http://127.0.0.1:4173/?v=acid-console
```

## Verificacion

```powershell
bun run typecheck
bun run lint
bun run test
bun run build
bun run test:e2e
```

La suite E2E comprueba las 15 rutas en desktop y Pixel 7, las 20 opciones del
selector, canvas WebGL no uniforme, overflow, audio sin autoplay y persistencia
del Portal. La matriz movil recorre los veinte mundos de JUDAS.

## Arquitectura

- `src/data/`: canon tipado de rutas, capitulos y mundos.
- `src/shell/`: navegacion, estado visual, GSAP, Lenis y preferencias.
- `src/pages/`: experiencias de ruta.
- `src/components/`: escena 3D, Portal, audio y componentes interactivos.
- `src/styles/`: sistema base, paginas y variaciones de mundo.
- `tests/e2e/`: pruebas de navegador y pixeles de canvas.
- `docs/`: concepto, decisiones y arquitectura narrativa.
- `research/`: referencias verificadas y corpus privado ignorado por Git.

## Procedencia

Todo contenido publicable debe declarar:

```text
realityMode: REAL | MITO | ENTRELAZADO
certainty: VERIFIED | EDITORIAL | PENDING
source: archivo o referencia
consent: confirmado | pendiente | no aplica
public: true | false
```

`research/private-corpus/` contiene material local de trabajo y permanece fuera
de Git. Retratos, audio, manuscritos y documentos personales no deben moverse a
`public/` sin revisar autoria, consentimiento y derechos.

## Documentos

- `docs/BELENTANI-JUDAS-ARQUITECTURA-PSICOLOGICA-MASIVA.txt`
- `research/awwwards-100.md`

## Limites Actuales

- No hay despliegue remoto ni dominio configurado.
- Los assets privados siguen pendientes de derechos y curacion.
- La escena 3D esta separada del arranque, pero su chunk de produccion requiere
  seguimiento en dispositivos de GPU limitada.
