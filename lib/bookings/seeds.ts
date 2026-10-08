import type { VybeBooking } from "@/lib/bookings/storage";

export const seedBookings: VybeBooking[] = [
  {
    id: "VYBEDEMOEVENT01",
    bookingCode: "635532924866353101",
    category: "events",
    title: "Rooftop jazz evening",
    posterUrl: "/images/events/poster-03.jpg",
    meta: "Live music | 18+",
    dateLabel: "Sunday, 21 Sep",
    timeLabel: "08:00 PM",
    venue: "Jubilee Hills, Hyderabad",
    seats: ["GA-12", "GA-13"],
    ticketPrice: 2498,
    convenienceFee: 0,
    paymentMethod: "UPI",
    total: 2498,
    createdAt: "2026-09-18T14:30:00.000Z",
  },
  {
    id: "VYBEDEMOPLAY01",
    bookingCode: "635532924866353103",
    category: "play",
    title: "Bowling league night",
    posterUrl: "/images/play/play-8.jpg",
    meta: "2 lanes | 60 mins",
    dateLabel: "Friday, 19 Sep",
    timeLabel: "07:00 PM",
    venue: "Inorbit Mall, Hyderabad",
    seats: ["Lane 3"],
    ticketPrice: 899,
    convenienceFee: 0,
    paymentMethod: "UPI",
    total: 899,
    createdAt: "2026-09-17T19:00:00.000Z",
  },
];

export function mergeBookings(stored: VybeBooking[]) {
  const merged = [...stored];
  for (const seed of seedBookings) {
    if (!merged.some((item) => item.id === seed.id)) merged.push(seed);
  }
  return merged;
}
