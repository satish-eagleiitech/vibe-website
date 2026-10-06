"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/common/Container";
import { getBookingDates } from "@/lib/data/booking";
import { formatInr } from "@/lib/format";
import type { LiveEvent } from "@/types/event";

type BookEventTicketsProps = {
  event: LiveEvent;
};

type TicketTier = {
  id: string;
  name: string;
  description: string;
  price: number;
};

function buildTiers(base: number): TicketTier[] {
  return [
    {
      id: "general",
      name: "General admission",
      description: "Standing / standard seating",
      price: base,
    },
    {
      id: "premium",
      name: "Premium",
      description: "Reserved zone · faster entry",
      price: Math.round(base * 1.6),
    },
    {
      id: "vip",
      name: "VIP",
      description: "Front access · lounge perk",
      price: Math.round(base * 2.4),
    },
  ];
}

export function BookEventTickets({ event }: BookEventTicketsProps) {
  const router = useRouter();
  const [dates, setDates] = useState<ReturnType<typeof getBookingDates>>([]);
  const tiers = useMemo(
    () => buildTiers(event.startingPrice),
    [event.startingPrice],
  );
  const [dateIso, setDateIso] = useState("");
  const [tierId, setTierId] = useState(tiers[0]?.id ?? "general");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const next = getBookingDates(5);
    setDates(next);
    setDateIso((current) => current || next[0]?.iso || "");
  }, []);

  const activeTier = tiers.find((tier) => tier.id === tierId) ?? tiers[0];
  const total = (activeTier?.price ?? 0) * qty;
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  const monthLabel = dates[0]?.month ?? "";

  function proceed() {
    const params = new URLSearchParams({
      date: dateIso,
      tier: tierId,
      qty: String(qty),
    });
    router.push(`/events/${event.id}/checkout?${params.toString()}`);
  }

  return (
    <div className="w-full pb-20">
      <section className="border-b border-border bg-surface">
        <Container className="flex items-center gap-4 py-5 md:gap-5 md:py-6">
          <div className="relative aspect-[2/3] w-[72px] shrink-0 overflow-hidden rounded-xl bg-surface-muted md:w-[88px]">
            <Image
              src={event.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="88px"
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[22px] font-extrabold text-text md:text-[28px]">
              {event.title}
            </h1>
            <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-text-secondary md:text-[14px]">
              <MapPin className="size-3.5 shrink-0" />
              {place || "Venue TBA"}
            </p>
            <p className="mt-1 text-[13px] text-text-muted">{event.category}</p>
          </div>
        </Container>
      </section>

      <div className="sticky top-(--vybe-header-h) z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
        <Container className="py-3">
          <div className="flex items-stretch gap-3 overflow-x-auto hide-scrollbar">
            <div className="flex w-10 shrink-0 items-center justify-center text-[12px] font-extrabold tracking-widest text-text-secondary [writing-mode:vertical-rl] rotate-180">
              {monthLabel}
            </div>
            {dates.map((date) => {
              const active = date.iso === dateIso;
              return (
                <button
                  key={date.iso}
                  type="button"
                  onClick={() => setDateIso(date.iso)}
                  className={`flex h-[64px] w-[58px] shrink-0 flex-col items-center justify-center rounded-xl border text-center transition-colors ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface text-text hover:border-accent/40"
                  }`}
                >
                  <span className="text-[18px] font-extrabold leading-none">
                    {date.day}
                  </span>
                  <span className="mt-1 text-[11px] font-semibold">
                    {date.weekday}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="pt-6">
        <div className="mb-5 rounded-xl bg-accent-soft px-4 py-3 text-[13px] font-semibold text-accent">
          Pick a date and ticket type. Instant confirmation on VYBE.
        </div>

        <h2 className="text-[18px] font-extrabold text-text md:text-[20px]">
          Select tickets
        </h2>
        <div className="mt-4 space-y-3">
          {tiers.map((tier) => {
            const active = tier.id === tierId;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setTierId(tier.id)}
                className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition-colors ${
                  active
                    ? "border-accent bg-accent-soft"
                    : "border-border bg-surface hover:border-accent/40"
                }`}
              >
                <div>
                  <p className="text-[15px] font-extrabold text-text">
                    {tier.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-text-secondary">
                    {tier.description}
                  </p>
                </div>
                <p className="shrink-0 text-[15px] font-extrabold text-text">
                  {formatInr(tier.price)}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-4">
          <div>
            <p className="text-[15px] font-extrabold text-text">Quantity</p>
            <p className="text-[13px] text-text-secondary">Max 8 tickets</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={qty <= 1}
              onClick={() => setQty((n) => Math.max(1, n - 1))}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-bg text-text disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-6 text-center text-[16px] font-extrabold text-text">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={qty >= 8}
              onClick={() => setQty((n) => Math.min(8, n + 1))}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-bg text-text disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <div>
            <p className="text-[12px] text-text-secondary">
              {qty} × {activeTier?.name}
            </p>
            <p className="text-[18px] font-extrabold text-text">
              {formatInr(total)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/events/${event.id}`}
              className="hidden rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text sm:inline-flex"
            >
              Back
            </Link>
            <button
              type="button"
              onClick={proceed}
              className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Proceed
            </button>
          </div>
        </Container>
      </div>
    </div>
  );
}
