export type RecentCategory = "movies" | "events" | "play" | "activities";

const RECENT_CATEGORIES: RecentCategory[] = ["movies", "events", "play", "activities"];

export type RecentItem = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  meta?: string;
  category: RecentCategory;
  viewedAt: string;
};

const STORAGE_KEY = "vybe-recently-viewed";
const MAX_ITEMS = 24;

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function readRecent(): RecentItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentItem[];
    return Array.isArray(parsed)
      ? parsed.filter((item) => RECENT_CATEGORIES.includes(item.category))
      : [];
  } catch {
    return [];
  }
}

export function writeRecent(items: RecentItem[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("vybe-recent-change"));
}

export function trackRecentView(item: Omit<RecentItem, "viewedAt">) {
  if (!item.id || !item.href || !item.imageUrl) return;
  const current = readRecent().filter((entry) => entry.id !== item.id);
  const next: RecentItem[] = [
    { ...item, viewedAt: new Date().toISOString() },
    ...current,
  ].slice(0, MAX_ITEMS);
  writeRecent(next);
}

export function clearRecent() {
  writeRecent([]);
}
