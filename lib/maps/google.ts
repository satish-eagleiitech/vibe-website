import { publicEnv } from "@/config/public";

const SCRIPT_ID = "vybe-google-maps";

type MapsReady = {
  maps: typeof google.maps;
};

let mapsPromise: Promise<MapsReady> | null = null;

export function hasMapsKey() {
  return Boolean(publicEnv.googleMapsApiKey);
}

export function loadGoogleMaps(): Promise<MapsReady> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Maps only available in the browser"));
  }

  if (window.google?.maps?.places) {
    return Promise.resolve({ maps: window.google.maps });
  }

  if (mapsPromise) return mapsPromise;

  const key = publicEnv.googleMapsApiKey;
  if (!key) {
    return Promise.reject(new Error("Google Maps API key is missing"));
  }

  mapsPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    const onReady = () => {
      if (window.google?.maps) {
        resolve({ maps: window.google.maps });
      } else {
        mapsPromise = null;
        reject(new Error("Google Maps failed to initialize"));
      }
    };

    if (existing) {
      if (window.google?.maps) onReady();
      else existing.addEventListener("load", onReady, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key,
    )}&libraries=places&v=weekly`;
    script.onload = onReady;
    script.onerror = () => {
      mapsPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });

  return mapsPromise;
}

export type PlaceSuggestion = {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
};

export async function autocompletePlaces(
  input: string,
  sessionToken?: google.maps.places.AutocompleteSessionToken,
): Promise<PlaceSuggestion[]> {
  const q = input.trim();
  if (q.length < 2) return [];

  const { maps } = await loadGoogleMaps();
  const service = new maps.places.AutocompleteService();

  return new Promise((resolve) => {
    service.getPlacePredictions(
      {
        input: q,
        componentRestrictions: { country: ["in", "ae"] },
        types: ["geocode"],
        sessionToken,
      },
      (predictions, status) => {
        if (
          status !== maps.places.PlacesServiceStatus.OK ||
          !predictions?.length
        ) {
          resolve([]);
          return;
        }
        resolve(
          predictions.slice(0, 8).map((item) => ({
            placeId: item.place_id,
            mainText: item.structured_formatting.main_text,
            secondaryText: item.structured_formatting.secondary_text || "",
            description: item.description,
          })),
        );
      },
    );
  });
}

export type ResolvedPlace = {
  city: string;
  state: string;
  area: string;
  lat: number;
  lng: number;
  placeId?: string;
  formattedAddress: string;
};

function pickComponent(
  components: google.maps.GeocoderAddressComponent[] | undefined,
  type: string,
) {
  return components?.find((item) => item.types.includes(type))?.long_name ?? "";
}

function fromAddressComponents(
  components: google.maps.GeocoderAddressComponent[] | undefined,
  fallbackName = "",
): Pick<ResolvedPlace, "city" | "state" | "area"> {
  const locality =
    pickComponent(components, "locality") ||
    pickComponent(components, "administrative_area_level_3") ||
    pickComponent(components, "sublocality") ||
    pickComponent(components, "postal_town") ||
    fallbackName;
  const area =
    pickComponent(components, "sublocality_level_1") ||
    pickComponent(components, "neighborhood") ||
    pickComponent(components, "sublocality") ||
    "";
  const state = pickComponent(components, "administrative_area_level_1");
  return {
    city: locality || fallbackName || "Selected area",
    state: state || "India",
    area,
  };
}

export async function resolvePlaceId(
  placeId: string,
  attributionEl: HTMLDivElement,
): Promise<ResolvedPlace | null> {
  const { maps } = await loadGoogleMaps();
  const service = new maps.places.PlacesService(attributionEl);

  return new Promise((resolve) => {
    service.getDetails(
      {
        placeId,
        fields: ["address_component", "formatted_address", "geometry", "name", "place_id"],
      },
      (place, status) => {
        if (status !== maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) {
          resolve(null);
          return;
        }
        const parsed = fromAddressComponents(
          place.address_components,
          place.name || "",
        );
        resolve({
          ...parsed,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id,
          formattedAddress: place.formatted_address || place.name || parsed.city,
        });
      },
    );
  });
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ResolvedPlace | null> {
  const { maps } = await loadGoogleMaps();
  const geocoder = new maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== "OK" || !results?.[0]) {
        resolve(null);
        return;
      }
      const result = results[0];
      const parsed = fromAddressComponents(result.address_components);
      resolve({
        ...parsed,
        lat,
        lng,
        placeId: result.place_id,
        formattedAddress: result.formatted_address,
      });
    });
  });
}

export async function geocodeQuery(query: string): Promise<ResolvedPlace | null> {
  const { maps } = await loadGoogleMaps();
  const geocoder = new maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode(
      { address: query, componentRestrictions: { country: "IN" } },
      (results, status) => {
        if (status !== "OK" || !results?.[0]) {
          resolve(null);
          return;
        }
        const result = results[0];
        const loc = result.geometry.location;
        const parsed = fromAddressComponents(
          result.address_components,
          query,
        );
        resolve({
          ...parsed,
          lat: loc.lat(),
          lng: loc.lng(),
          placeId: result.place_id,
          formattedAddress: result.formatted_address,
        });
      },
    );
  });
}

export type MapController = {
  setCenter: (lat: number, lng: number) => void;
  destroy: () => void;
};

export async function mountPreviewMap(
  el: HTMLElement,
  lat: number,
  lng: number,
): Promise<MapController> {
  const { maps } = await loadGoogleMaps();
  const center = { lat, lng };
  const map = new maps.Map(el, {
    center,
    zoom: 13,
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: "cooperative",
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      },
    ],
  });
  const marker = new maps.Marker({
    map,
    position: center,
  });

  return {
    setCenter(nextLat, nextLng) {
      const next = { lat: nextLat, lng: nextLng };
      map.setCenter(next);
      marker.setPosition(next);
    },
    destroy() {
      marker.setMap(null);
      el.innerHTML = "";
    },
  };
}
