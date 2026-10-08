import { findPlaySport } from "@/lib/data/playSports";
import type { PlayItem } from "@/types/play";

type SportProfile = {
  images: string[];
  suffixes: string[];
  blurbs: string[];
  price: [number, number];
  unit: string;
  hours: string[];
  schedules: string[];
  amenities: string[];
  also?: string[];
};

const LOCALITIES: { name: string; km: number }[] = [
  { name: "Gachibowli", km: 1.2 },
  { name: "Kondapur", km: 2.4 },
  { name: "HITEC City", km: 1.8 },
  { name: "Madhapur", km: 2.9 },
  { name: "Kothaguda", km: 3.3 },
  { name: "Nanakramguda", km: 3.7 },
  { name: "Manikonda", km: 4.4 },
  { name: "Jubilee Hills", km: 5.6 },
  { name: "Banjara Hills", km: 6.8 },
  { name: "Kukatpally", km: 7.4 },
  { name: "Miyapur", km: 8.9 },
  { name: "Narsingi", km: 6.1 },
  { name: "Tolichowki", km: 7.9 },
  { name: "Mehdipatnam", km: 9.6 },
  { name: "Ameerpet", km: 10.8 },
  { name: "Begumpet", km: 12.2 },
  { name: "Secunderabad", km: 15.4 },
  { name: "Kompally", km: 18.3 },
  { name: "Uppal", km: 21.5 },
  { name: "LB Nagar", km: 22.8 },
  { name: "Attapur", km: 11.4 },
  { name: "Bachupally", km: 13.6 },
];

const PREFIXES = [
  "Smash", "Urban", "Prime", "Victory", "Champions", "Zenith", "Elite", "Pro", "Ace", "Rally",
  "Red Dot", "Blue Line", "Pitch Perfect", "Golden Hour", "Skyline", "Rooftop", "Metro", "Night Owl",
  "Game On", "Sportz Village", "Fit Nation", "Play Hub", "Turf Town", "Kings", "Legends", "Hustle",
  "Momentum", "Velocity", "Arena One", "First Serve", "Fair Play", "Hat-trick", "Weekend", "The Den",
  "Lakeview", "Greenfield", "Stadia", "Pulse", "Rebound", "Squad",
];

const DAILY = ["Daily slots", "Daily slots", "Weekends and evenings", "Mon–Sat slots", "Evening slots"];
const DAY_HOURS = ["6:00 AM to 11:00 PM", "5:30 AM to 10:30 PM", "6:00 AM to 12:00 AM", "7:00 AM to 10:00 PM"];
const LATE_HOURS = ["11:00 AM to 12:00 AM", "12:00 PM to 1:00 AM", "10:00 AM to 11:00 PM"];
const POOL_HOURS = ["5:30 AM to 9:00 PM", "6:00 AM to 8:30 PM"];

const PROFILES: Record<string, SportProfile> = {
  badminton: {
    images: ["/images/explore/play/badminton.png", "/images/play/sport-badminton.jpg", "/images/play/play-8.jpg"],
    suffixes: ["Badminton Arena", "Shuttle Club", "Badminton Centre", "Smashers Court"],
    blurbs: [
      "Synthetic-mat badminton courts with BWF-grade lighting",
      "Wooden-floor indoor courts with shuttle and racquet rentals",
      "Air-cooled badminton hall with coaching for all levels",
      "Six indoor courts with anti-skid mats and spectator seating",
    ],
    price: [349, 699],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: DAILY,
    amenities: ["Racquet rentals", "Changing rooms", "Drinking water", "Parking"],
    also: ["Table Tennis", "Pickleball"],
  },
  swimming: {
    images: ["/images/explore/play/swimming.png", "/images/play/play-11.jpg"],
    suffixes: ["Aquatics", "Swim Club", "Swimming Pool", "Aqua Centre"],
    blurbs: [
      "Temperature-controlled pool with lane swimming and lessons",
      "Olympic-length outdoor pool with certified lifeguards",
      "Semi-covered pool with kids' learn-to-swim batches",
      "Rooftop lap pool with morning and evening sessions",
    ],
    price: [199, 449],
    unit: "/ session",
    hours: POOL_HOURS,
    schedules: ["Daily sessions", "Morning and evening batches", "Daily sessions"],
    amenities: ["Lifeguards", "Lockers", "Showers", "Changing rooms"],
  },
  pickleball: {
    images: [
      "/images/explore/play/pickleball.png",
      "/images/play/sport-pickleball.jpg",
      "/images/play/play-1.jpg",
      "/images/play/play-7.jpg",
      "/images/play/play-12.jpg",
    ],
    suffixes: ["Pickleball Club", "Pickle Courts", "Dink Arena", "Pickleball Hub"],
    blurbs: [
      "Cushioned pickleball courts with paddle rentals",
      "Floodlit outdoor pickleball courts with weekend socials",
      "Indoor pickleball courts with beginner coaching slots",
      "Four tournament-spec courts with late-night slots",
    ],
    price: [399, 899],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: DAILY,
    amenities: ["Paddle rentals", "Floodlights", "Seating", "Parking"],
    also: ["Padel", "Badminton"],
  },
  "turf-football": {
    images: ["/images/explore/play/turf-football.png", "/images/play/play-4.jpg", "/images/play/sport-football.jpg"],
    suffixes: ["Turf", "Football Turf", "5s Arena", "Sports Turf"],
    blurbs: [
      "FIFA-grade artificial turf for 5-a-side and 7-a-side games",
      "Floodlit rooftop turf with bibs and balls provided",
      "Shock-pad turf with night slots till midnight",
      "Netted multi-sport turf for football and box cricket",
    ],
    price: [900, 1800],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: DAILY,
    amenities: ["Floodlights", "Bibs & balls", "Changing rooms", "Parking"],
    also: ["Football", "Box Cricket"],
  },
  "table-tennis": {
    images: ["/images/explore/play/table-tennis.png", "/images/play/play-10.jpg"],
    suffixes: ["TT Club", "Table Tennis Centre", "Spin Studio", "Ping Pong Lounge"],
    blurbs: [
      "ITTF-approved tables in an air-conditioned hall",
      "Table tennis lounge with robot training sessions",
      "Six competition tables with coaching for juniors",
      "Casual ping pong tables with café seating",
    ],
    price: [149, 349],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: DAILY,
    amenities: ["Bat rentals", "Air conditioning", "Drinking water", "Seating"],
    also: ["Badminton", "Snooker"],
  },
  "box-cricket": {
    images: [
      "/images/explore/play/box-cricket.png",
      "/images/play/sport-cricket.jpg",
      "/images/play/play-2.jpg",
      "/images/play/play-4.jpg",
    ],
    suffixes: ["Box Cricket", "Cricket Box", "Box Arena", "Cricket Turf"],
    blurbs: [
      "Netted box cricket arena with floodlit night slots",
      "Rooftop box cricket with bats, balls and stumps provided",
      "Box cricket and 5-a-side turf under one roof",
      "Covered box cricket arena that plays through the rains",
    ],
    price: [900, 1600],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: DAILY,
    amenities: ["Floodlights", "Bats & balls", "Netted turf", "Parking"],
    also: ["Turf Football", "Cricket Nets"],
  },
  padel: {
    images: ["/images/explore/play/padel.png", "/images/play/play-7.jpg"],
    suffixes: ["Padel Club", "Padel Courts", "Padel House", "Padel Arena"],
    blurbs: [
      "Panoramic glass padel courts with racquet rentals",
      "Covered padel courts with evening coaching clinics",
      "Imported-turf padel courts with a lounge café",
      "Two championship padel courts open till midnight",
    ],
    price: [1200, 2400],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: DAILY,
    amenities: ["Racquet rentals", "Floodlights", "Lounge", "Parking"],
    also: ["Pickleball", "Tennis"],
  },
  "cricket-nets": {
    images: ["/images/explore/play/cricket-nets.png", "/images/play/sport-cricket.jpg", "/images/explore/play/cricket.png"],
    suffixes: ["Cricket Nets", "Cricket Academy", "Practice Nets", "Nets & Bowling"],
    blurbs: [
      "Turf and cement practice nets with a bowling machine",
      "Floodlit cricket nets with BCCI-level coaches on call",
      "Indoor practice lanes with speed-gun tracking",
      "Six practice nets with bowling machine add-ons",
    ],
    price: [399, 899],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: DAILY,
    amenities: ["Bowling machine", "Floodlights", "Kit storage", "Parking"],
    also: ["Box Cricket"],
  },
  tennis: {
    images: ["/images/explore/play/tennis.png", "/images/play/sport-tennis.jpg", "/images/play/play-9.jpg"],
    suffixes: ["Tennis Club", "Tennis Centre", "Tennis Academy", "Court House"],
    blurbs: [
      "Hard courts with floodlights and ball-machine sessions",
      "Clay and synthetic tennis courts with pro coaching",
      "Four floodlit hard courts with sunrise slots",
      "Members-style tennis club open to day bookings",
    ],
    price: [499, 1100],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: DAILY,
    amenities: ["Ball machine", "Floodlights", "Changing rooms", "Parking"],
    also: ["Padel", "Pickleball"],
  },
  basketball: {
    images: ["/images/explore/play/basketball.png", "/images/play/play-3.jpg"],
    suffixes: ["Hoops", "Basketball Court", "Ballers Arena", "Hoop House"],
    blurbs: [
      "Full-size wooden basketball court with pickup games",
      "Outdoor acrylic court with evening 3-on-3 runs",
      "Indoor basketball arena with scoreboard and seating",
      "Half and full court bookings with ball rentals",
    ],
    price: [599, 1299],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: ["Evening slots", "Daily slots", "Weekends and evenings"],
    amenities: ["Ball rentals", "Floodlights", "Scoreboard", "Parking"],
    also: ["Volleyball"],
  },
  snooker: {
    images: ["/images/explore/play/snooker.png", "/images/play/play-5.jpg"],
    suffixes: ["Snooker Lounge", "Cue Club", "Snooker Parlour", "Baize Room"],
    blurbs: [
      "Full-size snooker tables in a quiet air-conditioned lounge",
      "Snooker and pool parlour with café service",
      "Tournament-grade snooker tables with cue rentals",
      "Late-night snooker lounge with private tables",
    ],
    price: [199, 449],
    unit: "/ hour",
    hours: LATE_HOURS,
    schedules: ["Daily, till late", "Daily slots", "Evening slots"],
    amenities: ["Cue rentals", "Air conditioning", "Café", "Parking"],
    also: ["Pool", "Table Tennis"],
  },
  pool: {
    images: ["/images/explore/play/pool.png", "/images/play/play-5.jpg"],
    suffixes: ["Pool Hall", "8-Ball Lounge", "Billiards Bar", "Pool Club"],
    blurbs: [
      "8-ball and 9-ball tables with music and café",
      "Pool lounge with tournament nights every Friday",
      "American pool tables in an air-conditioned hall",
      "Pool and snooker bar open till 1 AM",
    ],
    price: [149, 399],
    unit: "/ hour",
    hours: LATE_HOURS,
    schedules: ["Daily, till late", "Daily slots", "Evening slots"],
    amenities: ["Cue rentals", "Music", "Café", "Air conditioning"],
    also: ["Snooker"],
  },
  volleyball: {
    images: ["/images/explore/play/volleyball.png", "/images/play/sport-volleyball.jpg"],
    suffixes: ["Volleyball Court", "Beach Volley", "Spike Arena", "Volley Club"],
    blurbs: [
      "Sand volleyball court with floodlit evening games",
      "Indoor volleyball court with sprung wooden floor",
      "Beach-style volleyball pits with weekend leagues",
      "Outdoor volleyball and throwball courts",
    ],
    price: [499, 999],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: ["Evening slots", "Weekends and evenings", "Daily slots"],
    amenities: ["Ball rentals", "Floodlights", "Showers", "Parking"],
    also: ["Basketball"],
  },
  football: {
    images: ["/images/explore/play/football.png", "/images/play/sport-football.jpg", "/images/play/play-6.jpg"],
    suffixes: ["Football Ground", "FC Ground", "Football Park", "Sports Ground"],
    blurbs: [
      "Full-size natural grass ground for 11-a-side matches",
      "7-a-side football ground with floodlights",
      "Grass football ground with weekend league slots",
      "Floodlit ground with goalposts, bibs and referees on call",
    ],
    price: [1500, 3500],
    unit: "/ hour",
    hours: DAY_HOURS,
    schedules: DAILY,
    amenities: ["Floodlights", "Bibs & balls", "Changing rooms", "Parking"],
    also: ["Turf Football"],
  },
};

const ID_PREFIX = "play-x-";

function hash(text: string) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function pick<T>(list: T[], seed: number) {
  return list[seed % list.length];
}

/** Total listing size per sport, stable between renders: 30–40 */
export function playSportTarget(sportId: string) {
  return 30 + (hash(sportId) % 11);
}

function buildVenue(sportId: string, index: number): PlayItem | null {
  const sport = findPlaySport(sportId);
  const profile = PROFILES[sportId];
  if (!sport || !profile) return null;

  const seed = hash(`${sportId}:${index}`);
  const area = LOCALITIES[(index * 7 + (hash(sportId) % LOCALITIES.length)) % LOCALITIES.length];
  const prefix = PREFIXES[(index * 11 + (hash(sportId) % PREFIXES.length)) % PREFIXES.length];
  const title = `${prefix} ${profile.suffixes[index % profile.suffixes.length]}`;
  const blurb =
    profile.blurbs[(index + Math.floor(index / profile.blurbs.length)) % profile.blurbs.length];
  const [min, max] = profile.price;
  const price = Math.round((min + ((seed >>> 5) % (max - min + 1))) / 50) * 50 - 1;
  const distanceKm = Math.round((area.km + ((seed >>> 7) % 19) / 10) * 10) / 10;
  const extra = profile.also && (seed >>> 9) % 3 === 0 ? [pick(profile.also, seed >>> 11)] : [];

  return {
    id: `${ID_PREFIX}${sportId}-${index + 1}`,
    title,
    description: `${blurb}. ${
      profile.unit.includes("hour") ? "Book by the hour" : "Book a session"
    } at ${area.name}.`,
    imageUrl: profile.images[index % profile.images.length],
    venue: area.name,
    locality: area.name,
    schedule: pick(profile.schedules, seed >>> 15),
    price: Math.max(price, min - 1),
    priceUnit: profile.unit,
    kind: "venue",
    sport: sport.label,
    sports: [sport.label, ...extra],
    distanceKm,
    hours: pick(profile.hours, seed >>> 17),
    rating: Math.round((3.9 + ((seed >>> 19) % 10) / 10) * 10) / 10,
    amenities: profile.amenities,
  };
}

/** Mock venues that top a sport listing up to its target size */
export function generatedPlayVenues(sportId: string, existing: number): PlayItem[] {
  const count = Math.max(0, playSportTarget(sportId) - existing);
  const list: PlayItem[] = [];
  for (let index = 0; index < count; index += 1) {
    const venue = buildVenue(sportId, index);
    if (venue) list.push(venue);
  }
  return list;
}

export function findGeneratedPlayVenue(id: string): PlayItem | null {
  if (!id.startsWith(ID_PREFIX)) return null;
  const match = id.slice(ID_PREFIX.length).match(/^(.+)-(\d+)$/);
  if (!match) return null;
  return buildVenue(match[1], Number(match[2]) - 1);
}
