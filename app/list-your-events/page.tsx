import Image from "next/image";
import Link from "next/link";
import { BarChart3, ChevronDown, Megaphone, TrendingUp } from "lucide-react";
import { Container } from "@/components/common/Container";

export const metadata = { title: "List your events" };

const categories = [
  { title: "Music", image: "/images/list-events/music.png" },
  { title: "Parties", image: "/images/list-events/parties.jpg" },
  { title: "Comedy", image: "/images/list-events/comedy.jpg" },
  { title: "Activities", image: "/images/list-events/activities.jpg" },
  { title: "Workshops", image: "/images/list-events/workshops.jpg" },
];

const steps = [
  {
    n: "01",
    title: "Register",
    body: "Create your organiser profile in minutes.",
    image: "/images/list-events/step-register.jpg",
  },
  {
    n: "02",
    title: "List your event",
    body: "Add details, visuals, shows and ticket tiers.",
    image: "/images/list-events/step-ticket.jpg",
  },
  {
    n: "03",
    title: "Go live on VYBE",
    body: "Publish and start selling to the VYBE crowd.",
    image: "/images/list-events/step-live.jpg",
  },
];

const insights = [
  {
    icon: TrendingUp,
    title: "Grow eventually",
    body: "Real-time analytics on how your event is performing.",
  },
  {
    icon: BarChart3,
    title: "Traffic insights",
    body: "Track views, tickets sold and interest in your listing.",
  },
  {
    icon: Megaphone,
    title: "Marketing impact",
    body: "See which campaigns drive the most conversions.",
  },
];

export default function ListYourEventsPage() {
  return (
    <div className="w-full bg-bg pb-16 md:pb-20">
      <Container className="pt-8 pb-2 md:pt-12">
        <section className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:gap-16">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.18em] text-accent uppercase">
              Creator hub
            </p>
            <h1 className="mt-3 max-w-3xl text-[36px] leading-[1.05] font-extrabold tracking-[-0.035em] text-text sm:text-[48px] lg:text-[60px]">
              List all your <span className="text-accent">events</span> with us
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary sm:text-[17px]">
            Music, parties, comedy, activities and workshops — one organiser flow, no upfront cost, commission only when a ticket sells.

            </p>
            <Link
              href="/list-your-events/get-started"
              className="mt-7 inline-flex rounded-full bg-accent px-7 py-3.5 text-[15px] font-extrabold text-white shadow-[0_14px_32px_rgba(255,0,91,0.28)] transition-transform hover:-translate-y-0.5"
            >
              Get started
            </Link>
          </div>
        </section>

        {/* Five equal cards — nothing stretched or cropped into a banner */}
        <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
          {categories.map((item) => (
            <article
              key={item.title}
              className="relative aspect-square overflow-hidden rounded-[22px] shadow-[0_10px_30px_rgba(17,24,39,0.08)] sm:rounded-[26px] max-sm:last:col-span-2 max-sm:last:w-[calc(50%-0.375rem)] max-sm:last:justify-self-center"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
              />
            </article>
          ))}
        </section>
      </Container>

      <section className="mt-16 md:mt-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-text sm:text-[36px]">
              How listing works
            </h2>
            <p className="hidden max-w-xs text-right text-[13px] text-text-secondary md:block">
              Three steps from profile to a live ticket page.
            </p>
          </div>

          <ol className="mt-6 grid gap-4 lg:grid-cols-3 lg:gap-5">
            {steps.map((step, index) => (
              <li key={step.n} className="relative">
                <article className="flex h-full min-h-[168px] items-center gap-4 overflow-hidden rounded-[24px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(17,24,39,0.04)] sm:p-6">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-extrabold text-accent">{step.n}</p>
                    <h3 className="mt-1 text-[20px] font-extrabold tracking-tight text-text">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-snug text-text-secondary sm:text-[14px]">
                      {step.body}
                    </p>
                  </div>
                  <div className="relative size-[104px] shrink-0 sm:size-[120px]">
                    <Image
                      src={step.image}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="120px"
                    />
                  </div>
                </article>

              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="mt-16 md:mt-20">
        <Container>
          <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-text sm:text-[36px]">
            Fair & transparent pricing
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="rounded-[24px] border border-border bg-surface p-6 sm:p-7">
              <p className="text-[22px] font-extrabold text-text">No upfront costs</p>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-text-secondary">
                Take your event live for free. You only pay when someone actually buys a ticket.
              </p>
            </article>
            <article className="rounded-[24px] border border-border bg-surface p-6 sm:p-7">
              <p className="text-[22px] font-extrabold text-text">Pay only when you sell</p>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-text-secondary">
                Commission is charged per ticket sold — not for drafts, edits, or empty shows.
              </p>
            </article>
          </div>

          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {insights.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="flex gap-3 rounded-[20px] bg-accent-soft px-4 py-4"
                >
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <Icon className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-extrabold text-text">{item.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-text-secondary">
                      {item.body}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <Link
              href="/list-your-events/get-started"
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-accent px-8 text-[16px] font-extrabold text-white shadow-[0_16px_36px_rgba(255,0,91,0.28)] transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Start your journey
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
