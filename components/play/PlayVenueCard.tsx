"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { trackRecentView } from "@/lib/recent/storage";
import type { PlayItem } from "@/types/play";

type PlayVenueCardProps = {
  item: PlayItem;
  /** Portrait image + details below (Play browse grid) */
  variant?: "browse" | "classic";
};

function locationLine(item: PlayItem) {
  if (item.kind === "event" && item.venue) {
    return [item.venue, item.locality].filter(Boolean).join(", ");
  }
  return [item.title, item.locality ?? item.venue].filter(Boolean).join(", ");
}

function headlineLine(item: PlayItem) {
  if (item.kind === "event") return item.title;
  const blurb = item.description?.split(".")[0]?.trim();
  return blurb || item.title;
}

function scheduleLine(item: PlayItem) {
  if (item.dateLabel && item.timeLabel) {
    return `${item.dateLabel}, ${item.timeLabel}`;
  }
  return item.schedule ?? item.hours ?? "";
}

export function PlayVenueCard({ item, variant = "browse" }: PlayVenueCardProps) {
  const onTrack = () =>
    trackRecentView({
      id: item.id,
      title: item.title,
      href: `/play/${item.id}`,
      imageUrl: item.imageUrl,
      meta: `${item.sport ?? "Play"} · ${item.locality ?? item.venue}`,
      category: "play",
    });

  if (variant === "browse") {
    const when = scheduleLine(item);

    return (
      <Link
        href={`/play/${item.id}`}
        onClick={onTrack}
        className="flex w-full flex-col"
      >
        <div className="relative h-[260px] w-full overflow-hidden border border-border bg-surface-muted sm:h-[300px] md:h-[320px]">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px"
          />
        </div>

        <div className="mt-3 flex flex-col gap-1 px-0.5">
          <p className="line-clamp-1 text-[12px] font-semibold text-text-secondary">
            {locationLine(item)}
          </p>
          <h3 className="line-clamp-2 text-[14px] leading-snug font-extrabold text-text sm:text-[15px]">
            {headlineLine(item)}
          </h3>
          {when ? (
            <p className="text-[12px] text-text-muted">{when}</p>
          ) : null}
          {item.price != null ? (
            <p className="mt-0.5 text-[13px] font-extrabold text-text">
              ₹{item.price.toLocaleString("en-IN")}
              {item.priceUnit ? (
                <span className="font-medium text-text-secondary">
                  {" "}
                  {item.priceUnit}
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
      </Link>
    );
  }

  const distance =
    item.distanceKm != null ? `${item.distanceKm} km` : null;

  return (
    <Link
      href={`/play/${item.id}`}
      onClick={onTrack}
      className="group flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-shadow hover:shadow-[0_14px_32px_rgba(17,24,39,0.10)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {item.sport ? (
          <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur-sm">
            {item.sport}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-[16px] font-extrabold text-text">
          {item.title}
        </h3>
        <p className="mt-1 inline-flex items-center gap-1 text-[12.5px] text-text-secondary">
          <MapPin className="size-3.5 shrink-0 text-accent" />
          <span className="line-clamp-1">
            {[distance, item.locality || "Hyderabad"].filter(Boolean).join(" · ")}
          </span>
        </p>
        {item.price ? (
          <p className="mt-auto pt-3 text-[14px] font-extrabold text-text">
            ₹{item.price.toLocaleString("en-IN")}
            <span className="font-medium text-text-secondary"> {item.priceUnit}</span>
          </p>
        ) : null}
      </div>
    </Link>
  );
}
