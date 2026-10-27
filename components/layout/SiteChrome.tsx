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

export function isBareRoute(pathname: string) {
  return isAccountRoute(pathname) || pathname === "/login" || pathname.startsWith("/login/");
}

/** Hides site chrome (nav/footer) on account dashboard routes. */
export function HideOnAccount({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isBareRoute(pathname)) return null;
  return children;
}
