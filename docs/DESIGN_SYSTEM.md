# Design system

Business OS: Digital Clinic uses a restrained operational interface: premium minimalism, technological medical precision, and the information density of a business operating system. The system is implemented in `frontend/src/app/globals.css` and `frontend/src/components/ui`; the live catalog is available at `/design-system`.

## Principles

1. Diagnose before decorating. Hierarchy and task clarity come before visual effects.
2. Color communicates state. Green means stable or actionable; red is reserved for genuine critical states.
3. Different information deserves different composition. Do not repeat one generic card for every content type.
4. Motion must explain change, location, or causality. Decorative motion is not a default.
5. Accessibility is a component contract, not a page-level patch.
6. Demo telemetry and outcomes must be explicitly labeled and must not be presented as real client data.

## Color tokens

| Token | Value | Purpose |
| --- | --- | --- |
| `--ds-color-canvas` | `#060B0A` | Page canvas and deepest background |
| `--ds-color-surface` | `#0B1210` | Standard surface |
| `--ds-color-surface-raised` | `#111B18` | Raised controls and panels |
| `--ds-color-surface-inset` | `#080E0D` | Recessed fields and internal tracks |
| `--ds-color-ink` | `#F0F0E8` | Primary milk-white text |
| `--ds-color-ink-muted` | `#AEBBB5` | Supporting text |
| `--ds-color-line` | `#202C28` | Soft structural borders |
| `--ds-color-accent` | `#67E8C2` | Primary action and stable status |
| `--ds-color-warning` | `#EFB44A` | States needing attention |
| `--ds-color-danger` | `#FF746C` | Real validation errors and critical states only |

Do not introduce purple-blue AI gradients, decorative glowing spheres, or translucent surfaces that reduce text contrast. New colors require a semantic purpose and contrast verification.

## Typography

- **Manrope Variable** is the primary interface and editorial face. It supports the large Cyrillic headings required by the product direction.
- **IBM Plex Mono** is used for versions, measurements, short labels, and system status. It is not a body font.
- Display headings use tight leading and tracking; paragraph text remains at a readable line height and a controlled line length.
- Font packages are stored as npm dependencies and served by the application. No font CDN is required at runtime.

## Layout and surfaces

- `Container` owns horizontal page gutters and the maximum content width.
- `Surface` has `raised`, `inset`, and `outline` variants. Select a variant based on information hierarchy.
- Editorial sections use asymmetric grid spans, deliberate whitespace, and selective borders.
- Sticky or pinned regions are allowed only when they preserve context or support storytelling.
- The minimum supported viewport width is 320 pixels; horizontal page overflow is prohibited.

## Components

- `Badge` — compact neutral, stable, attention, or critical status.
- `Button` and `ButtonLink` — primary, secondary, ghost, and danger actions with visible focus and native semantics.
- `TextField` — label, hint, and error relationships wired through accessible attributes.
- `ProgressMeter` — bounded 0–100 metric with an accessible progress role.
- `Metric` — operational value with a short descriptive label.
- `SectionIntro` — shared editorial section hierarchy.
- `PageState` — loading, empty, and error presentation built from the same primitives.

Components accept content and presentation props only. Backend business rules, authorization, and authoritative scoring never belong in these primitives.

## Interaction and accessibility

- Every interactive control must work with a keyboard and expose a visible `:focus-visible` state.
- Icons are SVG components, marked decorative when adjacent text provides the name. Emoji are not used as interface icons.
- Form hints and errors must be programmatically connected to their controls.
- Text and controls must retain usable contrast in default, hover, focus, disabled, and error states.
- Global reduced-motion CSS collapses transition and animation duration. Feature motion added later must also provide an explicit non-motion path.
- Error language is actionable and does not expose internal details.

## Usage

Import components through their explicit module path:

```tsx
import { ButtonLink } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
```

Use semantic theme utilities such as `bg-canvas`, `text-ink`, `text-ink-muted`, `border-line`, and `text-accent`. Avoid hardcoded colors inside feature components unless the value represents data visualization and is documented.

## Verification

The stage is guarded by:

- Vitest and Testing Library checks for control semantics, field errors, and progress bounds.
- Playwright checks for the live catalog at a narrow viewport, no horizontal overflow, reduced-motion behavior, and an error-free browser console.
- ESLint, strict TypeScript, Prettier, the Next.js production build, and dependency audit.
