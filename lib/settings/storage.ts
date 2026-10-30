export type SettingsPreferences = {
  bookingUpdates: boolean;
  offersAndRewards: boolean;
};

const STORAGE_KEY = "vybe-settings";
const DEFAULTS: SettingsPreferences = {
  bookingUpdates: true,
  offersAndRewards: true,
};

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function readSettings(): SettingsPreferences {
  if (!canUseStorage()) return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<SettingsPreferences>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function writeSettings(next: SettingsPreferences) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("vybe-settings-updated"));
}

export const SETTINGS_EVENT = "vybe-settings-updated";
