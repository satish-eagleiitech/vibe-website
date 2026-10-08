import type { PlayItem } from "@/types/play";

export type PlayCourt = {
  id: string;
  name: string;
  detail: string;
};

export type PlayBookingMode = "court" | "session";

export type PlaySlot = {
  hour: number;
  label: string;
  price: number;
  peak: boolean;
  booked: boolean;
  past: boolean;
};

const PEAK_MULTIPLIER = 1.25;
const WEEKEND_DAYS = new Set([0, 6]);

function hashSeed(input: string) {
  let seed = 7;
  for (const ch of input) seed = (seed * 31 + ch.charCodeAt(0)) % 100_003;
  return seed;
}

function parseClock(value: string) {
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  const hour = Number.parseInt(match[1], 10) % 12;
  const pm = match[3].toUpperCase() === "PM";
  return hour + (pm ? 12 : 0);
}

/** "6:00 AM to 12:00 AM" → { open: 6, close: 24 }; closing past midnight runs into the next day */
export function parseOpeningHours(hours?: string) {
  const [from, to] = (hours ?? "").split(/\s+to\s+/i);
  const open = from ? parseClock(from) : null;
  let close = to ? parseClock(to) : null;
  if (open == null || close == null) return { open: 6, close: 23 };
  if (close <= open) close += 24;
  return { open, close };
}

export function formatHour(hour: number) {
  const h24 = hour % 24;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return `${h12}:00 ${suffix}`;
}

export function formatSlotRange(start: number, duration: number) {
  return `${formatHour(start)} – ${formatHour(start + duration)}`;
}

export function bookingModeFor(item: PlayItem): PlayBookingMode {
  const unit = (item.priceUnit ?? "").toLowerCase();
  return unit.includes("session") || unit.includes("person")
    ? "session"
    : "court";
}

export function courtsFor(item: PlayItem): { unit: string; courts: PlayCourt[] } {
  const sport = (item.sport ?? "").toLowerCase();

  if (/turf|football|soccer/.test(sport)) {
    return {
      unit: "Turf",
      courts: [
        { id: "turf-a", name: "Turf A", detail: "5-a-side · Synthetic grass" },
        { id: "turf-b", name: "Turf B", detail: "7-a-side · Synthetic grass" },
      ],
    };
  }
  if (/box cricket/.test(sport)) {
    return {
      unit: "Box",
      courts: [
        { id: "box-1", name: "Box 1", detail: "8 per side · Netted" },
        { id: "box-2", name: "Box 2", detail: "6 per side · Netted" },
      ],
    };
  }
  if (/cricket/.test(sport)) {
    return {
      unit: "Net",
      courts: [
        { id: "net-1", name: "Net 1", detail: "Bowling machine" },
        { id: "net-2", name: "Net 2", detail: "Turf wicket" },
        { id: "net-3", name: "Net 3", detail: "Cement wicket" },
      ],
    };
  }
  if (/snooker|pool|table tennis/.test(sport)) {
    return {
      unit: "Table",
      courts: [
        { id: "table-1", name: "Table 1", detail: "Standard" },
        { id: "table-2", name: "Table 2", detail: "Standard" },
        { id: "table-3", name: "Table 3", detail: "Pro" },
      ],
    };
  }
  if (/swim/.test(sport)) {
    return {
      unit: "Lane",
      courts: [{ id: "lane", name: "Open lanes", detail: "25 m lap pool" }],
    };
  }

  return {
    unit: "Court",
    courts: [
      { id: "court-1", name: "Court 1", detail: "Indoor" },
      { id: "court-2", name: "Court 2", detail: "Indoor" },
      { id: "court-3", name: "Court 3", detail: "Outdoor · Floodlit" },
    ],
  };
}

export function isPeakHour(dateIso: string, hour: number) {
  const day = new Date(`${dateIso}T00:00:00`).getDay();
  if (WEEKEND_DAYS.has(day)) return hour >= 7;
  return hour % 24 >= 17 && hour % 24 < 23;
}

export function hourlyPrice(item: PlayItem, dateIso: string, hour: number) {
  const base = item.price ?? 699;
  if (!isPeakHour(dateIso, hour)) return base;
  return Math.round((base * PEAK_MULTIPLIER) / 50) * 50;
}

export function peakPrice(item: PlayItem) {
  return Math.round(((item.price ?? 699) * PEAK_MULTIPLIER) / 50) * 50;
}

/** Deterministic mock availability so the same court/date always looks the same */
export function buildSlots(
  item: PlayItem,
  courtId: string,
  dateIso: string,
  now: Date | null,
): PlaySlot[] {
  const { open, close } = parseOpeningHours(item.hours);
  const todayIso = now ? now.toISOString().slice(0, 10) : "";
  const slots: PlaySlot[] = [];

  for (let hour = open; hour < close; hour += 1) {
    const seed = hashSeed(`${item.id}:${courtId}:${dateIso}:${hour}`);
    const peak = isPeakHour(dateIso, hour);
    const booked = seed % (peak ? 3 : 5) === 0;
    const past = !!now && dateIso === todayIso && hour <= now.getHours();
    slots.push({
      hour,
      label: formatHour(hour),
      price: hourlyPrice(item, dateIso, hour),
      peak,
      booked,
      past,
    });
  }

  return slots;
}

/** A start slot is bookable only if every hour of the chosen duration is free */
export function canStartAt(slots: PlaySlot[], index: number, duration: number) {
  if (index + duration > slots.length) return false;
  for (let offset = 0; offset < duration; offset += 1) {
    const slot = slots[index + offset];
    if (!slot || slot.booked || slot.past) return false;
  }
  return true;
}

export function slotPeriod(hour: number) {
  const h = hour % 24;
  if (h >= 5 && h < 12) return "Morning";
  if (h >= 12 && h < 17) return "Afternoon";
  if (h >= 17 && h < 21) return "Evening";
  return "Night";
}
