import Image from "next/image";
import Link from "next/link";

const CARDS = [
  {
    key: "park",
    title: "Amusement Parks",
    text: "Hold on for a fast ride near you.",
    image: "/images/landing/activities-for-you/park.jpg",
    alt: "A couple on a roller coaster at night",
    href: "/activities",
    layout: "sm:col-span-2 aspect-[3/4] md:col-span-1 md:row-span-2 md:aspect-auto",
    position: "object-[center_62%]",
    copy: "text-white",
    sub: "text-white/85",
    button: "bg-[#f2c14e] text-[#1a1230]",
  },
  {
    key: "kart",
    title: "Go Karting",
    text: "Race a friend on a track near you.",
    image: "/images/landing/activities-for-you/gokart.jpg",
    alt: "Two people racing go-karts",
    href: "/play",
    layout: "sm:col-span-2 aspect-[16/7] md:aspect-auto",
    position: "object-center",
    copy: "max-w-[280px] text-[#161616]",
    sub: "text-[#242424]",
    button: "bg-[#111] text-white",
  },
  {
    key: "bowl",
    title: "Bowling alleys near you",
    text: "Grab a lane and roll a few frames.",
    image: "/images/landing/activities-for-you/bowling.jpg",
    alt: "A person bowling",
    href: "/play",
    layout: "aspect-[1/1.05] sm:aspect-square md:aspect-auto",
    position: "object-[center_40%]",
    copy: "text-white",
    sub: "text-white/85",
    button: "bg-[#1f7f86] text-white",
  },
  {
    key: "kids",
    title: "Get the kids along",
    text: "Bring them out for a day of play.",
    image: "/images/landing/activities-for-you/kids.jpg",
    alt: "Two kids playing mini golf",
    href: "/activities",
    layout: "aspect-[1/1.05] sm:aspect-square md:aspect-auto",
    position: "object-[center_42%]",
    copy: "text-[#142033]",
    sub: "text-[#243044]",
    button: "bg-[#e07a62] text-white",
  },
] as const;

export function ActivitiesForYouSection() {
  return (
    <section aria-label="Activities for you" className="w-full px-[4vw] py-14 md:py-16">
      <header className="mx-auto mb-9 max-w-[1120px] text-center">
        <h2 className="text-[clamp(2.4rem,4.6vw,3.7rem)] leading-[0.95] font-extrabold tracking-[-0.035em] text-[#1c2a44] uppercase dark:text-text">
          Activities for you
        </h2>
        <p className="mt-3.5 text-[16.5px] leading-[1.4] font-medium text-[#8d929a] dark:text-text-muted">
          Go-karts, bowling, parks and a day out with the kids.
        </p>
      </header>

      <div className="mx-auto grid max-w-[420px] grid-cols-1 gap-4 sm:max-w-[1120px] sm:grid-cols-2 md:h-[640px] md:grid-cols-[1.05fr_1fr_1fr] md:grid-rows-[0.72fr_1fr]">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className={`group relative min-h-0 overflow-hidden rounded-[28px] ${card.layout}`}
          >
            <Image
              src={card.image}
              alt={card.alt}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 768px) 46vw, 560px"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${card.position}`}
            />
            <div className={`relative z-[1] px-5 pt-5 ${card.copy}`}>
              <h3 className="max-w-[12ch] text-[clamp(1.35rem,1.7vw,1.9rem)] leading-[1.02] font-extrabold tracking-[-0.04em]">
                {card.title}
              </h3>
              <p className={`mt-2 max-w-[24ch] text-[14.5px] leading-[1.35] font-medium ${card.sub}`}>
                {card.text}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-3.5 py-2 text-[13.5px] font-bold transition-transform group-hover:scale-105 ${card.button}`}
              >
                Learn more
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
