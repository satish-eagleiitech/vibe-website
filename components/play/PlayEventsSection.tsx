import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { PlayEventCard } from "@/components/play/PlayEventCard";
import type { PlayItem } from "@/types/play";

type PlayEventsSectionProps = {
  events: PlayItem[];
};

export function PlayEventsSection({ events }: PlayEventsSectionProps) {
  return (
    <section className="w-full py-6 md:py-8">
      <Container>
        <h2 className="text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
          Featured sports events
        </h2>
        {events.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No featured sports events right now" />
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
