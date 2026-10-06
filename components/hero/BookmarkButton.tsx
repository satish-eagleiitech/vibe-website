"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { isSaved, toggleSaved, type SavedItem } from "@/lib/saved/storage";

type BookmarkButtonProps = {
  item: Omit<SavedItem, "savedAt">;
};

export function BookmarkButton({ item }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved(item.id));
  }, [item.id]);

  return (
    <button
      type="button"
      aria-label={saved ? "Remove bookmark" : "Save this event"}
      aria-pressed={saved}
      onClick={() => {
        const next = toggleSaved(item);
        setSaved(next);
      }}
      className="inline-flex size-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/40"
    >
      <Bookmark className={`size-6 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
