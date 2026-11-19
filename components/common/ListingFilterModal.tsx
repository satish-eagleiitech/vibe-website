"use client";

import { useEffect, useState } from "react";

export type ListingFilterPanel = {
  id: string;
  label: string;
  options: { id: string; label: string }[];
};

type ListingFilterModalProps = {
  open: boolean;
  panels: ListingFilterPanel[];
  /** Current selected value per panel id (empty string = none) */
  values: Record<string, string>;
  onClose: () => void;
  onApply: (values: Record<string, string>) => void;
  onClear: () => void;
};

export function ListingFilterModal({
  open,
  panels,
  values,
  onClose,
  onApply,
  onClear,
}: ListingFilterModalProps) {
  const [panel, setPanel] = useState(panels[0]?.id ?? "");
  const [draft, setDraft] = useState(values);

  useEffect(() => {
    if (!open) return;
    setDraft(values);
    setPanel(panels[0]?.id ?? "");
    // Sync draft only when the modal opens
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const activePanel = panels.find((item) => item.id === panel) ?? panels[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/45" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-filter-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] bg-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4">
          <h2
            id="listing-filter-title"
            className="text-[22px] font-extrabold tracking-tight text-text"
          >
            Filter by
          </h2>
        </div>

        <div className="flex gap-0 px-4 pb-4">
          <nav
            aria-label="Filter categories"
            className="flex w-[108px] shrink-0 flex-col gap-0.5 pr-2"
          >
            {panels.map((item) => {
              const active = panel === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPanel(item.id)}
                  className={`rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold transition-colors ${
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-text-secondary hover:bg-surface-muted hover:text-text"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="min-h-[240px] max-h-[50vh] flex-1 overflow-y-auto rounded-2xl bg-surface-muted p-4">
            <ul className="space-y-3">
              {activePanel?.options.map((option) => {
                const checked = draft[activePanel.id] === option.id;
                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          [activePanel.id]:
                            current[activePanel.id] === option.id ? "" : option.id,
                        }))
                      }
                      className="flex w-full cursor-pointer items-center gap-3 text-left text-[15px] font-medium text-text"
                    >
                      <span
                        className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          checked ? "border-accent bg-accent" : "border-border bg-surface"
                        }`}
                      >
                        {checked ? <span className="size-2 rounded-full bg-white" /> : null}
                      </span>
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => {
              const cleared = Object.fromEntries(panels.map((item) => [item.id, ""]));
              setDraft(cleared);
              onClear();
            }}
            className="text-[14px] font-semibold text-text underline decoration-dotted underline-offset-4 hover:text-accent"
          >
            Clear filters
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="min-w-[160px] rounded-full bg-sidebar py-3 text-[14px] font-extrabold text-white transition-colors hover:bg-accent dark:bg-accent dark:hover:opacity-90"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
