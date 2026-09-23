import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CoverImage } from "@/components/ui/cover-image";
import { Separator } from "@/components/ui/separator";
import { getCollection } from "@/lib/store";
import type { BlogPost } from "@/lib/data/blog";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getCollection<BlogPost[]>("blog");
  const post = posts.find((item) => item.slug === slug && item.published);
  return {
    title: post ? `${post.title} | Hope Consultants` : "Blog | Hope Consultants",
    description: post?.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getCollection<BlogPost[]>("blog");
  const post = posts.find((item) => item.slug === slug && item.published);
  if (!post) notFound();

  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="w-full">
      <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-4">
          <p className="text-xs tracking-[0.18em] text-hope-ember uppercase">
            Blog
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-card-foreground sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {post.author && (
              <>
                <span aria-hidden="true">·</span>
                <span>By {post.author}</span>
              </>
            )}
          </div>
        </div>

        {post.coverImage && (
          <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <CoverImage src={post.coverImage} alt={post.title} />
          </div>
        )}

        <div className="mt-10 flex flex-col gap-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={`${index}-${paragraph.slice(0, 24)}`}
              className="whitespace-pre-line text-base leading-8 text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <Separator className="mt-12" />

        <div className="mt-6 flex flex-col items-start gap-2">
          <p className="text-sm leading-7 text-muted-foreground">
            Not sure where your goals fit? Get an honest read on your profile —
            free and no obligation.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-hope-ember px-6 py-3 font-semibold text-hope-white transition-opacity hover:opacity-90"
          >
            Book a free consultation
          </a>
        </div>
      </article>
    </main>
  );
}