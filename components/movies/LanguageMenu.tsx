"use client";

import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

type LanguageMenuProps = {
  active?: string;
  label: string;
  basePath?: string;
};

export function LanguageMenu({
  active = "all",
  label,
  basePath = "/",
}: LanguageMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const current = (active || "all").toLowerCase();

  useEffect(() => {
    if (!open) return;

    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 text-xs font-bold text-accent"
      >
        {label}
        <ChevronDown
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Languages"
          className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-[180px] overflow-hidden rounded-2xl border border-border bg-surface py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
        >
          {siteConfig.moreLanguages.map((language) => {
            const href = `${basePath}${basePath.includes("?") ? "&" : "?"}language=${language.id}`;
            const selected = current === language.id;

            return (
              <Link
                key={language.id}
                href={href}
                scroll={false}
                role="menuitem"
                aria-current={selected ? "true" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-3 px-4 py-2 text-[13px] font-semibold ${
                  selected
                    ? "bg-accent-soft text-accent"
                    : "text-text hover:bg-surface-muted"
                }`}
              >
                {language.label}
                {selected ? <Check className="size-3.5" aria-hidden /> : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
