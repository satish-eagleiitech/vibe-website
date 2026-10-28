"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AddressPicker } from "@/components/list-events/AddressPicker";
import { AgreementReview } from "@/components/list-events/AgreementReview";
import { SignaturePad } from "@/components/list-events/SignaturePad";
import { readProfile } from "@/lib/profile/storage";

const STEPS = [
  "Create profile",
  "PAN details",
  "GST details",
  "Address details",
  "Bank details",
  "Agreement",
] as const;

type Draft = {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  pan: string;
  panName: string;
  panFileName: string;
  hasGst: boolean;
  gstin: string;
  mapQuery: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  accountType: string;
  bankConfirmed: boolean;
  signature: string;
};

const EMPTY: Draft = {
  firstName: "",
  lastName: "",
  email: "",
  emailVerified: false,
  displayName: "",
  pan: "",
  panName: "",
  panFileName: "",
  hasGst: false,
  gstin: "",
  mapQuery: "Kukatpally",
  line1: "",
  line2: "",
  city: "Hyderabad",
  state: "Telangana",
  pincode: "",
  lat: 17.4849,
  lng: 78.4138,
  accountName: "",
  accountNumber: "",
  ifsc: "",
  accountType: "",
  bankConfirmed: false,
  signature: "",
};

const STORAGE_KEY = "vybe-organiser-draft";

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-[14px] font-medium text-text outline-none placeholder:text-text-muted focus:border-accent";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-text">{label}</span>
      {children}
    </label>
  );
}

export function OrganiserForm() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setDraft({ ...EMPTY, ...JSON.parse(saved) });
    } catch {
      /* ignore broken drafts */
    }
    setPhone(readProfile().phone);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, ready]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function verifyEmail() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      setError("Enter a valid email to verify");
      return;
    }
    set("emailVerified", true);
  }

  function next() {
    if (step === 1) {
      if (!draft.firstName.trim() || !draft.lastName.trim()) {
        setError("First and last name are required");
        return;
      }
      if (!draft.emailVerified) {
        setError("Verify your email to continue");
        return;
      }
    }
    if (step === 2) {
      if (!draft.displayName.trim() || !draft.panName.trim()) {
        setError("Display name and legal name are required");
        return;
      }
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(draft.pan.trim())) {
        setError("Enter a valid PAN");
        return;
      }
      if (!draft.panFileName) {
        setError("Upload your PAN document");
        return;
      }
    }
    if (step === 3 && draft.hasGst && draft.gstin.trim().length < 15) {
      setError("Enter a 15-character GSTIN");
      return;
    }
    if (step === 4 && (!draft.line1.trim() || !draft.city.trim() || !/^\d{6}$/.test(draft.pincode))) {
      setError("Address line 1, city and a 6-digit pincode are required");
      return;
    }
    if (step === 5) {
      if (!draft.accountName.trim() || !draft.accountNumber.trim() || !draft.ifsc.trim()) {
        setError("Account name, number and IFSC are required");
        return;
      }
      if (!draft.accountType) {
        setError("Select an account type");
        return;
      }
      if (!draft.bankConfirmed) {
        setError("Confirm the bank details to continue");
        return;
      }
    }
    setStep((value) => Math.min(6, value + 1));
  }

  const organiserName = `${draft.firstName} ${draft.lastName}`.trim();

  if (done) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-12 md:py-16">
        <p className="text-[12px] font-extrabold tracking-[0.16em] text-accent uppercase">Creator home</p>
        <h1 className="mt-4 text-[36px] font-extrabold tracking-tight text-text">Under review</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
          Your registration is under review. Once approved, you’ll get the full VYBE Publisher desk.
        </p>
        <div className="mt-6 rounded-[22px] border border-border bg-surface p-5">
          <p className="text-[12px] font-semibold text-text-muted">Organiser</p>
          <p className="mt-1 text-[20px] font-extrabold text-text">{organiserName || draft.displayName}</p>
          <p className="mt-1 text-[14px] text-text-secondary">{draft.email}</p>
          <p className="mt-3 text-[14px] font-extrabold text-accent">Status: Pending Review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[240px_minmax(0,720px)] md:px-8 md:py-12">
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
                    ? "-ml-0 font-extrabold text-text md:-ml-[2px] md:border-text"
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
      {step > 1 && step < 6 ? (
        <button
          type="button"
          onClick={() => setStep((value) => value - 1)}
          className="mb-4 text-[13px] font-bold text-text-secondary"
        >
          Back
        </button>
      ) : null}

      {step === 1 ? (
        <div className="space-y-5">
          <h1 className="text-[30px] font-extrabold tracking-tight text-text">Create your user profile</h1>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <input className={inputClass} placeholder="e.g. Rahul" value={draft.firstName} onChange={(e) => set("firstName", e.target.value)} />
            </Field>
            <Field label="Last name">
              <input className={inputClass} placeholder="e.g. Sharma" value={draft.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </Field>
          </div>
          <Field label="Email">
            <div className="flex gap-3">
              <input
                className={inputClass}
                placeholder="eg. you@example.com"
                value={draft.email}
                onChange={(e) => {
                  set("email", e.target.value);
                  set("emailVerified", false);
                }}
              />
              <button
                type="button"
                onClick={verifyEmail}
                className={`h-12 shrink-0 rounded-xl px-5 text-[14px] font-bold ${
                  draft.emailVerified ? "bg-accent text-white" : "bg-surface-muted text-text-secondary"
                }`}
              >
                {draft.emailVerified ? "Verified" : "Verify"}
              </button>
            </div>
          </Field>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-5">
          <p className="text-[13px] font-semibold text-text-secondary">Set up your VYBE account</p>
          <h1 className="text-[30px] font-extrabold tracking-tight text-text">PAN details</h1>
          <Field label="Organiser display name">
            <input className={inputClass} placeholder="OneAD Communication Pvt. Ltd." value={draft.displayName} onChange={(e) => set("displayName", e.target.value)} />
          </Field>
          <Field label="PAN number">
            <input className={`${inputClass} uppercase`} placeholder="ABCDE1234F" value={draft.pan} onChange={(e) => set("pan", e.target.value.toUpperCase())} />
          </Field>
          <Field label="Legal name on PAN">
            <input className={inputClass} placeholder="Eternal Ltd." value={draft.panName} onChange={(e) => set("panName", e.target.value)} />
          </Field>
          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-text">PAN card document</p>
            <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface text-center">
              <span className="text-[14px] font-extrabold text-accent">
                {draft.panFileName || "Upload document"}
              </span>
              <span className="mt-1 text-[12px] text-text-muted">Up to 5MB · JPEG, JPG, PNG or PDF</span>
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    setError("Keep the file under 5MB");
                    return;
                  }
                  set("panFileName", file.name);
                }}
              />
            </label>
            <ul className="mt-4 space-y-2 text-[12px] text-text-secondary">
              <li><span className="font-extrabold text-accent">PDF</span> — single-page scan, not password-protected.</li>
              <li><span className="font-extrabold text-accent">Photo</span> — flat surface, even light, all 4 corners visible.</li>
              <li><span className="font-extrabold text-accent">Personal PAN</span> for an individual creator. <span className="font-extrabold text-accent">Business PAN</span> for a registered company.</li>
            </ul>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-5">
          <h1 className="text-[30px] font-extrabold tracking-tight text-text">GST details</h1>
          <p className="text-[14px] text-text-secondary">
            Add GST if you are registered. You can list without it and update later.
          </p>
          <label className="flex items-center gap-2 text-[14px] font-semibold text-text">
            <input type="checkbox" checked={draft.hasGst} onChange={(e) => set("hasGst", e.target.checked)} />
            I have a GSTIN
          </label>
          {draft.hasGst ? (
            <Field label="GSTIN">
              <input className={`${inputClass} uppercase`} value={draft.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} />
            </Field>
          ) : null}
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-4">
          <h1 className="text-[30px] font-extrabold tracking-tight text-text">Address details</h1>
          <AddressPicker
            query={draft.mapQuery}
            lat={draft.lat}
            lng={draft.lng}
            onQuery={(value) => set("mapQuery", value)}
            onResolved={(place) => {
              setDraft((prev) => ({
                ...prev,
                line1: place.line1,
                city: place.city,
                state: place.state,
                pincode: place.pincode || prev.pincode,
                lat: place.lat,
                lng: place.lng,
              }));
              setError("");
            }}
          />
          <Field label="Address line 1">
            <input className={inputClass} value={draft.line1} onChange={(e) => set("line1", e.target.value)} />
          </Field>
          <Field label="Address line 2">
            <input className={inputClass} placeholder="Landmark (optional)" value={draft.line2} onChange={(e) => set("line2", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City">
              <input className={inputClass} value={draft.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="State">
              <input className={inputClass} value={draft.state} onChange={(e) => set("state", e.target.value)} />
            </Field>
          </div>
          <Field label="Pincode">
            <input className={inputClass} inputMode="numeric" value={draft.pincode} onChange={(e) => set("pincode", e.target.value)} />
          </Field>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="space-y-5">
          <p className="text-[13px] font-semibold text-text-muted">Address added</p>
          <h1 className="text-[30px] font-extrabold tracking-tight text-text">Bank details</h1>
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

      {step === 6 ? (
        <div className="space-y-4">
          <p className="text-[13px] font-semibold text-text-muted">1 bank account added</p>
          <h1 className="text-[30px] font-extrabold tracking-tight text-text">Sign your agreement</h1>
          <p className="max-w-lg text-[14px] leading-relaxed text-text-secondary">
            Review and sign your publisher agreement to activate your VYBE account. Read it fully before signing — you’ll be taken to the agreement on this page.
          </p>
          <button
            type="button"
            onClick={() => setAgreementOpen(true)}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#111827] px-5 text-[14px] font-extrabold text-white"
          >
            Sign agreement
          </button>
          {draft.signature ? (
            <p className="text-[13px] font-semibold text-emerald-600">Signature saved. Open the agreement to submit.</p>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="mt-4 text-[13px] font-semibold text-accent">{error}</p> : null}

      {step < 6 ? (
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={next}
            className="h-12 flex-1 rounded-full bg-[#111827] text-[15px] font-extrabold text-white"
          >
            Continue
          </button>
        </div>
      ) : (
        <p className="mt-10 text-[12px] text-text-muted">
          {phone ? `Signed in with ${phone}` : "Signed in on this device"} · Version v1.0.0
        </p>
      )}

      </div>

      {agreementOpen ? (
        <AgreementReview
          organiserName={organiserName}
          email={draft.email}
          signature={draft.signature}
          onClose={() => setAgreementOpen(false)}
          onCreateSignature={() => setSignOpen(true)}
          onSubmit={() => {
            setAgreementOpen(false);
            setDone(true);
          }}
        />
      ) : null}

      {signOpen ? (
        <SignaturePad
          onClose={() => setSignOpen(false)}
          onSave={(dataUrl) => {
            set("signature", dataUrl);
            setSignOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
