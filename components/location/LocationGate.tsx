"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resolveMajorCity, writeSavedLocation } from "@/lib/location/cities";
import { reverseGeocode } from "@/lib/maps/google";

const PROMPT_KEY = "vybe-location-prompt";

export function LocationGate() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      if (window.localStorage.getItem(PROMPT_KEY) === "1") return;
    } catch {
      return;
    }
    if (pathname === "/login") return;
    setOpen(true);
  }, [pathname]);

  function finish() {
    try {
      window.localStorage.setItem(PROMPT_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  function enterManually() {
    finish();
    if (document.querySelector("[data-vybe-location]")) {
      window.dispatchEvent(new Event("vybe-open-location"));
      return;
    }
    try {
      sessionStorage.setItem("vybe-open-location", "1");
    } catch {
      /* ignore */
    }
    router.push("/");
  }

  function allowLocation() {
    if (!navigator.geolocation) {
      setError("Location is not available on this device");
      return;
    }
    setBusy(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const resolved = await reverseGeocode(lat, lng);
          const major = resolveMajorCity({
            city: resolved?.city,
            area: resolved?.area,
            state: resolved?.state,
            lat,
            lng,
          });
          writeSavedLocation({
            city: major.name,
            state: major.state,
            area: resolved?.area,
            lat,
            lng,
            placeId: resolved?.placeId,
          });
          finish();
        } catch {
          const major = resolveMajorCity({ lat, lng });
          writeSavedLocation({ city: major.name, state: major.state, lat, lng });
          finish();
        } finally {
          setBusy(false);
        }
      },
      () => {
        setBusy(false);
        setError("Location was blocked. Enter it manually instead.");
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  if (!open || pathname === "/login") return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6">
      <div className="w-full max-w-[440px] rounded-t-[28px] bg-white px-6 pt-8 pb-7 text-center shadow-2xl sm:rounded-[28px]">
        <Image
          src="/images/location-pin.jpg"
          alt=""
          width={280}
          height={220}
          className="mx-auto h-[180px] w-auto object-contain"
          priority
        />
        <h2 className="mt-2 text-[26px] leading-tight font-extrabold tracking-tight text-[#14161c]">
          Discover the best things happening around you
        </h2>
        <p className="mx-auto mt-3 max-w-[320px] text-[14px] leading-relaxed text-[#5c6370]">
          Allow location permissions for best recommendations around you
        </p>
        <button
          type="button"
          onClick={allowLocation}
          disabled={busy}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#111827] text-[15px] font-extrabold text-white disabled:opacity-70"
        >
          {busy ? "Finding you…" : "Allow location access"}
        </button>
        <button
          type="button"
          onClick={enterManually}
          className="mt-4 text-[14px] font-semibold text-[#14161c] underline underline-offset-4"
        >
          Enter location manually
        </button>
        {error ? <p className="mt-3 text-[13px] font-semibold text-accent">{error}</p> : null}
      </div>
    </div>
  );
}
