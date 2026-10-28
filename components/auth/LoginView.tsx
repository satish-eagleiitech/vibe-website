"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useEffect, useState } from "react";
import { markSignedIn } from "@/lib/auth/session";
import { DEFAULT_PROFILE, readProfile, writeProfile } from "@/lib/profile/storage";

const SLIDES = [
  {
    src: "/images/hero/events.jpg",
    label: "Events",
    title: "Your events, in front of millions",
    text: "Publish on VYBE and reach people discovering their next gig, show, and night out.",
  },
  {
    src: "/images/hero/movies.jpg",
    label: "Movies",
    title: "The big screen, closer to you",
    text: "Premiere nights, new releases, and the seats everyone is booking.",
  },
  {
    src: "/images/activities/spot-gokart.jpg",
    label: "Activities",
    title: "Days out worth leaving home for",
    text: "Parks, karts, and plans that turn a free afternoon into a plan.",
  },
  {
    src: "/images/play/sport-football.jpg",
    label: "Play",
    title: "Courts, turfs, and game time",
    text: "List a ground and let players book the next match in a few taps.",
  },
  {
    src: "/images/activities/spot-theme-night.jpg",
    label: "Nights",
    title: "Nights that fill the floor",
    text: "Music, fairs, and the rooms people come back to.",
  },
] as const;

const COUNTRIES = [
  { id: "IN", name: "India", dial: "+91", digits: 10 },
  { id: "US", name: "America", dial: "+1", digits: 10 },
  { id: "CA", name: "Canada", dial: "+1", digits: 10 },
  { id: "UK", name: "UK", dial: "+44", digits: 10 },
] as const;

type CountryId = (typeof COUNTRIES)[number]["id"];

function nextPath(value: string | null) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/profile";
}

type LoginViewProps = {
  onDone?: () => void;
};

export function LoginView({ onDone }: LoginViewProps) {
  const router = useRouter();
  const search = useSearchParams();
  const [index, setIndex] = useState(0);
  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [countryId, setCountryId] = useState<CountryId>("IN");
  const [phone, setPhone] = useState("");
  const country = COUNTRIES.find((item) => item.id === countryId) ?? COUNTRIES[0];
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % SLIDES.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  function finish(identity: { email?: string; phone?: string; name?: string }) {
    const current = readProfile();
    writeProfile({
      ...current,
      name: identity.name || current.name,
      email: identity.email || current.email,
      phone: identity.phone || current.phone,
    });
    markSignedIn();
    if (onDone) {
      onDone();
      return;
    }
    router.push(nextPath(search.get("next")));
  }

  function sendOtp() {
    if (channel === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Enter a valid email address");
        return;
      }
    } else if (phone.length !== country.digits) {
      setError(`Enter a ${country.digits}-digit mobile number`);
      return;
    }
    setError("");
    setSent(true);
  }

  function verifyOtp() {
    if (otp.join("").length < 6) {
      setError("Enter the 6-digit code");
      return;
    }
    const name = channel === "email" ? email.split("@")[0] : "VYBE host";
    finish({
      email: channel === "email" ? email.trim() : undefined,
      phone: channel === "phone" ? `${country.dial} ${phone}` : undefined,
      name,
    });
  }

  const slide = SLIDES[index];

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-2">
      <section className="relative h-[46vh] min-h-[280px] overflow-hidden bg-[#120818] lg:h-auto lg:min-h-screen">
        {SLIDES.map((item, slideIndex) => (
          <div
            key={item.label}
            className={`absolute inset-0 transition-opacity duration-700 ${slideIndex === index ? "opacity-100" : "opacity-0"}`}
            style={{ transform: `translateX(${(slideIndex - index) * 100}%)` }}
          >
            <Image
              src={item.src}
              alt=""
              fill
              className={`object-cover ${item.label === "Play" ? "object-[center_72%]" : ""}`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority={item.label === "Events"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35" />
          </div>
        ))}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center px-8 pt-7">
          <Logo overlay priority />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 text-white lg:px-10 lg:pb-12">
          <p className="text-[12px] font-extrabold tracking-[0.16em] uppercase text-white/80">{slide.label}</p>
          <h2 className="mt-2 max-w-md text-[28px] leading-[1.05] font-extrabold tracking-tight lg:mt-3 lg:text-[40px]">{slide.title}</h2>
          <p className="mt-2 hidden max-w-md text-[15px] leading-relaxed text-white/85 sm:block">{slide.text}</p>
          <div className="mt-6 flex gap-2">
            {SLIDES.map((item, dot) => (
              <button
                key={item.label}
                type="button"
                aria-label={item.label}
                onClick={() => setIndex(dot)}
                className={`h-1.5 rounded-full transition-all ${dot === index ? "w-8 bg-white" : "w-3 bg-white/45"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col px-6 py-8 sm:px-12 lg:min-h-screen">
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center">
          <h1 className="text-center text-[28px] font-extrabold tracking-tight text-text">Login or Signup</h1>
          <p className="mt-1 text-center text-[14px] text-text-secondary">to publish your event</p>

          {sent ? (
            <div className="mt-8">
              <p className="text-[13px] text-text-secondary">
                Code sent to {channel === "email" ? email : `+91 ${phone}`}. Enter any 6 digits to continue.
              </p>
              <div className="mt-4 flex justify-between gap-2">
                {otp.map((digit, slot) => (
                  <input
                    key={slot}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    aria-label={`Digit ${slot + 1}`}
                    className="h-12 w-12 rounded-xl border border-border bg-surface text-center text-[18px] font-extrabold text-text outline-none focus:border-accent"
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, "").slice(-1);
                      const next = [...otp];
                      next[slot] = value;
                      setOtp(next);
                      if (value) {
                        const sibling = event.target.nextElementSibling;
                        if (sibling instanceof HTMLInputElement) sibling.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={verifyOtp}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-accent text-[15px] font-extrabold text-white"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setOtp(["", "", "", "", "", ""]);
                }}
                className="mt-3 w-full text-[13px] font-bold text-text-secondary"
              >
                Use a different {channel === "email" ? "email" : "number"}
              </button>
            </div>
          ) : (
            <>
              {channel === "email" ? (
                <label className="mt-8 block">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter email address"
                    className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-[14px] text-text outline-none placeholder:text-text-muted focus:border-accent"
                  />
                </label>
              ) : (
                <label className="mt-8 flex h-12 overflow-hidden rounded-xl border border-border bg-surface focus-within:border-accent">
                  <span className="relative flex items-center border-r border-border">
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
                      className="h-12 appearance-none bg-transparent pr-7 pl-3 text-[14px] font-semibold text-text outline-none"
                    >
                      {COUNTRIES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} {item.dial}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-1.5 size-4 -translate-y-1/2 text-text-muted" />
                  </span>
                  <input
                    inputMode="numeric"
                    maxLength={country.digits}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, country.digits))}
                    placeholder="Mobile number"
                    className="min-w-0 flex-1 bg-transparent px-4 text-[14px] text-text outline-none"
                  />
                </label>
              )}
              <button
                type="button"
                onClick={sendOtp}
                className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-accent text-[15px] font-extrabold text-white"
              >
                Send OTP
              </button>
              <div className="my-5 flex items-center gap-3 text-[12px] font-bold tracking-[0.14em] text-text-muted">
                <span className="h-px flex-1 bg-border" />
                OR
                <span className="h-px flex-1 bg-border" />
              </div>
              {channel === "email" ? (
                <button
                  type="button"
                  onClick={() => {
                    setChannel("phone");
                    setError("");
                  }}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface text-[14px] font-extrabold text-text"
                >
                  Continue with Phone
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setChannel("email");
                    setError("");
                  }}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface text-[14px] font-extrabold text-text"
                >
                  Continue with Email
                </button>
              )}
              <p className="mt-2 text-center text-[12px] text-text-muted">Receive code via SMS or WhatsApp</p>
              <button
                type="button"
                onClick={() => {
          const current = readProfile();
          const fresh = current.email === DEFAULT_PROFILE.email;
          finish({
            email: fresh ? "host@gmail.com" : current.email,
            name: fresh ? "Host" : current.name,
          });
        }}
                className="mt-3 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-surface text-[14px] font-extrabold text-text"
              >
                <GoogleMark />
                Continue with Google
              </button>
            </>
          )}
          {error ? <p className="mt-3 text-center text-[13px] font-semibold text-accent">{error}</p> : null}
        </div>
        <p className="mt-8 text-center text-[12px] text-text-muted">
          In case of any queries, reach out at{" "}
          <a href="mailto:hello@vybe.app" className="font-semibold text-accent">
            hello@vybe.app
          </a>
        </p>
      </section>
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
