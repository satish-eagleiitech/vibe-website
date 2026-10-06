"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ComponentType, type ReactNode } from "react";
import {
  Bookmark,
  CalendarDays,
  ChevronRight,
  Gift,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Ticket,
  User,
} from "lucide-react";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { useAccountData } from "@/components/account/useAccountData";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import type { BookingCategory } from "@/lib/bookings/storage";
import { writeSavedLocation } from "@/lib/location/cities";
import { writeProfile, type VybeProfile } from "@/lib/profile/storage";

const CATEGORY_LABEL: Record<BookingCategory, string> = {
  movies: "Movies",
  dining: "Dining",
  events: "Events",
  play: "Game Zone",
  activities: "Activities",
};

function StatCard({
  tone,
  label,
  value,
  hint,
  href,
  icon: Icon,
}: {
  tone: "accent" | "ink";
  label: string;
  value: string;
  hint: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className={`group relative block min-h-[104px] overflow-hidden rounded-[20px] p-4 text-white transition-transform hover:-translate-y-0.5 sm:min-h-[116px] sm:rounded-[22px] sm:p-5 ${
        tone === "accent"
          ? "bg-accent shadow-[0_12px_28px_rgba(255,0,91,0.28)]"
          : "bg-sidebar"
      }`}
    >
      <p className="truncate text-[12px] font-bold text-white/75 sm:text-[13px]">{label}</p>
      <p className="mt-1 text-[26px] leading-tight font-extrabold sm:text-[30px]">{value}</p>
      <p className="mt-0.5 truncate text-[11px] font-semibold text-white/75 sm:text-[12px]">
        {hint}
      </p>
      <Icon className="absolute -right-3 -bottom-4 size-20 -rotate-12 text-white/15 transition-transform group-hover:rotate-0 sm:size-24" />
    </Link>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[16px] font-extrabold text-text md:text-[17px]">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-[12px] text-text-secondary">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function ProfileView() {
  const data = useAccountData();
  const [editing, setEditing] = useState(false);

  if (!data) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-surface-muted" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-[104px] animate-pulse rounded-[20px] bg-surface sm:h-[116px]" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-[24px] bg-surface" />
      </div>
    );
  }

  const { profile, bookings, saved, newScratchCards } = data;
  const recent = bookings.slice(0, 4);

  function saveProfile(next: VybeProfile) {
    writeProfile(next);
    writeSavedLocation({ city: next.city, state: next.state });
    setEditing(false);
  }

  const details = [
    { label: "Full name", value: profile.name, icon: User },
    { label: "Phone", value: profile.phone, icon: Phone },
    { label: "Email", value: profile.email || "Add email", icon: Mail },
    { label: "Gender", value: profile.gender, icon: User },
    {
      label: "City",
      value: `${profile.city}${profile.state ? `, ${profile.state}` : ""}`,
      icon: MapPin,
    },
    { label: "Member since", value: profile.memberSince, icon: CalendarDays },
  ];

  return (
    <div>
      <AccountPageHeader
        title={`Hi, ${profile.name.split(" ")[0]}`}
        subtitle="Here's what's happening with your plans"
        action={
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-sidebar px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
          >
            <Pencil className="size-3.5" />
            Edit profile
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard
            tone="accent"
            label="Bookings"
            value={String(bookings.length)}
            hint="Tickets & reservations"
            href="/tickets"
            icon={Ticket}
          />
          <StatCard
            tone="ink"
            label="Saved spots"
            value={String(saved.length)}
            hint="Plans you bookmarked"
            href="/saved"
            icon={Bookmark}
          />
        </div>

        <Link
          href="/rewards"
          className="group relative flex items-center gap-4 overflow-hidden rounded-[22px] border border-dashed border-accent/50 bg-accent-soft p-4 transition-colors hover:border-accent sm:p-5"
        >
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-white shadow-[0_8px_18px_rgba(255,0,91,0.3)]">
            <Gift className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-extrabold text-text">
              {newScratchCards > 0
                ? `${newScratchCards} scratch card${newScratchCards === 1 ? "" : "s"} waiting`
                : "All cards scratched"}
            </span>
            <span className="block text-[12px] text-text-secondary">
              Scratch to reveal offers on your next plan
            </span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-5">
        <SectionCard
          title="Recent bookings"
          subtitle="Your latest tickets and reservations"
          action={
            <Link href="/tickets" className="shrink-0 text-[13px] font-bold text-accent">
              View all
            </Link>
          }
        >
          {recent.length === 0 ? (
            <div className="py-8 text-center">
              <Ticket className="mx-auto size-8 text-text-muted" />
              <p className="mt-2 text-[14px] font-extrabold text-text">No bookings yet</p>
              <Link
                href="/movies"
                className="mt-3 inline-flex rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-white"
              >
                Browse movies
              </Link>
            </div>
          ) : (
            <div className="@container">
              <div className="hidden grid-cols-[minmax(0,1fr)_110px_150px_24px] gap-3 pb-2 text-[12px] font-semibold text-text-muted @xl:grid">
                <span>Booking</span>
                <span>Category</span>
                <span>Date & time</span>
                <span />
              </div>
              {recent.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/tickets/${booking.id}`}
                  className="relative grid grid-cols-[minmax(0,1fr)_20px] items-center gap-3 border-t border-dashed border-border py-3.5 transition-colors hover:bg-surface-muted/60 @xl:grid-cols-[minmax(0,1fr)_110px_150px_24px]"
                >
                  <span
                    aria-hidden
                    className="absolute top-0 -left-[26px] size-5 -translate-y-1/2 rounded-full bg-bg sm:-left-[30px] lg:bg-dash"
                  />
                  <span
                    aria-hidden
                    className="absolute top-0 -right-[26px] size-5 -translate-y-1/2 rounded-full bg-bg sm:-right-[30px] lg:bg-dash"
                  />
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                      <Image
                        src={booking.posterUrl}
                        alt={booking.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-extrabold text-text">
                        {booking.title}
                      </span>
                      <span className="block truncate text-[12px] text-text-secondary">
                        <span className="@xl:hidden">{booking.dateLabel} · </span>
                        {booking.venue}
                      </span>
                    </span>
                  </span>
                  <span className="hidden @xl:block">
                    <span className="inline-flex rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-accent">
                      {CATEGORY_LABEL[booking.category]}
                    </span>
                  </span>
                  <span className="hidden min-w-0 @xl:block">
                    <span className="block truncate text-[13px] font-semibold text-text">
                      {booking.dateLabel}
                    </span>
                    <span className="block text-[12px] text-text-secondary">
                      {booking.timeLabel}
                    </span>
                  </span>
                  <ChevronRight className="size-4 text-text-muted" />
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="mt-5">
        <SectionCard
          title="Personal details"
          subtitle="Used for tickets and reservations"
          action={
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[12px] font-bold text-text transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Pencil className="size-3" />
              Edit
            </button>
          }
        >
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {details.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl bg-surface-muted px-3.5 py-3"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface text-accent">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[11px] font-semibold text-text-muted">{item.label}</dt>
                    <dd className="truncate text-[14px] font-extrabold text-text">{item.value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </SectionCard>
      </div>

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
