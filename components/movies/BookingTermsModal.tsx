"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { BOOKING_TERMS } from "@/lib/data/bookingTerms";

type BookingTermsModalProps = {
  open: boolean;
  mode?: "accept" | "view";
  onAccept?: () => void;
  onClose: () => void;
};

export function BookingTermsModal({
  open,
  mode = "accept",
  onAccept,
  onClose,
}: BookingTermsModalProps) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close terms"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-terms-title"
        className="relative z-[1] flex max-h-[72svh] w-full max-w-[400px] flex-col overflow-hidden rounded-t-[20px] border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:max-h-[68svh] sm:rounded-[20px]"
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
          <h2
            id="booking-terms-title"
            className="text-[16px] font-extrabold text-text"
          >
            Terms & Conditions
          </h2>
          {mode === "view" ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex size-8 items-center justify-center rounded-full bg-surface-muted text-text"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-2">
          <p className="rounded-lg bg-accent-soft px-3 py-2 text-[12px] leading-relaxed font-semibold text-accent">
            Accessibility: ask the cinema box office for Audio Description (AD),
            Closed Captions (CC) or wheelchair-friendly seats when available.
          </p>
          <ol className="mt-3 list-decimal space-y-2.5 pl-4 text-[12.5px] leading-relaxed text-text-secondary">
            {BOOKING_TERMS.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ol>
        </div>

        {mode === "accept" ? (
          <div className="grid grid-cols-2 gap-2.5 border-t border-border px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-accent px-3 py-2.5 text-[13px] font-extrabold text-accent transition-colors hover:bg-accent-soft"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="rounded-full bg-accent px-3 py-2.5 text-[13px] font-extrabold text-white transition-transform hover:scale-[1.01]"
            >
              Accept
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
