export type CategoryId =
  | 'all'
  | 'world'
  | 'india'
  | 'tech'
  | 'business'
  | 'finance'
  | 'science'
  | 'sports'
  | 'entertainment'
  | 'health'
  | 'politics';

export interface NewsSource {
  id?: string;
  name: string;
  url?: string;
  domain?: string;
  logoUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  source: NewsSource;
  author?: string;
  publishedAt: string; // ISO string
  imageUrl: string;
  category: CategoryId;
  readingTime: number; // in minutes
  isBreaking?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  feedOrigin: 'google' | 'bbc' | 'cached' | 'api';
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
}

export interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: number;
  changePercent: string;
  isPositive: boolean;
}

export type EditionType = 'global' | 'india' | 'us' | 'uk';

export type ViewMode = 'grid' | 'magazine' | 'compact';

export type ActiveView = 'home' | 'about' | 'contact' | 'privacy';

export type SortOption = 'latest' | 'trending' | 'reading_time';

export interface NewsFeedStatus {
  isLive: boolean;
  sourceLabel: string;
  lastUpdated: Date;
  itemCount: number;
  isFallback: boolean;
  error?: string;
}

export interface UserPreferences {
  fontSize: 'normal' | 'large' | 'xl';
  edition: EditionType;
  bookmarkedIds: string[];
}
