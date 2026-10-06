export const lightColors = {
  bg: "#F7F7F8",
  surface: "#FFFFFF",
  surfaceMuted: "#F7F7F8",
  border: "#F0F0F0",
  borderStrong: "#EFEFEF",
  text: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  textFaint: "#D1D5DB",
  textSoft: "#A1A1AA",
  textBody: "#374151",
  iconMuted: "#C4C4C4",
  accent: "#FF005B",
  accentSoft: "rgba(255,0,91,0.1)",
  dangerBg: "#FEF2F2",
  dangerText: "#B91C1C",
  overlay: "#FFFFFF",
  sheet: "#FFFFFF",
  sheetElevated: "#FFFFFF",
  cta: "#111827",
  ctaText: "#FFFFFF",
  menuDivider: "#F5F5F5",
  segmentTrack: "#F0F0F0",
  segmentActive: "#FFFFFF",
  segmentActiveText: "#111827",
  segmentIdleText: "#6B7280",
} as const;

/**
 * Dark palette — applied when the user picks Dark (or System while OS is dark).
 * Default website theme remains light until the user changes Appearance.
 */
export const darkColors = {
  bg: "#0B0B0F",
  surface: "#16161C",
  surfaceMuted: "#1E1E26",
  border: "#2A2A33",
  borderStrong: "#3A3A45",
  text: "#F9FAFB",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textFaint: "#52525B",
  textSoft: "#71717A",
  textBody: "#D4D4D8",
  iconMuted: "#A1A1AA",
  accent: "#FF005B",
  accentSoft: "rgba(255,0,91,0.18)",
  dangerBg: "#3F1219",
  dangerText: "#FCA5A5",
  overlay: "#16161C",
  sheet: "#1C1C24",
  sheetElevated: "#25252F",
  cta: "#F4F4F5",
  ctaText: "#111827",
  menuDivider: "#2A2A33",
  segmentTrack: "#1E1E26",
  segmentActive: "#2A2A33",
  segmentActiveText: "#F9FAFB",
  segmentIdleText: "#A1A1AA",
} as const;

export const categoryColors = {
  dining: { from: "#803816", to: "#59240C" },
  movies: { from: "#3B1663", to: "#21083D" },
  events: { from: "#831843", to: "#50072B" },
  activities: { from: "#064E3B", to: "#022C22" },
  play: { from: "#0E7490", to: "#083344" },
} as const;

export type ThemeName = "light" | "dark";
export const defaultTheme: ThemeName = "light";
