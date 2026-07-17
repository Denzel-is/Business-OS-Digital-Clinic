# Frontend module

The frontend module will contain the public site and protected administration experience built with Next.js App Router, React, strict TypeScript, and Tailwind CSS. Application code is intentionally deferred to stage 4.

## Responsibilities

- Accessible, responsive public pages and business-diagnostic flow.
- Protected administration UI backed by server-enforced permissions.
- A single typed client boundary for backend communication.
- Explicit loading, empty, error, and offline-aware states.
- Purposeful motion with a complete reduced-motion path.
- Metadata, structured content, and performance-conscious media delivery.

## Planned layout

```text
frontend/
├── app/          routes, layouts, metadata, and server components
├── components/   reusable accessible UI primitives
├── features/     feature-owned interactive UI and schemas
├── lib/          typed API client and shared browser/server utilities
├── public/       optimized public assets
├── styles/       design tokens and global styles
└── tests/        integration and end-to-end support
```

Client Components will be limited to real interactivity. GSAP and React Three Fiber will be dynamically loaded only in the isolated experiences that justify them.

## Planned commands

These commands become available after stage 4:

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```
