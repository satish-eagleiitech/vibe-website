"use client";

import { useSyncExternalStore } from "react";

let snapshot: Date | null = null;

function getSnapshot() {
  if (!snapshot || Date.now() - snapshot.getTime() > 60_000) {
    snapshot = new Date();
  }
  return snapshot;
}

function subscribe() {
  return () => {};
}

/** Current time on the client, `null` during SSR so date-based UI never mismatches on hydration */
export function useClientNow() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
