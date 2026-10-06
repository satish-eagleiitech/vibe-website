export type SavedCategory = "movies" | "dining" | "events" | "play" | "activities";

export type SavedItem = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  meta?: string;
  category: SavedCategory;
  savedAt: string;
};

const STORAGE_KEY = "vybe-saved";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function readSaved(): SavedItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeSaved(items: SavedItem[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("vybe-saved-updated"));
}

export function isSaved(id: string) {
  return readSaved().some((item) => item.id === id);
}

export function toggleSaved(item: Omit<SavedItem, "savedAt">) {
  const current = readSaved();
  const exists = current.some((entry) => entry.id === item.id);
  const next = exists
    ? current.filter((entry) => entry.id !== item.id)
    : [{ ...item, savedAt: new Date().toISOString() }, ...current];
  writeSaved(next);
  return !exists;
}

export function removeSaved(id: string) {
  writeSaved(readSaved().filter((item) => item.id !== id));
}

export const SAVED_TABS: { id: SavedCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "movies", label: "Movies" },
  { id: "dining", label: "Dining" },
  { id: "events", label: "Events" },
  { id: "play", label: "Game Zone" },
  { id: "activities", label: "Activities" },
];
