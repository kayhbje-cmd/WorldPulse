export function calculateReadingTime(text?: string): number {
  if (!text) return 3;
  const words = text.trim().split(/\s+/).length;
  // If only headline + summary provided (~30-50 words), simulate full article estimate (3-4 mins)
  if (words < 100) {
    return Math.max(2, Math.min(5, Math.floor(words / 15) + 2));
  }
  return Math.max(1, Math.ceil(words / 200));
}
