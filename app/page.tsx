import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { DiningSection } from "@/components/dining/DiningSection";
import { EventsSection } from "@/components/events/EventsSection";
import { ArtistsSection } from "@/components/landing/ArtistsSection";
import { LandingHero } from "@/components/landing/LandingHero";
import { PosterRailSection } from "@/components/landing/PosterRailSection";
import { VideoRailSection } from "@/components/landing/VideoRailSection";
import { TrendingMovies } from "@/components/movies/TrendingMovies";
import { getFeaturedArtists } from "@/lib/api/artists";
import { getDiningSpots } from "@/lib/api/dining";
import { getUpcomingEvents } from "@/lib/api/events";
import { getLandingHeroMovies, getNewReleaseMovies } from "@/lib/api/movies";
import { fallbackCategories } from "@/lib/data/fallback";
import {
  landingCrowdFavourites,
  landingGameZoneVideos,
  landingMomentsVideos,
  landingMusicEvents,
} from "@/lib/data/landingExtras";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ language?: string }>;
}) {
  const { language } = await searchParams;
  const movieLanguage = language || "all";

  const [hero, latest, events, dining, artists] = await Promise.all([
    getLandingHeroMovies(),
    getNewReleaseMovies(movieLanguage),
    getUpcomingEvents(),
    getDiningSpots(),
    getFeaturedArtists(),
  ]);

  return (
    <div className="flex w-full flex-col">
      {/* Latest 4 Tollywood + 3 Bollywood + 3 Hollywood, refreshed daily */}
      <LandingHero movies={hero.items} />

      {/* 1. Movies — newest across all languages, or the selected one */}
      <TrendingMovies
        movies={latest.items.slice(0, 15)}
        language={movieLanguage}
        totalLabel={`View All${latest.total ? ` (${latest.total})` : ""}`}
      />

      {/* 2. Categories */}
      <CategoryGrid categories={fallbackCategories} />

      {/* 3. Recently viewed */}
      {/* <RecentlyViewedSection /> */}

      {/* 4. Events */}
      <EventsSection events={events.items.slice(0, 8)} />

      {/* 5. Artists */}
      <ArtistsSection artists={artists} />

      {/* 6. Dining */}
      <DiningSection spots={dining.items.slice(0, 12)} />

      {/* 7. Crowd favourites */}
      <VideoRailSection
        title="Crowd favourite activities"
        description="Tours, parks, and plans everyone is booking"
        href="/activities"
        items={landingCrowdFavourites}
      />

      {/* 8. Music events */}
      <PosterRailSection
        title="Explore music events near you"
        description="Gigs, live bands, and nights worth booking"
        href="/events"
        items={landingMusicEvents}
      />

      {/* 9. Moments */}
      <VideoRailSection
        title="Moments on VYBE"
        description="Short clips from dining and game nights"
        href="/dining"
        items={landingMomentsVideos}
      />

      {/* 10. Game Zone */}
      <VideoRailSection
        title="Game Zone"
        description="Bowling, VR, karting and arcade spots near you"
        href="/play"
        items={landingGameZoneVideos}
      />
    </div>
  );
}
