import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { PlayEventCard } from "@/components/play/PlayEventCard";
import type { PlayItem } from "@/types/play";

type PlayEventsSectionProps = {
  events: PlayItem[];
  title?: string;
  emptyTitle?: string;
};

export function PlayEventsSection({
  events,
  title = "Featured sports events",
  emptyTitle = "No featured sports events right now",
}: PlayEventsSectionProps) {
  return (
    <section className="w-full py-6 md:py-8">
      <Container>
        <h2 className="text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
          {title}
        </h2>
        {events.length === 0 ? (
          <div className="mt-6">
            <EmptyState title={emptyTitle} />
          </div>
        ) : (
          <div className="mt-5 hide-scrollbar flex gap-5 overflow-x-auto pb-2">
            {events.map((event) => (
              <PlayEventCard key={event.id} item={event} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
