"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Crosshair, Loader2, MapPin, Search, X } from "lucide-react";
import { publicEnv } from "@/config/public";
import {
  ALL_CITIES,
  POPULAR_CITIES,
  readSavedLocation,
  resolveMajorCity,
  writeSavedLocation,
  type SavedLocation,
} from "@/lib/location/cities";
import {
  autocompletePlaces,
  geocodeQuery,
  hasMapsKey,
  loadGoogleMaps,
  mountPreviewMap,
  resolvePlaceId,
  reverseGeocode,
  type MapController,
  type PlaceSuggestion,
  type ResolvedPlace,
} from "@/lib/maps/google";

type LocationButtonProps = {
  className?: string;
  overlay?: boolean;
  variant?: "inline" | "stacked";
};

export function LocationButton({
  className = "",
  overlay = false,
  variant = "inline",
}: LocationButtonProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(publicEnv.defaultCity);
  const [state, setState] = useState("Telangana");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState("");
  const [locating, setLocating] = useState(false);
  const [searching, setSearching] = useState(false);

  const placesAttrRef = useRef<HTMLDivElement>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapCtrlRef = useRef<MapController | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(
    null,
  );

  useEffect(() => {
    function applySaved() {
      const saved = readSavedLocation();
      if (!saved?.city) return;

      const major = resolveMajorCity(saved);
      const isPopular = POPULAR_CITIES.some(
        (item) => item.name.toLowerCase() === saved.city.toLowerCase(),
      );
      const next = isPopular
        ? saved
        : {
            ...saved,
            city: major.name,
            state: major.state || saved.state,
          };

      if (!isPopular) {
        writeSavedLocation(next);
      }

      setCity(next.city);
      setState(next.state || "India");
      if (next.lat != null && next.lng != null) {
        setCoords({ lat: next.lat, lng: next.lng });
      }
    }
    applySaved();
    window.addEventListener("vybe-city-change", applySaved);
    return () => window.removeEventListener("vybe-city-change", applySaved);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !hasMapsKey()) return;
    let cancelled = false;
    loadGoogleMaps()
      .then(({ maps }) => {
        if (cancelled) return;
        sessionTokenRef.current = new maps.places.AutocompleteSessionToken();
        setMapsReady(true);
        setMapsError("");
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setMapsReady(false);
        setMapsError(error.message || "Maps unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSuggestions([]);
      mapCtrlRef.current?.destroy();
      mapCtrlRef.current = null;
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!open || !coords || !mapElRef.current || !mapsReady) return;
    let cancelled = false;

    (async () => {
      try {
        if (!mapCtrlRef.current) {
          mapCtrlRef.current = await mountPreviewMap(
            mapElRef.current!,
            coords.lat,
            coords.lng,
          );
        } else {
          mapCtrlRef.current.setCenter(coords.lat, coords.lng);
        }
      } catch {
        if (!cancelled) {
          // Map preview is optional
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, coords, mapsReady]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    if (!mapsReady) return;

    let cancelled = false;
    setSearching(true);
    const timer = window.setTimeout(() => {
      autocompletePlaces(q, sessionTokenRef.current ?? undefined)
        .then((items) => {
          if (!cancelled) setSuggestions(items);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, open, mapsReady]);

  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_CITIES.slice(0, 24);
    return ALL_CITIES.filter((item) => item.toLowerCase().includes(q)).slice(
      0,
      40,
    );
  }, [query]);

  function persist(next: SavedLocation) {
    writeSavedLocation(next);
    setCity(next.city);
    setState(next.state);
    if (next.lat != null && next.lng != null) {
      setCoords({ lat: next.lat, lng: next.lng });
    }
  }

  function applyResolved(place: ResolvedPlace, majorOnly = false) {
    const major = resolveMajorCity({
      city: place.city,
      area: place.area,
      state: place.state,
      lat: place.lat,
      lng: place.lng,
    });
    // Detect / reverse-geocode: always show the parent metro (Hyderabad, not HITEC).
    // Place search: prefer metro when the hit is a known locality.
    const useMajor =
      majorOnly ||
      Boolean(
        place.area ||
          matchLocalityNeedsMajor(place.city) ||
          matchLocalityNeedsMajor(place.area),
      );
    persist({
      city: useMajor ? major.name : place.city || major.name,
      state: useMajor ? major.state : place.state || major.state,
      area: place.area || undefined,
      lat: place.lat,
      lng: place.lng,
      placeId: place.placeId,
    });
    setOpen(false);
    setQuery("");
    setSuggestions([]);
  }

  function matchLocalityNeedsMajor(value?: string) {
    if (!value) return false;
    const popular = POPULAR_CITIES.some(
      (c) => c.name.toLowerCase() === value.trim().toLowerCase(),
    );
    return !popular;
  }

  function selectPopular(item: (typeof POPULAR_CITIES)[number]) {
    persist({
      city: item.name,
      state: item.state,
      lat: item.lat,
      lng: item.lng,
    });
    setOpen(false);
    setQuery("");
  }

  async function selectSuggestion(item: PlaceSuggestion) {
    if (!placesAttrRef.current) return;
    const resolved = await resolvePlaceId(item.placeId, placesAttrRef.current);
    if (resolved) {
      applyResolved(resolved);
      return;
    }
    persist({
      city: item.mainText,
      state: item.secondaryText || "India",
    });
    setOpen(false);
  }

  async function selectListedCity(name: string) {
    if (mapsReady) {
      const resolved = await geocodeQuery(name);
      if (resolved) {
        applyResolved(resolved);
        return;
      }
    }
    const popular = POPULAR_CITIES.find((item) => item.name === name);
    persist({
      city: name,
      state: popular?.state || state || "India",
      lat: popular?.lat,
      lng: popular?.lng,
    });
    setOpen(false);
  }

  async function useCurrentLocation() {
    if (!navigator.geolocation) {
      setMapsError("Geolocation is not supported on this device");
      return;
    }
    setLocating(true);
    setMapsError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          if (mapsReady) {
            const resolved = await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude,
            );
            if (resolved) {
              applyResolved(resolved, true);
              return;
            }
          }
          const major = resolveMajorCity({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          persist({
            city: major.name,
            state: major.state,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setOpen(false);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        setMapsError(error.message || "Unable to fetch current location");
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  return (
    <>
      {variant === "stacked" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex min-w-0 items-center gap-1.5 text-left ${className}`}
          aria-label={`Current location ${city}. Open location picker.`}
        >
          <MapPin className="size-[18px] shrink-0 text-accent" strokeWidth={2.25} aria-hidden="true" />
          <span className="min-w-0 leading-tight">
            <span className="flex items-center gap-0.5">
              <span className="truncate text-[14px] font-extrabold text-text">{city}</span>
              <ChevronDown className="size-3.5 shrink-0 text-text" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="block truncate text-[11px] font-medium text-text-secondary">
              {state}
            </span>
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex max-w-[180px] items-center gap-1 text-left ${className}`}
          aria-label={`Current location ${city}. Open location picker.`}
        >
          <span
            className={`truncate text-[14px] font-bold ${
              overlay ? "text-white" : "text-text"
            }`}
          >
            {city}
          </span>
          <ChevronDown
            className={`size-4 shrink-0 ${
              overlay ? "text-white/80" : "text-text"
            }`}
            strokeWidth={2.25}
            aria-hidden="true"
          />
        </button>
      )}

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/45 px-4 py-10 backdrop-blur-[2px] md:py-16">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Select location"
            className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-surface p-5 shadow-2xl md:p-7"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full bg-surface-muted text-text"
            >
              <X className="size-4" />
            </button>

            <h2 className="text-[22px] font-extrabold text-text">
              Select Location
            </h2>

            <label className="relative mt-5 flex h-12 items-center gap-2 rounded-xl border border-border bg-bg px-3 focus-within:border-border">
              <Search className="size-4 shrink-0 text-text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search city, area or locality"
                className="w-full bg-transparent text-sm font-semibold text-text outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none placeholder:text-text-muted"
                autoFocus
              />
              {searching ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-accent" />
              ) : null}
            </label>

            {suggestions.length > 0 ? (
              <ul className="mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                {suggestions.map((item) => (
                  <li key={item.placeId}>
                    <button
                      type="button"
                      onClick={() => void selectSuggestion(item)}
                      className="flex w-full items-start gap-3 border-b border-border px-3 py-3 text-left last:border-b-0 hover:bg-accent-soft/40"
                    >
                      <MapPin
                        className="mt-0.5 size-4 shrink-0 text-accent/55"
                        strokeWidth={1.6}
                      />
                      <span className="min-w-0">
                        <span className="block text-[14px] font-bold text-text">
                          {item.mainText}
                        </span>
                        <span className="block truncate text-[12px] text-text-secondary">
                          {item.secondaryText}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <button
              type="button"
              onClick={() => void useCurrentLocation()}
              disabled={locating}
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent disabled:opacity-60"
            >
              {locating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Crosshair className="size-4" />
              )}
              {locating ? "Detecting location…" : "Detect my location"}
            </button>

            {mapsError ? (
              <p className="mt-2 text-[12px] font-medium text-text-muted">
                {mapsError}. You can still pick a city below.
              </p>
            ) : null}

            {!hasMapsKey() ? (
              <p className="mt-2 text-[12px] font-medium text-text-muted">
                Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable live maps search.
              </p>
            ) : null}

            {coords && mapsReady ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                <div ref={mapElRef} className="h-[180px] w-full bg-surface-muted" />
                <p className="bg-surface-muted px-3 py-2 text-[12px] font-semibold text-text-secondary">
                  Map preview · {city}
                  {state ? `, ${state}` : ""}
                </p>
              </div>
            ) : null}

            {!query.trim() ? (
              <>
                <h3 className="mt-7 text-[15px] font-extrabold text-text">
                  Popular cities
                </h3>
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {POPULAR_CITIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectPopular(item)}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-accent-soft/50 px-2 py-3 text-center transition-colors hover:bg-accent-soft"
                    >
                      <span className="relative inline-flex size-14 items-center justify-center overflow-hidden rounded-xl">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt=""
                            width={56}
                            height={56}
                            className="object-contain p-1.5"
                            unoptimized
                          />
                        ) : (
                          <MapPin
                            className="size-5 text-accent/70"
                            strokeWidth={1.6}
                          />
                        )}
                      </span>
                      <span className="text-[12px] font-bold text-text">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {suggestions.length === 0 ? (
              <>
                <h3 className="mt-7 text-[15px] font-extrabold text-text">
                  {query.trim() ? "Cities" : "All cities"}
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                  {filteredCities.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => void selectListedCity(name)}
                      className="rounded-lg px-1 py-1.5 text-left text-[14px] font-semibold text-text-secondary hover:bg-surface-muted hover:text-text"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {/* Required attribution container for PlacesService */}
            <div ref={placesAttrRef} className="hidden" aria-hidden="true" />
          </div>
        </div>
      ) : null}
    </>
  );
}
