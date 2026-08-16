# Auditoría de reutilización desde Downloads — 2026-08-13

## Alcance

- Origen revisado: `Downloads/`, solo lectura.
- Destino: rama `codex/home-cinematic-prototypes-20260807`, commit base observado `e11bbc4`.
- El worktree ya estaba modificado. Esta revisión no altera ni atribuye esos cambios previos.
- Criterio: solo código o medios con procedencia local clara, permiso de publicación y valor incremental verificable.

## Inventario verificable

- 277 rutas cuyo nombre o ruta contiene `belentani`, `judas`, `omega` o `buildai`.
- 316.142.509 bytes en esas rutas: 62 TXT, 53 PNG, 52 HTML, 32 TSX, 18 ZIP, 18 JS y otros formatos.
- 68 archivos relacionados en la raíz de Downloads; 52 hashes SHA-256 únicos.
- 11 grupos de duplicados exactos. Se conservaron todos los originales; no se copió ningún duplicado.
- `belentani-Omega/`: 15 archivos, 58.370 bytes, sin repositorio Git ni licencia local verificable.
- `belentani-judas-escape-mobile/`: 6 archivos, 5.781.280 bytes. Su README declara explícitamente la experiencia y el audio como privados.
- `PROJECTS/judas-experience/`: exportación de proyecto con capturas, archivos de agente y material visual; no se encontró una licencia de reutilización pública.

## Comparación por hash y referencias existentes

| Candidato | SHA-256 | Resultado |
| --- | --- | --- |
| `OMEGA_LIVING_UNIVERSE_MAX.html` | `efd22b6046baadfc91b05c277bab5332a1c17b0e969aadf4e1ddb5e199c24519` | Ya catalogado como `html-0041`, relación `core`, visibilidad `review`. |
| `OMEGA_LIVING_UNIVERSE_OFFLINE.html` | `0bc39b9bc4f35c4962141960768114c400b5909ea94387aa15e75abc6b6d0576` | Ya catalogado como `html-0042`, relación `core`, visibilidad `review`; existe una copia exacta. |
| `belentani_omega_v2.html` | `d248beb59fd3373f641eb5feaab8fb4c62cee846d61cea32578380a81c402c9a` | Referencia visual nueva; usa CDNs y copy biográfico/editorial no verificado. No se integra. |
| `belentani-portal-v2.html` | `fe8a459d4fda94b24382d0fb3d4e5ddf76bcc5ecf9b9f44803d4b1aae5929ee1` | Contiene límites de sello útiles, pero también telemetría simulada y afirmaciones públicas no verificadas. No se integra. |
| `judas-era-pro.html` | `f0196a6c3e158f3185bfb5bedec16641e13ae1756d37652006f6e3c64bbd475c` | Contiene narrativa relacional/biográfica y una entrada marcada privada. Excluido. |
| `Belentani — Órbita Carmesí (...).html` | `4092c5950c7b21f054cc1df89d34553c87b6bae3c0af328e69544e28278227ef` | Captura de servicio externo con URL compartida/código y recursos de terceros. Excluida. |

El patrón visual más reusable de los HTML OMEGA — llave, cinco gemas, escena adaptativa, pausa por visibilidad y movimiento reducido — ya existe en componentes tipados del destino. Copiar la versión autónoma degradaría accesibilidad, mantenimiento y procedencia.

## Exclusiones

- Audio, stems, demos, letras, waveforms, descargas y rutas de reproducción JUDAS.
- Chats, documentos legales/laborales, datos de contacto y narrativa relacional privada.
- Retratos, capturas, imágenes generadas y referencias visuales sin licencia o consentimiento comprobable.
- ZIPs con exportaciones de generadores, depuración, términos de API key o archivos de entorno sin autoría/licencia pública verificable.
- Duplicados exactos y código que ya tiene una implementación más segura en el destino.

## Integración realizada

No se añadió código de ejecución ni medios. Esta auditoría es el único artefacto nuevo: deja hashes, decisiones y límites reproducibles sin exponer el corpus privado dentro de `public/`.

Una integración futura requiere, para cada activo, autoría, licencia o consentimiento explícito, estado `public: true` y una referencia de procedencia estable.
