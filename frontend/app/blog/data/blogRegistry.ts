export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogSection {
  heading?: string;
  paragraphs: string[];
  listItems?: string[];
  listType?: 'ordered' | 'unordered';
  codeBlock?: {
    code: string;
    language: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishDate: string;
  updatedDate: string;
  category: 'strategy' | 'mechanics' | 'history' | 'lists' | 'development' | 'trends';
  tags: string[];
  readingTime: string;
  keywords: string[];
  sections: BlogSection[];
  faqs?: BlogFAQ[];
}

import { post as post1 } from './posts/history-of-snakes-and-ladders';
import { post as post2 } from './posts/ultimate-strategy-guide';
import { post as post3 } from './posts/how-dice-math-works';
import { post as post4 } from './posts/fastapi-for-real-time-lobbies';
import { post as post5 } from './posts/teaching-kids-math-with-dice';
import { post as post6 } from './posts/rise-of-online-board-gaming';

export const allBlogPosts: BlogPost[] = [
  post1,
  post2,
  post3,
  post4,
  post5,
  post6
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return allBlogPosts.find(p => p.slug === slug);
}

export function getRecentBlogs(limit: number = 5): BlogPost[] {
  return [...allBlogPosts]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, limit);
}

export function getRelatedBlogs(slug: string, limit: number = 3): BlogPost[] {
  const current = getBlogBySlug(slug);
  if (!current) return [];
  return allBlogPosts
    .filter(p => p.slug !== slug && (p.category === current.category || p.tags.some(t => current.tags.includes(t))))
    .slice(0, limit);
}
