"use client";

import { Bookmark, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import {
  isSaved,
  toggleSaved,
  type SavedCategory,
} from "@/lib/saved/storage";

type SaveButtonProps = {
  label: string;
  itemId: string;
  title: string;
  href: string;
  imageUrl: string;
  meta?: string;
  category: SavedCategory;
  variant?: "bookmark" | "flame";
  className?: string;
};

export function SaveButton({
  label,
  itemId,
  title,
  href,
  imageUrl,
  meta,
  category,
  variant = "bookmark",
  className = "",
}: SaveButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved(itemId));
  }, [itemId]);

  const Icon = variant === "flame" ? Flame : Bookmark;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = toggleSaved({
          id: itemId,
          title,
          href,
          imageUrl,
          meta,
          category,
        });
        setSaved(next);
      }}
      className={`inline-flex size-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/35 ${className}`}
    >
      <Icon className={`size-[18px] ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
