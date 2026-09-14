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
]);

/** Studio cutout; decorative because the crop name appears alongside it. */
export function CropIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
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
      loading="lazy"
      decoding="async"
      // Already sized for the 48 px maximum display size at 2x density.
      unoptimized
    />
  );
}
