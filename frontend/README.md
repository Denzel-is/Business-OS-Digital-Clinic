# Frontend module

The frontend is a Next.js App Router application running on Node.js 24 LTS with React, strict
TypeScript, Tailwind CSS, Vitest, and Playwright. It includes the public marketing experience,
Business Diagnostic, project breakdowns, Security Center, contact flow, authentication BFF, and
protected administration shell.

## Architecture

```text
frontend/
├── e2e/                    Playwright browser checks
├── public/                 static public assets
├── src/
│   ├── app/                routes, layouts, metadata, and route states
│   ├── components/         accessible foundation and UI primitives
│   │   └── motion/         isolated Framer, GSAP, and R3F client boundaries
│   ├── content/            immutable editorial content and labels
│   ├── features/           feature-owned interactive UI
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

Framer Motion owns lightweight reveals, the Spotlight heading, and Hero parallax. Business Vitals
dynamically imports GSAP ScrollTrigger, while Security Pulse dynamically imports the only React
Three Fiber scene.

## Design system

The live component catalog is available at `http://localhost:3000/design-system`. Semantic color, typography, radius, and shadow tokens are defined in `src/app/globals.css`; reusable primitives live in `src/components/ui`. See `../docs/DESIGN_SYSTEM.md` for usage and accessibility rules.

Manrope Variable and IBM Plex Mono are packaged with the application and do not require a font CDN. Lucide SVG icons replace emoji-based interface decoration.

## Homepage

The `/` route contains a compact competence strip, Hero process map, Business Health Indicator,
sticky Business Vitals, Digital Symptoms, treatment approach, solutions, featured demo cases,
Security Pulse, named creator/contact section, and the final diagnostic CTA. Server Components own
content while isolated client boundaries provide motion. A persisted dark/light theme uses the
same semantic token system.

The `/diagnostic` route contains a 12-step React Hook Form wizard. Eleven enumerated process answers are validated with Zod and sent through the same-origin `/api/diagnostic/evaluate` proxy. The twelfth contact step is optional and stays in browser memory; its fields are never included in the evaluation payload. The Java backend owns scoring and recommendation rules.

The `/projects` route filters immutable case records across all eight required categories. Six `/projects/[slug]` routes are generated statically. Every list and detail view retains its Concept, Educational, Personal, or Demo label plus a visible limitation and verification signals; there are no claimed clients, testimonials, or measured outcomes.

The `/security` route presents all 16 required controls with evidence-backed `Implemented`, `Foundation`, or `Planned` states. Its educational lab sends a strict two-field request through `/api/security/input-validation`; the returned preview is rendered as text and the lab neither executes input nor probes another system.

The `/admin/login` route authenticates through same-origin BFF routes. `/admin` and
`/admin/[section]` are server-rendered protected views backed by the Java API. The frontend hides
system links from editors and redirects anonymous users for usability, while the backend remains
the authority for every permission decision.

The `/contact` route uses a strict same-origin contact BFF, consent UI, a non-visible honeypot,
optional Turnstile rendering, direct creator Telegram contact, route-specific CSP allowances only
when a site key exists, and `robots.txt` exclusions for admin and API paths.

Focused tests cover the contact form, consent boundary, strict contact contract, theme persistence,
reduced motion, ADMIN/EDITOR resource policy, backend cookie allowlist, and browser journeys. See
`../docs/TESTING.md`.

The Hero uses a code-native animated process map instead of an unapproved stock or generated video.
Production video requirements and reduced-motion behavior are defined in
`../docs/MEDIA_GUIDE.md`. Homepage claims and demo labeling rules are defined in
`../docs/CONTENT_GUIDE.md`.

Framer Motion provides lightweight reveals and Hero parallax. Business Vitals dynamically imports GSAP ScrollTrigger, while Security Pulse dynamically imports the only React Three Fiber scene. Reduced-motion mode keeps all content static and avoids loading GSAP or Three.js; narrow viewports also use the static security model. The complete contract is documented in `../docs/MOTION_GUIDE.md`.

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

Next.js responses include a baseline Content Security Policy, clickjacking protection, MIME
sniffing protection, a restrictive permissions policy, and a referrer policy. HSTS and
upgrade-insecure-requests are enabled only for production builds. The current static CSP uses the
framework-compatible `unsafe-inline` allowance; a nonce-based policy would force every route into
dynamic rendering and is an explicit deployment/performance tradeoff rather than a claimed
control.
