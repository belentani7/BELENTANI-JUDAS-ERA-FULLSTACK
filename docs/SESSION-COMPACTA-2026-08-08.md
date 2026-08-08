# BELENTANI — sesión compacta 2026-08-08

## Decisión ejecutiva

La base activa sigue siendo `BELENTANI-JUDAS-ERA-FULLSTACK`. No se sustituyó por los HTML pegados de GLM. El mundo `portal` conserva React, React Three Fiber, Drei y shaders separados; incorpora ahora un crescendo automático de iluminación a los 9 segundos, activación manual accesible y una onda expansiva sincronizada con el pico.

`BELENTANI · El nombre vivo` queda preservado como experimento autónomo en `artifacts/BELENTANI-NOMBRE-VIVO.html`. No reemplaza Home, Portal ni JUDAS.

## Evidencia local verificada

- Audio privado localizado: `C:\Users\USER\Downloads\Judas demo pura de Pedro Belentani.mp3`.
- Imágenes localizadas en Downloads: cuatro de las cinco referencias pegadas.
- Los cuatro archivos `Pasted Content_*.txt` no aparecieron en Downloads, Desktop ni Documents; su texto solo consta en la conversación.
- Las creaciones de archivos descritas en el razonamiento pegado de GLM no existían en los repos BELENTANI revisados.
- La implementación real del diamante ya existía como `src/features/home/LivingDiamondWorld.tsx` con 4.200 partículas GPU, IOR 2.417 y fallback compacto.

## Correcciones frente a los snippets pegados

- “Cero dependencias” era falso: el nombre vivo cargaba Google Fonts; el diamante cargaba Three.js r128 desde CDN.
- “Cuatro motores” contenía tres entregables: HTML/JS, generador OBJ y Blender Python.
- El crescendo del HTML dependía de FPS; la implementación integrada usa `delta` y amortiguación temporal.
- Los render targets del HTML no se redimensionaban.
- El script Blender compartía un material entre todos los sparks, insertaba keyframes en `location` en vez de emisión y usaba `s.materials` en lugar de `s.data.materials`; no estaba verificado como ejecutable.
- El modelo del nombre es heurístico y local. Observa interacción limitada; no es IA ni lectura psicológica.

## Git y preservación

El worktree apuntaba a metadatos Git inexistentes. El puntero roto se preservó como `.git-broken-worktree-pointer-20260808.txt`. Se creó un repositorio nuevo y el contenido recuperado quedó fijado en el commit base `8c325e4` antes de la nueva implementación. El historial anterior no fue reconstruido.

## Límites vigentes

- Audio, voz, letra y masters de JUDAS permanecen privados y fuera del frontend público.
- La petición de clonar la voz propia autoriza una prueba privada, no una publicación ni entrenamiento con voces de terceros.
- Las referencias a artistas vivos se traducen a rasgos musicales generales; no se replica su identidad artística.
- Próximo paso musical seguro: piloto privado de una canción con stem vocal limpio y consentimiento confirmado, antes de escalar a un álbum.

## Verificación requerida

Ejecutar y conservar salida de:

```powershell
bun run typecheck
bun run lint
bun run test
bun run build
bun run test:e2e
```

Revisar además `?direction=portal` en escritorio, móvil y `prefers-reduced-motion`.

## Verificación ejecutada

- `bun run typecheck`: aprobado, código 0.
- `bun run lint`: aprobado, código 0.
- `bun run test`: 9/9 tests aprobados.
- `bun run build`: aprobado; advertencia pendiente del chunk `Sparkles` de 897,63 kB minificado / 242,16 kB gzip.
- JavaScript de `BELENTANI-NOMBRE-VIVO.html`: sintaxis aprobada con `node --check`.
- Prueba E2E nueva de máxima iluminación: 2/2 aprobada en `desktop-chromium` y `mobile-chromium`.
- Verificación directa Playwright: HTTP 200, canvas WebGL presente, `aria-pressed=true`, texto actualizado y `data-illuminated=true`.
- Evidencia visual: `artifacts/portal-maximum-illumination-clicked.png`.
- [PARTIAL] La matriz E2E completa excedió 240 segundos sin emitir resumen. No se considera aprobada en esta sesión.
