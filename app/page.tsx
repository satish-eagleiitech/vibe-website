import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { EventsSection } from "@/components/events/EventsSection";
import { ActivitiesForYouSection } from "@/components/landing/ActivitiesForYouSection";
// import { LandingHero } from "@/components/landing/LandingHero";
import { PosterRailSection } from "@/components/landing/PosterRailSection";
import { VideoRailSection } from "@/components/landing/VideoRailSection";
import { MovieHeroCarousel } from "@/components/movies/MovieHeroCarousel";
import { TrendingMovies } from "@/components/movies/TrendingMovies";
import { PlayEventsSection } from "@/components/play/PlayEventsSection";
import { getUpcomingEvents } from "@/lib/api/events";
import { getLandingHeroMovies, getNewReleaseMovies } from "@/lib/api/movies";
import { getPlayEvents } from "@/lib/api/play";
import { fallbackCategories } from "@/lib/data/fallback";
import {
  landingCrowdFavourites,
  landingMomentsVideos,
  landingMusicEvents,
} from "@/lib/data/landingExtras";

const HERO_SLIDES = 10;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ language?: string }>;
}) {
  const { language } = await searchParams;
  const movieLanguage = language || "all";

  const [hero, latest, events, playEvents] = await Promise.all([
    getLandingHeroMovies(),
    getNewReleaseMovies(movieLanguage),
    getUpcomingEvents(),
    getPlayEvents(),
  ]);

  const LANDING_EXCLUDE = new Set(["1787082", "1785244"]); // Poniiy, AAKHRI MULAQAT

  // Fresh regional mix for the cinematic hero; latest-first for Movies cards
  const heroMovies = hero.items
    .filter(
      (movie) =>
        (movie.backdropUrl || movie.posterUrl) && !LANDING_EXCLUDE.has(movie.id),
    )
    .slice(0, HERO_SLIDES);
  const latestItems = latest.items.filter(
    (movie) => !LANDING_EXCLUDE.has(movie.id),
  );

  return (
    <div className="flex w-full flex-col">
      {/* Previous coverflow landing hero — kept for easy restore
      <LandingHero movies={hero.items} />
      */}

      {/* Movies-category cinematic hero on the homepage */}
      <MovieHeroCarousel movies={heroMovies} />

      {/* 1. Movies — newest across all languages, or the selected one */}
      <TrendingMovies
        movies={latestItems.slice(0, 15)}
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
      {/* <ArtistsSection artists={artists} /> */}

      {/* 6. Crowd favourites */}
      <VideoRailSection
        title="Crowd Activities"
        description="Tours, parks, and plans everyone is booking"
        href="/activities"
        items={landingCrowdFavourites}
      />

      {/* 7. Music events */}
      <PosterRailSection
        title="Music Events"
        description="Gigs, live bands, and nights worth booking"
        href="/events"
        items={landingMusicEvents}
      />

      {/* 8. Moments */}
      <VideoRailSection
        title="Moments on VYBE"
        description="comedy, club scenes and play drops around you"
        href="/events"
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
