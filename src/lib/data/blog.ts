export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  published: boolean;
}

export const blogPosts: BlogPost[] = [];