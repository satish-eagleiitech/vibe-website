"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Search, ShoppingBag } from "lucide-react";
import { Container } from "@/components/common/Container";
import { findShowtime } from "@/lib/data/booking";
import { MOVIE_FNB_ITEMS } from "@/lib/data/movieFnB";
import { formatInr } from "@/lib/format";
import type { MovieDetails } from "@/types/movie";

type FoodBeveragesPanelProps = {
  movie: MovieDetails;
  theatreId: string;
  showId: string;
  dateIso: string;
  seatIds: string[];
  language?: string;
  ticketTotal: number;
};

export function FoodBeveragesPanel({
  movie,
  theatreId,
  showId,
  dateIso,
  seatIds,
  language,
  ticketTotal,
}: FoodBeveragesPanelProps) {
  const router = useRouter();
  const { theatre, show } = findShowtime(movie.id, theatreId, showId, dateIso);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOVIE_FNB_ITEMS;
    return MOVIE_FNB_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [query]);

  const foodTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MOVIE_FNB_ITEMS.find((entry) => entry.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  function setQty(id: string, next: number) {
    setCart((current) => {
      const copy = { ...current };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }

  function continueCheckout(skip = false) {
    const params = new URLSearchParams({
      theatre: theatreId,
      show: showId,
      date: dateIso,
      seats: seatIds.join(","),
    });
    if (language) params.set("lang", language);
    if (!skip) {
      const food = Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => `${id}:${qty}`)
        .join(",");
      if (food) params.set("food", food);
    }
    router.push(`/movies/${movie.id}/checkout?${params.toString()}`);
  }

  return (
    <div className="w-full pb-16">
      <div className="border-b border-border bg-surface">
        <Container className="flex items-center justify-between gap-3 py-3.5">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-extrabold text-text">
              {movie.title}
              {language ? ` (${language.charAt(0).toUpperCase()}${language.slice(1)})` : ""}
            </p>
            <p className="truncate text-[12px] text-text-secondary">
              {theatre?.name}
              {show ? ` · ${show.label}` : ""} · {dateIso}
            </p>
          </div>
          <button
            type="button"
            onClick={() => continueCheckout(true)}
            className="shrink-0 rounded-full bg-accent px-5 py-2 text-[13px] font-extrabold text-white"
          >
            Skip
          </button>
        </Container>
      </div>

      <Container className="pt-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section>
            <h1 className="text-[20px] font-extrabold text-text md:text-[22px]">
              Grab a Bite!
            </h1>
            <label className="relative mt-3 block">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for F&B items"
                className="w-full rounded-full border border-border bg-surface py-2.5 pr-4 pl-10 text-[13px] text-text outline-none focus:border-accent"
              />
            </label>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((item) => {
                const qty = cart[item.id] ?? 0;
                const off =
                  item.originalPrice && item.originalPrice > item.price
                    ? Math.round(
                        ((item.originalPrice - item.price) / item.originalPrice) *
                          100,
                      )
                    : 0;
                return (
                  <article
                    key={item.id}
                    className="flex overflow-hidden rounded-xl border border-border bg-surface"
                  >
                    <div className="relative h-[108px] w-[108px] shrink-0 bg-surface-muted sm:h-[116px] sm:w-[116px]">
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="116px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                      <div className="min-w-0">
                        <div className="flex items-start gap-1.5">
                          <span
                            aria-label={item.veg ? "Vegetarian" : "Non-vegetarian"}
                            className={`mt-0.5 inline-grid size-3.5 shrink-0 place-items-center rounded-[2px] border ${
                              item.veg
                                ? "border-emerald-600 text-emerald-600"
                                : "border-rose-600 text-rose-600"
                            }`}
                          >
                            <span className="size-1 rounded-full bg-current" />
                          </span>
                          <div className="min-w-0">
                            <h2 className="truncate text-[13px] font-extrabold text-text sm:text-[14px]">
                              {item.name}
                            </h2>
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-text-secondary">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-end justify-between gap-2">
                        <div>
                          <p className="text-[14px] font-extrabold text-text">
                            {formatInr(item.price)}
                          </p>
                          {off ? (
                            <p className="text-[10px] font-bold text-emerald-600">
                              <span className="mr-1 text-text-muted line-through">
                                {formatInr(item.originalPrice!)}
                              </span>
                              {off}% OFF
                            </p>
                          ) : null}
                        </div>
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => setQty(item.id, 1)}
                            className="rounded-lg border border-accent px-3 py-1 text-[12px] font-extrabold text-accent"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 rounded-lg border border-accent px-1.5 py-0.5 text-accent">
                            <button
                              type="button"
                              aria-label="Decrease"
                              onClick={() => setQty(item.id, qty - 1)}
                              className="grid size-6 place-items-center"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="min-w-3 text-center text-[12px] font-extrabold">
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase"
                              onClick={() => setQty(item.id, qty + 1)}
                              className="grid size-6 place-items-center"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="mt-6 text-[11px] leading-relaxed text-text-muted">
              Images are indicative. Prices include taxes where applicable.
              Collect pre-booked food from the cinema F&B counter.
            </p>
          </section>

          <aside className="h-fit rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-[calc(var(--vybe-header-h)+16px)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-extrabold text-text">Your Cart</h2>
              <ShoppingBag className="size-4 text-text-muted" />
            </div>
            <div className="mt-4 flex justify-between text-[14px] text-text-secondary">
              <span>Ticket(s) price</span>
              <span className="font-semibold text-text">
                {formatInr(ticketTotal)}
              </span>
            </div>

            {foodTotal === 0 ? (
              <div className="mt-8 text-center">
                <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full bg-accent-soft">
                  <Image
                    src="/images/movies/fnb/popcorn-fries.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-90"
                    sizes="80px"
                  />
                </div>
                <p className="mt-4 text-[13px] font-semibold text-text-secondary">
                  Fill this cart with your favorite food combos!
                </p>
              </div>
            ) : (
              <ul className="mt-4 space-y-3 border-t border-border pt-4">
                {Object.entries(cart).map(([id, qty]) => {
                  const item = MOVIE_FNB_ITEMS.find((entry) => entry.id === id);
                  if (!item) return null;
                  return (
                    <li
                      key={id}
                      className="flex items-start justify-between gap-3 text-[13px]"
                    >
                      <span className="text-text-secondary">
                        {item.name} × {qty}
                      </span>
                      <span className="font-semibold text-text">
                        {formatInr(item.price * qty)}
                      </span>
                    </li>
                  );
                })}
                <li className="flex justify-between border-t border-border pt-3 text-[14px] font-extrabold text-text">
                  <span>Food total</span>
                  <span>{formatInr(foodTotal)}</span>
                </li>
              </ul>
            )}

            <button
              type="button"
              onClick={() => continueCheckout(false)}
              className="mt-6 w-full rounded-full bg-accent py-3.5 text-[14px] font-extrabold text-white transition-transform hover:scale-[1.01]"
            >
              Continue {formatInr(ticketTotal + foodTotal)}
            </button>
            <Link
              href={`/movies/${movie.id}/seats?theatre=${theatreId}&show=${showId}&date=${dateIso}${language ? `&lang=${language}` : ""}`}
              className="mt-3 block text-center text-sm font-semibold text-text-secondary hover:text-accent"
            >
              Edit seats
            </Link>
          </aside>
        </div>
      </Container>
    </div>
  );
}
