export type BookingCategory = "movies" | "events" | "play" | "activities";

const BOOKING_CATEGORIES: BookingCategory[] = ["movies", "events", "play", "activities"];

export type BookingStatus = "confirmed" | "cancelled";

export type VybeBooking = {
  id: string;
  bookingCode: string;
  category: BookingCategory;
  title: string;
  posterUrl: string;
  meta: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  seats: string[];
  audi?: string;
  format?: string;
  language?: string;
  certification?: string;
  ticketPrice?: number;
  convenienceFee?: number;
  seatClass?: string;
  theatreName?: string;
  paymentMethod?: string;
  total: number;
  createdAt: string;
  status?: BookingStatus;
  cancelledAt?: string;
  refundAmount?: number;
};

const STORAGE_KEY = "vybe-bookings";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function readBookings(): VybeBooking[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VybeBooking[];
    return Array.isArray(parsed)
      ? parsed.filter((item) => BOOKING_CATEGORIES.includes(item.category))
      : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: VybeBooking) {
  if (!canUseStorage()) return;
  const next = [booking, ...readBookings().filter((item) => item.id !== booking.id)];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("vybe-bookings-updated"));
}

export function getBookingById(id: string): VybeBooking | null {
  return readBookings().find((item) => item.id === id) ?? null;
}

export function bookingsByCategory(category: BookingCategory): VybeBooking[] {
  return readBookings().filter((item) => item.category === category);
}

/** Events stay non-cancellable unless the organiser cancels (partner-side). */
export function isBookingCancellable(booking: VybeBooking) {
  if ((booking.status ?? "confirmed") === "cancelled") return false;
  return booking.category !== "events";
}

export function estimateRefund(booking: VybeBooking) {
  const fees = booking.convenienceFee ?? 0;
  return Math.max(0, booking.total - fees);
}

export function cancelBooking(
  id: string,
  fallback?: VybeBooking | null,
): VybeBooking | null {
  if (!canUseStorage()) return null;
  const current = getBookingById(id) ?? fallback ?? null;
  if (!current || current.id !== id || !isBookingCancellable(current)) return null;
  const next: VybeBooking = {
    ...current,
    status: "cancelled",
    cancelledAt: new Date().toISOString(),
    refundAmount: estimateRefund(current),
  };
  saveBooking(next);
  return next;
}

export function createBookingId() {
  return `VYBZ${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 90 + 10)}`;
}

export function createBookingCode() {
  return Array.from({ length: 18 }, () => Math.floor(Math.random() * 10)).join("");
}

export const BOOKING_TABS: {
  id: BookingCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "movies", label: "Movies" },
  { id: "events", label: "Events" },
  { id: "play", label: "Game Zone" },
  { id: "activities", label: "Activities" },
];
