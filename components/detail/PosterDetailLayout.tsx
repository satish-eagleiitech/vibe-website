"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  ChevronLeft,
  Copy,
  Share2,
  Ticket,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { useLoginGate } from "@/components/auth/useLoginGate";
import { Container } from "@/components/common/Container";
import { isSaved, toggleSaved, type SavedItem } from "@/lib/saved/storage";

export const posterChipClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-[13px] font-bold text-text transition-colors hover:bg-surface-muted";

export const posterPriceChipClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-muted px-3 py-2 text-[13px] font-extrabold text-text";

export const posterButtonClass =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-bold text-text transition-colors hover:bg-surface-muted";

function subscribeSaved(onChange: () => void) {
  window.addEventListener("vybe-saved-updated", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("vybe-saved-updated", onChange);
    window.removeEventListener("storage", onChange);
  };
}

const iconButtonClass =
  "inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-muted hover:text-text";

type PosterDetailLayoutProps = {
  title: string;
  posterSrc: string;
  sentinelId: string;
  saveItem: Omit<SavedItem, "savedAt">;
  bookHref: string;
  bookLabel: string;
  priceCaption: string;
  priceValue: string;
  /** Chips shown before the Save chip */
  chips?: ReactNode;
  /** Chips shown after the Save chip */
  trailingChips?: ReactNode;
  /** `PosterInfoRow`s rendered inside the summary card */
  info: ReactNode;
  children?: ReactNode;
};

export function PosterDetailLayout({
  title,
  posterSrc,
  sentinelId,
  saveItem,
  bookHref,
  bookLabel,
  priceCaption,
  priceValue,
  chips,
  trailingChips,
  info,
  children,
}: PosterDetailLayoutProps) {
  const router = useRouter();
  const { gate, modal } = useLoginGate();
  const [copied, setCopied] = useState(false);
  const saved = useSyncExternalStore(
    subscribeSaved,
    () => isSaved(saveItem.id),
    () => false,
  );

  function save() {
    toggleSaved(saveItem);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function share() {
    if (navigator.share) {
      void navigator.share({ title, url: window.location.href });
    } else {
      void copyLink();
    }
  }

  return (
    <section>
      {modal}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-2 text-[13px] font-bold text-text transition-colors hover:bg-surface-muted"
        >
          <ChevronLeft className="size-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Share" onClick={share} className={iconButtonClass}>
            <Share2 className="size-[18px]" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-[280px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10">
        <div className="md:sticky md:top-36 md:self-start">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-[0_16px_40px_rgba(17,24,39,0.12)] md:max-h-[calc(100dvh-22rem)] md:min-h-[260px]">
            <Image
              src={posterSrc}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 340px"
            />
          </div>
          <div className="mx-auto mt-3 w-full max-w-[340px] rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[13px] font-semibold text-text-secondary">{priceCaption}</p>
              <p className="text-[20px] font-extrabold text-text">{priceValue}</p>
            </div>
            <Link
              href={bookHref}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-text px-5 py-3.5 text-[15px] font-bold text-bg transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
            >
              <Ticket className="size-4" />
              {bookLabel}
            </Link>
            <p className="mt-2.5 text-center text-[12px] text-text-muted">
              Instant confirmation on VYBE
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <span id={sentinelId} className="block h-px w-full" />
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-text sm:text-[32px] lg:text-[40px]">
            {title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {chips}
            <button
              type="button"
              aria-pressed={saved}
              onClick={() => gate(save, true)}
              className={`${posterChipClass} ${saved ? "bg-surface-muted" : ""}`}
            >
              <Bookmark className={`size-3.5 ${saved ? "fill-current" : ""}`} />
              {saved ? "Saved" : "Save"}
            </button>
            {trailingChips}
          </div>

          <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-surface">
            {info}
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}

export function PosterInfoRow({
  badge,
  title,
  subtitle,
}: {
  badge: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 p-4 md:p-5">
      {badge}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-[15px] font-extrabold text-text">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-0.5 text-[13px] text-text-secondary">{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}

export function PosterMapChip({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-muted px-2 py-0.5 text-[11px] font-bold text-text-secondary transition-colors hover:text-text"
    >
      Map
      <ArrowUpRight className="size-3" />
    </a>
  );
}

export function PosterIconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-text">
      {children}
    </div>
  );
}

export function PosterSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="mt-4 scroll-mt-[calc(var(--vybe-header-h)+5rem)] rounded-2xl border border-border bg-surface p-4 md:p-5"
    >
      <h2 className="text-[15px] font-extrabold text-text">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function PosterCompactBar<T extends string>({
  visible,
  imageSrc,
  title,
  subtitle,
  tabs,
  active,
  onSelect,
}: {
  visible: boolean;
  imageSrc: string;
  title: string;
  subtitle: string;
  tabs: readonly { id: T; label: string }[];
  active: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div
      className={`fixed inset-x-0 top-0 z-[60] border-b border-border bg-surface/95 backdrop-blur-xl transition-all duration-200 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <Container className="py-3">
        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
            <Image src={imageSrc} alt="" fill className="object-cover" sizes="40px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-extrabold text-text">{title}</p>
            <p className="truncate text-[12px] text-text-secondary">{subtitle}</p>
          </div>
        </div>
        <div className="mt-3 hide-scrollbar flex gap-5 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`shrink-0 border-b-2 pb-1 text-[13px] font-bold ${
                active === item.id
                  ? "border-accent text-text"
                  : "border-transparent text-text-secondary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Container>
    </div>
  );
}
