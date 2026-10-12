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
      className="relative flex aspect-[20/10] min-h-[200px] flex-col justify-between overflow-hidden rounded-[32px] p-7 text-white md:min-h-[240px] md:p-8"
      style={{ backgroundColor: category.gradientFrom }}
    >
      {/* Wider layer + left shift so props move left WITHOUT a right edge seam */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[118%] -translate-x-[10%]">
        <Image
          src={category.imageUrl}
          alt=""
          fill
          unoptimized
          className="object-cover object-center scale-[1.01]"
          sizes="(max-width: 768px) 120vw, 60vw"
        />
      </div>

      <div className="relative z-10 max-w-[48%]">
        <h3 className="text-[30px] leading-[1] font-extrabold tracking-[-0.03em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.25)] md:text-[36px]">
          {category.title}
        </h3>
      </div>

      <div className="relative z-10 mt-auto inline-flex items-center gap-2 text-[12px] font-extrabold tracking-[0.16em] uppercase drop-shadow-[0_1px_6px_rgba(0,0,0,0.25)]">
        <ArrowUpRight className="size-4" strokeWidth={2.5} />
        Explore more
      </div>
    </Link>
  );
}
