"use client";

import { useEffect, useMemo, useState } from "react";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { RewardPromoCards } from "@/components/rewards/RewardPromoCards";
import { ScratchCard } from "@/components/rewards/ScratchCard";
import { PROFILE_REWARD_PROMOS } from "@/lib/data/profileRewardPromos";
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

  const promoCards = useMemo(() => {
    const [scratch, offers, howTo] = PROFILE_REWARD_PROMOS;
    const ready = revealed !== null;
    return [
      {
        ...scratch,
        href: "",
        title: ready ? `${fresh.length} cards to scratch` : "Cards to scratch",
        subtitle: "Reveal offers on movies, events and play",
      },
      {
        ...offers,
        href: "",
        title: ready ? `${won} offers won` : "Offers won",
        subtitle: "Keep booking to unlock more rewards",
      },
      {
        ...howTo,
        href: "",
        title: "Scratch to reveal",
        subtitle: "Drag your finger or mouse across a card below",
      },
    ];
  }, [fresh.length, won, revealed]);

  return (
    <div>
      <AccountPageHeader
        title="Rewards"
        subtitle="Scratch your cards to reveal offers on movies, events and more"
      />

      <RewardPromoCards promos={promoCards} />

      {revealed === null ? (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[230px] animate-pulse rounded-[22px] bg-surface sm:h-[250px]" />
          ))}
        </div>
      ) : (
        <>
          {fresh.length > 0 ? (
            <section className="mt-6" id="new-cards">
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
