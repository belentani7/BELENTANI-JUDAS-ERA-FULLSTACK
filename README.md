# BELENTANI / 20 WORLDS

Sistema creativo web para BELENTANI, JUDAS y NOIACORE. Una misma arquitectura
editorial se renderiza en veinte mundos visuales sin cambiar el canon ni la
procedencia del contenido.

Este repositorio es un workspace nuevo y aislado. No reemplaza ni modifica las
versiones BELENTANI ya publicadas.

## Estado

- 16 rutas principales y el subrecorrido `/judas/versions`.
- 20 mundos: 4 familias por 5 composiciones.
- Selector manual, variacion por sesion y URL compartible con `?v=`.
- Escena Three.js/R3F diferida, a pantalla completa y con movimiento reducible.
- `/judas`: recorrido continuo de cinco capítulos, WebGL reactivo, ES/EN/PT/CA
  y obra sellada sin audio, letra, waveform ni URL de reproducción.
- API Node tipada para manifiesto JUDAS, sesión anónima y señales de capítulo.
- Audio generativo de otras rutas activado solo por accion del visitante.
- Cinco identidades del Portal con progreso en `localStorage`.
- Archivo, laboratorio local, formularios editoriales y estados de procedencia.
- Atlas sanitizado de 691 HTML únicos y 854 localizaciones recuperadas.
- Version Lab con 12 relecturas JUDAS originales y tres componentes NOIACORE.
- Sin cuentas, perfiles, cookies, identidad civil ni recopilación de datos personales.

## Ejecucion

Requisitos: Bun y Google Chrome.

```powershell
bun install
bun run dev
```

Abrir `http://127.0.0.1:5173/`. La API escucha en `http://127.0.0.1:8787/`.

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

La suite E2E comprueba las 16 rutas en desktop y Pixel 7, las 20 opciones del
selector, canvas WebGL no uniforme, overflow, audio sin autoplay y persistencia
del Portal. También valida Atlas, las 12 variantes, los cuatro idiomas de JUDAS,
la matriz móvil y la ausencia de peticiones de medios protegidos.

## Arquitectura

- `src/data/`: canon tipado de rutas, capitulos y mundos.
- `src/shell/`: navegacion, estado visual, GSAP, Lenis y preferencias.
- `src/pages/`: experiencias de ruta.
- `src/components/`: escena 3D, Portal, audio y componentes interactivos.
- `src/features/judas-era/`: narrativa, API client, estado, escena R3F y copy multilingüe.
- `server/`: API y servidor de producción sin framework ni base de datos externa.
- `tools/build-html-atlas.ps1`: genera metadatos anónimos desde el manifiesto recuperado.
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
- `docs/SESSION-LEDGER-2026-08-06.md`
- `research/awwwards-100.md`

## Limites Actuales

- No hay despliegue remoto ni dominio configurado.
- Solo se integraron assets ya presentes en el proyecto y autorizados por el usuario;
  el resto del corpus permanece fuera de `public/`.
- La escena 3D esta separada del arranque, pero su chunk de produccion requiere
  seguimiento en dispositivos de GPU limitada.
