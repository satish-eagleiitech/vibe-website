"use client";

import { useEffect, useState } from "react";
import { Gift, Hand, Ticket } from "lucide-react";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { ScratchCard } from "@/components/rewards/ScratchCard";
import {
  readRevealed,
  revealCard,
  SCRATCH_CARDS,
  SCRATCH_EVENT,
} from "@/lib/rewards/scratch";

export function RewardsView() {
  const [revealed, setRevealed] = useState<string[] | null>(null);

  useEffect(() => {
    const refresh = () => setRevealed(readRevealed());
    refresh();
    window.addEventListener(SCRATCH_EVENT, refresh);
    return () => window.removeEventListener(SCRATCH_EVENT, refresh);
  }, []);

  const done = new Set(revealed ?? []);
  const fresh = SCRATCH_CARDS.filter((card) => !done.has(card.id));
  const scratched = SCRATCH_CARDS.filter((card) => done.has(card.id));
  const won = scratched.filter((card) => card.code).length;

  return (
    <div>
      <AccountPageHeader
        title="Rewards"
        subtitle="Scratch your cards to reveal offers on movies, events and more"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-[20px] bg-accent p-4 text-white shadow-[0_12px_28px_rgba(255,0,91,0.25)]">
          <Gift className="size-8 shrink-0 text-white/85" />
          <div>
            <p className="text-[22px] leading-none font-extrabold">{revealed ? fresh.length : "–"}</p>
            <p className="mt-1 text-[12px] font-semibold text-white/80">Cards to scratch</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[20px] bg-sidebar p-4 text-white">
          <Ticket className="size-8 shrink-0 text-accent" />
          <div>
            <p className="text-[22px] leading-none font-extrabold">{revealed ? won : "–"}</p>
            <p className="mt-1 text-[12px] font-semibold text-white/70">Offers won</p>
          </div>
        </div>
        <div className="col-span-2 flex items-center gap-3 rounded-[20px] border border-border bg-surface p-4 sm:col-span-1">
          <Hand className="size-8 shrink-0 text-accent" />
          <p className="text-[12px] leading-snug font-semibold text-text-secondary">
            Drag your finger or mouse across a card to scratch it.
          </p>
        </div>
      </div>

      {revealed === null ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[230px] animate-pulse rounded-[22px] bg-surface sm:h-[250px]" />
          ))}
        </div>
      ) : (
        <>
          {fresh.length > 0 ? (
            <section className="mt-6">
              <h2 className="mb-3 text-[17px] font-extrabold text-text">New cards</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
                {fresh.map((card) => (
                  <ScratchCard
                    key={card.id}
                    card={card}
                    revealed={false}
                    onReveal={() => revealCard(card.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {scratched.length > 0 ? (
            <section className="mt-6">
              <h2 className="mb-3 text-[17px] font-extrabold text-text">Scratched</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
                {scratched.map((card) => (
                  <ScratchCard key={card.id} card={card} revealed onReveal={() => {}} />
                ))}
              </div>
            </section>
          ) : null}

          <p className="mt-6 rounded-2xl bg-surface-muted px-4 py-3 text-center text-[12px] font-semibold text-text-secondary">
            Every booking on VYBE unlocks a new scratch card.
          </p>
        </>
      )}
    </div>
  );
}
