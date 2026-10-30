"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Settings, X } from "lucide-react";
import { ThemeToggle } from "@/components/navbar/ThemeToggle";
import { resetProfile, type VybeProfile } from "@/lib/profile/storage";
import { ACCOUNT_NAV } from "./accountNav";
import { useAccountData, type AccountData } from "./useAccountData";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function badgeFor(href: string, data: AccountData | null) {
  if (!data) return 0;
  switch (href) {
    case "/profile":
      return data.unread;
    case "/tickets":
      return data.bookings.length;
    case "/saved":
      return data.saved.length;
    case "/rewards":
      return data.newScratchCards;
    case "/help-center":
      return 0;
    default:
      return 0;
  }
}

export function AccountAvatar({
  profile,
  size,
  className = "",
}: {
  profile: VybeProfile | null;
  size: number;
  className?: string;
}) {
  const initials =
    profile?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "V";

  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-full bg-accent text-white ${className}`}
      style={{ width: size, height: size }}
    >
      {profile?.avatarUrl ? (
        <Image
          src={profile.avatarUrl}
          alt={profile.name}
          fill
          className="object-cover"
          sizes={`${size}px`}
          unoptimized
        />
      ) : (
        <span className="flex h-full items-center justify-center text-[45%] font-extrabold tracking-wide">
          {initials}
        </span>
      )}
    </span>
  );
}

function GlassRail({
  pinned = false,
  pathname,
  data,
  onLogout,
  onNavigate,
  onClose,
}: {
  /** Mobile drawer stays open with labels. Desktop expands with group-hover. */
  pinned?: boolean;
  pathname: string;
  data: AccountData | null;
  onLogout: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  const labelClass = pinned
    ? "min-w-0 flex-1 opacity-100"
    : "w-0 overflow-hidden opacity-0 group-hover/rail:min-w-0 group-hover/rail:flex-1 group-hover/rail:opacity-100 group-focus-within/rail:min-w-0 group-focus-within/rail:flex-1 group-focus-within/rail:opacity-100";
  const rowLayout = pinned
    ? "gap-2.5 pr-3 pl-1"
    : "justify-center group-hover/rail:justify-start group-hover/rail:gap-2.5 group-hover/rail:pr-3 group-hover/rail:pl-1 group-focus-within/rail:justify-start group-focus-within/rail:gap-2.5 group-focus-within/rail:pr-3 group-focus-within/rail:pl-1";

  return (
    <div
      className={`relative flex h-full w-full flex-col rounded-[40px] border border-white/15 bg-rail py-5 text-rail-ink dark:border-black/10 ${
        pinned ? "overflow-hidden px-3.5" : "px-3"
      }`}
    >
      <div
        className={`mb-6 flex items-center ${
          pinned
            ? "gap-2 px-1"
            : "justify-center group-hover/rail:justify-start group-hover/rail:gap-2 group-hover/rail:px-1 group-focus-within/rail:justify-start group-focus-within/rail:gap-2 group-focus-within/rail:px-1"
        }`}
      >
        <Link
          href="/"
          aria-label="VYBE home"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-[15px] font-extrabold text-rail-ink ring-1 ring-white/15 transition-transform hover:scale-105 dark:bg-black/8 dark:ring-black/10"
        >
          V
        </Link>
        <span
          className={`overflow-hidden text-[15px] font-extrabold tracking-wide whitespace-nowrap text-rail-ink transition-all duration-300 ${
            pinned ? "ml-1 opacity-100" : "w-0 opacity-0 group-hover/rail:ml-1 group-hover/rail:w-auto group-hover/rail:opacity-100 group-focus-within/rail:ml-1 group-focus-within/rail:w-auto group-focus-within/rail:opacity-100"
          }`}
        >
          VYBE
        </span>
        {pinned && onClose ? (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="ml-auto inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-rail-ink ring-1 ring-white/15 dark:bg-black/8 dark:ring-black/10"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <nav aria-label="Account" className="account-rail-nav flex min-h-0 flex-1 flex-col gap-3">
        {ACCOUNT_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          const badge = badgeFor(item.href, data);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={item.label}
              className={`relative flex h-12 items-center rounded-full text-rail-ink transition-colors duration-200 ${rowLayout} ${
                active
                  ? pinned
                    ? "bg-rail-active text-rail-on shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                    : "account-rail-curve"
                  : "hover:bg-white/10 dark:hover:bg-black/8"
              }`}
            >
              <span
                className={`relative flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 ${
                  active
                    ? pinned
                      ? "bg-transparent text-rail-on"
                      : "bg-rail-active text-rail-on shadow-[0_6px_16px_rgba(0,0,0,0.12)] group-hover/rail:bg-transparent group-hover/rail:shadow-none group-focus-within/rail:bg-transparent group-focus-within/rail:shadow-none"
                    : "bg-white/10 text-rail-ink ring-1 ring-white/15 dark:bg-black/8 dark:ring-black/10"
                }`}
              >
                <Icon className="size-[18px]" strokeWidth={active ? 2.35 : 1.9} />
              </span>
              <span
                className={`truncate text-[15px] font-semibold whitespace-nowrap transition-all duration-300 ${labelClass} ${
                  active ? "text-rail-on" : "text-rail-ink"
                }`}
              >
                {item.label}
              </span>
              {badge > 0 ? (
                <span
                  className={`z-10 inline-flex items-center justify-center rounded-full bg-accent text-[10px] font-extrabold leading-none text-white ${
                    pinned
                      ? "relative min-h-5 min-w-5 shrink-0 px-1.5 py-0.5"
                      : "absolute -top-0.5 right-0.5 size-5 min-w-5 max-w-5 shrink-0 group-hover/rail:static group-hover/rail:right-auto group-hover/rail:h-auto group-hover/rail:w-auto group-hover/rail:max-w-none group-hover/rail:min-h-5 group-hover/rail:min-w-5 group-hover/rail:px-1.5 group-hover/rail:py-0.5 group-focus-within/rail:static group-focus-within/rail:right-auto group-focus-within/rail:h-auto group-focus-within/rail:w-auto group-focus-within/rail:max-w-none group-focus-within/rail:min-h-5 group-focus-within/rail:min-w-5 group-focus-within/rail:px-1.5 group-focus-within/rail:py-0.5"
                  }`}
                >
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 flex flex-col gap-2">
      <Link
        href="/settings"
        onClick={onNavigate}
        title="Settings"
        aria-current={isActive(pathname, "/settings") ? "page" : undefined}
        className={`flex h-12 items-center rounded-full text-rail-ink transition-colors hover:bg-white/10 dark:hover:bg-black/8 ${rowLayout} ${
          isActive(pathname, "/settings")
            ? pinned
              ? "bg-rail-active text-rail-on shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
              : "account-rail-curve"
            : ""
        }`}
      >
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ring-1 transition-transform duration-200 hover:scale-105 ${
            isActive(pathname, "/settings")
              ? pinned
                ? "bg-transparent text-rail-on ring-transparent"
                : "bg-rail-active text-rail-on shadow-[0_6px_16px_rgba(0,0,0,0.12)] ring-transparent group-hover/rail:bg-transparent group-hover/rail:shadow-none group-focus-within/rail:bg-transparent group-focus-within/rail:shadow-none"
              : "bg-white/10 text-rail-ink ring-white/15 dark:bg-black/8 dark:ring-black/10"
          }`}
        >
          <Settings className="size-[18px]" strokeWidth={isActive(pathname, "/settings") ? 2.35 : 1.9} />
        </span>
        <span
          className={`truncate text-[15px] font-semibold whitespace-nowrap transition-all duration-300 ${labelClass} ${
            isActive(pathname, "/settings") ? "text-rail-on" : "text-rail-ink"
          }`}
        >
          Settings
        </span>
      </Link>

      <button
        type="button"
        onClick={onLogout}
        title="Log out"
        className={`flex h-12 items-center rounded-full text-rail-ink transition-colors hover:bg-white/10 dark:hover:bg-black/8 ${rowLayout}`}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 dark:bg-black/8 dark:ring-black/10">
          <LogOut className="size-[18px]" strokeWidth={1.9} />
        </span>
        <span
          className={`truncate text-[15px] font-semibold whitespace-nowrap text-rail-ink transition-all duration-300 ${labelClass}`}
        >
          Log out
        </span>
      </button>
      </div>
    </div>
  );
}

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const data = useAccountData();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const profile = data?.profile ?? null;
  const profilePage =
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/settings" ||
    pathname.startsWith("/settings/");

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  function logout() {
    resetProfile();
    setConfirmLogout(false);
    router.push("/");
  }

  return (
    <div
      className={`min-h-dvh min-w-[320px] ${profilePage ? "bg-white dark:bg-bg" : "bg-bg"}`}
    >
      <div className="flex min-h-dvh w-full max-w-[1600px] lg:gap-3">
        <aside className="group/rail sticky top-0 z-20 hidden h-dvh w-[76px] shrink-0 py-4 pl-2 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-[260px] focus-within:w-[260px] lg:mr-1 lg:block">
          <GlassRail
            pathname={pathname}
            data={data}
            onLogout={() => setConfirmLogout(true)}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className={`sticky top-0 z-40 py-3 pr-4 pl-4 backdrop-blur-md sm:pr-6 sm:pl-5 lg:pr-8 lg:pl-6 ${
              profilePage
                ? "border-0 bg-white/90 dark:bg-bg/90"
                : "border-b border-border bg-bg/90"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-text lg:hidden"
              >
                <Menu className="size-5" />
              </button>

              <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
                <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-border bg-surface">
                  <ThemeToggle />
                </span>
                <Link
                  href="/profile"
                  className="flex max-w-[180px] items-center gap-2 py-1 pr-1 pl-0.5 no-underline transition-opacity hover:opacity-80 sm:max-w-none"
                >
                  <span className="hidden min-w-0 sm:block">
                    <span className="block truncate text-[13px] font-bold text-text">
                      {profile?.name ?? "Account"}
                    </span>
                  </span>
                  <AccountAvatar profile={profile} size={34} />
                </Link>
              </div>
            </div>
          </header>

          <div className="min-w-0 flex-1 pt-2 pr-4 pb-2 pl-4 sm:pt-3 sm:pr-6 sm:pb-6 sm:pl-5 lg:pt-2 lg:pr-8 lg:pb-4 lg:pl-6">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      <div
        aria-hidden
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-[70] bg-black/50 transition-opacity duration-200 lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Account menu"
        inert={!drawerOpen}
        className={`fixed inset-y-0 left-0 z-[80] flex w-[min(320px,92vw)] flex-col bg-transparent p-3 transition-transform duration-300 ease-out lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full pt-[max(0px,env(safe-area-inset-top))] pb-[max(0px,env(safe-area-inset-bottom))]">
          <GlassRail
            pinned
            pathname={pathname}
            data={data}
            onClose={() => setDrawerOpen(false)}
            onLogout={() => {
              setDrawerOpen(false);
              setConfirmLogout(true);
            }}
            onNavigate={() => setDrawerOpen(false)}
          />
        </div>
      </aside>

      {confirmLogout ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            className="w-full max-w-sm rounded-[24px] border border-border bg-surface p-6 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <LogOut className="size-5" />
            </span>
            <h2 id="logout-title" className="mt-4 text-[18px] font-extrabold text-text">
              Log out of VYBE?
            </h2>
            <p className="mt-1 text-[13px] text-text-secondary">
              Your profile details on this device will be cleared.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmLogout(false)}
                className="rounded-full bg-surface-muted py-2.5 text-[14px] font-bold text-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-accent py-2.5 text-[14px] font-bold text-white"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
