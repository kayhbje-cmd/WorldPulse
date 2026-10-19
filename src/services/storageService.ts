import { EditionType } from '../types/news';

const BOOKMARKS_KEY = 'worldpulse_bookmarks_v1';
const FONT_SIZE_KEY = 'worldpulse_font_size_v1';
const EDITION_KEY = 'worldpulse_edition_v1';

// In-memory fallback for SSR, incognito, or non-browser environments
const memoryStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return memoryStore[key] || null;
  } catch {
    return memoryStore[key] || null;
  }
}

function safeSet(key: string, value: string): void {
  memoryStore[key] = value;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Quota exceeded or incognito
  }
}

function safeRemove(key: string): void {
  delete memoryStore[key];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export const storageService = {
  getBookmarks(): string[] {
    try {
      const data = safeGet(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isBookmarked(id: string): boolean {
    const list = this.getBookmarks();
    return list.includes(id);
  },

  toggleBookmark(id: string): boolean {
    const list = this.getBookmarks();
    const index = list.indexOf(id);
    let updated: string[];
    let isSaved: boolean;

    if (index >= 0) {
      updated = list.filter((item) => item !== id);
      isSaved = false;
    } else {
      updated = [id, ...list];
      isSaved = true;
    }

    try {
      safeSet(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    return isSaved;
  },

  clearAllBookmarks(): void {
    safeRemove(BOOKMARKS_KEY);
  },

  getFontSize(): 'normal' | 'large' | 'xl' {
    const val = safeGet(FONT_SIZE_KEY);
    return (val as any) || 'normal';
  },

  setFontSize(size: 'normal' | 'large' | 'xl'): void {
    safeSet(FONT_SIZE_KEY, size);
  },

  getEdition(): EditionType {
    const val = safeGet(EDITION_KEY);
    return (val as EditionType) || 'global';
  },

  setEdition(edition: EditionType): void {
    safeSet(EDITION_KEY, edition);
  },
};
