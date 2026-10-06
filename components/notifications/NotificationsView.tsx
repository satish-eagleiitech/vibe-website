"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BellOff,
  CalendarClock,
  CheckCheck,
  Gift,
  ShieldAlert,
  Tag,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import {
  markAllNotificationsRead,
  markNotificationRead,
  NOTIFICATIONS_EVENT,
  readNotifications,
  relativeTime,
  type NotificationKind,
  type VybeNotification,
} from "@/lib/notifications/storage";

const KIND_STYLE: Record<NotificationKind, { icon: LucideIcon; tile: string }> = {
  booking: { icon: Ticket, tile: "bg-accent text-white" },
  reminder: { icon: CalendarClock, tile: "bg-sidebar text-white dark:bg-surface-muted" },
  reward: { icon: Gift, tile: "bg-accent-soft text-accent" },
  offer: { icon: Tag, tile: "bg-surface-muted text-accent" },
  system: { icon: ShieldAlert, tile: "bg-surface-muted text-text" },
};

const FILTERS: { id: "all" | "unread" | NotificationKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "booking", label: "Bookings" },
  { id: "offer", label: "Offers" },
  { id: "reward", label: "Rewards" },
];

export function NotificationsView() {
  const [items, setItems] = useState<VybeNotification[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  useEffect(() => {
    const refresh = () => setItems(readNotifications());
    refresh();
    window.addEventListener(NOTIFICATIONS_EVENT, refresh);
    return () => window.removeEventListener(NOTIFICATIONS_EVENT, refresh);
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((item) => !item.read);
    return items.filter((item) => item.kind === filter);
  }, [items, filter]);

  const unread = items?.filter((item) => !item.read).length ?? 0;
  const groups = [
    { label: "Today", rows: filtered.filter((item) => item.minutesAgo < 60 * 24) },
    { label: "Earlier", rows: filtered.filter((item) => item.minutesAgo >= 60 * 24) },
  ].filter((group) => group.rows.length > 0);

  return (
    <div>
      <AccountPageHeader
        title="Notifications"
        subtitle={unread > 0 ? `You have ${unread} unread updates` : "You're all caught up"}
        action={
          <button
            type="button"
            onClick={markAllNotificationsRead}
            disabled={unread === 0}
            className="inline-flex items-center gap-1.5 rounded-full bg-sidebar px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <CheckCheck className="size-4" />
            Mark all read
          </button>
        }
      />

      <div className="hide-scrollbar flex w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1 sm:w-fit">
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-bold tracking-wide uppercase transition-colors ${
                active
                  ? "bg-sidebar text-white dark:bg-accent"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {item.label}
              {item.id === "unread" && unread > 0 ? ` (${unread})` : ""}
            </button>
          );
        })}
      </div>

      {!items ? (
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-[20px] bg-surface" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="mt-5 rounded-[24px] border border-border bg-surface px-6 py-12 text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <BellOff className="size-6" />
          </span>
          <p className="mt-3 text-[16px] font-extrabold text-text">Nothing here</p>
          <p className="mt-1 text-[14px] text-text-secondary">
            New booking updates and offers will show up here.
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.label} className="mt-6">
            <h2 className="mb-2.5 text-[12px] font-extrabold tracking-[0.14em] text-text-muted uppercase">
              {group.label}
            </h2>
            <ul className="overflow-hidden rounded-[24px] border border-border bg-surface">
              {group.rows.map((item, index) => {
                const style = KIND_STYLE[item.kind];
                const Icon = style.icon;
                const body = (
                  <>
                    <span
                      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-2xl ${style.tile}`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span
                          className={`text-[14px] text-text ${item.read ? "font-bold" : "font-extrabold"}`}
                        >
                          {item.title}
                        </span>
                        <span className="shrink-0 text-[11px] font-semibold text-text-muted">
                          {relativeTime(item.minutesAgo)}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-text-secondary">
                        {item.body}
                      </span>
                    </span>
                    {!item.read ? (
                      <span
                        aria-label="Unread"
                        className="mt-1.5 size-2 shrink-0 rounded-full bg-accent"
                      />
                    ) : null}
                  </>
                );
                const rowClass = `flex w-full items-start gap-3.5 px-4 py-4 text-left transition-colors hover:bg-surface-muted sm:px-5 ${
                  item.read ? "" : "bg-accent-soft/40"
                } ${index > 0 ? "border-t border-border" : ""}`;
                return (
                  <li key={item.id}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => markNotificationRead(item.id)}
                        className={rowClass}
                      >
                        {body}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markNotificationRead(item.id)}
                        className={rowClass}
                      >
                        {body}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
