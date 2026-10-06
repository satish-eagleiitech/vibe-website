"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { NOTIFICATIONS_EVENT, unreadCount } from "@/lib/notifications/storage";

type NotificationButtonProps = {
  overlay?: boolean;
};

export function NotificationButton({
  overlay = false,
}: NotificationButtonProps) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const refresh = () => setUnread(unreadCount());
    refresh();
    window.addEventListener(NOTIFICATIONS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(NOTIFICATIONS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <Link
      href="/notifications"
      aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
      className={`relative inline-flex size-9 items-center justify-center rounded-full transition-colors ${
        overlay
          ? "text-white hover:bg-white/15"
          : "text-text hover:bg-black/[0.06] dark:hover:bg-white/10"
      }`}
    >
      <Bell className="size-[18px]" />
      {unread > 0 ? (
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent" />
      ) : null}
    </Link>
  );
}
