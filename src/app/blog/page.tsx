import type { Metadata } from "next";
import Link from "next/link";

import { CoverImage } from "@/components/ui/cover-image";
import { DarkPageHero } from "@/components/sections/dark-page-hero";
import { DarkSection } from "@/components/sections/dark-section";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
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
    .filter((post) => post.published && post.coverImage)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  return (
    <main id="main-content" className="w-full">
      <DarkPageHero
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
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.05} className="h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="hope-card hope-card--light group flex h-full flex-col"
              >
                <div className="relative aspect-16/9 w-full overflow-hidden">
                  <CoverImage src={post.coverImage} alt={post.title} />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-display text-xl font-semibold text-card-foreground">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    {post.author && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{post.author}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </section>
      )}

      <DarkSection>
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold text-hope-white">
            Reading is one thing — your situation is another.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-hope-white/70">
            Book a consultation and we will tell you honestly what is realistic for
            your grades, budget, and goals.
          </p>
          <div className="pt-2">
            <Magnetic>
              <Button nativeButton={false} render={<a href="/contact" />} size="lg">
                Book a free consultation
              </Button>
            </Magnetic>
          </div>
        </div>
      </DarkSection>
    </main>
  );
}
