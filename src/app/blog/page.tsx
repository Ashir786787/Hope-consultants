import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CoverImage } from "@/components/ui/cover-image";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { getCollection } from "@/lib/store";
import type { BlogPost } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Blog | Hope Consultants",
  description:
    "Honest, plain-language writing from Hope Consultants on studying abroad — universities, scholarships, visas, and student life.",
};

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = (await getCollection<BlogPost[]>("blog"))
    .filter((post) => post.published)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  return (
    <main className="w-full">
      <PageHero
        eyebrow="Blog"
        title="Notes from the road"
        lede="Practical, honest writing on studying abroad — universities, scholarships, visas, and student life. New posts appear here automatically when the team publishes them."
      />

      {posts.length === 0 ? (
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 pb-24 text-center sm:px-6">
          <p className="text-sm leading-7 text-muted-foreground">
            No published posts yet. The team is working on the first one — check
            back soon.
          </p>
        </section>
      ) : (
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-2">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.05} className="h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="hope-card hope-card--light flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <CoverImage src={post.coverImage} alt={post.title} />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(post.publishedAt)}</span>
                    {post.author && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{post.author}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-display text-xl font-semibold text-card-foreground">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="pt-2 text-sm font-semibold text-hope-ember">
                    Read post →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </section>
      )}

      <section className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6">
          <Badge variant="outline" className="w-fit">
            Talk to us first
          </Badge>
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            Reading is one thing — your situation is another.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Book a consultation and we will tell you honestly what is realistic for
            your grades, budget, and goals.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-hope-ember px-6 py-3 font-semibold text-hope-white transition-opacity hover:opacity-90"
            >
              Book a free consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}