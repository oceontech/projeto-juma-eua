# Field-to-leaf imagery, version 2

Generated with the built-in image_gen tool. Final assets: `public/img/surface-v2/`.

Three generated images, each delivered for desktop and mobile. All WebPs use quality 88 and effort 6. Desktop leaf images retain the generated native 1672 × 941 resolution; mobile variants share the exact same crop rectangle to preserve overlay alignment.

| File | Dimensions | Bytes |
| --- | --- | ---: |
| field.webp | 2048 × 688 | 151184 |
| field-mobile.webp | 960 × 540 | 69806 |
| leaf.webp | 1672 × 941 | 121242 |
| structure.webp | 1672 × 941 | 163078 |
| leaf-mobile.webp | 672 × 896 | 98720 |
| structure-mobile.webp | 672 × 896 | 138390 |

The field leads from an airy horizon into dark foreground foliage. The leaf structure image is an edit of the natural leaf reference, preserving silhouette, stem, major veins and framing while revealing stronger chartreuse veins and translucent green tissue. It is a conceptual botanical view.

The field exit and leaf entrance share the same #07110b endpoint with gradual CSS overlays. The entry overlay is outside the animated camera, so its boundary stays fixed during the zoom. Pointer exploration and the existing natural/structure buttons are retained.

Validation: production build and scoped ESLint passed. Chrome checks at 1440 × 1000 and 390 × 844 confirmed adjacent section coordinates with no gap, correct responsive image files, no mobile horizontal overflow, button state change and working pointer mask. Reduced-motion captures inspected for both views and the section boundary.

## Final prompts

### surfaceField

Use case: photorealistic-natural. Create a premium cinematic agricultural website transition banner: an expansive healthy soybean field at first morning light, perfectly believable real soybean plants, gently converging cultivated rows, a low subtle tree line and soft golden haze in the far distance. Camera close to canopy level. Very wide panoramic composition, approximately 3:1 aspect ratio. Upper quarter airy pale warm ivory sky and subtle dawn mist. Middle of image rich living green canopy in warm soft light, natural varied foliage, beautifully detailed without crunchy oversharpening. Lower third gradually becomes close foreground soybean foliage in deep forest-green shade, darkest along the entire bottom edge, naturally low-key green-black approximately #07110b, NO white mist at the bottom. This image will flow from a white website section above into a dark macro-leaf section below, so the top is light and the bottom is consistently very dark green with no bright soil or highlights touching the bottom edge. Sophisticated modern photographic art direction, realistic botanical shapes, restrained sun glow rather than a blown-out sun disk, no synthetic perfect repetition. Full-bleed photo, no text, no graphics, no borders, no watermark, no people, no buildings, no CGI. Output one panoramic photograph.

### surfaceNatural

Use case: photorealistic-natural. Create one spectacular premium modern botanical macro photograph for a dark agricultural website section. Wide landscape 16:9. One single healthy soybean leaflet, botanically credible oval pointed soybean leaf, large and sculptural on the RIGHT TWO THIRDS, gently diagonal from lower center to upper right, entire main leaf silhouette visible with breathing room, fine soft edge hairs, subtle real skin texture, a few tiny realistic dew droplets, gently visible natural branching veins. Deep emerald and forest green surface, restrained warm daylight grazing from upper right, tactile macro detail and soft cinematic shadows, realistic rather than glossy plastic. Main leaf occupies x=43% to 94%, y=12% to 92%; its center around x=72%, y=54%. LEFT 40% remains almost empty deep forest-green-black #07110b negative space for large white website heading. Background is a dark very softly blurred soybean canopy with no visible horizon. Entire top edge and bottom edge fade naturally into deep forest-green-black #07110b shadow, no bright object touching those edges, for seamless integration with adjacent section. Keep the most readable vein detail and droplets around center-right. Sophisticated agricultural editorial photography, crisp but not oversharpened, no graphic effects. No text, labels, logos, watermark, borders, collage or diagrams. This photo will be used as the exact alignment reference for a second internal-vein reveal version; make the silhouette and branching pattern distinctive.

### surfaceReveal

Use case: precise-object-edit. Edit the supplied natural soybean-leaf photograph into its aligned 'reveal internal structure' companion for an interactive before/after overlay. CRITICAL INVARIANTS: keep the exact canvas, framing, camera, leaf silhouette, pointed tip, stem position, every major branching vein location, background shapes and dark left negative space pixel-aligned. Do not move, reshape, rotate, crop or scale the leaf. Change ONLY the optical appearance inside the existing main leaf: transform its opaque green surface into a translucent deep emerald teal botanical specimen under transmitted light, exposing a dramatically clearer intricate lime-gold vascular skeleton, fine branching capillaries and subtle cellular tissue mesh. The main midrib and secondary veins should become distinct luminous warm chartreuse lines, thinner branches fine and crisp, interveinal tissue darker translucent teal. Strong immediately noticeable contrast to the original dark opaque leaf, still sophisticated macro-photographic botanical detail with realistic tissue, like optical microscopy blended with a backlit leaf specimen. Gentle glow localized to the veins only, no neon beams, no sparkles, no particles, no sci-fi HUD, no rainbow, no artificial network geometry. Keep the few dew droplets in exactly their original positions as subtler transparent lenses. Match the original background and all outside-leaf pixels, deep #07110b at the frame edges and dark empty left 40%. This is a conceptual structure reveal, not a crop treatment comparison. No text, no labels, no logos, no watermark. Return one full landscape companion image.

