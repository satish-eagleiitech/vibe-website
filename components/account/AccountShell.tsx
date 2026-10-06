"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, User, X } from "lucide-react";
import { Container } from "@/components/common/Container";
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

export function AccountAvatar({
  profile,
  size,
  className = "",
}: {
  profile: VybeProfile | null;
  size: number;
  className?: string;
}) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-full bg-surface-muted ${className}`}
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
        <span className="flex h-full items-center justify-center text-text-muted">
          <User className="size-1/2" />
        </span>
      )}
    </span>
  );
}

function Identity({ profile }: { profile: VybeProfile | null }) {
  return (
    <div className="flex flex-col items-center px-5 text-center">
      <span className="rounded-full p-1 ring-2 ring-accent">
        <AccountAvatar profile={profile} size={84} />
      </span>
      <p className="mt-4 max-w-full truncate text-[17px] font-extrabold tracking-wide uppercase">
        {profile?.name ?? "\u00a0"}
      </p>
      <p className="mt-0.5 max-w-full truncate text-[12px] text-text-muted">
        {profile?.email || profile?.phone || "\u00a0"}
      </p>
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

  function askLogout() {
    setDrawerOpen(false);
    setConfirmLogout(true);
  }

  return (
    <div className="w-full bg-bg pb-10 lg:pb-14">
      <Container className="pt-3 md:pt-4 lg:pt-6">
        <div className="grid grid-cols-[60px_minmax(0,1fr)] gap-3 sm:grid-cols-[68px_minmax(0,1fr)] sm:gap-5 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-6 lg:rounded-[32px] lg:bg-dash lg:p-4 xl:grid-cols-[268px_minmax(0,1fr)] xl:gap-8">
          {/* Desktop sidebar */}
          <aside className="sticky top-[calc(var(--vybe-header-h)+1.5rem)] hidden min-h-[calc(100svh-var(--vybe-header-h)-3rem)] flex-col self-start rounded-[28px] bg-surface pt-8 pb-5 text-text shadow-[0_6px_20px_rgba(17,24,39,0.05)] lg:flex dark:bg-sidebar dark:shadow-none">
            <Identity profile={profile} />
            <nav aria-label="Account" className="mt-7">
              <ul className="space-y-1 pl-4">
                {ACCOUNT_NAV.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);
                  const badge = badgeFor(item.href, data);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3.5 rounded-l-full py-2.5 pr-5 pl-5 text-[13px] font-bold tracking-wide uppercase transition-colors ${
                          active ? "vybe-side-active text-text" : "text-text-secondary hover:text-text"
                        }`}
                      >
                        <Icon
                          className={`size-[18px] shrink-0 ${active ? "text-accent" : ""}`}
                          strokeWidth={2}
                        />
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
            <button
              type="button"
              onClick={askLogout}
              className="mx-4 mt-auto flex items-center justify-center gap-2 rounded-full border border-border py-2.5 text-[13px] font-bold tracking-wide text-text-secondary uppercase transition-colors hover:border-accent hover:bg-accent hover:text-white"
            >
              <LogOut className="size-4" strokeWidth={2} />
              Logout
            </button>
          </aside>

          {/* Compact icon rail below lg; the menu panel opens in place over it */}
          <div className="sticky top-[calc(var(--vybe-header-h)+0.75rem)] z-40 self-start lg:hidden">
            <aside className="flex max-h-[calc(100svh-var(--vybe-header-h)-1.5rem)] flex-col items-center gap-1 overflow-y-auto rounded-[22px] border border-border bg-surface py-2.5 shadow-[0_6px_20px_rgba(17,24,39,0.05)]">
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
                className="inline-flex size-11 items-center justify-center rounded-2xl text-text transition-colors hover:bg-surface-muted"
              >
                <Menu className="size-5" />
              </button>
              <span className="my-1 h-px w-8 bg-border" />
              {ACCOUNT_NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                const badge = badgeFor(item.href, data);
                const isProfile = item.href === "/profile";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    title={item.label}
                    className={`relative inline-flex size-12 items-center justify-center rounded-2xl transition-colors ${
                      active ? "bg-accent-soft text-accent" : "text-text-secondary hover:bg-surface-muted hover:text-text"
                    }`}
                  >
                    {isProfile ? (
                      <span className={`rounded-full p-0.5 ring-2 ${active ? "ring-accent" : "ring-border"}`}>
                        <AccountAvatar profile={profile} size={30} />
                      </span>
                    ) : (
                      <Icon className="size-5" strokeWidth={1.8} />
                    )}
                    {badge > 0 ? (
                      <span className="absolute top-1.5 right-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] leading-4 font-extrabold text-white">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
              <span className="my-1 h-px w-8 bg-border" />
              <button
                type="button"
                aria-label="Logout"
                title="Logout"
                onClick={askLogout}
                className="inline-flex size-12 items-center justify-center rounded-2xl text-text-secondary transition-colors hover:bg-accent-soft hover:text-accent"
              >
                <LogOut className="size-5" strokeWidth={1.8} />
              </button>
            </aside>

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Account menu"
              inert={!drawerOpen}
              className={`absolute top-0 left-0 flex max-h-[calc(100svh-var(--vybe-header-h)-1.5rem)] w-[272px] max-w-[calc(100vw-2rem)] origin-top-left flex-col overflow-y-auto rounded-[22px] border border-border bg-surface pt-6 pb-5 text-text shadow-2xl dark:border-transparent dark:bg-sidebar transition-[opacity,transform] duration-200 ease-out ${
                drawerOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
              }`}
            >
              <button
                type="button"
                aria-label="Close account menu"
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full bg-surface-muted text-text transition-colors hover:bg-border"
              >
                <X className="size-4" />
              </button>
              <Identity profile={profile} />
              <nav aria-label="Account menu links" className="mt-6 px-3">
                <ul className="space-y-1">
                  {ACCOUNT_NAV.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(pathname, item.href);
                    const badge = badgeFor(item.href, data);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setDrawerOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[13px] font-bold tracking-wide uppercase transition-colors ${
                            active ? "bg-accent text-white" : "text-text-secondary hover:bg-surface-muted hover:text-text"
                          }`}
                        >
                          <Icon className="size-[18px] shrink-0" strokeWidth={2} />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {badge > 0 ? (
                            <span
                              className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                                active ? "bg-white text-accent" : "bg-accent text-white"
                              }`}
                            >
                              {badge}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <button
                type="button"
                onClick={askLogout}
                className="mx-4 mt-auto flex items-center justify-center gap-2 rounded-full border border-border py-2.5 text-[13px] font-bold tracking-wide text-text-secondary uppercase transition-colors hover:border-accent hover:bg-accent hover:text-white"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </div>

          <main className="min-w-0 lg:py-4 lg:pr-4">{children}</main>
        </div>
      </Container>

      <div
        aria-hidden
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-x-0 top-(--vybe-header-h) bottom-0 z-30 bg-black/45 transition-opacity duration-200 lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {confirmLogout ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            className="w-full max-w-sm rounded-[24px] bg-surface p-6 text-center shadow-2xl"
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
