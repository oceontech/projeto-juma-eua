# Beneath the surface — image assets

Generated with the built-in image generation tool. The reveal is an edit of the base image, keeping the framing aligned. These are conceptual botanical illustrations, not trial evidence.

Final project assets:
- `web/public/img/surface-leaf.webp` (1536 × 1024)
- `web/public/img/surface-veins.webp` (1536 × 1024)
- `web/public/img/surface-leaf-mobile.webp` (900 × 600)
- `web/public/img/surface-veins-mobile.webp` (900 × 600)

The product thumbnail uses the existing `web/public/img/pack-aminosan.webp` to preserve actual packaging. WebP exports use Sharp, with quality 88 on desktop and 84 on mobile.

## Base image prompt

Use case: ads-marketing. Asset type: premium full-bleed website photographic background for Juma-Agro USA, agricultural foliar nutrition. Generate a 1536x1024 landscape image. Extreme cinematic macro photograph of a living soybean plant, one magnificent broad oval soybean leaf occupying the right 65 percent of the composition, extending diagonally from lower center stem toward upper right, with clearly resolved delicate branching veins, minute hairs, and a few real dew droplets. A smaller soft-focus soybean leaflet below. Left 38 percent is very dark almost-black forest-green negative space for website headline, no bright objects on left. Entire backdrop near-black #07110b softly blurred vegetation, restrained olive and fresh lime #b7c73e rim light from upper right, believable natural green leaf, subtle warm early morning edge light. Leaf is large, sculptural, dimensional, exquisite photographic detail, tactile waxy surface, long soft shadows. High-end botanical editorial campaign, macro lens, shallow depth of field, natural restrained grading, not fantasy. Keep the whole main leaf outline within the frame at x 42-96 percent y 12-85 percent. No text, no labels, no logos, no UI, no typography, no split screen, no frames. This is a conceptual botanical brand illustration, not an experimental before/after photograph.

## Reveal image prompt

Use case: lighting-weather / style-transfer. Edit target: the supplied macro soybean leaf image. Make the second precisely aligned image for a cursor spotlight reveal on an agricultural nutrition website. CRITICAL: preserve exact 1536x1024 framing, every leaf outline, stem position, vein location, droplets, camera viewpoint and background geometry. Change only the visualization of the main leaf: transform its opaque green lamina into a darker translucent emerald botanical specimen, with the existing midrib and all existing fine branching veins lit from within by a luminous restrained yellow-lime #b7c73e glow. Very fine luminous cellular mesh within the actual existing vein network. This is an elegant backlit botanical art interpretation of what lies beneath the surface. Preserve photographic texture and depth, delicate glowing veins crisp against deep forest-green surface. Dew remains in exactly the same position. Left dark negative space remains unchanged. No new objects, no particles outside the leaf, no diagrams, no labels, no text, no graphics, no UI. Avoid cyan, purple, sci-fi circuitry or excessive bloom. Do not change leaf shape or zoom. Fine veins should look unmistakably luminous, brighter than the original, but organic and tasteful.
