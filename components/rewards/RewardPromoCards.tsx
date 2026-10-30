"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProfileRewardPromo } from "@/lib/data/profileRewardPromos";

export function RewardPromoCards({
  promos,
  linkCards = false,
}: {
  promos: ProfileRewardPromo[];
  linkCards?: boolean;
}) {
  return (
    <div className="hide-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0">
      {promos.map((promo) => {
        const inner = (
          <>
            <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center px-4 py-3 pr-[38%] sm:px-5">
              <p className="text-[18px] leading-[1.15] font-extrabold tracking-[-0.02em] text-[#111111] sm:text-[20px]">
                {promo.title}
              </p>
              <p className="mt-1.5 text-[12px] leading-snug font-semibold text-[#111111]/72 sm:text-[13px]">
                {promo.subtitle}
              </p>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex w-[44%] items-end justify-center pb-0 pr-1 sm:pr-2">
              <Image
                src={promo.imageUrl}
                alt=""
                width={160}
                height={160}
                className="h-[92%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_10px_18px_rgba(0,0,0,0.14)] sm:h-[95%]"
                sizes="160px"
                unoptimized
              />
            </div>
          </>
        );

        const className =
          "relative flex h-[108px] min-w-[min(88vw,300px)] shrink-0 overflow-hidden rounded-[20px] sm:h-[116px] sm:min-w-[280px] lg:min-w-0 lg:shrink";

        if (linkCards && promo.href) {
          return (
            <Link
              key={promo.id}
              href={promo.href}
              className={`${className} transition-transform hover:scale-[1.01]`}
              style={{ backgroundColor: promo.background }}
            >
              {inner}
            </Link>
          );
        }

        return (
          <div
            key={promo.id}
            className={className}
            style={{ backgroundColor: promo.background }}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
