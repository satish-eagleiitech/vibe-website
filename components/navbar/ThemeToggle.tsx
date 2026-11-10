"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

type ThemeToggleProps = {
  overlay?: boolean;
  /** White icon for the dark top dock */
  dock?: boolean;
};

export function ThemeToggle({ overlay = false, dock = false }: ThemeToggleProps) {
  const { resolved, setAppearance } = useTheme();
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setAppearance(isDark ? "light" : "dark")}
      className={`inline-flex size-9 items-center justify-center rounded-full transition-colors ${
        dock
          ? "text-text hover:bg-black/[0.06] dark:text-white dark:hover:bg-white/10"
          : overlay
            ? "text-white hover:bg-white/10"
            : "text-text hover:bg-black/[0.06] dark:hover:bg-white/10"
      }`}
    >
      {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}
