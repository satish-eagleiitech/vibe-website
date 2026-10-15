export type PopularCity = {
  id: string;
  name: string;
  state: string;
  /** Landmark artwork under /public/images/cities */
  image?: string;
  /** Soft colorful tile behind the landmark icon */
  tone?: string;
  lat: number;
  lng: number;
};

/** Landmark art for the location picker popular grid — top metros first */
export const POPULAR_CITIES: PopularCity[] = [
  {
    id: "hyd",
    name: "Hyderabad",
    state: "Telangana",
    image: "/images/cities/hyderabad.png",
    tone: "#FFD0E4",
    lat: 17.385,
    lng: 78.4867,
  },
  {
    id: "mum",
    name: "Mumbai",
    state: "Maharashtra",
    image: "/images/cities/mumbai.png",
    tone: "#CDE3FF",
    lat: 19.076,
    lng: 72.8777,
  },
  {
    id: "del",
    name: "Delhi NCR",
    state: "Delhi",
    image: "/images/cities/delhi.png",
    tone: "#FFE0B8",
    lat: 28.6139,
    lng: 77.209,
  },
  {
    id: "blr",
    name: "Bengaluru",
    state: "Karnataka",
    image: "/images/cities/bengaluru.png",
    tone: "#C6F0D6",
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: "che",
    name: "Chennai",
    state: "Tamil Nadu",
    image: "/images/cities/chennai.png",
    tone: "#E4D0FF",
    lat: 13.0827,
    lng: 80.2707,
  },
  {
    id: "pun",
    name: "Pune",
    state: "Maharashtra",
    image: "/images/cities/pune.png",
    tone: "#FFE9A8",
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    id: "kol",
    name: "Kolkata",
    state: "West Bengal",
    image: "/images/cities/kolkata.png",
    tone: "#C8ECFF",
    lat: 22.5726,
    lng: 88.3639,
  },
  {
    id: "amd",
    name: "Ahmedabad",
    state: "Gujarat",
    image: "/images/cities/ahmedabad.png",
    tone: "#FFD4C4",
    lat: 23.0225,
    lng: 72.5714,
  },
  {
    id: "jai",
    name: "Jaipur",
    state: "Rajasthan",
    image: "/images/cities/jaipur.png",
    tone: "#FFC9DC",
    lat: 26.9124,
    lng: 75.7873,
  },
  {
    id: "cok",
    name: "Kochi",
    state: "Kerala",
    image: "/images/cities/kochi.png",
    tone: "#B8F5DE",
    lat: 9.9312,
    lng: 76.2673,
  },
  {
    id: "chd",
    name: "Chandigarh",
    state: "Chandigarh",
    image: "/images/cities/chandigarh.png",
    tone: "#D4D8FF",
    lat: 30.7333,
    lng: 76.7794,
  },
  {
    id: "goi",
    name: "Goa",
    state: "Goa",
    image: "/images/cities/goa.png",
    tone: "#B6F5E4",
    lat: 15.2993,
    lng: 74.124,
  },
];

/** Locality / suburb aliases → popular metro display name */
const CITY_ALIASES: Record<string, string> = {
  // Hyderabad
  hyderabad: "Hyderabad",
  secunderabad: "Hyderabad",
  "hitec city": "Hyderabad",
  "hitech city": "Hyderabad",
  madhapur: "Hyderabad",
  gachibowli: "Hyderabad",
  "banjara hills": "Hyderabad",
  "jubilee hills": "Hyderabad",
  kukatpally: "Hyderabad",
  "financial district": "Hyderabad",
  kondapur: "Hyderabad",
  miyapur: "Hyderabad",
  dilsukhnagar: "Hyderabad",
  // Mumbai
  mumbai: "Mumbai",
  bombay: "Mumbai",
  andheri: "Mumbai",
  bandra: "Mumbai",
  powai: "Mumbai",
  "navi mumbai": "Mumbai",
  thane: "Mumbai",
  // Delhi NCR
  delhi: "Delhi NCR",
  "new delhi": "Delhi NCR",
  "delhi ncr": "Delhi NCR",
  noida: "Delhi NCR",
  gurugram: "Delhi NCR",
  gurgaon: "Delhi NCR",
  faridabad: "Delhi NCR",
  ghaziabad: "Delhi NCR",
  // Bengaluru
  bengaluru: "Bengaluru",
  bangalore: "Bengaluru",
  whitefield: "Bengaluru",
  koramangala: "Bengaluru",
  indiranagar: "Bengaluru",
  // Chennai
  chennai: "Chennai",
  madras: "Chennai",
  // Pune
  pune: "Pune",
  hinjewadi: "Pune",
  // Kolkata
  kolkata: "Kolkata",
  calcutta: "Kolkata",
  // Ahmedabad
  ahmedabad: "Ahmedabad",
  // Jaipur
  jaipur: "Jaipur",
  // Kochi
  kochi: "Kochi",
  cochin: "Kochi",
  // Chandigarh
  chandigarh: "Chandigarh",
  mohali: "Chandigarh",
  // Goa
  goa: "Goa",
  panaji: "Goa",
};

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function matchPopularByName(raw: string): PopularCity | null {
  const key = raw.trim().toLowerCase();
  if (!key) return null;

  const alias = CITY_ALIASES[key];
  if (alias) {
    return POPULAR_CITIES.find((c) => c.name === alias) ?? null;
  }

  const exact = POPULAR_CITIES.find((c) => c.name.toLowerCase() === key);
  if (exact) return exact;

  const contained = POPULAR_CITIES.find(
    (c) => key.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(key),
  );
  return contained ?? null;
}

/**
 * Map a detected locality (e.g. HITEC City) to the parent popular metro
 * shown in the navbar (e.g. Hyderabad). Falls back to nearest popular city.
 */
export function resolveMajorCity(input: {
  city?: string;
  area?: string;
  state?: string;
  lat?: number;
  lng?: number;
}): PopularCity {
  const candidates = [input.city, input.area, input.state].filter(
    Boolean,
  ) as string[];

  for (const candidate of candidates) {
    const matched = matchPopularByName(candidate);
    if (matched) return matched;
  }

  // Phrase scan: "HITEC City, Hyderabad, Telangana"
  const blob = candidates.join(" ").toLowerCase();
  for (const [alias, metro] of Object.entries(CITY_ALIASES)) {
    if (blob.includes(alias)) {
      const matched = POPULAR_CITIES.find((c) => c.name === metro);
      if (matched) return matched;
    }
  }

  if (input.lat != null && input.lng != null) {
    let best = POPULAR_CITIES[0];
    let bestKm = Number.POSITIVE_INFINITY;
    for (const city of POPULAR_CITIES) {
      const km = haversineKm(input.lat, input.lng, city.lat, city.lng);
      if (km < bestKm) {
        bestKm = km;
        best = city;
      }
    }
    // Within ~80km of a metro, snap to it
    if (bestKm <= 80) return best;
  }

  return (
    POPULAR_CITIES.find((c) => c.name === "Hyderabad") ?? POPULAR_CITIES[0]
  );
}

export const ALL_CITIES = [
  "Abohar",
  "Abu Dhabi",
  "Abu Road",
  "Achampet",
  "Acharapakkam",
  "Addanki",
  "Adilabad",
  "Adipur",
  "Agra",
  "Ahmedabad",
  "Ajmer",
  "Aligarh",
  "Allahabad",
  "Amravati",
  "Amritsar",
  "Anantapur",
  "Aurangabad",
  "Bengaluru",
  "Bhopal",
  "Bhubaneswar",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Delhi NCR",
  "Dubai",
  "Goa",
  "Guntur",
  "Gurugram",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Jodhpur",
  "Kochi",
  "Kolkata",
  "Lucknow",
  "Madurai",
  "Mangalore",
  "Mumbai",
  "Mysuru",
  "Nagpur",
  "Nashik",
  "Noida",
  "Patna",
  "Pune",
  "Raipur",
  "Rajkot",
  "Ranchi",
  "Surat",
  "Thiruvananthapuram",
  "Tirupati",
  "Udaipur",
  "Vadodara",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam",
  "Warangal",
];

export const CITY_STORAGE_KEY = "vybe-city";

export type SavedLocation = {
  city: string;
  state: string;
  area?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
};

export function readSavedLocation(): SavedLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CITY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedLocation;
  } catch {
    return null;
  }
}

export function writeSavedLocation(location: SavedLocation) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(location));
  window.dispatchEvent(new Event("vybe-city-change"));
}
