"use client";

import { useEffect, useRef, useState } from "react";
import { geocodeQuery, loadGoogleMaps, reverseGeocode } from "@/lib/maps/google";

type AddressPickerProps = {
  query: string;
  lat: number;
  lng: number;
  onQuery: (value: string) => void;
  onResolved: (place: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  }) => void;
};

export function AddressPicker({ query, lat, lng, onQuery, onResolved }: AddressPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapObjRef = useRef<google.maps.Map | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    let cancelled = false;

    loadGoogleMaps()
      .then(({ maps }) => {
        if (cancelled) return;
        const center = { lat, lng };
        const map = new maps.Map(el, {
          center,
          zoom: 15,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });
        const marker = new maps.Marker({ map, position: center, draggable: true });
        mapObjRef.current = map;
        markerRef.current = marker;
        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          if (!pos) return;
          void applyLatLng(pos.lat(), pos.lng());
        });
      })
      .catch(() => setError("Map could not load. You can still type the address."));

    return () => {
      cancelled = true;
    };
    // Mount once; later searches move the pin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapObjRef.current?.setCenter({ lat, lng });
    markerRef.current?.setPosition({ lat, lng });
  }, [lat, lng]);

  async function applyLatLng(nextLat: number, nextLng: number) {
    const place = await reverseGeocode(nextLat, nextLng);
    if (!place) return;
    const pincode = place.formattedAddress.match(/\b\d{6}\b/)?.[0] ?? "";
    onResolved({
      line1: place.formattedAddress,
      city: place.city,
      state: place.state,
      pincode,
      lat: nextLat,
      lng: nextLng,
    });
    onQuery(place.area || place.city);
  }

  async function search() {
    const trimmed = query.trim();
    if (!trimmed) return;
    setError("");
    const place = await geocodeQuery(trimmed);
    if (!place) {
      setError("No match for that search");
      return;
    }
    const pincode = place.formattedAddress.match(/\b\d{6}\b/)?.[0] ?? "";
    onResolved({
      line1: place.formattedAddress,
      city: place.city,
      state: place.state,
      pincode,
      lat: place.lat,
      lng: place.lng,
    });
  }

  return (
    <div>
      <p className="mb-2 text-[13px] font-semibold text-text-secondary">Search on Google Maps</p>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void search();
            }
          }}
          placeholder="Kukatpally"
          className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 text-[14px] font-medium text-text outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={() => void search()}
          className="h-12 shrink-0 px-2 text-[15px] font-extrabold text-accent"
        >
          Go
        </button>
      </div>
      <div ref={mapRef} className="mt-3 h-56 overflow-hidden rounded-2xl border border-border bg-surface-muted sm:h-64" />
      <p className="mt-2 text-[12px] text-text-secondary">
        Search a place, or drag the pin. The address fills in automatically.
      </p>
      {error ? <p className="mt-1 text-[12px] font-semibold text-accent">{error}</p> : null}
    </div>
  );
}
