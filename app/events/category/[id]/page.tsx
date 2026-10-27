import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/common/Container";
import { EventListingCard } from "@/components/events/EventListingCard";
import { EventSubcategoryGrid } from "@/components/events/EventSubcategoryGrid";
import { getUpcomingEvents } from "@/lib/api/events";
import { eventExploreCategories, findEventCategory } from "@/lib/data/eventCategories";

export function generateStaticParams() {
  return eventExploreCategories.map((category) => ({ id: category.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = findEventCategory(id);
  return { title: category ? category.label : "Events" };
}

export default async function EventCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = findEventCategory(id);
  if (!category) notFound();

  const { items } = await getUpcomingEvents();
  const ids = new Set(category.subcategories.map((item) => item.eventId));
  const events = items.filter((event) => ids.has(event.id));
  const chip =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-bold transition-colors";
  const chipIdle = "border-border bg-surface text-text hover:border-accent/40";
  const chipOn = "border-accent bg-accent-soft text-accent";

  return (
    <div className="w-full pb-14">
      <Container className="pt-6 md:pt-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-[13px] font-bold text-text-secondary transition-colors hover:text-accent"
        >
          <ChevronLeft className="size-4" />
          Events
        </Link>
        <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-text md:text-[32px]">
          {category.label} in Hyderabad
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          {category.subcategories.length}{" "}
          {category.subcategories.length === 1 ? "type" : "types"} to explore
        </p>
      </Container>

      <div className="sticky top-(--vybe-header-h) z-30 mt-5 border-b border-border bg-bg/95 backdrop-blur-xl">
        <Container className="flex items-center gap-2 py-3">
          <div className="hide-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
            {eventExploreCategories.map((entry) => {
              const current = entry.id === category.id;
              return (
                <Link
                  key={entry.id}
                  href={entry.href}
                  aria-current={current ? "page" : undefined}
                  className={`${chip} ${current ? chipOn : chipIdle}`}
                >
                  {entry.label}
                </Link>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="mt-6">
        <EventSubcategoryGrid
          items={category.subcategories}
          title={`${category.label} types`}
          meta={category.label}
        />

        <h2 className="mt-10 text-[20px] font-extrabold tracking-tight text-text md:text-[24px]">Events</h2>
        {events.length === 0 ? (
          <p className="mt-4 text-[14px] text-text-secondary">No events in this category yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7 3xl:grid-cols-6 4xl:grid-cols-7">
            {events.map((event) => (
              <EventListingCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
