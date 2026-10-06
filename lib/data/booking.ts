import type { MovieShowtime, MovieTheatre } from "@/types/movie";

const TIME_SLOTS = [
  { hour: 10, minute: 30, format: "2K" },
  { hour: 13, minute: 15, format: "2K" },
  { hour: 16, minute: 0, format: "IMAX" },
  { hour: 18, minute: 45, format: "4DX" },
  { hour: 21, minute: 30, format: "2K" },
] as const;

const THEATRE_SEEDS: Omit<MovieTheatre, "showtimes">[] = [
  {
    id: "inox-gvk",
    name: "INOX: GVK One Mall",
    area: "Banjara Hills",
    city: "Hyderabad",
    distanceKm: 4.2,
    cancellable: true,
    brand: "INOX",
  },
  {
    id: "pvr-irr",
    name: "PVR: IRR Ascendas",
    area: "Madhapur",
    city: "Hyderabad",
    distanceKm: 6.8,
    cancellable: true,
    brand: "PVR",
  },
  {
    id: "rajdhani-dil",
    name: "Rajdhani Deluxe 2K Dolby",
    area: "Dilsukhnagar",
    city: "Hyderabad",
    distanceKm: 9.1,
    cancellable: false,
    brand: "RD",
  },
  {
    id: "cinepolis-amb",
    name: "Cinepolis: AMB Mall",
    area: "Gachibowli",
    city: "Hyderabad",
    distanceKm: 11.4,
    cancellable: true,
    brand: "CP",
  },
  {
    id: "asian-muk",
    name: "Asian Cinemas Mukta A2",
    area: "Kukatpally",
    city: "Hyderabad",
    distanceKm: 12.6,
    cancellable: false,
    brand: "AS",
  },
  {
    id: "miraj-sec",
    name: "Miraj Cinemas",
    area: "Secunderabad",
    city: "Hyderabad",
    distanceKm: 7.5,
    cancellable: true,
    brand: "MJ",
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatLabel(hour: number, minute: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${pad(h12)}:${pad(minute)} ${suffix}`;
}

function statusFor(index: number): MovieShowtime["status"] {
  if (index % 5 === 0) return "almost";
  if (index % 3 === 0) return "filling";
  return "available";
}

/** Mock Hyderabad showtimes for booking UI (TMDB has no theatre data). */
export function getMovieTheatres(movieId: string, dateIso: string): MovieTheatre[] {
  return THEATRE_SEEDS.map((theatre, theatreIndex) => {
    const showtimes: MovieShowtime[] = TIME_SLOTS.filter(
      (_, slotIndex) => (theatreIndex + slotIndex + movieId.length) % 7 !== 0,
    ).map((slot, slotIndex) => {
      const startsAt = `${dateIso}T${pad(slot.hour)}:${pad(slot.minute)}:00`;
      return {
        id: `${theatre.id}-${dateIso}-${slot.hour}${slot.minute}`,
        startsAt,
        label: formatLabel(slot.hour, slot.minute),
        format: slot.format,
        status: statusFor(theatreIndex + slotIndex),
      };
    });

    return { ...theatre, showtimes };
  });
}

export function getBookingDates(days = 7) {
  const today = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const iso = date.toISOString().slice(0, 10);
    return {
      iso,
      day: date.getDate(),
      weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
      month: date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
      isToday: index === 0,
    };
  });
}

export function findTheatre(theatreId: string) {
  return THEATRE_SEEDS.find((item) => item.id === theatreId) ?? null;
}

export function findShowtime(
  movieId: string,
  theatreId: string,
  showId: string,
  dateIso: string,
) {
  const theatre = getMovieTheatres(movieId, dateIso).find(
    (item) => item.id === theatreId,
  );
  const show = theatre?.showtimes?.find((item) => item.id === showId);
  return { theatre: theatre ?? null, show: show ?? null };
}

export type SeatStatus = "available" | "occupied" | "selected";

export type SeatCell = {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
  category: string;
};

/** Deterministic seat map so the same show always looks consistent. */
export function buildSeatMap(showId: string): {
  categories: { name: string; price: number; rows: string[] }[];
  seats: SeatCell[];
} {
  const categories = [
    { name: "BOX", price: 350, rows: ["BOX"] },
    { name: "EXECUTIVE CLASS", price: 190, rows: ["A", "B", "C"] },
    { name: "CLASSIC", price: 150, rows: ["D", "E", "F"] },
  ];

  const seats: SeatCell[] = [];
  let seed = 0;
  for (const ch of showId) seed = (seed + ch.charCodeAt(0) * 17) % 997;

  for (const category of categories) {
    for (const row of category.rows) {
      for (let number = 1; number <= 16; number++) {
        // aisle gap visually between 8 and 9
        seed = (seed * 31 + number + row.charCodeAt(0)) % 997;
        const occupied = seed % 5 === 0 || (row === "BOX" && number % 2 === 0);
        seats.push({
          id: `${row}-${number}`,
          row,
          number,
          status: occupied ? "occupied" : "available",
          price: category.price,
          category: category.name,
        });
      }
    }
  }

  return { categories, seats };
}
