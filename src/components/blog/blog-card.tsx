import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/lib/data/blog";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogPost }) {
  if (!post.coverImage) return null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="hope-card hope-card--light group flex h-full flex-col"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-xl font-semibold text-card-foreground">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted-foreground">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.author ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.author}</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
