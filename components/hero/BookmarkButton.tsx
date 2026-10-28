"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useLoginGate } from "@/components/auth/useLoginGate";
import { isSaved, toggleSaved, type SavedItem } from "@/lib/saved/storage";

type BookmarkButtonProps = {
  item: Omit<SavedItem, "savedAt">;
};

export function BookmarkButton({ item }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const { gate, modal } = useLoginGate();

  useEffect(() => {
    setSaved(isSaved(item.id));
  }, [item.id]);

  function save() {
    const next = toggleSaved(item);
    setSaved(next);
  }

  return (
    <>
    {modal}
    <button
      type="button"
      aria-label={saved ? "Remove bookmark" : "Save this event"}
      aria-pressed={saved}
      onClick={() => gate(save, true)}
      className="inline-flex size-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/40"
    >
      <Bookmark className={`size-6 ${saved ? "fill-current" : ""}`} />
    </button>
    </>
  );
}
