"use client";

import { useEffect, useState } from "react";
import { mergeBookings } from "@/lib/bookings/seeds";
import { readBookings, type VybeBooking } from "@/lib/bookings/storage";
import { NOTIFICATIONS_EVENT, unreadCount } from "@/lib/notifications/storage";
import { readProfile, type VybeProfile } from "@/lib/profile/storage";
import { SCRATCH_EVENT, unscratchedCount } from "@/lib/rewards/scratch";
import { readSaved, type SavedItem } from "@/lib/saved/storage";

export type AccountData = {
  profile: VybeProfile;
  bookings: VybeBooking[];
  saved: SavedItem[];
  unread: number;
  newScratchCards: number;
};

const EVENTS = [
  "vybe-profile-updated",
  "vybe-bookings-updated",
  "vybe-saved-updated",
  NOTIFICATIONS_EVENT,
  SCRATCH_EVENT,
  "storage",
];

function snapshot(): AccountData {
  return {
    profile: readProfile(),
    bookings: mergeBookings(readBookings()),
    saved: readSaved(),
    unread: unreadCount(),
    newScratchCards: unscratchedCount(),
  };
}

/** Local-storage backed account state; null until mounted on the client. */
export function useAccountData() {
  const [data, setData] = useState<AccountData | null>(null);

  useEffect(() => {
    const refresh = () => setData(snapshot());
    refresh();
    EVENTS.forEach((name) => window.addEventListener(name, refresh));
    return () => EVENTS.forEach((name) => window.removeEventListener(name, refresh));
  }, []);

  return data;
}
