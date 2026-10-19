export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Recently';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recently';
  }
}

export function formatFullDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeUTC(date: Date = new Date()): string {
  return date.toUTCString().slice(17, 22) + ' UTC';
}

export interface WorldClock {
  city: string;
  timeZone: string;
  label: string;
  code: string;
}

export const WORLD_CLOCKS: WorldClock[] = [
  { city: 'London', timeZone: 'Europe/London', label: 'LON', code: 'GMT' },
  { city: 'New York', timeZone: 'America/New_York', label: 'NYC', code: 'EDT' },
  { city: 'New Delhi', timeZone: 'Asia/Kolkata', label: 'DEL', code: 'IST' },
  { city: 'Tokyo', timeZone: 'Asia/Tokyo', label: 'TYO', code: 'JST' },
  { city: 'Geneva', timeZone: 'Europe/Zurich', label: 'GVA', code: 'CET' },
];

export function getFormattedCityTime(timeZone: string, date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return '--:--';
  }
}
