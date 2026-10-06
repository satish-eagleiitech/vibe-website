"use client";

import { HalfMoonIcon } from "@/components/profile/HalfMoonIcon";
import {
  useTheme,
  type AppearanceMode,
} from "@/components/theme/ThemeProvider";

const modes: { id: AppearanceMode; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export function AppearanceToggle() {
  const { appearance, setAppearance } = useTheme();

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-start gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-surface-muted text-text">
          <HalfMoonIcon className="size-5" />
        </span>
        <div>
          <p className="text-[15px] font-extrabold text-text">Appearance</p>
          <p className="text-[13px] text-text-secondary">
            System, light, or dark
          </p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Appearance"
        className="grid grid-cols-3 gap-1 rounded-xl bg-segment-track p-1"
      >
        {modes.map((mode) => {
          const active = appearance === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setAppearance(mode.id)}
              className={`rounded-lg px-3 py-2.5 text-[13px] font-bold transition-all ${
                active
                  ? "bg-segment-active text-text shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
