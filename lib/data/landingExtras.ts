export type LandingArtist = {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
  /** Solid card fill — VYBE accent family */
  tone: string;
  /** Short badge under the name on showcase cards */
  tag?: string;
  /** Engagement pill, e.g. "546 K" */
  viewsLabel?: string;
};

export type LandingPosterCard = {
  id: string;
  title: string;
  imageUrl: string;
  href: string;
  venue?: string;
  schedule?: string;
  tag?: string;
};

export type LandingVideoCard = {
  id: string;
  title: string;
  subtitle?: string;
  venue?: string;
  schedule?: string;
  posterUrl: string;
  /** Omit for image-only cards (Moments posters). */
  videoUrl?: string;
  href: string;
};

/** Fallback when TMDB person photos are unavailable — local portraits */
export const landingArtists: LandingArtist[] = [
  {
    id: "artist-arijit",
    name: "Arijit Singh",
    imageUrl: "/images/artists/artist-7.jpg",
    href: "/events",
    tone: "#ff005b",
    tag: "TOP SELLER",
    viewsLabel: "892 K",
  },
  {
    id: "artist-shreya",
    name: "Shreya Ghoshal",
    imageUrl: "/images/artists/artist-1.jpg",
    href: "/events",
    tone: "#111827",
    tag: "LIVE THIS WEEK",
    viewsLabel: "654 K",
  },
  {
    id: "artist-diljit",
    name: "Diljit Dosanjh",
    imageUrl: "/images/artists/artist-2.jpg",
    href: "/events",
    tone: "#e11d48",
    tag: "TRENDING",
    viewsLabel: "721 K",
  },
  {
    id: "artist-sunidhi",
    name: "Sunidhi Chauhan",
    imageUrl: "/images/artists/artist-1.jpg",
    href: "/events",
    tone: "#9f1239",
    tag: "CROWD FAVOURITE",
    viewsLabel: "508 K",
  },
  {
    id: "artist-anirudh",
    name: "Anirudh Ravichander",
    imageUrl: "/images/artists/artist-3.jpg",
    href: "/events",
    tone: "#fb7185",
    tag: "NEW ON VYBE",
    viewsLabel: "615 K",
  },
  {
    id: "artist-kailash",
    name: "Kailash Kher",
    imageUrl: "/images/artists/artist-5.jpg",
    href: "/events",
    tone: "#be185d",
    tag: "TOP SELLER",
    viewsLabel: "432 K",
  },
  {
    id: "artist-neha",
    name: "Neha Kakkar",
    imageUrl: "/images/artists/artist-8.jpg",
    href: "/events",
    tone: "#ff005b",
    tag: "LIVE THIS WEEK",
    viewsLabel: "577 K",
  },
  {
    id: "artist-prateek",
    name: "Prateek Kuhad",
    imageUrl: "/images/artists/artist-4.jpg",
    href: "/events",
    tone: "#1e1e26",
    tag: "INTIMATE GIGS",
    viewsLabel: "389 K",
  },
];

/** Music rail posters — unique from landing Events (posters 09–16) */
export const landingMusicEvents: LandingPosterCard[] = [
  {
    id: "event-jazz-lounge",
    title: "Blue Note Jazz Lounge",
    imageUrl: "/images/events/poster-09.jpg",
    href: "/events/event-jazz-lounge",
    venue: "Park Hyatt",
    schedule: "Mar 05 · Hyderabad",
    tag: "Jazz",
  },
  {
    id: "event-comedy-circuit",
    title: "Hyderabad Comedy Circuit",
    imageUrl: "/images/events/poster-10.jpg",
    href: "/events/event-comedy-circuit",
    venue: "Phoenix Live",
    schedule: "Mar 12 · Hyderabad",
    tag: "Comedy",
  },
  {
    id: "event-theatre-night",
    title: "Black Box Theatre Night",
    imageUrl: "/images/events/poster-11.jpg",
    href: "/events/event-theatre-night",
    venue: "Ravindra Bharathi",
    schedule: "Mar 20 · Hyderabad",
    tag: "Theatre",
  },
  {
    id: "event-food-music",
    title: "Taste & Bass Festival",
    imageUrl: "/images/events/poster-12.jpg",
    href: "/events/event-food-music",
    venue: "Durgam Cheruvu",
    schedule: "Apr 04 · Hyderabad",
    tag: "Food Fest",
  },
  {
    id: "event-city-expo",
    title: "Hyderabad City Expo",
    imageUrl: "/images/events/poster-13.jpg",
    href: "/events/event-city-expo",
    venue: "HITEX Exhibition Grounds",
    schedule: "Apr 18 · Hyderabad",
    tag: "Expos",
  },
  {
    id: "event-art-walk",
    title: "Banjara Art Walk",
    imageUrl: "/images/events/poster-14.jpg",
    href: "/events/event-art-walk",
    venue: "Kalakriti Art Gallery",
    schedule: "May 03 · Hyderabad",
    tag: "Art",
  },
  {
    id: "event-sunday-fair",
    title: "Sunday Fest & Fair",
    imageUrl: "/images/events/poster-15.jpg",
    href: "/events/event-sunday-fair",
    venue: "Necklace Road",
    schedule: "May 10 · Hyderabad",
    tag: "Fair",
  },
  {
    id: "event-sunset-date",
    title: "Sunset Date Night",
    imageUrl: "/images/events/poster-16.jpg",
    href: "/events/event-sunset-date",
    venue: "Heart Cup Coffee",
    schedule: "May 16 · Hyderabad",
    tag: "Live",
  },
];

/**
 * Crowd favourites — mall adventure, water park, gaming, laser, Wonderla, go-kart
 */
export const landingCrowdFavourites: LandingVideoCard[] = [
  {
    id: "crowd-1",
    title: "Mall Adventure Zone",
    venue: "Inorbit Mall · Hyderabad",
    schedule: "Daily, 11:00 AM onwards",
    posterUrl: "/images/activities/spot-trampoline.jpg",
    videoUrl: "/assets/videos/vybe-4.mp4",
    href: "/activities",
  },
  {
    id: "crowd-2",
    title: "Wild Waters",
    venue: "Water park · Hyderabad",
    schedule: "Daily, 10:00 AM – 6:00 PM",
    posterUrl: "/images/activities/spot-waterpark-slides.jpg",
    videoUrl: "/assets/videos/vybe-5.mp4",
    href: "/activities",
  },
  {
    id: "crowd-3",
    title: "Gaming Arena",
    venue: "Arcade & console battles",
    schedule: "Hourly slots · Book anytime",
    posterUrl: "/images/activities/spot-bowling.jpg",
    videoUrl: "/assets/videos/vybe-6.mp4",
    href: "/activities",
  },
  {
    id: "crowd-4",
    title: "Laser Shooter",
    venue: "Laser tag arena · Kukatpally",
    schedule: "Weekday deals · Team raids",
    posterUrl: "/images/activities/spot-theme-night.jpg",
    videoUrl: "/assets/videos/vybe-7.mp4",
    href: "/activities",
  },
  {
    id: "crowd-5",
    title: "Wonderla",
    venue: "Kongara Kalan · Amusement park",
    schedule: "Daily, 11:00 AM onwards",
    posterUrl: "/images/activities/spot-wonderla.jpg",
    videoUrl: "/assets/videos/vybe-11.mp4",
    href: "/activities",
  },
  {
    id: "crowd-6",
    title: "Go-Karting",
    venue: "Gachibowli · Race track",
    schedule: "Fri – Sun evenings",
    posterUrl: "/images/activities/spot-gokart.jpg",
    videoUrl: "/assets/videos/gokart.mp4",
    href: "/activities",
  },
];

/** Moments — event posters; only Music Ni8 plays video */
export const landingMomentsVideos: LandingVideoCard[] = [
  {
    id: "moment-1",
    title: "Let's Play Garba",
    venue: "Traditional steps · Timeless joy",
    posterUrl: "/images/moments/garba.jpg",
    href: "/events",
  },
  {
    id: "moment-2",
    title: "HOTBOX",
    venue: "Bollywood beats · Veer Batra",
    posterUrl: "/images/moments/hotbox.jpg",
    href: "/events",
  },
  {
    id: "moment-3",
    title: "Still Alive",
    venue: "Stand-up comedy special",
    posterUrl: "/images/moments/still-alive.jpg",
    href: "/events",
  },
  {
    id: "moment-4",
    title: "Music Ni8",
    venue: "Dreamy night vibes",
    posterUrl: "/images/moments/club-night.jpg",
    videoUrl: "/assets/videos/music-ni8.mp4",
    href: "/events",
  },
  {
    id: "moment-5",
    title: "BGMI",
    venue: "Ninjas Assemble · Naruto mode",
    posterUrl: "/images/moments/bgmi.jpg",
    href: "/play",
  },
  {
    id: "moment-6",
    title: "Club Night",
    venue: "With DJ Ken Adams",
    posterUrl: "/images/moments/club-night.jpg",
    href: "/events",
  },
  {
    id: "moment-7",
    title: "Expressions",
    venue: "Gallery walkthrough",
    posterUrl: "/images/moments/art-exhibit.jpg",
    href: "/events",
  },
];

/** Game Zone — play / arcade / VR clips */
export const landingGameZoneVideos: LandingVideoCard[] = [
  {
    id: "game-1",
    title: "Strike night bowling",
    venue: "Inorbit Mall",
    schedule: "Daily, 11:00 AM",
    posterUrl: "/images/play/play-1.jpg",
    videoUrl: "/assets/videos/vybe-8.mp4",
    href: "/play",
  },
  {
    id: "game-2",
    title: "VR arena battles",
    venue: "Madhapur",
    schedule: "Hourly slots",
    posterUrl: "/images/play/play-2.jpg",
    videoUrl: "/assets/videos/vybe-10.mp4",
    href: "/play",
  },
  {
    id: "game-3",
    title: "Go-kart heat",
    venue: "Gachibowli",
    schedule: "Fri – Sun evenings",
    posterUrl: "/images/play/play-3.jpg",
    videoUrl: "/assets/videos/vybe-9.mp4",
    href: "/play",
  },
  {
    id: "game-4",
    title: "Arcade high scores",
    venue: "HITEC City",
    schedule: "Book anytime",
    posterUrl: "/images/play/play-4.jpg",
    videoUrl: "/assets/videos/vybe-11.mp4",
    href: "/play",
  },
  {
    id: "game-5",
    title: "Laser tag raids",
    venue: "Kukatpally",
    schedule: "Weekday deals",
    posterUrl: "/images/play/play-5.jpg",
    videoUrl: "/assets/videos/vybe-7.mp4",
    href: "/play",
  },
  {
    id: "game-6",
    title: "Trampoline park",
    venue: "Banjara Hills",
    schedule: "Open till late",
    posterUrl: "/images/play/play-6.jpg",
    videoUrl: "/assets/videos/vybe-6.mp4",
    href: "/play",
  },
];
