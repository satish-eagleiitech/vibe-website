"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const ACCOUNT_PREFIXES = [
  "/profile",
  "/tickets",
  "/saved",
  "/notifications",
  "/rewards",
  "/help-center",
] as const;

export function isAccountRoute(pathname: string) {
  return ACCOUNT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Hides site chrome (nav/footer) on account dashboard routes. */
export function HideOnAccount({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isAccountRoute(pathname)) return null;
  return children;
}
