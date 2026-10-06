"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { useRef } from "react";
import type { Activity } from "@/types/activity";
import { trackRecentView } from "@/lib/recent/storage";

type ActivityCardProps = {
  activity: Activity;
  className?: string;
};

export function ActivityCard({ activity, className = "" }: ActivityCardProps) {
  return (
    <Link
      href={`/activities/${activity.id}`}
      onClick={() =>
        trackRecentView({
          id: activity.id,
          title: activity.title,
          href: `/activities/${activity.id}`,
          imageUrl: activity.imageUrl,
          meta: activity.venue || activity.category,
          category: "activities",
        })
      }
      className={`group flex w-[220px] shrink-0 snap-start flex-col sm:w-[240px] ${className}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[16px] bg-[#ECECEE]">
        <Image
          src={activity.imageUrl}
          alt={activity.title}
          fill
          className="object-cover"
          sizes="240px"
        />
      </div>
      <div className="pt-3 pb-1">
        <div className="flex items-start gap-1 text-[12px] text-text-secondary">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span className="line-clamp-1">
            {activity.venue || activity.category}
          </span>
        </div>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-extrabold text-text">
          {activity.title}
        </h3>
        <p className="mt-1 truncate text-[12px] leading-4 text-text-secondary">
          {activity.schedule || activity.description}
        </p>
      </div>
    </Link>
  );
}

type ActivityCarouselProps = {
  activities: Activity[];
};

export function ActivityCarousel({ activities }: ActivityCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="hide-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2"
      >
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
      <button
        type="button"
        aria-label="Scroll activities"
        onClick={() =>
          scrollerRef.current?.scrollBy({ left: 260, behavior: "smooth" })
        }
        className="absolute top-[38%] right-0 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-text shadow-md md:inline-flex"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
