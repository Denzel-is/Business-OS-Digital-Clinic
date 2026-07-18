# Frontend module

The frontend foundation is a Next.js App Router application running on Node.js 24 LTS with React, strict TypeScript, Tailwind CSS, Vitest, and Playwright. Stage 4 establishes runtime and quality boundaries only; the visual system and full homepage arrive in stages 5 and 6.

## Architecture

```text
frontend/
├── e2e/                    Playwright browser checks
├── public/                 static public assets
├── src/
│   ├── app/                routes, layouts, metadata, and route states
│   ├── components/         reusable accessible components
│   ├── features/           feature-owned interactive UI (added by feature stages)
│   ├── lib/api/            typed server-side backend boundary
│   └── test/               Vitest setup
├── eslint.config.mjs
├── next.config.ts
├── playwright.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── vitest.config.mts
```

Server Components are the default. Files using browser state, effects, event handlers, or browser-only libraries must declare `"use client"` at the narrowest practical boundary. Backend calls go through `src/lib/api`; browser-visible environment variables must never contain secrets.

GSAP, Framer Motion, and React Three Fiber are installed to satisfy the approved stack, but remain unused until the motion and 3D stages. They must be dynamically imported when introduced.

## Requirements

- Node.js 24 LTS (24.18.0 or newer within major 24).
- npm 11 or newer.
- Playwright Chromium for end-to-end checks.

## Commands

```powershell
npm.cmd ci
npm.cmd run dev
```

```powershell
npm.cmd run format:check
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

The application is available at `http://localhost:3000`. The server-side API client reads `BACKEND_PUBLIC_URL` and defaults to `http://localhost:8080` for local development. Production environments must set the value explicitly at runtime.

## Security baseline

Next.js responses include a baseline Content Security Policy, clickjacking protection, MIME sniffing protection, a restrictive permissions policy, and a referrer policy. HSTS and upgrade-insecure-requests are enabled only for production builds. The current static CSP uses the framework-compatible `unsafe-inline` allowance; nonce-based CSP is intentionally deferred to the security-hardening stage because it would force every route into dynamic rendering and disable CDN-friendly static output.
