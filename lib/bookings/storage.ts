export type BookingCategory = "movies" | "events" | "play" | "activities";

const BOOKING_CATEGORIES: BookingCategory[] = ["movies", "events", "play", "activities"];

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

export function createBookingId() {
  return `VYBE${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 90 + 10)}`;
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
