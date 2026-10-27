"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { markSignedIn } from "@/lib/auth/session";
import { readProfile, writeProfile } from "@/lib/profile/storage";

type PhoneLoginDialogProps = {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
};

export function PhoneLoginDialog({ open, onClose, onDone }: PhoneLoginDialogProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  function continueWithPhone() {
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a 10-digit mobile number");
      return;
    }
    const current = readProfile();
    writeProfile({ ...current, phone: `+91 ${phone}` });
    markSignedIn();
    onDone();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4">
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
            <span className="flex h-12 shrink-0 items-center rounded-xl border border-border bg-bg px-3 text-[14px] font-semibold text-text">
              🇮🇳 +91
            </span>
            <input
              inputMode="numeric"
              maxLength={10}
              value={phone}
              placeholder="Enter mobile number"
              aria-label="Mobile number"
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
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
