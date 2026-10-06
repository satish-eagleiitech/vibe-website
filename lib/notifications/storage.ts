export type NotificationKind = "booking" | "offer" | "reminder" | "reward" | "system";

export type VybeNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href?: string;
  minutesAgo: number;
  read: boolean;
};

const READ_KEY = "vybe-notifications-read";
export const NOTIFICATIONS_EVENT = "vybe-notifications-updated";

const SEED: Omit<VybeNotification, "read">[] = [
  {
    id: "n-event-confirmed",
    kind: "booking",
    title: "Tickets confirmed",
    body: "Your passes for Neon Arena Night are ready. Show the QR at the gate.",
    href: "/tickets",
    minutesAgo: 25,
  },
  {
    id: "n-dining-reminder",
    kind: "reminder",
    title: "Table tonight at 8:00 PM",
    body: "Lakeview Olive Kitchen is holding your table for 15 minutes past the slot.",
    href: "/tickets?tab=dining",
    minutesAgo: 140,
  },
  {
    id: "n-scratch",
    kind: "reward",
    title: "New scratch card unlocked",
    body: "Your last booking earned a scratch card. Scratch it to reveal your offer.",
    href: "/rewards",
    minutesAgo: 320,
  },
  {
    id: "n-weekend-offer",
    kind: "offer",
    title: "Flat 20% off Game Zone",
    body: "Bowling, VR and go-karts this weekend. Use code PLAY20 at checkout.",
    href: "/play",
    minutesAgo: 60 * 26,
  },
  {
    id: "n-movie-release",
    kind: "offer",
    title: "Bookings open: The Paradise",
    body: "First-day shows are filling fast in Hyderabad. Grab your seats early.",
    href: "/movies",
    minutesAgo: 60 * 30,
  },
  {
    id: "n-security",
    kind: "system",
    title: "New sign-in on this device",
    body: "If this wasn't you, update your details from Help & safety.",
    href: "/help-center",
    minutesAgo: 60 * 72,
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readIds(): string[] {
  if (!canUseStorage()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(READ_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(READ_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(NOTIFICATIONS_EVENT));
}

export function readNotifications(): VybeNotification[] {
  const read = new Set(readIds());
  return SEED.map((item) => ({ ...item, read: read.has(item.id) }));
}

export function unreadCount() {
  return readNotifications().filter((item) => !item.read).length;
}

export function markNotificationRead(id: string) {
  const ids = readIds();
  if (ids.includes(id)) return;
  writeIds([...ids, id]);
}

export function markAllNotificationsRead() {
  writeIds(SEED.map((item) => item.id));
}

export function relativeTime(minutesAgo: number) {
  if (minutesAgo < 1) return "Just now";
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hours = Math.floor(minutesAgo / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}
