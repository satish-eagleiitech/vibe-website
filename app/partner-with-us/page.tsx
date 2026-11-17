import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  MapPinned,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Partner With Us" };

const paths = [
  {
    tag: "Events",
    title: "List your events",
    body: "Concerts, comedy, workshops and sports nights — publish shows and sell tickets to people already browsing plans.",
    href: "/list-your-events",
    cta: "Start hosting",
    image: "/images/partner/partner-events-hero.jpg",
    tone: "from-[#FF005B]/90 via-[#FF005B]/40 to-transparent",
  },
  {
    tag: "Venues",
    title: "List your venue",
    body: "Turfs, courts, studios and game zones with hourly slots, discovery and booking that syncs to the VYBE crowd.",
    href: "/list-your-venue",
    cta: "List a venue",
    image: "/images/partner/partner-venues-hero.jpg",
    tone: "from-[#0EA5E9]/90 via-[#0EA5E9]/35 to-transparent",
  },
];

const benefits = [
  {
    icon: Megaphone,
    title: "Built-in discovery",
    body: "Show up next to movies, activities and play — not buried in a niche feed.",
    tone: "bg-[#FFE8A3] text-[#1a1a1a]",
  },
  {
    icon: Wallet,
    title: "Clear payouts",
    body: "Ticket and slot revenue with transparent fees explained during onboarding.",
    tone: "bg-[#C8F0E0] text-[#0f3d32]",
  },
  {
    icon: BarChart3,
    title: "Live insights",
    body: "Track views, interest and tickets sold as your listing goes live.",
    tone: "bg-[#FFD0E0] text-[#5c1030]",
  },
  {
    icon: ShieldCheck,
    title: "Trusted checkout",
    body: "Customers pay through VYBE’s secure flow and walk in with a QR.",
    tone: "bg-[#D9D6FF] text-[#1b1640]",
  },
];

const steps = [
  {
    n: "01",
    title: "Register",
    body: "Create an organiser or venue profile in a few minutes.",
    image: "/images/partner/partner-step-register.jpg",
  },
  {
    n: "02",
    title: "Add inventory",
    body: "Upload visuals, timings, ticket tiers or hourly slots.",
    image: "/images/partner/partner-step-ticket.jpg",
  },
  {
    n: "03",
    title: "Go live",
    body: "Publish to VYBE and start selling to city explorers.",
    image: "/images/partner/partner-step-live.jpg",
  },
];

const quotes = [
  {
    quote: "We sold out the first comedy night in under a week once it was on VYBE.",
    name: "Rhea · Indie organiser",
  },
  {
    quote: "Hourly turf slots finally stop dying in Instagram DMs.",
    name: "Arjun · Venue owner",
  },
  {
    quote: "Analytics made it obvious which creatives actually convert.",
    name: "Sana · Festival team",
  },
];

export default function PartnerWithUsPage() {
  return (
    <div className="-mb-10 w-full flex-1 overflow-x-hidden bg-white pb-16 md:-mb-14 md:pb-24 dark:bg-bg">
      <section className="relative pt-10 pb-8 md:pt-14 md:pb-10">
        <Container className="relative text-center">
          <span className="inline-flex rounded-full border border-border bg-surface px-3.5 py-1 text-[11px] font-extrabold tracking-[0.16em] text-text-secondary uppercase shadow-sm">
            Partners
          </span>
          <h1 className="mx-auto mt-5 max-w-[16ch] text-[36px] leading-[1.05] font-extrabold tracking-tight text-text md:text-[52px]">
            Grow with the city&apos;s{" "}
            <em className="font-[family-name:var(--font-fraunces)] font-semibold text-accent italic">
              plans network.
            </em>
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-relaxed text-text-secondary md:text-[16px]">
            Whether you host shows or own a sports space, get discovered by people
            already looking for what to do next on {siteConfig.name}.
          </p>
        </Container>
      </section>

      <Container className="space-y-8 md:space-y-10">
        {/* Featured dual path cards */}
        <div className="grid gap-4 lg:grid-cols-2">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group relative min-h-[320px] overflow-hidden rounded-[28px] border border-border shadow-[0_24px_60px_-28px_rgba(15,15,20,0.4)]"
            >
              <Image
                src={path.image}
                alt=""
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${path.tone}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold tracking-wide text-white uppercase backdrop-blur">
                  {path.tag}
                </span>
                <h2 className="mt-3 text-[28px] font-extrabold text-white md:text-[32px]">
                  {path.title}
                </h2>
                <p className="mt-2 max-w-[42ch] text-[14px] leading-relaxed text-white/80">
                  {path.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-[#1a1a1a]">
                  {path.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Color benefit cards */}
        <div>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-accent uppercase">
                Why partners choose VYBE
              </p>
              <h2 className="mt-1 text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
                Built for hosts and venues
              </h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-[24px] p-5 shadow-[0_16px_40px_-28px_rgba(15,15,20,0.35)] ${item.tone}`}
                >
                  <Icon className="size-5 opacity-80" />
                  <h3 className="mt-4 text-[17px] font-extrabold">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed opacity-80">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AKINA asymmetric how-it-works */}
        <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(220px,0.7fr)]">
          <div className="overflow-hidden rounded-[28px] bg-[#2A1830] text-white md:grid md:grid-cols-2">
            <div className="p-6 md:p-8">
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-accent uppercase">
                How it works
              </p>
              <h3 className="mt-2 text-[24px] leading-tight font-extrabold md:text-[28px]">
                Live in three short steps
              </h3>
              <ul className="mt-5 space-y-3">
                {steps.map((step) => (
                  <li key={step.n} className="flex gap-3">
                    <span className="text-[13px] font-extrabold text-accent tabular-nums">
                      {step.n}
                    </span>
                    <div>
                      <p className="text-[14px] font-extrabold">{step.title}</p>
                      <p className="text-[13px] text-white/65">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative min-h-[240px]">
              <Image
                src="/images/partner/partner-how-music.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
          <div className="px-1 lg:px-2">
            <p className="text-[20px] leading-snug font-extrabold text-text md:text-[22px]">
              You can go live from the website — no sales call required to start.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/list-your-events"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-extrabold text-white"
              >
                <CalendarDays className="size-3.5" />
                Events
              </Link>
              <Link
                href="/list-your-venue"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-extrabold text-text"
              >
                <MapPinned className="size-3.5" />
                Venues
              </Link>
            </div>
          </div>
        </div>

        {/* Step image cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.n}
              className="overflow-hidden rounded-[24px] border border-border bg-surface shadow-[0_18px_40px_-28px_rgba(15,15,20,0.35)]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={step.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-text shadow-sm dark:bg-black/70 dark:text-white">
                  Step {step.n}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-[17px] font-extrabold text-text">{step.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                  {step.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>

      {/* Dark GAZU-style band */}
      <section className="mt-12 bg-[#0c0c0e] py-12 text-white md:mt-16 md:py-16">
        <Container>
          <div className="mb-8">
            <p className="text-[11px] font-extrabold tracking-[0.18em] text-accent uppercase">
              Who we work with
            </p>
            <h2 className="mt-2 text-[28px] font-extrabold tracking-tight md:text-[34px]">
              Built for every kind of host
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Event organisers",
                body: "Single nights or multi-day festivals with ticket tiers.",
                image: "/images/about/lux-pillar-events.jpg",
                href: "/list-your-events",
              },
              {
                title: "Sports venues",
                body: "Turfs, courts and nets with hourly inventory.",
                image: "/images/about/lux-love-court.jpg",
                href: "/list-your-venue",
              },
              {
                title: "Cinemas & parks",
                body: "Talk to partnerships for inventory integrations.",
                image: "/images/about/lux-pillar-activities.jpg",
                href: "/contact",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex gap-4 rounded-[22px] border border-white/10 bg-white/[0.04] p-3.5 transition-colors hover:border-accent/50 hover:bg-white/[0.07]"
              >
                <div className="relative h-[88px] w-[72px] shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="72px"
                  />
                </div>
                <div className="min-w-0 py-1">
                  <h3 className="text-[15px] font-extrabold tracking-wide uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/65">
                    {item.body}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-extrabold text-accent">
                    Get started <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Fills footer top gap so page gray does not show through */}
      <div className="h-10 bg-white md:h-14 dark:bg-bg" aria-hidden />
    </div>
  );
}
