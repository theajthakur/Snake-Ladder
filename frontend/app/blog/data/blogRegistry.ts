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
import { post as post4 } from './posts/best-multiplayer-browser-games';
import { post as post5 } from './posts/benefits-of-playing-board-games';
import { post as post6 } from './posts/rise-of-online-board-gaming';
import { post as post7 } from './posts/two-player-games-online';
import { post as post8 } from './posts/family-game-night-ideas';
import { post as post9 } from './posts/evolution-of-dice-games';
import { post as post10 } from './posts/casual-gaming-trends-2026';
import { post as post11 } from './posts/making-browser-games-responsive';
import { post as post12 } from './posts/server-authoritative-netcode';
import { post as post13 } from './posts/how-ladders-and-snakes-change-probability';
import { post as post14 } from './posts/best-free-online-games';
import { post as post15 } from './posts/guide-to-hosting-game-rooms';
import { post as post16 } from './posts/dice-prediction-strategic-gaming';
import { post as post17 } from './posts/sound-design-in-web-games';
import { post as post18 } from './posts/traditional-vs-modern-board-games';
import { post as post19 } from './posts/best-coop-browser-games';
import { post as post20 } from './posts/improving-web-game-performance';
import { post as post21 } from './posts/psychology-of-board-game-wins';
import { post as post22 } from './posts/teaching-kids-math-with-dice';
import { post as post23 } from './posts/accessibility-in-browser-games';
import { post as post24 } from './posts/mobile-vs-desktop-web-gaming';
import { post as post25 } from './posts/simple-games-to-play-on-zoom';
import { post as post26 } from './posts/how-to-manage-game-state-in-react';
import { post as post27 } from './posts/revisiting-ludo-and-snakes-ladders';
import { post as post28 } from './posts/fastapi-for-real-time-lobbies';
import { post as post29 } from './posts/future-of-webassembly-in-gaming';
import { post as post30 } from './posts/safe-and-private-web-gaming';

export const allBlogPosts: BlogPost[] = [
  post1, post2, post3, post4, post5, post6, post7, post8, post9, post10,
  post11, post12, post13, post14, post15, post16, post17, post18, post19, post20,
  post21, post22, post23, post24, post25, post26, post27, post28, post29, post30
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
