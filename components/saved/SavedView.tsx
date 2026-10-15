"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, BookmarkX } from "lucide-react";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { useAccountData } from "@/components/account/useAccountData";
import { removeSaved, SAVED_TABS, type SavedCategory } from "@/lib/saved/storage";

export function SavedView() {
  const [tab, setTab] = useState<SavedCategory | "all">("all");
  const data = useAccountData();
  const items = useMemo(() => data?.saved ?? [], [data]);

  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((item) => item.category === tab);
  }, [items, tab]);

  return (
    <div>
      <AccountPageHeader
        title="Saved spots"
        subtitle="Movies, events and plans you bookmarked"
        action={
          <span className="rounded-full bg-accent-soft px-3 py-1.5 text-[12px] font-extrabold text-accent">
            {items.length} saved
          </span>
        }
      />

      <div className="hide-scrollbar flex w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1 sm:w-fit">
        {SAVED_TABS.map((item) => {
          const active = tab === item.id;
          const count =
            item.id === "all"
              ? items.length
              : items.filter((entry) => entry.category === item.id).length;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold tracking-wide uppercase transition-colors ${
                active
                  ? "bg-sidebar text-white dark:bg-accent"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {item.label}
              <span className={active ? "text-accent dark:text-white" : "text-text-muted"}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {!data ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-[20px] bg-surface" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[24px] border border-border bg-surface px-6 py-12 text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Bookmark className="size-6" />
          </span>
          <p className="mt-3 text-[16px] font-extrabold text-text">Nothing saved yet</p>
          <p className="mt-1 text-[14px] text-text-secondary">
            Tap the bookmark on a movie, event or activity to keep it here.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link
              href="/movies"
              className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white"
            >
              Browse movies
            </Link>
            <Link
              href="/events"
              className="inline-flex rounded-full bg-surface-muted px-5 py-2.5 text-sm font-bold text-text"
            >
              Find events
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 3xl:grid-cols-5">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-[20px] border border-border bg-surface"
            >
              <Link href={item.href} className="block">
                <div className="relative aspect-[4/5] bg-surface-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 240px"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-accent uppercase">
                    {item.category === "play" ? "Game Zone" : item.category}
                  </span>
                </div>
                <div className="p-3">
                  <h2 className="truncate text-[14px] font-extrabold text-text">{item.title}</h2>
                  <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                    {item.meta || "Saved plan"}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                aria-label={`Remove ${item.title}`}
                onClick={() => removeSaved(item.id)}
                className="absolute top-2.5 right-2.5 inline-flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-accent"
              >
                <BookmarkX className="size-4" />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
