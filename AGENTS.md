# BELENTANI 20 WORLDS

## Alcance

- Preservar proyectos existentes. Este workspace es una evolucion aislada.
- No modificar `manos abiertas deploy` ni repositorios BELENTANI publicados.
- Tratar el corpus movil y Drive como privado hasta revision humana.
- Publicar solo datos, creditos y medios verificados.
- Mantener 15 rutas editoriales y 20 mundos visuales sobre un canon compartido.

## Frontend

- React, TypeScript, Vite, GSAP, Lenis y React Three Fiber.
- WCAG AA, controles de movimiento, foco visible y alternativas a canvas/audio.
- WebGL solo en escenas activas; pausar fuera de vista.
- Cada mundo debe cambiar composicion, tipografia, material y movimiento, no solo color.

## Verificacion

- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`
- Playwright desktop y movil, incluido canvas no vacio.
