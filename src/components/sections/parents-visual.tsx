import Image from "next/image";

export function ParentsVisual({ image }: { image: string | null }) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-hope-midnight/10 bg-hope-midnight shadow-[var(--shadow-card)]">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority={false}
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
      ) : null}
    </div>
  );
}
