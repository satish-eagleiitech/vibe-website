import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryCardData } from "@/types/category";

type CategoryCardProps = {
  category: CategoryCardData;
};

const CARD_RADIUS = "32px";

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className="relative block h-[188px] min-w-0 flex-1 overflow-hidden rounded-[32px] md:h-[214px]"
    >
      <div
        aria-hidden
        className="absolute inset-0 shadow-[0_18px_34px_rgba(15,23,42,0.14)]"
        style={{
          borderRadius: CARD_RADIUS,
          background: `linear-gradient(165deg, ${category.gradientFrom} 0%, ${category.gradientTo} 100%)`,
        }}
      />
      <Image
        src={category.imageUrl}
        alt=""
        width={720}
        height={720}
        unoptimized
        className="pointer-events-none absolute right-0 bottom-0 z-[1] w-auto max-w-none select-none"
        style={{ height: "92%", width: "auto", transform: "translate(10%, 10%)" }}
      />
      <div className="relative z-[2] flex h-full max-w-[46%] flex-col justify-between p-4 md:p-5">
        <div>
          <h3 className="text-[20px] font-extrabold leading-none tracking-[-0.03em] text-white md:text-[24px]">
            {category.title}
          </h3>
          <p className="mt-1.5 text-[12px] leading-snug font-medium text-white/80 max-lg:sr-only md:text-[13px]">
            {category.subtitle}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-[0.14em] text-white/90 uppercase">
          <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
          Explore
        </span>
      </div>
    </Link>
  );
}
