import Image from "next/image";
import { cn } from "cn";

function isExternalImage(src: string): boolean {
  if (src.startsWith("data:")) return true;
  return /^https?:\/\//.test(src);
}

type SiteImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function SiteImage({
  src,
  alt,
  fill = true,
  sizes,
  priority = false,
  className,
}: SiteImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      unoptimized={isExternalImage(src)}
      className={cn("object-cover", className)}
    />
  );
}