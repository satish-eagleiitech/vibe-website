import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Star,
  Ticket,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { StickyBookBar } from "@/components/movies/StickyBookBar";
import { RecordRecentView } from "@/components/recent/RecordRecentView";
import { PlayVenueCard } from "@/components/play/PlayVenueCard";
import { formatInr } from "@/lib/format";
import type { PlayItem } from "@/types/play";

type PlayDetailViewProps = {
  item: PlayItem;
  related: PlayItem[];
};

export function PlayDetailView({ item, related }: PlayDetailViewProps) {
  const isEvent = item.kind === "event";
  const place = [...new Set([item.venue, item.locality || "Hyderabad"].filter(Boolean))].join(", ");
  const bookLabel = isEvent ? "Book tickets" : "Book a slot";

  return (
    <div className="w-full bg-bg pb-16">
      <RecordRecentView
        id={item.id}
        title={item.title}
        href={`/play/${item.id}`}
        imageUrl={item.imageUrl}
        meta={place}
        category="play"
      />

      <section id="play-detail-hero" className="bg-bg">
        <Container className="pt-5 pb-6 md:pt-7 md:pb-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface-muted md:aspect-[21/9]">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              priority
              className="object-cover object-[center_30%]"
              sizes="100vw"
            />
            {item.sport ? (
              <span className="absolute top-4 left-4 rounded-full bg-black/65 px-3 py-1 text-[11px] font-extrabold tracking-wide text-white uppercase">
                {item.sport}
              </span>
            ) : null}
          </div>
        </Container>
      </section>

      <StickyBookBar
        title={item.title}
        bookHref={`/play/${item.id}/book`}
        heroId="play-detail-hero"
      />

      <Container className="grid gap-8 pb-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-text md:text-[36px]">
            {item.title}
          </h1>
          <div className="mt-4 space-y-2.5 text-[14px] text-text-secondary md:text-[15px]">
            {item.rating ? (
              <p className="inline-flex items-center gap-2 font-bold text-text">
                <Star className="size-4 fill-accent text-accent" />
                {item.rating.toFixed(1)}
              </p>
            ) : null}
            {isEvent ? (
              <p className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-accent" />
                {item.schedule}
              </p>
            ) : (
              <p className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-accent" />
                {item.hours}
              </p>
            )}
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>
                {place}
                {item.distanceKm != null ? ` · ${item.distanceKm} km` : ""}
              </span>
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
              {isEvent ? "About the event" : "About the venue"}
            </h2>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-text-secondary">
              {item.description}
            </p>
          </div>

          {!isEvent && item.amenities?.length ? (
            <div className="mt-8">
              <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
                Amenities
              </h2>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-[14px] text-text-secondary sm:grid-cols-3">
                {item.amenities.map((amenity) => (
                  <li key={amenity} className="rounded-xl border border-border bg-surface px-3 py-2">
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8">
            <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
              {isEvent ? "Venue" : "Location"}
            </h2>
            <div className="mt-3 rounded-2xl border border-border bg-surface p-4">
              <p className="text-[15px] font-extrabold text-text">{item.venue}</p>
              <p className="mt-1 text-[13px] text-text-secondary">
                {item.locality || "Hyderabad"}, Telangana
              </p>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-[0_10px_30px_rgba(17,24,39,0.06)] lg:sticky lg:top-24">
          <p className="text-[12px] font-extrabold tracking-[0.14em] text-accent uppercase">
            {isEvent ? "Book tickets" : "Book a slot"}
          </p>
          <h3 className="mt-2 text-[18px] font-extrabold text-text">{item.title}</h3>
          <p className="mt-2 text-[13px] text-text-secondary">{place}</p>
          {item.price ? (
            <p className="mt-4 text-[22px] font-extrabold text-text">
              {formatInr(item.price)}{" "}
              <span className="text-[13px] font-semibold text-text-secondary">
                {item.priceUnit ?? "onwards"}
              </span>
            </p>
          ) : null}
          <Link
            href={`/play/${item.id}/book`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            <Ticket className="size-4" />
            {bookLabel}
          </Link>
          <p className="mt-3 text-center text-[12px] text-text-muted">
            Instant confirmation on VYBE
          </p>
        </aside>
      </Container>

      {related.length > 0 ? (
        <section className="mt-6 border-t border-border bg-bg py-8 md:py-10">
          <Container>
            <h2 className="mb-5 text-[22px] font-extrabold tracking-tight text-text md:text-[26px]">
              More venues near you
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-5">
              {related.map((venue) => (
                <PlayVenueCard key={venue.id} item={venue} variant="browse" />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
