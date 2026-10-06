"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { ALL_CITIES, POPULAR_CITIES } from "@/lib/location/cities";
import {
  AVATAR_OPTIONS,
  type ProfileGender,
  type VybeProfile,
} from "@/lib/profile/storage";

const GENDERS: ProfileGender[] = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
];

type EditProfileModalProps = {
  profile: VybeProfile;
  onClose: () => void;
  onSave: (profile: VybeProfile) => void;
};

export function EditProfileModal({
  profile,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function setField<K extends keyof VybeProfile>(key: K, value: VybeProfile[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function onCityChange(city: string) {
    const popular = POPULAR_CITIES.find((item) => item.name === city);
    setDraft((prev) => ({
      ...prev,
      city,
      state: popular?.state || prev.state,
    }));
  }

  function onPickFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setField("avatarUrl", reader.result);
        setError("");
      }
    };
    reader.readAsDataURL(file);
  }

  function submit() {
    if (!draft.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!draft.phone.trim()) {
      setError("Phone is required");
      return;
    }
    if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      setError("Enter a valid email");
      return;
    }
    onSave({
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/45 px-4 py-10 backdrop-blur-[2px] md:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit profile"
        className="relative max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-border bg-surface p-5 shadow-2xl md:p-7"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full bg-surface-muted text-text"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-[22px] font-extrabold text-text">Edit profile</h2>
        <p className="mt-1 text-[14px] text-text-secondary">
          Update the details shown on your VYBE account
        </p>

        <div className="mt-6 flex items-center gap-4">
          <div className="relative size-20 overflow-hidden rounded-2xl bg-surface-muted">
            {draft.avatarUrl ? (
              <Image
                src={draft.avatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            ) : (
              <span className="flex h-full items-center justify-center text-xl font-extrabold text-text">
                {draft.name.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-white"
            >
              Upload photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onPickFile(event.target.files?.[0])}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {AVATAR_OPTIONS.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setField("avatarUrl", src)}
              className={`relative size-12 overflow-hidden rounded-full ring-2 ${
                draft.avatarUrl === src ? "ring-accent" : "ring-transparent"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="48px" />
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] font-semibold text-text-secondary">
            Full name
            <input
              value={draft.name}
              onChange={(event) => setField("name", event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm font-semibold text-text outline-none focus:border-border"
            />
          </label>
          <label className="block text-[13px] font-semibold text-text-secondary">
            Phone
            <input
              value={draft.phone}
              onChange={(event) => setField("phone", event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm font-semibold text-text outline-none focus:border-border"
            />
          </label>
          <label className="block text-[13px] font-semibold text-text-secondary sm:col-span-2">
            Email
            <input
              type="email"
              value={draft.email}
              onChange={(event) => setField("email", event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm font-semibold text-text outline-none focus:border-border"
            />
          </label>
          <label className="block text-[13px] font-semibold text-text-secondary">
            Gender
            <select
              value={draft.gender}
              onChange={(event) =>
                setField("gender", event.target.value as ProfileGender)
              }
              className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm font-semibold text-text outline-none"
            >
              {GENDERS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[13px] font-semibold text-text-secondary">
            City
            <select
              value={draft.city}
              onChange={(event) => onCityChange(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm font-semibold text-text outline-none"
            >
              {!ALL_CITIES.includes(draft.city) ? (
                <option value={draft.city}>{draft.city}</option>
              ) : null}
              {ALL_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <p className="mt-4 text-[13px] font-semibold text-danger-text">{error}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-surface-muted px-5 py-2.5 text-sm font-bold text-text"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
