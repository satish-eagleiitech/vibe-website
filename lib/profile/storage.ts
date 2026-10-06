import { readSavedLocation } from "@/lib/location/cities";

export type ProfileGender = "Male" | "Female" | "Other" | "Prefer not to say";

export type VybeProfile = {
  name: string;
  email: string;
  phone: string;
  gender: ProfileGender;
  city: string;
  state: string;
  avatarUrl: string;
  memberSince: string;
};

const STORAGE_KEY = "vybe-profile";

export const DEFAULT_PROFILE: VybeProfile = {
  name: "Vamshi",
  email: "vamshi@vybe.app",
  phone: "+91 9347190965",
  gender: "Male",
  city: "Hyderabad",
  state: "Telangana",
  avatarUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=320&q=80",
  memberSince: "2024",
};

export const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=320&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=320&q=80",
];

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function readProfile(): VybeProfile {
  const location = canUseStorage() ? readSavedLocation() : null;
  const fallback: VybeProfile = {
    ...DEFAULT_PROFILE,
    city: location?.city || DEFAULT_PROFILE.city,
    state: location?.state || DEFAULT_PROFILE.state,
  };

  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<VybeProfile>;
    return {
      ...fallback,
      ...parsed,
      city: parsed.city || fallback.city,
      state: parsed.state || fallback.state,
    };
  } catch {
    return fallback;
  }
}

export function writeProfile(profile: VybeProfile) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("vybe-profile-updated"));
}

export function resetProfile() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("vybe-profile-updated"));
}
