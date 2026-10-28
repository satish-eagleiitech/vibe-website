"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginGate } from "@/components/auth/useLoginGate";
import { eventSections } from "@/lib/events/sections";
import { formatInr } from "@/lib/format";
import type { LiveEvent } from "@/types/event";

type BookEventTicketsProps = {
  event: LiveEvent;
};

export function BookEventTickets({ event }: BookEventTicketsProps) {
  const router = useRouter();
  const { gate, modal } = useLoginGate();
  const sections = useMemo(() => eventSections(event.startingPrice), [event.startingPrice]);
  const [sectionId, setSectionId] = useState("");
  const [qty, setQty] = useState(2);
  const [sort, setSort] = useState<"low" | "high">("low");
  const listed = [...sections].sort((a, b) => (sort === "low" ? a.price - b.price : b.price - a.price));
  const active = sections.find((section) => section.id === sectionId);

  function go() {
    const params = new URLSearchParams({
      date: `${event.month} ${event.day}`,
      time: "6:00 – 10:00 PM",
      tier: sectionId,
      qty: String(qty),
    });
    gate(() => router.push(`/events/${event.id}/checkout?${params.toString()}`));
  }

  function proceed() {
    if (!sectionId) return;
    go();
  }

  return (
    <div className="w-full">
      {modal}
      <div className="bg-[#e7f8ef] px-4 py-2.5 text-center text-[13px] font-semibold text-[#1c7a45]">
        Pay only 50% to reserve your booking
      </div>
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <SeatMap sections={sections} activeId={sectionId} onPick={setSectionId} />
        <aside>
          <h1 className="text-[28px] font-extrabold tracking-tight text-text">Choose your section</h1>
          <div className="mt-4 flex gap-2">
            <select
              aria-label="Tickets"
              value={qty}
              onChange={(event) => setQty(Number(event.target.value))}
              className="h-10 rounded-full bg-text px-4 text-[13px] font-extrabold text-bg"
            >
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count} ticket{count > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <select
              aria-label="Sort by price"
              value={sort}
              onChange={(event) => setSort(event.target.value as "low" | "high")}
              className="h-10 rounded-full border border-border bg-surface px-4 text-[13px] font-extrabold text-text"
            >
              <option value="low">₹ Price · Low to high</option>
              <option value="high">₹ Price · High to low</option>
            </select>
          </div>
          <p className="mt-6 text-[12px] font-extrabold tracking-[0.14em] text-text-muted">
            {sections.length} SECTIONS LIVE
          </p>
          <div className="mt-2 divide-y divide-border">
            {listed.map((section) => {
              const activeRow = section.id === sectionId;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setSectionId(section.id)}
                  className={`flex w-full items-center justify-between py-4 text-left ${activeRow ? "text-accent" : "text-text"}`}
                >
                  <span className="text-[16px] font-semibold">{section.name}</span>
                  <span className="text-[16px] font-semibold">{formatInr(section.price)}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={!active}
            onClick={proceed}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-text text-[15px] font-extrabold text-bg disabled:opacity-40"
          >
            {active ? `Continue with ${active.name}` : "Select a section"}
          </button>
        </aside>
      </div>
    </div>
  );
}

function SeatMap({
  sections,
  activeId,
  onPick,
}: {
  sections: ReturnType<typeof eventSections>;
  activeId: string;
  onPick: (id: string) => void;
}) {
  const tone = (id: string) => sections.find((section) => section.id === id)?.tone ?? "#eee";
  const ring = (id: string) => (id === activeId ? "ring-2 ring-text ring-offset-2" : "");

  return (
    <div className="mx-auto w-full max-w-[560px] py-4">
      <div className="mx-auto w-28 rounded-t-xl bg-surface-muted py-2 text-center text-[11px] font-extrabold tracking-wide text-text-secondary">
        STAGE
      </div>
      <div className="mt-4 flex items-start justify-between gap-8 px-6">
        <Block id="fanpit" label="FANPIT" tone={tone("fanpit")} ring={ring("fanpit")} onPick={onPick} className="h-16 w-24" />
        <Block id="fanpit" label="FANPIT" tone={tone("fanpit")} ring={ring("fanpit")} onPick={onPick} className="h-16 w-24" />
      </div>
      <Block
        id="solitaire"
        label="SOLITAIRE"
        tone={tone("solitaire")}
        ring={ring("solitaire")}
        onPick={onPick}
        className="mx-auto mt-3 h-14 w-40"
      />
      <Block
        id="platinum"
        label="PLATINUM"
        tone={tone("platinum")}
        ring={ring("platinum")}
        onPick={onPick}
        className="mx-auto mt-3 h-16 w-[78%]"
      />
      <Block id="gold" label="GOLD" tone={tone("gold")} ring={ring("gold")} onPick={onPick} className="mx-auto mt-3 h-16 w-[86%]" />
      <button
        type="button"
        onClick={() => onPick("silver")}
        className={`relative mx-auto mt-3 block h-28 w-full overflow-hidden ${ring("silver")}`}
        style={{
          background: tone("silver"),
          borderRadius: "0 0 220px 220px",
          clipPath: "polygon(0 0, 100% 0, 92% 100%, 8% 100%)",
        }}
      >
        <span className="absolute inset-x-0 top-3 text-center text-[12px] font-extrabold tracking-wide text-text">SILVER</span>
      </button>
      <div className="mt-6 flex justify-center gap-6 text-[12px] text-text-secondary">
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#7aa2ff]" /> Available
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-full bg-surface-muted" /> Sold out
        </span>
      </div>
    </div>
  );
}

function Block({
  id,
  label,
  tone,
  ring,
  onPick,
  className,
}: {
  id: string;
  label: string;
  tone: string;
  ring: string;
  onPick: (id: string) => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(id)}
      className={`rounded-xl text-[11px] font-extrabold tracking-wide text-text ${className} ${ring}`}
      style={{ background: tone }}
    >
      {label}
    </button>
  );
}
