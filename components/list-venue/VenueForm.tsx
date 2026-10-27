"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AddressPicker } from "@/components/list-events/AddressPicker";

const STEPS = [
  "Owner",
  "Venue",
  "Courts",
  "Setup",
  "Photos",
  "Amenities",
  "Hours",
  "Bank details",
  "Review",
] as const;

const SPORTS = [
  "Football",
  "Turf Football",
  "Cricket",
  "Cricket Nets",
  "Box Cricket",
  "Badminton",
  "Pickleball",
  "Padel",
  "Tennis",
  "Basketball",
  "Volleyball",
  "Table Tennis",
  "Squash",
  "Swimming",
  "Hockey",
  "Kabaddi",
  "Skating",
  "Futsal",
] as const;

const SURFACES = [
  "Wooden",
  "Synthetic",
  "Artificial turf",
  "Natural grass",
  "Concrete",
  "Clay",
  "Acrylic",
  "Rubber",
] as const;

const AMENITIES = [
  "Parking",
  "Washrooms",
  "Changing rooms",
  "Showers",
  "Drinking water",
  "Flood lights",
  "Seating",
  "Cafeteria",
  "First aid",
  "Lockers",
  "Wi-Fi",
  "Equipment on rent",
] as const;

const QUICK_HOURS = [
  { label: "6 AM – 10 PM", open: 6 * 60, close: 22 * 60 },
  { label: "6 AM – 12 AM", open: 6 * 60, close: 24 * 60 },
  { label: "4 PM – 11 PM", open: 16 * 60, close: 23 * 60 },
] as const;

const PRICE_PRESETS = [500, 800, 1000, 1500, 2000] as const;

type Photo = { name: string; url: string };

type SportSetup = {
  turfs: number;
  surface: string;
  setting: "" | "Indoor" | "Outdoor";
  rain: "" | "Rainproof" | "Open to rain";
  turfPhoto: Photo | null;
  equipment: Photo | null;
};

type Draft = {
  ownerName: string;
  phone: string;
  email: string;
  venueName: string;
  city: string;
  mapQuery: string;
  line1: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  sports: string[];
  setups: Record<string, SportSetup>;
  amenities: string[];
  openMin: number;
  closeMin: number;
  slotHours: number;
  price: number;
  note: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  accountType: string;
  bankConfirmed: boolean;
};

const STORAGE_KEY = "vybe-venue-draft";

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-[14px] font-medium text-text outline-none placeholder:text-text-muted focus:border-accent";

function emptySetup(): SportSetup {
  return { turfs: 1, surface: "", setting: "", rain: "", turfPhoto: null, equipment: null };
}

const EMPTY: Draft = {
  ownerName: "",
  phone: "",
  email: "",
  venueName: "",
  city: "Hyderabad",
  mapQuery: "Kukatpally",
  line1: "",
  state: "Telangana",
  pincode: "",
  lat: 17.4849,
  lng: 78.4138,
  sports: [],
  setups: {},
  amenities: [],
  openMin: 6 * 60,
  closeMin: 22 * 60,
  slotHours: 1,
  price: 800,
  note: "",
  accountName: "",
  accountNumber: "",
  ifsc: "",
  accountType: "",
  bankConfirmed: false,
};

function formatTime(mins: number) {
  if (mins >= 24 * 60) return "12:00 AM";
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function formatHours(openMin: number, closeMin: number) {
  const hours = (closeMin - openMin) / 60;
  return Number.isInteger(hours) ? `${hours} hours` : `${hours.toFixed(1)} hours`;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-text">{label}</span>
      {children}
    </label>
  );
}

function readImage(file: File): Promise<Photo | null> {
  if (!file.type.startsWith("image/")) return Promise.resolve(null);
  if (file.size > 5 * 1024 * 1024) return Promise.resolve(null);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, url: String(reader.result) });
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export function VenueForm() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [mainPhotos, setMainPhotos] = useState<Photo[]>([]);
  const [gallery, setGallery] = useState<Photo[]>([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Draft>;
        setDraft({
          ...EMPTY,
          ...parsed,
          setups: { ...parsed.setups },
          sports: parsed.sports ?? [],
          amenities: parsed.amenities ?? [],
        });
      }
    } catch {
      /* ignore broken drafts */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const { setups, ...rest } = draft;
    const lightSetups = Object.fromEntries(
      Object.entries(setups).map(([sport, setup]) => [
        sport,
        { ...setup, turfPhoto: null, equipment: null },
      ]),
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, setups: lightSetups }));
  }, [draft, ready]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function toggleSport(sport: string) {
    setDraft((prev) => {
      const selected = prev.sports.includes(sport);
      const sports = selected ? prev.sports.filter((item) => item !== sport) : [...prev.sports, sport];
      const setups = { ...prev.setups };
      if (!selected && !setups[sport]) setups[sport] = emptySetup();
      return { ...prev, sports, setups };
    });
    setError("");
  }

  function patchSetup(sport: string, patch: Partial<SportSetup>) {
    setDraft((prev) => ({
      ...prev,
      setups: { ...prev.setups, [sport]: { ...(prev.setups[sport] ?? emptySetup()), ...patch } },
    }));
  }

  function canContinue() {
    if (step === 1) {
      return Boolean(draft.ownerName.trim() && /^\d{10}$/.test(draft.phone) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()));
    }
    if (step === 2) return Boolean(draft.venueName.trim() && draft.city.trim() && draft.line1.trim());
    if (step === 3) return draft.sports.length > 0;
    if (step === 4) {
      return draft.sports.every((sport) => {
        const setup = draft.setups[sport];
        return setup && setup.turfs > 0 && setup.surface && setup.setting && setup.rain;
      });
    }
    if (step === 5) return mainPhotos.length > 0;
    if (step === 7) return draft.closeMin > draft.openMin && draft.price > 0;
    if (step === 8) {
      return Boolean(draft.accountName.trim() && draft.accountNumber.trim() && draft.ifsc.trim() && draft.accountType && draft.bankConfirmed);
    }
    return true;
  }

  function next() {
    if (!canContinue()) {
      setError("Complete this step to continue");
      return;
    }
    setError("");
    setStep((value) => Math.min(9, value + 1));
  }

  const rangeLabel = `${formatTime(draft.openMin)} – ${formatTime(draft.closeMin)}`;
  const slotLabel = draft.slotHours === 1 ? "1 hr slots" : `${draft.slotHours} hr slots`;

  if (sent) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16">
        <p className="text-[12px] font-extrabold tracking-[0.16em] text-accent uppercase">List your venue</p>
        <h1 className="mt-3 text-[36px] font-extrabold tracking-tight text-text">Sent for review</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
          {draft.venueName || "Your venue"} is with the VYBE team. We’ll use the owner details below if we need anything else.
        </p>
        <div className="mt-6 rounded-[22px] border border-border bg-surface p-5">
          <p className="text-[20px] font-extrabold text-text">{draft.venueName}</p>
          <p className="mt-1 text-[14px] text-text-secondary">{draft.ownerName}</p>
          <p className="text-[14px] text-text-secondary">{draft.email}</p>
          <p className="mt-3 text-[14px] font-extrabold text-accent">Status: Pending review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[220px_minmax(0,760px)] md:px-8 md:py-12">
      <ol className="flex gap-1 overflow-x-auto md:block md:overflow-visible md:border-l-2 md:border-border">
        {STEPS.map((label, index) => {
          const id = index + 1;
          const active = id === step;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => {
                  if (id <= step) setStep(id);
                }}
                className={`flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-[14px] md:rounded-none md:border-l-2 md:py-3 ${
                  active
                    ? "font-extrabold text-text md:-ml-[2px] md:border-text"
                    : "font-semibold text-text-muted md:-ml-[2px] md:border-transparent"
                }`}
              >
                <span className="w-6 tabular-nums">{String(id).padStart(2, "0")}</span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>

      <div>
        <div className="mb-6">
          <div className="flex items-center justify-between text-[13px] font-semibold text-text-secondary">
            <span>Step {step} of 9</span>
            <span>{Math.round((step / 9) * 100)}% complete</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-accent" style={{ width: `${(step / 9) * 100}%` }} />
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-5">
            <h1 className="text-[32px] font-extrabold tracking-tight text-text">Owner</h1>
            <Field label="Owner name">
              <input className={inputClass} value={draft.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
            </Field>
            <Field label="Phone">
              <div className="flex h-12 overflow-hidden rounded-xl border border-border bg-surface focus-within:border-accent">
                <span className="flex items-center border-r border-border px-4 text-[14px] font-semibold text-text">+91</span>
                <input
                  className="min-w-0 flex-1 bg-transparent px-4 text-[14px] font-medium text-text outline-none"
                  inputMode="numeric"
                  maxLength={10}
                  value={draft.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              </div>
            </Field>
            <Field label="Email">
              <input className={inputClass} value={draft.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <h1 className="text-[32px] font-extrabold tracking-tight text-text">Venue</h1>
            <Field label="Business or venue name">
              <input className={inputClass} value={draft.venueName} onChange={(e) => set("venueName", e.target.value)} />
            </Field>
            <Field label="City">
              <input className={inputClass} value={draft.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <div>
              <p className="mb-1.5 text-[13px] font-semibold text-text">Location</p>
              <p className="mb-3 text-[13px] leading-relaxed text-text-secondary">
                Type an area, landmark, or address, then pick a result. Or drag the map to place the pin.
              </p>
              {draft.line1 ? <p className="mb-3 text-[14px] leading-relaxed text-text">{draft.line1}</p> : null}
              <AddressPicker
                query={draft.mapQuery}
                lat={draft.lat}
                lng={draft.lng}
                onQuery={(value) => set("mapQuery", value)}
                onResolved={(place) => {
                  setDraft((prev) => ({
                    ...prev,
                    line1: place.line1,
                    city: place.city || prev.city,
                    state: place.state || prev.state,
                    pincode: place.pincode || prev.pincode,
                    lat: place.lat,
                    lng: place.lng,
                  }));
                  setError("");
                }}
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <h1 className="text-[32px] font-extrabold tracking-tight text-text">Courts</h1>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[14px] font-semibold text-text-secondary">Sports offered</p>
              <span className="rounded-full border border-border px-3 py-1 text-[12px] font-bold text-text-secondary">
                {draft.sports.length} {draft.sports.length === 1 ? "place" : "places"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SPORTS.map((sport) => {
                const on = draft.sports.includes(sport);
                return (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={`flex h-12 items-center justify-between rounded-2xl border px-4 text-left text-[14px] font-semibold ${
                      on ? "border-text bg-surface text-text" : "border-border bg-surface text-text"
                    }`}
                  >
                    {sport}
                    <span className={`size-4 rounded-full border ${on ? "border-accent bg-accent" : "border-border"}`} />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-5">
            <h1 className="text-[32px] font-extrabold tracking-tight text-text">Setup</h1>
            <p className="text-[14px] leading-relaxed text-text-secondary">
              Set each sport you selected. Equipment is for the sport, shared across every one of that sport.
            </p>
            {draft.sports.map((sport) => {
              const setup = draft.setups[sport] ?? emptySetup();
              return (
                <section key={sport} className="rounded-[24px] border border-border bg-surface p-5">
                  <h2 className="text-[18px] font-extrabold text-text">{sport}</h2>
                  <p className="mt-4 text-[13px] font-semibold text-text-secondary">Turfs for this sport</p>
                  <div className="mt-2 inline-flex items-center gap-4 rounded-full border border-border px-3 py-1.5">
                    <button type="button" className="px-2 text-[18px] font-bold" onClick={() => patchSetup(sport, { turfs: Math.max(1, setup.turfs - 1) })}>−</button>
                    <span className="w-4 text-center text-[15px] font-extrabold">{setup.turfs}</span>
                    <button type="button" className="px-2 text-[18px] font-bold" onClick={() => patchSetup(sport, { turfs: setup.turfs + 1 })}>+</button>
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-text-secondary">
                    Surface. Wooden and synthetic are the usual indoor floors. Artificial turf, natural grass, concrete, clay, acrylic, and rubber are the other surfaces.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SURFACES.map((surface) => (
                      <button
                        key={surface}
                        type="button"
                        onClick={() => patchSetup(sport, { surface })}
                        className={`rounded-full px-4 py-2 text-[13px] font-bold ${
                          setup.surface === surface ? "bg-text text-white" : "bg-surface-muted text-text"
                        }`}
                      >
                        {surface}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-[13px] font-semibold text-text">Indoor or outdoor</p>
                  <div className="mt-2 flex gap-2">
                    {(["Indoor", "Outdoor"] as const).map((setting) => (
                      <button
                        key={setting}
                        type="button"
                        onClick={() => patchSetup(sport, { setting })}
                        className={`rounded-full px-4 py-2 text-[13px] font-bold ${
                          setup.setting === setting ? "bg-text text-white" : "bg-surface-muted text-text"
                        }`}
                      >
                        {setting}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-[13px] font-semibold text-text">Rain cover</p>
                  <div className="mt-2 flex gap-2">
                    {(["Rainproof", "Open to rain"] as const).map((rain) => (
                      <button
                        key={rain}
                        type="button"
                        onClick={() => patchSetup(sport, { rain })}
                        className={`rounded-full px-4 py-2 text-[13px] font-bold ${
                          setup.rain === rain ? "bg-text text-white" : "bg-surface-muted text-text"
                        }`}
                      >
                        {rain}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-[13px] font-semibold text-text">Turf photo</p>
                  <PhotoDrop
                    label={setup.turfPhoto ? setup.turfPhoto.name : "Add turf photo"}
                    preview={setup.turfPhoto?.url}
                    onPick={async (file) => {
                      const photo = await readImage(file);
                      if (!photo) {
                        setError("Use an image under 5MB");
                        return;
                      }
                      patchSetup(sport, { turfPhoto: photo });
                    }}
                  />
                  <p className="mt-5 text-[15px] font-extrabold text-text">Equipment in {sport}</p>
                  <p className="mt-1 text-[13px] text-text-secondary">Rented with this sport, not tied to one turf. Photo is optional.</p>
                  <PhotoDrop
                    label={setup.equipment ? setup.equipment.name : "Add equipment"}
                    preview={setup.equipment?.url}
                    onPick={async (file) => {
                      const photo = await readImage(file);
                      if (!photo) {
                        setError("Use an image under 5MB");
                        return;
                      }
                      patchSetup(sport, { equipment: photo });
                    }}
                  />
                </section>
              );
            })}
          </div>
        ) : null}

        {step === 5 ? (
          <div className="space-y-6">
            <h1 className="text-[32px] font-extrabold tracking-tight text-text">Photos</h1>
            <div>
              <p className="text-[15px] font-extrabold text-text">Main images</p>
              <p className="mt-1 text-[13px] text-text-secondary">These are the large photos at the top of the venue page. Add up to 6.</p>
              <PhotoDrop
                label="Add main images"
                multiple
                onPickMany={async (files) => {
                  const next = [...mainPhotos];
                  for (const file of files) {
                    if (next.length >= 6) break;
                    const photo = await readImage(file);
                    if (photo) next.push(photo);
                  }
                  setMainPhotos(next);
                }}
              />
              <PhotoRow photos={mainPhotos} onRemove={(index) => setMainPhotos((prev) => prev.filter((_, i) => i !== index))} />
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-text">Gallery</p>
              <p className="mt-1 text-[13px] text-text-secondary">More photos of the venue, seating, and facilities. Up to 8. These show under amenities.</p>
              <PhotoDrop
                label="Add gallery photos"
                multiple
                onPickMany={async (files) => {
                  const next = [...gallery];
                  for (const file of files) {
                    if (next.length >= 8) break;
                    const photo = await readImage(file);
                    if (photo) next.push(photo);
                  }
                  setGallery(next);
                }}
              />
              <PhotoRow photos={gallery} onRemove={(index) => setGallery((prev) => prev.filter((_, i) => i !== index))} />
            </div>
          </div>
        ) : null}

        {step === 6 ? (
          <div>
            <h1 className="text-[32px] font-extrabold tracking-tight text-text">Amenities</h1>
            <p className="mt-2 text-[14px] text-text-secondary">Choose what players can use at the venue.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {AMENITIES.map((item) => {
                const on = draft.amenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      set(
                        "amenities",
                        on ? draft.amenities.filter((value) => value !== item) : [...draft.amenities, item],
                      )
                    }
                    className={`rounded-full px-4 py-2 text-[13px] font-bold ${on ? "bg-text text-white" : "bg-surface-muted text-text"}`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 7 ? (
          <div className="space-y-6">
            <h1 className="text-[32px] font-extrabold tracking-tight text-text">Hours</h1>
            <div className="rounded-[24px] bg-accent-soft p-5">
              <p className="text-[13px] font-semibold text-text-secondary">Players can book</p>
              <p className="mt-1 text-[28px] font-extrabold tracking-tight text-text">{rangeLabel}</p>
              <p className="mt-1 text-[13px] text-text-secondary">
                {formatHours(draft.openMin, draft.closeMin)} · {slotLabel} · ₹{draft.price}/hour
              </p>
            </div>
            <div>
              <p className="text-[14px] font-extrabold text-text">Quick hours</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_HOURS.map((item) => {
                  const on = draft.openMin === item.open && draft.closeMin === item.close;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, openMin: item.open, closeMin: item.close }))}
                      className={`rounded-full px-4 py-2 text-[13px] font-bold ${on ? "bg-accent text-white" : "bg-surface-muted text-text"}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TimeCard
                label="Opens"
                value={formatTime(draft.openMin)}
                onDec={() => set("openMin", Math.max(0, draft.openMin - 30))}
                onInc={() => set("openMin", Math.min(draft.closeMin - 30, draft.openMin + 30))}
              />
              <TimeCard
                label="Closes"
                value={formatTime(draft.closeMin)}
                onDec={() => set("closeMin", Math.max(draft.openMin + 30, draft.closeMin - 30))}
                onInc={() => set("closeMin", Math.min(24 * 60, draft.closeMin + 30))}
              />
            </div>
            <div>
              <p className="text-[14px] font-extrabold text-text">Slot length</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  { hours: 1, hint: "Most common" },
                  { hours: 2, hint: "Longer games" },
                  { hours: 3, hint: "Full session" },
                ].map((item) => (
                  <button
                    key={item.hours}
                    type="button"
                    onClick={() => set("slotHours", item.hours)}
                    className={`rounded-2xl px-4 py-4 text-left ${
                      draft.slotHours === item.hours ? "bg-accent text-white" : "bg-surface-muted text-text"
                    }`}
                  >
                    <span className="block text-[16px] font-extrabold">{item.hours} hr</span>
                    <span className={`mt-1 block text-[12px] ${draft.slotHours === item.hours ? "text-white/80" : "text-text-secondary"}`}>
                      {item.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[14px] font-extrabold text-text">Price per hour</p>
              <div className="mt-3 flex h-12 items-center rounded-xl border border-border bg-surface px-4">
                <span className="text-[16px] font-bold text-text">₹</span>
                <input
                  className="min-w-0 flex-1 bg-transparent px-2 text-[16px] font-bold text-text outline-none"
                  inputMode="numeric"
                  value={draft.price}
                  onChange={(e) => set("price", Number(e.target.value.replace(/\D/g, "")) || 0)}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRICE_PRESETS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => set("price", amount)}
                    className={`rounded-full px-4 py-2 text-[13px] font-bold ${
                      draft.price === amount ? "bg-accent text-white" : "bg-surface-muted text-text"
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Note">
              <textarea
                className="min-h-24 w-full rounded-xl border border-border bg-surface px-4 py-3 text-[14px] text-text outline-none focus:border-accent"
                placeholder="Optional. Peak hours, rules, or anything else we should know."
                value={draft.note}
                onChange={(e) => set("note", e.target.value)}
              />
            </Field>
          </div>
        ) : null}

        {step === 8 ? (
          <div className="space-y-5">
            <h1 className="text-[32px] font-extrabold tracking-tight text-text">Bank details</h1>
            <Field label="Account holder name">
              <input className={inputClass} placeholder="e.g. Vybe Entertainment Pvt Ltd" value={draft.accountName} onChange={(e) => set("accountName", e.target.value)} />
            </Field>
            <Field label="Account number">
              <input className={inputClass} placeholder="eg. 012345678901" value={draft.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} />
            </Field>
            <Field label="IFSC code">
              <input className={`${inputClass} uppercase`} placeholder="eg. HDFC0000001" value={draft.ifsc} onChange={(e) => set("ifsc", e.target.value.toUpperCase())} />
            </Field>
            <Field label="Account type">
              <select className={inputClass} value={draft.accountType} onChange={(e) => set("accountType", e.target.value)}>
                <option value="">Select account type</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
            </Field>
            <label className="flex items-start gap-3 text-[13px] leading-relaxed text-text-secondary">
              <input type="checkbox" className="mt-1" checked={draft.bankConfirmed} onChange={(e) => set("bankConfirmed", e.target.checked)} />
              I confirm that the bank details provided are accurate and the account is held by me or my organisation. I take responsibility for any incorrect information submitted.
            </label>
          </div>
        ) : null}

        {step === 9 ? (
          <div className="space-y-5">
            <h1 className="text-[32px] font-extrabold tracking-tight text-text">Review</h1>
            {mainPhotos.length || gallery.length ? (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {[...mainPhotos, ...gallery].map((photo) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={photo.url} src={photo.url} alt="" className="h-36 w-36 shrink-0 rounded-2xl object-cover" />
                ))}
              </div>
            ) : null}
            <section className="rounded-[24px] border border-border bg-surface p-5">
              <h2 className="text-[26px] font-extrabold text-text">{draft.venueName}</h2>
              <p className="mt-1 text-[14px] leading-relaxed text-text-secondary">
                {draft.city}
                {draft.line1 ? ` · ${draft.line1}` : ""}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-bold text-text">₹{draft.price}/hour</span>
                <span className="rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-bold text-text">{rangeLabel}</span>
                <span className="rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-bold text-text">{draft.slotHours}hr slots</span>
              </div>
              {draft.note ? <p className="mt-3 text-[13px] text-text-secondary">{draft.note}</p> : null}
            </section>
            <section className="rounded-[24px] border border-border bg-surface p-5">
              <p className="text-[12px] font-extrabold tracking-[0.14em] text-text-muted uppercase">Sports</p>
              <ul className="mt-3 space-y-3">
                {draft.sports.map((sport) => {
                  const setup = draft.setups[sport];
                  return (
                    <li key={sport} className="text-[14px] text-text">
                      <span className="font-extrabold">{sport}</span>
                      {setup ? (
                        <span className="text-text-secondary">
                          {" "}
                          · {setup.turfs} {setup.turfs === 1 ? "turf" : "turfs"} · {setup.surface} · {setup.setting} · {setup.rain}
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
            <section className="rounded-[24px] border border-border bg-surface p-5">
              <p className="text-[12px] font-extrabold tracking-[0.14em] text-text-muted uppercase">Amenities</p>
              <p className="mt-2 text-[14px] text-text">{draft.amenities.length ? draft.amenities.join(", ") : "None added"}</p>
            </section>
            <section className="rounded-[24px] border border-border bg-surface p-5">
              <p className="text-[12px] font-extrabold tracking-[0.14em] text-text-muted uppercase">Owner</p>
              <dl className="mt-3 space-y-2 text-[14px]">
                <div>
                  <dt className="text-text-muted">Name</dt>
                  <dd className="font-semibold text-text">{draft.ownerName}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Phone</dt>
                  <dd className="font-semibold text-text">+91 {draft.phone}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Email</dt>
                  <dd className="font-semibold text-text">{draft.email}</dd>
                </div>
              </dl>
            </section>
            <section className="rounded-[24px] border border-border bg-surface p-5">
              <p className="text-[12px] font-extrabold tracking-[0.14em] text-text-muted uppercase">Bank</p>
              <p className="mt-2 text-[14px] font-semibold text-text">{draft.accountName}</p>
              <p className="text-[14px] text-text-secondary">
                {draft.accountType} · {draft.ifsc} · ending {draft.accountNumber.slice(-4)}
              </p>
            </section>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-[13px] font-semibold text-accent">{error}</p> : null}

        <div className="mt-8 flex items-center gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep((value) => value - 1);
              }}
              className="h-12 rounded-full border border-border px-6 text-[15px] font-extrabold text-text"
            >
              Back
            </button>
          ) : null}
          {step < 9 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canContinue()}
              className="h-12 flex-1 rounded-full bg-[#111827] text-[15px] font-extrabold text-white disabled:bg-border disabled:text-text-muted"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSent(true)}
              className="h-12 flex-1 rounded-full bg-[#111827] text-[15px] font-extrabold text-white"
            >
              Send for review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TimeCard({ label, value, onDec, onInc }: { label: string; value: string; onDec: () => void; onInc: () => void }) {
  return (
    <div className="rounded-[22px] bg-surface-muted p-4 text-center">
      <p className="text-[13px] text-text-secondary">{label}</p>
      <p className="mt-1 text-[22px] font-extrabold text-text">{value}</p>
      <div className="mt-3 flex justify-center gap-3">
        <button type="button" onClick={onDec} className="flex size-9 items-center justify-center rounded-full bg-surface text-[18px] font-bold">−</button>
        <button type="button" onClick={onInc} className="flex size-9 items-center justify-center rounded-full bg-surface text-[18px] font-bold">+</button>
      </div>
    </div>
  );
}

function PhotoDrop({
  label,
  preview,
  multiple,
  onPick,
  onPickMany,
}: {
  label: string;
  preview?: string;
  multiple?: boolean;
  onPick?: (file: File) => void;
  onPickMany?: (files: File[]) => void;
}) {
  return (
    <label className="mt-3 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-muted px-4 py-6 text-center">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="mb-2 h-16 w-16 rounded-xl object-cover" />
      ) : (
        <span className="text-[22px] font-light text-text-muted">+</span>
      )}
      <span className="text-[14px] font-extrabold text-text">{label}</span>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];
          event.target.value = "";
          if (!files.length) return;
          if (onPickMany) onPickMany(files);
          else if (onPick) onPick(files[0]);
        }}
      />
    </label>
  );
}

function PhotoRow({ photos, onRemove }: { photos: Photo[]; onRemove: (index: number) => void }) {
  if (!photos.length) return null;
  return (
    <div className="mt-3 flex gap-2 overflow-x-auto">
      {photos.map((photo, index) => (
        <div key={`${photo.name}-${index}`} className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt="" className="h-20 w-20 rounded-xl object-cover" />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 rounded-full bg-text px-1.5 text-[11px] font-bold text-white"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
