"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  ChevronRight,
  LifeBuoy,
  Lock,
  RotateCcw,
  Ticket,
  User,
} from "lucide-react";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { useAccountData } from "@/components/account/useAccountData";
import {
  readSettings,
  SETTINGS_EVENT,
  writeSettings,
  type SettingsPreferences,
} from "@/lib/settings/storage";

function SettingsLinkRow({
  href,
  icon: Icon,
  title,
  subtitle,
}: {
  href: string;
  icon: typeof User;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-muted/80 first:rounded-t-[18px] last:rounded-b-[18px]"
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <Icon className="size-[18px]" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-extrabold text-text">{title}</span>
        <span className="mt-0.5 block truncate text-[12px] text-text-secondary">
          {subtitle}
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-text-muted" />
    </Link>
  );
}

function SettingsToggleRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 first:rounded-t-[18px] last:rounded-b-[18px]">
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-extrabold text-text">{title}</span>
        <span className="mt-0.5 block text-[12px] leading-snug text-text-secondary">
          {subtitle}
        </span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-segment-track"
        }`}
      >
        <span
          className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2.5 px-0.5 text-[13px] font-extrabold tracking-wide text-text-secondary uppercase">
        {title}
      </h2>
      <div className="overflow-hidden rounded-[20px] border border-border bg-surface">
        {children}
      </div>
    </section>
  );
}

export function SettingsView() {
  const data = useAccountData();
  const [prefs, setPrefs] = useState<SettingsPreferences | null>(null);

  useEffect(() => {
    const refresh = () => setPrefs(readSettings());
    refresh();
    window.addEventListener(SETTINGS_EVENT, refresh);
    return () => window.removeEventListener(SETTINGS_EVENT, refresh);
  }, []);

  if (!data || !prefs) {
    return (
      <div className="mx-auto w-full max-w-[720px] space-y-4">
        <div className="h-24 animate-pulse rounded-[24px] bg-surface-muted" />
        <div className="h-40 animate-pulse rounded-[24px] bg-surface" />
        <div className="h-52 animate-pulse rounded-[24px] bg-surface" />
      </div>
    );
  }

  function updatePrefs(patch: Partial<SettingsPreferences>) {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    writeSettings(next);
  }

  return (
    <div className="mx-auto w-full max-w-[720px] space-y-5 sm:space-y-6">
      <AccountPageHeader
        title="Settings"
        subtitle="Account and notifications"
      />

      <SettingsSection title="Account">
        <SettingsLinkRow
          href="/profile"
          icon={User}
          title="Dashboard"
          subtitle="Your home on VYBE"
        />
        <div className="h-px bg-border" />
        <SettingsLinkRow
          href="/tickets"
          icon={Ticket}
          title="Bookings"
          subtitle="Tickets and reservations"
        />
        <div className="h-px bg-border" />
        <SettingsLinkRow
          href="/notifications"
          icon={Bell}
          title="Notifications inbox"
          subtitle="Updates about plans and bookings"
        />
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingsToggleRow
          title="Booking updates"
          subtitle="Confirmations, reminders and ticket changes"
          checked={prefs.bookingUpdates}
          onChange={(bookingUpdates) => updatePrefs({ bookingUpdates })}
        />
        <div className="h-px bg-border" />
        <SettingsToggleRow
          title="Offers & rewards"
          subtitle="Scratch cards, deals and new listings"
          checked={prefs.offersAndRewards}
          onChange={(offersAndRewards) => updatePrefs({ offersAndRewards })}
        />
      </SettingsSection>

      <SettingsSection title="Support & legal">
        <SettingsLinkRow
          href="/help-center"
          icon={LifeBuoy}
          title="Help & safety"
          subtitle="FAQs, contact and safety tips"
        />
        <div className="h-px bg-border" />
        <SettingsLinkRow
          href="/refund-policy"
          icon={RotateCcw}
          title="Refund policy"
          subtitle="Cancellations and refunds"
        />
        <div className="h-px bg-border" />
        <SettingsLinkRow
          href="/privacy-policy"
          icon={Lock}
          title="Privacy"
          subtitle="How we use your data"
        />
      </SettingsSection>
    </div>
  );
}
