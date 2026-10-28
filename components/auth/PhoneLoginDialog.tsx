"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { markSignedIn } from "@/lib/auth/session";
import { DEFAULT_PROFILE, readProfile, writeProfile } from "@/lib/profile/storage";

const COUNTRIES = [
  { id: "IN", name: "India", dial: "+91", digits: 10 },
  { id: "US", name: "America", dial: "+1", digits: 10 },
  { id: "CA", name: "Canada", dial: "+1", digits: 10 },
  { id: "UK", name: "UK", dial: "+44", digits: 10 },
] as const;

type CountryId = (typeof COUNTRIES)[number]["id"];

type PhoneLoginDialogProps = {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
};

export function PhoneLoginDialog({ open, onClose, onDone }: PhoneLoginDialogProps) {
  const [countryId, setCountryId] = useState<CountryId>("IN");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const country = COUNTRIES.find((item) => item.id === countryId) ?? COUNTRIES[0];

  if (!open) return null;

  function continueWithPhone() {
    if (phone.length !== country.digits) {
      setError(`Enter a ${country.digits}-digit mobile number`);
      return;
    }
    const current = readProfile();
    writeProfile({ ...current, phone: `${country.dial} ${phone}` });
    markSignedIn();
    onDone();
  }

  function continueWithGoogle() {
    const current = readProfile();
    const fresh = current.email === DEFAULT_PROFILE.email;
    writeProfile({
      ...current,
      email: fresh ? "host@gmail.com" : current.email,
      name: fresh ? "Host" : current.name,
    });
    markSignedIn();
    onDone();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-[420px] overflow-hidden rounded-[28px] bg-surface shadow-2xl">
        <div className="relative bg-gradient-to-b from-[#2a0616] via-[#9d1248] to-accent px-6 pt-5 pb-8 text-center text-white">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-full text-white/90"
          >
            <X className="size-5" />
          </button>
          <Image
            src="/logos/vybe-logo-dark.png?v=24"
            alt="VYBE"
            width={168}
            height={64}
            unoptimized
            className="mx-auto h-12 w-auto"
          />
          <p className="mx-auto mt-4 max-w-[260px] text-[13px] leading-relaxed text-white/90">
            Experience the best in Movies, Events, Activities, and Play.
          </p>
        </div>
        <div className="px-6 pt-6 pb-7 text-center">
          <h2 className="text-[22px] font-extrabold tracking-tight text-text">Enter your mobile number</h2>
          <p className="mt-1 text-[13px] text-text-secondary">
            If you don&apos;t have an account yet, we&apos;ll create one for you
          </p>
          <div className="mt-5 flex gap-2">
            <label className="relative flex h-12 shrink-0 items-center rounded-xl border border-border bg-bg">
              <select
                aria-label="Country"
                value={countryId}
                onChange={(event) => {
                  const next = event.target.value as CountryId;
                  const picked = COUNTRIES.find((item) => item.id === next) ?? COUNTRIES[0];
                  setCountryId(next);
                  setPhone((value) => value.slice(0, picked.digits));
                  setError("");
                }}
                className="h-full appearance-none bg-transparent pr-7 pl-3 text-[14px] font-semibold text-text outline-none"
              >
                {COUNTRIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} {item.dial}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-text-muted" />
            </label>
            <input
              inputMode="numeric"
              maxLength={country.digits}
              value={phone}
              placeholder="Enter mobile number"
              aria-label="Mobile number"
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, country.digits))}
              className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-bg px-3 text-[14px] text-text outline-none focus:border-text"
            />
          </div>
          {error ? <p className="mt-2 text-[13px] font-semibold text-accent">{error}</p> : null}
          <button
            type="button"
            onClick={continueWithPhone}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-text text-[15px] font-extrabold text-bg"
          >
            Continue
          </button>
          <div className="my-4 flex items-center gap-3 text-[12px] font-bold tracking-[0.14em] text-text-muted">
            <span className="h-px flex-1 bg-border" />
            OR
            <span className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            onClick={continueWithGoogle}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface text-[14px] font-extrabold text-text"
          >
            <GoogleMark />
            Continue with Google
          </button>
          <p className="mt-4 text-[12px] text-text-muted">
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="font-semibold text-text underline">
              Terms of Service
            </Link>{" "}
            <Link href="/privacy-policy" className="font-semibold text-text underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z" />
      <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.9 10.7A5.4 5.4 0 0 1 3.6 9c0-.6.1-1.2.3-1.7V5H.9A9 9 0 0 0 0 9c0 1.4.3 2.8.9 4l3-2.3z" />
      <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z" />
    </svg>
  );
}
