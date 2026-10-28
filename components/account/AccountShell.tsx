"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Gift, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/navbar/ThemeToggle";
import { resetProfile, type VybeProfile } from "@/lib/profile/storage";
import { ACCOUNT_NAV } from "./accountNav";
import { useAccountData, type AccountData } from "./useAccountData";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function badgeFor(href: string, data: AccountData | null) {
  if (!data) return 0;
  if (href === "/notifications") return data.unread;
  if (href === "/rewards") return data.newScratchCards;
  return 0;
}

function pageMeta(pathname: string) {
  const hit = ACCOUNT_NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (pathname.startsWith("/tickets/")) {
    return { title: "Ticket", subtitle: "Booking details" };
  }
  return {
    title: hit?.label ?? "Dashboard",
    subtitle: new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date()),
  };
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

function SidebarNav({
  pathname,
  data,
  onNavigate,
}: {
  pathname: string;
  data: AccountData | null;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Account" className="mt-6 px-3">
      <ul className="space-y-1">
        {ACCOUNT_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          const badge = badgeFor(item.href, data);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[14px] font-semibold transition-colors ${
                  active
                    ? "bg-accent-soft font-bold text-accent"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text"
                }`}
              >
                <Icon className="size-[18px] shrink-0" strokeWidth={active ? 2.25 : 1.85} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {badge > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                    {badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarBody({
  pathname,
  data,
  onLogout,
  onNavigate,
}: {
  pathname: string;
  data: AccountData | null;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  const cards = data?.newScratchCards ?? 0;

  return (
    <>
      <div className="px-5 pt-5">
        <Logo className="scale-95 origin-left" />

      </div>

      <SidebarNav pathname={pathname} data={data} onNavigate={onNavigate} />

      <div className="mt-auto space-y-3 px-4 pb-5 pt-6">
        <Link
          href="/rewards"
          onClick={onNavigate}
          className="block overflow-hidden rounded-[22px] bg-accent-soft p-4 transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_18%,transparent)]"
        >
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-accent text-white">
            <Gift className="size-5" />
          </span>
          <p className="mt-3 text-[14px] font-extrabold text-text">
            {cards > 0 ? `${cards} scratch card${cards === 1 ? "" : "s"}` : "Rewards"}
          </p>
          <p className="mt-0.5 text-[12px] text-text-secondary">
            {cards > 0 ? "Ready to reveal" : "Offers from your bookings"}
          </p>
          <span className="mt-3 inline-flex rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold text-white">
            Open rewards
          </span>
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-2.5 text-[13px] font-bold text-text-secondary transition-colors hover:border-accent hover:bg-accent hover:text-white"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </>
  );
}

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const data = useAccountData();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const profile = data?.profile ?? null;
  const meta = useMemo(() => pageMeta(pathname), [pathname]);

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
    <div className="min-h-dvh min-w-[320px] bg-bg">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-[240px] shrink-0 flex-col border-r border-border bg-surface xl:flex 2xl:w-[260px]">
          <SidebarBody
            pathname={pathname}
            data={data}
            onLogout={() => setConfirmLogout(true)}
          />
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Open menu"
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-text xl:hidden"
                >
                  <Menu className="size-5" />
                </button>
                <div className="min-w-0">
                  <h1 className="truncate text-[20px] font-extrabold tracking-tight text-text sm:text-[22px]">
                    {meta.title}
                  </h1>
                  <p className="truncate text-[12px] text-text-secondary sm:text-[13px]">
                    {meta.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-border bg-surface">
                  <ThemeToggle />
                </span>
                <Link
                  href="/profile"
                  className="flex max-w-[180px] items-center gap-2 py-1 pr-1 pl-0.5 transition-opacity hover:opacity-80 sm:max-w-none"
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

          <div className="min-w-0 flex-1 px-4 pt-2 pb-2 sm:px-6 sm:pt-3 sm:pb-6 lg:px-8 lg:pt-2 lg:pb-4">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      <div
        aria-hidden
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-[70] bg-black/50 transition-opacity duration-200 xl:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Account menu"
        inert={!drawerOpen}
        className={`fixed inset-y-0 left-0 z-[80] flex w-[min(300px,88vw)] flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out xl:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setDrawerOpen(false)}
          className="absolute top-4 right-4 z-10 inline-flex size-9 items-center justify-center rounded-full bg-surface-muted text-text"
        >
          <X className="size-4" />
        </button>
        <div className="flex h-full flex-col overflow-y-auto pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <SidebarBody
            pathname={pathname}
            data={data}
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
