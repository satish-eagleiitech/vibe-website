import { getUpcomingEvents } from "@/lib/api/events";
import { getTrendingMovies } from "@/lib/api/movies";
import { getPlayItems } from "@/lib/api/play";
import { getActivities } from "@/lib/api/activities";
import { fallbackHeroSlides } from "@/lib/data/fallback";
import { formatInr } from "@/lib/format";
import type { HeroBannerData } from "@/types/hero";

/**
 * Build a full-width hero carousel: Movies, Play, Activities, Events.
 * Prefers live TMDB / API imagery when available.
 */
export async function getHeroSlides(): Promise<HeroBannerData[]> {
  const [movies, play, activities, events] = await Promise.all([
    getTrendingMovies(),
    getPlayItems(),
    getActivities(),
    getUpcomingEvents(),
  ]);

  const slides = fallbackHeroSlides.map((slide) => ({ ...slide }));
  const patch = (category: HeroBannerData["category"], data: Partial<HeroBannerData>) => {
    const index = slides.findIndex((slide) => slide.category === category);
    if (index >= 0) slides[index] = { ...slides[index], ...data };
  };

  const movie = movies.items.find((item) => item.backdropUrl || item.posterUrl);
  if (movie) {
    patch("movies", {
      id: `hero-movie-${movie.id}`,
      title: movie.title,
      description:
        movie.description ||
        "Book seats for tonight’s most talked-about title near you.",
      imageUrl: movie.backdropUrl || movie.posterUrl,
      imageAlt: `${movie.title} backdrop`,
      venue: "Cinemas near you",
      dateLabel: movie.formatBadge || "Now showing",
      ctaLabel: "Book Tickets",
      href: `/movies/${movie.id}`,
    });
  }

  const playItem = play.items[0];
  if (playItem) {
    patch("play", {
      id: `hero-play-${playItem.id}`,
      title: playItem.title,
      description: playItem.description,
      imageUrl: playItem.imageUrl,
      imageAlt: playItem.title,
      venue: playItem.venue,
      dateLabel: playItem.schedule,
      ctaLabel: playItem.price
        ? `Book from ${formatInr(playItem.price)}`
        : "Book a Slot",
      href: `/play/${playItem.id}`,
    });
  }

  const activity = activities.items[0];
  if (activity) {
    patch("activities", {
      id: `hero-activity-${activity.id}`,
      title: activity.title,
      description: activity.description,
      imageUrl: activity.imageUrl,
      imageAlt: activity.title,
      venue: activity.category,
      dateLabel: `${formatInr(activity.price)} ${activity.priceUnit}`,
      ctaLabel: "Book Slot",
      href: `/activities/${activity.id}`,
    });
  }

  const event = events.items[0];
  if (event) {
    patch("events", {
      id: `hero-event-${event.id}`,
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
      imageAlt: event.title,
      venue: event.venue,
      dateLabel: `${event.month} ${event.day}`,
      ctaLabel: `Book from ${formatInr(event.startingPrice)}`,
      href: `/events/${event.id}`,
    });
  }

  return slides;
}

/** @deprecated prefer getHeroSlides */
export async function getHeroBanner(): Promise<HeroBannerData> {
  const slides = await getHeroSlides();
  return slides[0];
}
