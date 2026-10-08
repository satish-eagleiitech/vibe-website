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
    const distance = item.distanceKm != null ? `${item.distanceKm} km` : null;
    const place = item.locality || item.venue;
    const meta = [distance, place].filter(Boolean).join(" • ");

    return (
      <Link
        href={`/play/${item.id}`}
        onClick={onTrack}
        className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white"
      >
        <div className="relative aspect-[16/10] w-full bg-[#F4F4F5]">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 50vw, 280px"
          />
        </div>

        <div className="flex flex-col px-3 pt-3 pb-3">
          <h3 className="line-clamp-1 text-[15px] leading-5 font-bold text-[#111111]">
            {item.title}
          </h3>
          {meta ? (
            <p className="mt-0.5 line-clamp-1 text-[12px] leading-4 font-normal text-[#9A9A9A]">
              {meta}
            </p>
          ) : null}
          {item.sport ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center rounded-full border border-[#E6E6E6] bg-white px-2.5 py-1 text-[12px] leading-none font-medium text-[#3A3A3A]">
                {item.sport}
              </span>
            </div>
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
