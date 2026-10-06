import Image from "next/image";
import Link from "next/link";
import { Flame, MapPin, Ticket } from "lucide-react";
import { Container } from "@/components/common/Container";
import { BookmarkButton } from "@/components/hero/BookmarkButton";
import type { HeroBannerData } from "@/types/hero";

type HeroBannerProps = {
  banner: HeroBannerData;
};

export function HeroBanner({ banner }: HeroBannerProps) {
  return (
    <section className="w-full py-6 md:py-8">
      <Container>
        <div className="relative flex min-h-[320px] items-end overflow-hidden rounded-3xl shadow-lg md:min-h-[400px] lg:min-h-[440px]">
          <Image
            src={banner.imageUrl}
            alt={banner.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1240px) 100vw, 1240px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 md:top-6 md:left-6">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-md">
              <Flame className="size-3.5" />
              {banner.statusBadge}
            </span>
            <span className="rounded-full bg-white/90 px-4 py-1 text-[11px] font-semibold text-text backdrop-blur-md">
              {banner.locationBadge}
            </span>
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between gap-6 p-5 text-white md:flex-row md:items-end md:p-10">
            <div className="max-w-2xl">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#B9EAFF]">
                <MapPin className="size-4" />
                <span>{banner.venue}</span>
                <span aria-hidden="true">•</span>
                <span>{banner.dateLabel}</span>
              </div>
              <h1 className="text-[32px] leading-[38px] font-extrabold tracking-tight md:text-[44px] md:leading-[52px]">
                {banner.title}
              </h1>
              <p className="mt-2 line-clamp-2 max-w-xl text-base text-[#DCE2F3]">
                {banner.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={banner.href}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#E70052] active:scale-95"
              >
                <Ticket className="size-5" />
                {banner.ctaLabel}
              </Link>
              <BookmarkButton
                item={{
                  id: banner.id,
                  title: banner.title,
                  href: banner.href,
                  imageUrl: banner.imageUrl,
                  meta: banner.venue,
                  category: banner.category === "play" ? "play" : banner.category,
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
