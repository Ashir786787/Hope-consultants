"use client";

import { useMemo, useState } from "react";

import { BlogCard } from "@/components/blog/blog-card";
import { PreviewGrid } from "@/components/ui/preview-grid";
import { SearchEmptyState } from "@/components/ui/search-empty-state";
import { SearchField } from "@/components/ui/search-field";

import type { BlogPost } from "@/lib/data/blog";

type BlogBrowserProps = {
  posts: BlogPost[];
  headingLevel?: 2 | 3;
};

export function BlogBrowser({ posts, headingLevel = 3 }: BlogBrowserProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return posts;
    return posts.filter((post) =>
      `${post.title} ${post.excerpt} ${post.content} ${post.author}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [posts, query]);

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex w-full flex-col gap-4">
        <SearchField
          label="Search articles"
          placeholder="Search articles or keywords…"
          value={query}
          onValueChange={setQuery}
        />
        {query.trim() ? (
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {results.length} of {posts.length}
          </p>
        ) : null}
      </div>

      {results.length === 0 ? (
        <SearchEmptyState
          heading="No articles match your search"
          body="Try a broader keyword, or clear the search box to see every article."
        />
      ) : (
        <PreviewGrid
          items={results.map((post) => ({
            key: post.slug,
            content: <BlogCard post={post} headingLevel={headingLevel} />,
          }))}
        />
      )}
    </div>
  );
}
