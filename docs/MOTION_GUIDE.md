# Motion guide

Motion in Business OS: Digital Clinic explains state, hierarchy, or system behavior. It is progressive enhancement: all content, navigation, and calls to action remain complete before animation code runs.

## Runtime ownership

| Area | Runtime | Purpose | Fallback |
| --- | --- | --- | --- |
| Hero and editorial reveals | Framer Motion | restrained reveal rhythms and shallow media parallax | content rendered in its final position |
| Business Vitals | dynamically imported GSAP ScrollTrigger | connect each problem state to its target process as the row crosses the viewport | both states shown together with a complete progress line |
| Security Pulse | dynamically imported React Three Fiber | one conceptual model of edge, application, and data defense layers | static layered diagram |
| Cards and controls | CSS transitions | local hover and directional feedback | no transform |

GSAP and the Three.js scene must not move into the shared application shell. Their client chunks belong only to the section that uses them.

## Motion language

- Use different movement for different meaning: a wipe introduces a diagnosis, a rise shows hierarchy, and a scrubbed transition explains process change.
- Keep editorial reveals between 500 and 800 ms with a natural deceleration curve.
- Keep hover travel within 4 px and parallax within 60 px.
- Do not animate every card, paragraph, or icon in the same way.
- Infinite animation is limited to low-attention system status and the single security model.
- Motion must not change the factual meaning or imply that demonstration results are real.

## Reduced motion and constrained devices

When `prefers-reduced-motion: reduce` is active:

- Framer Motion renders final static states;
- GSAP and ScrollTrigger are not imported;
- the Three.js scene is not imported and no WebGL canvas is created;
- the Hero scan line is hidden;
- hover transforms are disabled;
- normal document scrolling remains available.

The 3D scene is also skipped below 768 px. Mobile receives the same labeled static defense diagram, reducing JavaScript, GPU, and battery cost without removing information. If WebGL is unavailable, the static diagram remains in place.

## Accessibility and performance checklist

1. Test the page with operating-system reduced motion enabled.
2. Confirm keyboard focus is never moved or trapped by animation.
3. Verify the DOM reading order matches the visual order before and after motion.
4. Confirm GSAP and Three.js are loaded through section-local dynamic imports.
5. Check that mobile and reduced-motion modes create no WebGL canvas.
6. Verify animations use transforms and opacity instead of layout-changing properties where possible.
7. Check browser console errors and horizontal overflow at desktop and mobile sizes.
8. Keep the production Hero video poster-first and follow `MEDIA_GUIDE.md` when an approved real asset exists.
