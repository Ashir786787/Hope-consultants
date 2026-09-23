import { cn } from "cn";

export function CoverImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return <div className={cn("h-full w-full bg-hope-fog/20", className)} />;
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("h-full w-full bg-cover bg-center", className)}
      style={{ backgroundImage: `url("${src}")` }}
    />
  );
}