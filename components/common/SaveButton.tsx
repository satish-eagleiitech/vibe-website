"use client";

import { Bookmark, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { useLoginGate } from "@/components/auth/useLoginGate";
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
  /** glass = translucent on dark media; solid = white circle (District-style event cards) */
  tone?: "glass" | "solid";
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
  tone = "glass",
  className = "",
}: SaveButtonProps) {
  const [saved, setSaved] = useState(false);
  const { gate, modal } = useLoginGate();

  useEffect(() => {
    setSaved(isSaved(itemId));
  }, [itemId]);

  const Icon = variant === "flame" ? Flame : Bookmark;

  function save() {
    const next = toggleSaved({
      id: itemId,
      title,
      href,
      imageUrl,
      meta,
      category,
    });
    setSaved(next);
  }

  return (
    <>
    {modal}
    <button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        gate(save, true);
      }}
      className={`inline-flex size-9 items-center justify-center rounded-full transition-colors ${
        tone === "solid"
          ? "bg-white text-[#6b6b6b] shadow-[0_2px_8px_rgba(0,0,0,0.18)] hover:bg-white hover:text-text"
          : "bg-white/20 text-white backdrop-blur-md hover:bg-white/35"
      } ${className}`}
    >
      <Icon className={`size-[18px] ${saved ? "fill-current" : ""}`} />
    </button>
    </>
  );
}
