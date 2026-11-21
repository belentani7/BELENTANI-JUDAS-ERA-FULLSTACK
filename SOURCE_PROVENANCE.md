# JUDAS / 20 Worlds source restoration

Recovered original code and configuration from canonical local project `BELENTANI-CODER-WORKSPACE/canonical-projects/BELENTANI-JUDAS-ERA-FULLSTACK` on 2026-11-21.

Only source, tests, public assets and basic build documentation are included. Historical session ledgers, internal research and artifacts stay in protected local backup; this is a PUBLIC GitHub repository.

The README describes intended 20-world scope; the build and automated test results are documented only after verification. No production deployment or browser QA is implied by source recovery.

## Reproducible verification (2026-11-21)

- `pnpm install --frozen-lockfile --ignore-scripts`: successful with 349 packages. Bun is not installed; Bun dev scripts are not claimed tested.
- `pnpm run typecheck`: 0 errors after restoring `.glsl?raw` module declarations.
- `pnpm run typecheck:server`: 0 errors.
- `pnpm run lint`: 0 errors/warnings.
- `pnpm run build`: production Vite (2531 modules) + Node server bundle passed. React/Three.js chunk approx. 916 kB is a performance warning.
- `pnpm run test`: 4 test suites, **17/17 tests passed**.
- Local HTTP smoke (Node server bound to localhost only): GET `/api/health`, `/api/judas-era`, `/`, `/judas`, `/atlas` all HTTP 200. Test server terminated afterward.
- Not tested: complete Playwright browser suite, mobile GPU, 20-world user navigation end-to-end, real deployment.
