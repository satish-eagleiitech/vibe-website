"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultTheme, type ThemeName } from "@/lib/theme/colors";

export type AppearanceMode = "system" | "light" | "dark";

type ThemeContextValue = {
  appearance: AppearanceMode;
  resolved: ThemeName;
  setAppearance: (mode: AppearanceMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "vybe-appearance";

function resolveTheme(appearance: AppearanceMode): ThemeName {
  if (appearance === "light") return "light";
  if (appearance === "dark") return "dark";
  if (typeof window === "undefined") return defaultTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<AppearanceMode>("light");
  const [resolved, setResolved] = useState<ThemeName>(defaultTheme);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as AppearanceMode | null;
    const next =
      saved === "system" || saved === "light" || saved === "dark"
        ? saved
        : "light";
    setAppearanceState(next);
    const theme = resolveTheme(next);
    setResolved(theme);
    applyTheme(theme);
  }, []);

  useEffect(() => {
    if (appearance !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const theme = resolveTheme("system");
      setResolved(theme);
      applyTheme(theme);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [appearance]);

  const setAppearance = useCallback((mode: AppearanceMode) => {
    setAppearanceState(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
    const theme = resolveTheme(mode);
    setResolved(theme);
    applyTheme(theme);
  }, []);

  const value = useMemo(
    () => ({ appearance, resolved, setAppearance }),
    [appearance, resolved, setAppearance],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
