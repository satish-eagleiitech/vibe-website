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
  videoUrl: string;
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
 * Crowd favourites — video cards with outdoor/tour posters
 * (activity-7..12 so they don't clash with Activities rail if added later)
 */
export const landingCrowdFavourites: LandingVideoCard[] = [
  {
    id: "crowd-1",
    title: "Ramoji Studio Tour",
    venue: "Ramoji Film City",
    schedule: "Fri, 18 Sept – Wed, 7 Oct, 9:30 AM",
    posterUrl: "/images/activities/activity-7.jpg",
    videoUrl: "/assets/videos/vybe-4.mp4",
    href: "/activities",
  },
  {
    id: "crowd-2",
    title: "Wonderla Amusement Park",
    venue: "Kongara Kalan",
    schedule: "Daily, 11:00 AM onwards",
    posterUrl: "/images/activities/activity-8.jpg",
    videoUrl: "/assets/videos/vybe-5.mp4",
    href: "/activities",
  },
  {
    id: "crowd-3",
    title: "Snow World Hyderabad",
    venue: "Lower Tank Bund",
    schedule: "Daily, 11:00 AM – 9:00 PM",
    posterUrl: "/images/activities/activity-9.jpg",
    videoUrl: "/assets/videos/vybe-6.mp4",
    href: "/activities",
  },
  {
    id: "crowd-4",
    title: "Adventure Park Day Pass",
    venue: "Gandipet",
    schedule: "Weekends, 10:00 AM onwards",
    posterUrl: "/images/activities/activity-10.jpg",
    videoUrl: "/assets/videos/vybe-7.mp4",
    href: "/activities",
  },
  {
    id: "crowd-5",
    title: "City Walking Trail",
    venue: "Charminar Heritage Walk",
    schedule: "Sat – Sun, 7:00 AM",
    posterUrl: "/images/activities/activity-11.jpg",
    videoUrl: "/assets/videos/vybe-11.mp4",
    href: "/activities",
  },
  {
    id: "crowd-6",
    title: "Lakeside Cycling Loop",
    venue: "Hussain Sagar",
    schedule: "Daily sunrise slots",
    posterUrl: "/images/activities/activity-12.jpg",
    videoUrl: "/assets/videos/vybe-3.mp4",
    href: "/activities",
  },
];

/** Moments — sport and game posters only (no event/activity reuse) */
export const landingMomentsVideos: LandingVideoCard[] = [
  {
    id: "moment-1",
    title: "Floodlit box cricket",
    venue: "Gachibowli",
    schedule: "Night slots till 12 AM",
    posterUrl: "/images/play/sport-cricket.jpg",
    videoUrl: "/assets/videos/vybe-1.mp4",
    href: "/play/sports/box-cricket",
  },
  {
    id: "moment-2",
    title: "Sunrise badminton",
    venue: "Kondapur",
    schedule: "Daily, 6:00 AM",
    posterUrl: "/images/play/sport-badminton.jpg",
    videoUrl: "/assets/videos/vybe-2.mp4",
    href: "/play/sports/badminton",
  },
  {
    id: "moment-3",
    title: "Bowling league night",
    venue: "Inorbit Mall",
    schedule: "Daily, 11:00 AM",
    posterUrl: "/images/play/play-8.jpg",
    videoUrl: "/assets/videos/vybe-8.mp4",
    href: "/play",
  },
  {
    id: "moment-4",
    title: "Arcade rush hour",
    venue: "Gachibowli",
    schedule: "Book anytime",
    posterUrl: "/images/play/play-9.jpg",
    videoUrl: "/assets/videos/vybe-9.mp4",
    href: "/play",
  },
  {
    id: "moment-5",
    title: "VR battle rooms",
    venue: "Madhapur",
    schedule: "Hourly slots",
    posterUrl: "/images/play/play-10.jpg",
    videoUrl: "/assets/videos/vybe-10.mp4",
    href: "/play",
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
