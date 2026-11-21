# Home canónica — Matriz de aceptación

Estado objetivo: `QUINTESSENCE / LA QUINTA MATERIA / UMBRAL VIVO` en `/`. Las variantes históricas solo aparecen con `?lab=home&direction=<id>`.

| Criterio | Evidencia automatizada | Aceptación |
| --- | --- | --- |
| Canon público | `/` y `/?direction=ritual` resuelven `data-direction="quintessence"` | Obligatoria |
| Cinco prototipos preservados | Query `?lab=home&direction=ritual` expone cinco selectores | Obligatoria |
| Dramaturgia | DOM registra `dormancy`, `memory`, `convergence`, `shockwave`, `threshold` | Obligatoria |
| Entidad y acciones | Una figura descrita; botones `Reunir`, `Dispersar`; enlace `Entrar` | Obligatoria |
| Acceso | Axe focal sin violaciones; teclado, touch y foco operables | Obligatoria |
| Movimiento reducido | Fallback estático alcanza el mismo estado `threshold` | Obligatoria |
| Rendimiento | Drei `PerformanceMonitor` adapta DPR y partículas | Obligatoria |
| Resiliencia WebGL | `webglcontextlost` muestra fallback y `webglcontextrestored` recupera Canvas | Obligatoria |
| Privacidad | Home no solicita audio, vídeo ni rutas `/media/judas/` | Bloqueante |
| Publicación | Sin push, deploy ni exposición de JUDAS | Bloqueante |

Verificación: `bun run typecheck`, `bun run lint`, `bun run test`, `bun run build` y `bunx playwright test tests/e2e/home-quintessence.spec.ts`.
