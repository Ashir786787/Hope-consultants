import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

type PreviewGridProps = {
  items: Array<{ key: string; content: ReactNode }>;
  viewMoreHref?: string;
  viewMoreLink?: ReactNode;
  viewMoreLabel?: string;
  columns?: 2 | 3;
};

export function PreviewGrid({
  items,
  viewMoreHref,
  viewMoreLink,
  viewMoreLabel = "View more",
  columns = 3,
}: PreviewGridProps) {
  if (items.length === 0) return null;

  const columnClass = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="flex w-full flex-col gap-10">
      <ul className={`grid w-full grid-cols-1 gap-5 ${columnClass}`}>
        {items.map((item, index) => (
          <li key={item.key} className="h-full">
            <Reveal delay={index * 0.05} className="h-full">
              {item.content}
            </Reveal>
          </li>
        ))}
      </ul>
      {viewMoreLink ?? (viewMoreHref ? (
        <Reveal className="w-full">
          <Button nativeButton={false} render={<a href={viewMoreHref} />} variant="outline" size="lg">
            {viewMoreLabel}
          </Button>
        </Reveal>
      ) : null)}
    </div>
  );
}
