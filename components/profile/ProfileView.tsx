"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Pencil, Ticket } from "lucide-react";
import { useAccountData } from "@/components/account/useAccountData";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import type { BookingCategory, VybeBooking } from "@/lib/bookings/storage";
import { writeSavedLocation } from "@/lib/location/cities";
import { categoryColors } from "@/lib/theme/colors";
import { writeProfile, type VybeProfile } from "@/lib/profile/storage";

const CATEGORY_LABEL: Record<BookingCategory, string> = {
  movies: "Movies",
  events: "Events",
  activities: "Activities",
  play: "Play",
};

const PROFILE_CATEGORIES = [
  {
    id: "movies" as const,
    title: "Movies",
    subtitle: "Blockbusters & late nights",
    href: "/movies",
    imageUrl: "/images/profile/categories/movies.jpg",
    ...categoryColors.movies,
  },
  {
    id: "events" as const,
    title: "Events",
    subtitle: "Live nights worth going out",
    href: "/events",
    imageUrl: "/images/profile/categories/events.jpg",
    ...categoryColors.events,
  },
  {
    id: "activities" as const,
    title: "Activities",
    subtitle: "Parks, thrills & day trips",
    href: "/activities",
    imageUrl: "/images/profile/categories/activities.jpg?v=5",
    ...categoryColors.activities,
  },
  {
    id: "play" as const,
    title: "Play",
    subtitle: "Courts, turf & game time",
    href: "/play",
    imageUrl: "/images/profile/categories/play.jpg?v=4",
    ...categoryColors.play,
  },
];

function BookingRow({ booking }: { booking: VybeBooking }) {
  return (
    <article className="flex flex-col gap-3 rounded-[22px] border border-border bg-surface p-3 shadow-[0_6px_18px_rgba(17,24,39,0.04)] sm:flex-row sm:items-center sm:gap-4 sm:p-4 dark:shadow-none">
      <Link
        href={`/tickets/${booking.id}`}
        className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4"
      >
        <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-surface-muted sm:size-[72px]">
          <Image
            src={booking.posterUrl}
            alt={booking.title}
            fill
            className="object-cover"
            sizes="72px"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-extrabold text-text">
            {booking.title}
          </span>
          <span className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-text-secondary sm:text-[13px]">
            {booking.venue} · {booking.dateLabel} at {booking.timeLabel}
          </span>
          <span className="mt-2 inline-flex rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-bold text-accent">
            {CATEGORY_LABEL[booking.category]}
          </span>
        </span>
      </Link>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-3 sm:border-0 sm:pt-0 sm:pl-2">
        <span className="inline-flex items-center gap-2 text-[12px] font-bold text-text-secondary">
          <span className="size-2 rounded-full bg-emerald-500" />
          Confirmed
        </span>
        <Link
          href={`/tickets/${booking.id}`}
          aria-label={`Open ${booking.title}`}
          className="inline-flex size-9 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-accent-soft hover:text-accent"
        >
          <Ticket className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export function ProfileView() {
  const data = useAccountData();
  const [editing, setEditing] = useState(false);

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-[1200px] space-y-5">
        <div className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
        <div className="h-40 animate-pulse rounded-[24px] bg-surface" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[2.15/1] animate-pulse rounded-[28px] bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  const { profile, bookings } = data;
  const firstName = profile.name.split(" ")[0];
  const recent = bookings.slice(0, 5);

  function saveProfile(next: VybeProfile) {
    writeProfile(next);
    writeSavedLocation({ city: next.city, state: next.state });
    setEditing(false);
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1200px] space-y-5 sm:space-y-6">
      {/* Greeting banner — larger Pitch-style row */}
      <section className="flex min-w-0 flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[32px] leading-[1.05] font-semibold tracking-[-0.02em] text-text sm:text-[40px] lg:text-[48px]">
            Hi, {firstName}
          </h2>
          <p className="mt-2 max-w-lg text-[14px] leading-snug text-text-secondary sm:text-[15px] lg:text-[16px]">
            Ready to plan your next movie, event, activity or play session?
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_24px_rgba(255,0,91,0.28)] transition-opacity hover:opacity-90 sm:mt-5 sm:px-6 sm:py-3 sm:text-[14px]"
          >
            <Pencil className="size-4" />
            Edit profile
          </button>
        </div>

        <div className="relative h-[140px] w-[160px] shrink-0 sm:h-[180px] sm:w-[220px] lg:h-[210px] lg:w-[260px]">
          <Image
            src="/images/profile/welcome-illustration.png?v=3"
            alt=""
            fill
            className="object-contain object-right-bottom"
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 260px"
            priority
            unoptimized
          />
        </div>
      </section>

      {/* Category cards — full-bleed image (no contain gap / white seam) */}
      <h3 className="text-[16px] font-extrabold tracking-tight text-text sm:text-[17px]">
            Browse & book
      </h3>
      <div className="hide-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 sm:gap-3 md:grid md:grid-cols-4 md:overflow-visible">
        
        {PROFILE_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="relative h-[96px] w-[min(220px,72vw)] shrink-0 overflow-hidden rounded-[18px] text-white sm:h-[104px] sm:w-auto sm:rounded-[20px] md:h-[110px] md:min-w-0 lg:h-[118px]"
            style={{
              background: `linear-gradient(180deg, ${category.from}, ${category.to})`,
            }}
          >
            <Image
              src={category.imageUrl}
              alt=""
              fill
              unoptimized
              className="object-cover object-right"
              sizes="(max-width: 768px) 220px, 25vw"
            />
            <div className="relative z-10 flex h-full flex-col justify-between p-3 sm:p-3.5 lg:p-4">
              <div>
                <h3 className="text-[15px] leading-none font-extrabold tracking-[-0.02em] sm:text-[16px] lg:text-[17px]">
                  {category.title}
                </h3>
              </div>
              <div className="inline-flex items-center gap-1 text-[9px] font-extrabold tracking-[0.12em] text-white/90 uppercase sm:text-[10px]">
                <ArrowUpRight className="size-3" strokeWidth={2.5} />
                Explore
              </div>
            </div>
          </Link>
        ))}
      </div>

  {/* Profile details — above categories */}
  <section className="rounded-[24px] border border-border bg-surface p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-extrabold text-text">Profile details</h3>
            <p className="mt-0.5 text-[12px] text-text-secondary">
              {profile.city}
              {profile.state ? `, ${profile.state}` : ""} · Member since {profile.memberSince}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] font-bold text-text transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Pencil className="size-3" />
            Edit
          </button>
        </div>
        <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Name", value: profile.name },
            { label: "Phone", value: profile.phone },
            { label: "Email", value: profile.email || "Add email" },
            { label: "Gender", value: profile.gender },
            {
              label: "City",
              value: `${profile.city}${profile.state ? `, ${profile.state}` : ""}`,
            },
            { label: "Member since", value: profile.memberSince },
          ].map((item) => (
            <div key={item.label} className="rounded-[18px] bg-surface-muted px-3.5 py-3">
              <dt className="text-[11px] font-semibold text-text-muted">{item.label}</dt>
              <dd className="mt-0.5 truncate text-[14px] font-extrabold text-text">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Recent bookings — bottom */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <h3 className="text-[16px] font-extrabold tracking-tight text-text sm:text-[17px]">
            Recent bookings
          </h3>
          <Link href="/tickets" className="text-[13px] font-bold text-accent">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-[24px] border border-border bg-surface px-5 py-12 text-center">
            <Ticket className="mx-auto size-9 text-text-muted" />
            <p className="mt-3 text-[15px] font-extrabold text-text">No bookings yet</p>
            <p className="mt-1 text-[13px] text-text-secondary">
              Your tickets will show up here after you book
            </p>
            <Link
              href="/movies"
              className="mt-5 inline-flex rounded-full bg-accent px-5 py-2.5 text-[13px] font-bold text-white"
            >
              Browse movies
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {recent.map((booking) => (
              <li key={booking.id}>
                <BookingRow booking={booking} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing ? (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={saveProfile}
        />
      ) : null}
    </div>
  );
}
