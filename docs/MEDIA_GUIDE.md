# Media guide

The homepage currently uses the repository-owned `frontend/public/media/hero-poster.svg` as a transparent placeholder. It is not presented as client footage. A production hero video must be selected from real, licensed, non-AI-generated material and added during the motion stage.

## Hero video subject

Use restrained real-world footage that supports the digital-clinic metaphor without showing artificial medical scenes. Suitable subjects include:

- hands working with an authentic business interface;
- a real process map, operations room, workshop, or service environment;
- close details of analysis, prototyping, or system monitoring;
- abstract footage captured from real equipment or environments, not generated imagery.

Avoid stock footage of handshakes, staged server rooms, fake holograms, synthetic people, glowing AI brains, and identifiable personal or client data.

## Rights and privacy

- Record the author, license, source URL or internal asset owner, and permitted usage.
- Obtain releases for recognizable people and private locations.
- Remove screens containing credentials, personal data, customer records, tokens, or confidential material.
- Never use NDA or client media without written permission.
- AI-generated video is prohibited for the hero.

## Delivery formats

Provide both variants:

| Asset | Target | Suggested maximum |
| --- | --- | --- |
| Desktop WebM | 1920×1080, VP9/AV1, 24–30 fps, 8–12 seconds | 4 MB |
| Desktop MP4 | 1920×1080, H.264 fallback | 5 MB |
| Mobile WebM | 720×1280 or crop-safe 1280×720 | 2 MB |
| Mobile MP4 | Matching H.264 fallback | 2.5 MB |
| Poster | AVIF/WebP, same crop and focal point | 180 KB |

Remove audio tracks. Use a seamless loop only when the cut is not distracting. Preserve enough dark or visually quiet space for the overlay and text.

## Playback contract

The production component must use:

- `autoplay`, `muted`, `loop`, and `playsInline`;
- an explicit poster shown before the video is ready;
- `<source>` order preferring WebM with MP4 fallback;
- a dark overlay that maintains text contrast;
- a smaller mobile source selected with media queries or source logic;
- `preload="metadata"` or `preload="none"` so the first display is not blocked;
- fixed aspect ratio and dimensions to prevent layout shift;
- no controls for decorative background playback.

When `prefers-reduced-motion: reduce` is active, do not download or autoplay the video. Render the poster as the complete static replacement. If data-saving preferences are available, prefer the poster or mobile asset.

## Optimization and verification

1. Strip metadata and audio.
2. Verify duration, bitrate, dimensions, and codec locally.
3. Test the poster-first experience on a throttled connection.
4. Confirm there is no cumulative layout shift and the largest-contentful paint is not blocked by video.
5. Test Safari/iOS `playsInline`, Chromium, Firefox, and mobile viewport crops.
6. Confirm no console errors, failed source requests, or hidden captions that imply spoken content.
7. Run a reduced-motion browser test proving that only the poster loads.

Do not commit raw source footage or unoptimized exports. Store them outside Git with controlled access and commit only approved web derivatives.
