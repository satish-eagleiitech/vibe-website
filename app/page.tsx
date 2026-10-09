import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { EventsSection } from "@/components/events/EventsSection";
import { ActivitiesForYouSection } from "@/components/landing/ActivitiesForYouSection";
import { ArtistsSection } from "@/components/landing/ArtistsSection";
import { LandingHero } from "@/components/landing/LandingHero";
import { PosterRailSection } from "@/components/landing/PosterRailSection";
import { VideoRailSection } from "@/components/landing/VideoRailSection";
import { TrendingMovies } from "@/components/movies/TrendingMovies";
import { PlayEventsSection } from "@/components/play/PlayEventsSection";
import { getFeaturedArtists } from "@/lib/api/artists";
import { getUpcomingEvents } from "@/lib/api/events";
import { getLandingHeroMovies, getNewReleaseMovies } from "@/lib/api/movies";
import { getPlayEvents } from "@/lib/api/play";
import { fallbackCategories } from "@/lib/data/fallback";
import {
  landingCrowdFavourites,
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

  const [hero, latest, events, artists, playEvents] = await Promise.all([
    getLandingHeroMovies(),
    getNewReleaseMovies(movieLanguage),
    getUpcomingEvents(),
    getFeaturedArtists(),
    getPlayEvents(),
  ]);

  return (
    <div className="flex w-full flex-col">
      {/* Latest 4 Tollywood + 3 Bollywood + 3 Hollywood, refreshed hourly */}
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

      {/* 6. Crowd favourites */}
      <VideoRailSection
        title="Crowd favourite activities"
        description="Tours, parks, and plans everyone is booking"
        href="/activities"
        items={landingCrowdFavourites}
      />

      {/* 7. Music events */}
      <PosterRailSection
        title="Explore music events near you"
        description="Gigs, live bands, and nights worth booking"
        href="/events"
        items={landingMusicEvents}
      />

      {/* 8. Moments */}
      <VideoRailSection
        title="Moments on VYBE"
        description="Short clips from game nights and turf matches"
        href="/play"
        items={landingMomentsVideos}
      />

      {/* 9. Game Zone — same cards as Play → Featured sports events */}
      <PlayEventsSection
        title="Game Zone"
        emptyTitle="No Game Zone events right now"
        events={playEvents}
      />

      {/* 10. Activities for you */}
      <ActivitiesForYouSection />
    </div>
  );
}
