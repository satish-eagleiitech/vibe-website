"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { languageDisplay } from "@/lib/data/bookingTerms";

type LanguageSelectModalProps = {
  open: boolean;
  title: string;
  languages: string[];
  originalLanguage?: string;
  onClose: () => void;
  onProceed: (language: string) => void;
};

export function LanguageSelectModal({
  open,
  title,
  languages,
  originalLanguage,
  onClose,
  onProceed,
}: LanguageSelectModalProps) {
  const unique = Array.from(
    new Set(languages.map((item) => item.toLowerCase()).filter(Boolean)),
  );
  const first = unique[0] ?? "telugu";
  const [selected, setSelected] = useState(first);
  const active = unique.includes(selected) ? selected : first;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || unique.length < 2) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close language picker"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-select-title"
        className="relative z-[1] w-full max-w-[420px] overflow-hidden rounded-t-[24px] border border-border bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:rounded-[24px] md:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="lang-select-title"
              className="text-[20px] font-extrabold text-text"
            >
              {title}
            </h2>
            <p className="mt-1 text-[13px] text-text-secondary">
              Choose preferred language
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-9 items-center justify-center rounded-full bg-surface-muted text-text"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          {unique.map((id) => {
            const label = languageDisplay(id);
            const isActive = active === id;
            const isOriginal = originalLanguage?.toLowerCase() === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className={`flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3.5 text-left last:border-b-0 ${
                  isActive ? "bg-accent-soft" : "bg-surface hover:bg-surface-muted"
                }`}
              >
                <span className="inline-flex items-center gap-3">
                  <span
                    className={`grid size-5 place-items-center rounded-full border-2 ${
                      isActive ? "border-accent" : "border-border-strong"
                    }`}
                  >
                    {isActive ? (
                      <span className="size-2.5 rounded-full bg-accent" />
                    ) : null}
                  </span>
                  <span className="text-[15px] font-bold text-text">
                    {label.en} - {label.native}
                  </span>
                </span>
                {isOriginal ? (
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                    Original language
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onProceed(active)}
          className="mt-5 w-full rounded-full bg-cta py-3.5 text-[15px] font-extrabold text-cta-text transition-transform hover:scale-[1.01]"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
