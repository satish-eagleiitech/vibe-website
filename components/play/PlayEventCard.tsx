"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { trackRecentView } from "@/lib/recent/storage";
import type { PlayItem } from "@/types/play";

type PlayEventCardProps = {
  item: PlayItem;
};

export function PlayEventCard({ item }: PlayEventCardProps) {
  const place = [item.venue, item.locality || "Hyderabad"]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/play/${item.id}`}
      onClick={() =>
        trackRecentView({
          id: item.id,
          title: item.title,
          href: `/play/${item.id}`,
          imageUrl: item.imageUrl,
          meta: place,
          category: "play",
        })
      }
      className="group flex w-[220px] shrink-0 flex-col sm:w-[260px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-muted">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="260px"
        />
        {item.sport ? (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            {item.sport}
          </span>
        ) : null}
      </div>
      <p className="mt-2.5 inline-flex items-start gap-1 text-[12px] text-text-secondary">
        <MapPin className="mt-0.5 size-3.5 shrink-0 text-accent" />
        <span className="line-clamp-1">{place}</span>
      </p>
      <h3 className="mt-1 line-clamp-2 text-[15px] font-extrabold text-text">
        {item.title}
      </h3>
      <p className="mt-1 text-[12px] text-text-secondary">
        {[item.dateLabel, item.timeLabel].filter(Boolean).join(", ") ||
          item.schedule}
      </p>
      {item.price ? (
        <p className="mt-1 text-[13px] font-bold text-text">
          ₹{item.price.toLocaleString("en-IN")}
          <span className="font-medium text-text-secondary"> {item.priceUnit}</span>
        </p>
      ) : null}
    </Link>
  );
}
