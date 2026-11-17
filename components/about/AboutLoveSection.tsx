"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";

const testimonials = [
  {
    quote:
      "Booked movie seats and a play slot on VYBE the same evening. Both QRs scanned fine at entry.",
    name: "Ananya Reddy",
    role: "Product designer · Hyderabad",
    image: "/images/about/about-avatar-ananya.jpg",
  },
  {
    quote:
      "Comedy nights, parks and movies used to mean three different sites. On VYBE I browse and pay in one place.",
    name: "Karthik Mehta",
    role: "Founder · Bengaluru",
    image: "/images/about/about-avatar-karthik.jpg",
  },
  {
    quote:
      "Cancelled a play booking from the ticket page. The refund followed VYBE’s policy and landed on my UPI.",
    name: "Meera Sharma",
    role: "Marketing lead · Mumbai",
    image: "/images/about/about-avatar-meera.jpg",
  },
  {
    quote:
      "Booked an activity and a concert on VYBE. Both tickets stayed under Profile with directions ready.",
    name: "Rohan Iyer",
    role: "Student · Chennai",
    image: "/images/about/about-avatar-rohan.jpg",
  },
];

export function AboutLoveSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: -1 | 1) {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>("[data-love-card]");
    const amount = (card?.offsetWidth ?? 300) + 20;
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <section className="mt-12 bg-[#F4F0E8] py-12 dark:bg-[#16161a] md:mt-16 md:py-16">
      <Container>
        <div className="mb-14 md:mb-16">
          <div data-about-reveal className="mx-auto mb-8 max-w-[640px] text-center">
            <span className="inline-flex rounded-full border border-[#D4AF37]/35 bg-surface px-3.5 py-1 text-[11px] font-extrabold tracking-[0.16em] text-[#8a6d1f] uppercase shadow-sm dark:text-[#E8D59A]">
              People love the VYBE
            </span>
            <h2 className="mt-4 text-[28px] font-extrabold tracking-tight text-text md:text-[36px]">
              Why people book on VYBE
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-text-secondary md:text-[15px]">
              Clear booking flows and city-first listings for movies, events, activities
              and play — all in one VYBE account.
            </p>
          </div>

          <div
            data-about-stagger
            className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[minmax(220px,1fr)_minmax(220px,1fr)] lg:gap-5"
          >
            <article
              data-about-item
              className="flex flex-col overflow-hidden rounded-[28px] bg-surface shadow-[0_18px_50px_-28px_rgba(15,15,20,0.45)] ring-1 ring-[#D4AF37]/15 lg:col-span-4 lg:row-span-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden lg:min-h-0 lg:flex-1 lg:aspect-auto">
                <Image
                  src="/images/about/lux-love-bowling.jpg"
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-col p-6 md:p-7">
                <p className="text-[15px] leading-relaxed text-text-secondary md:text-[16px]">
                  Book showtimes, event passes and hourly play slots on VYBE — your
                  tickets stay under Profile with a ready QR.
                </p>
                <Link
                  href="/movies"
                  className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#111] px-5 py-2.5 text-[13px] font-extrabold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-[#111]"
                >
                  Explore plans
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>

            <article
              data-about-item
              className="relative min-h-[220px] overflow-hidden rounded-[28px] shadow-[0_18px_50px_-28px_rgba(15,15,20,0.45)] lg:col-span-5"
            >
              <Image
                src="/images/about/vybe-friends-event.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <p className="max-w-[22ch] text-[22px] leading-snug font-extrabold text-white md:text-[26px]">
                  Trusted by{" "}
                  <span className="font-[family-name:var(--font-fraunces)] font-semibold italic">
                    VYBE users across India.
                  </span>
                </p>
              </div>
            </article>

            <article
              data-about-item
              className="relative min-h-[220px] overflow-hidden rounded-[28px] shadow-[0_18px_50px_-28px_rgba(15,15,20,0.45)] lg:col-span-3"
            >
              <Image
                src="/images/about/lux-love-court.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/35 to-transparent" />
              <div className="relative flex h-full min-h-[220px] flex-col justify-end p-5 text-white md:p-6">
                <p className="text-[42px] leading-none font-extrabold md:text-[48px]">4×</p>
                <p className="mt-2 text-[13px] leading-snug font-semibold text-white/80">
                  categories in one booking home — movies, events, activities & play
                </p>
              </div>
            </article>

            <article
              data-about-item
              className="flex min-h-[220px] items-end rounded-[28px] bg-surface p-6 shadow-[0_18px_50px_-28px_rgba(15,15,20,0.45)] ring-1 ring-[#D4AF37]/15 md:p-8 lg:col-span-5"
            >
              <p className="max-w-[28ch] text-[22px] leading-snug font-extrabold tracking-tight text-text md:text-[26px]">
                Turns browsing into{" "}
                <span className="font-[family-name:var(--font-fraunces)] font-semibold text-accent italic">
                  confirmed VYBE tickets
                </span>{" "}
                for movies, events, activities and play.
              </p>
            </article>

            <article
              data-about-item
              className="relative min-h-[240px] overflow-hidden rounded-[28px] shadow-[0_18px_50px_-28px_rgba(15,15,20,0.45)] lg:col-span-3"
            >
              <Image
                src="/images/about/vybe-booking-desk.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
            </article>
          </div>
        </div>

        <div data-about-reveal>
          <div className="mx-auto mb-8 max-w-[640px] text-center">
            <span className="inline-flex rounded-full border border-[#D4AF37]/35 bg-surface px-3.5 py-1 text-[11px] font-extrabold tracking-[0.16em] text-[#8a6d1f] uppercase shadow-sm dark:text-[#E8D59A]">
              Testimonials
            </span>
            <h2 className="mt-4 text-[28px] font-extrabold tracking-tight text-text md:text-[36px]">
              What VYBE users say
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-text-secondary md:text-[15px]">
              Real feedback from people booking movies, events, activities and play on
              VYBE.
            </p>
          </div>

          <div
            ref={scrollerRef}
            className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 md:gap-5"
          >
            {testimonials.map((item) => (
              <article
                key={item.name}
                data-love-card
                className="flex w-[min(85vw,300px)] shrink-0 flex-col justify-between rounded-[28px] bg-surface p-6 shadow-[0_18px_50px_-28px_rgba(15,15,20,0.4)] md:w-[300px] md:p-7"
              >
                <p className="font-[family-name:var(--font-fraunces)] text-[16px] leading-relaxed text-text md:text-[17px]">
                  “{item.quote}”
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="relative size-11 overflow-hidden rounded-full bg-surface-muted">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-extrabold text-text">
                      {item.name}
                    </p>
                    <p className="truncate text-[12px] text-text-muted">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous testimonials"
              className="grid size-10 place-items-center rounded-full border border-border bg-surface text-text transition-colors hover:border-accent/40"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next testimonials"
              className="grid size-10 place-items-center rounded-full border border-border bg-surface text-text transition-colors hover:border-accent/40"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
