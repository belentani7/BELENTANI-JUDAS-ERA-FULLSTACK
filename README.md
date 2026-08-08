# BELENTANI / JUDAS ERA — FULL STACK

Experiencia React 19 + TypeScript + Vite con R3F/Drei/Three.js, GSAP y Lenis. Incluye servidor Bun/Node, API de sesiones/señales, archivo, atlas, laboratorio, portal y JUDAS sellado.

## Arranque

```powershell
bun install
bun run dev
```

- Web: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:8787/api/health`

## Producción

```powershell
bun run build
bun run start
```

El servidor publica `dist/` y las rutas `/api/health`, `/api/judas-era`, `/api/judas-era/session` y `/api/judas-era/signal`.

## Verificación

```powershell
bun run verify
```

Ejecuta tipos, ESLint, Vitest, build y Playwright en escritorio/móvil. La experiencia respeta teclado, movimiento reducido y activación voluntaria de audio. Los masters privados de JUDAS permanecen fuera del frontend.
