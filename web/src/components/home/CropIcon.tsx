import Image from "next/image";

const ICONS = new Set([
  "blueberry",
  "watermelon",
  "vegetables",
  "strawberry",
  "citrus",
  "tomato",
  "bell-pepper",
  "ornamentals",
  "pasture",
  "corn",
  "soybean",
  "cotton",
  "tree-fruit",
  "tomato-pepper",
  "potato",
  "onion-garlic",
  "carrot-beet",
  "beans",
  "grains",
]);

/** Studio cutout; decorative because the crop name appears alongside it. */
export function CropIcon({
  id,
  className,
  loading = "lazy",
}: {
  id: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  if (!ICONS.has(id)) return null;

  return (
    <Image
      src={`/img/crop-icons/${id}.webp`}
      alt=""
      aria-hidden="true"
      width={96}
      height={96}
      className={className}
      loading={loading}
      decoding="async"
      // Already sized for the 48 px maximum display size at 2x density.
      unoptimized
    />
  );
}
