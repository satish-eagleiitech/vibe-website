import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryCardData } from "@/types/category";

type CategoryCardProps = {
  category: CategoryCardData;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className="relative aspect-[2.15/1] min-h-[148px] overflow-hidden rounded-[28px] text-white md:min-h-[168px] md:rounded-[32px]"
      style={{ backgroundColor: category.gradientFrom }}
    >
      {/* Full-bleed card art — same composition as the sports reference */}
      <Image
        src={category.imageUrl}
        alt=""
        fill
        unoptimized
        className="object-cover object-right"
        sizes="(max-width: 768px) 92vw, 48vw"
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6 lg:p-7">
        <h3 className="max-w-[9ch] text-[22px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[26px] lg:text-[30px]">
          {category.title}
        </h3>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.14em] text-white/90 uppercase md:text-[11px]">
          <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
          Explore more
        </div>
      </div>
    </Link>
  );
}
