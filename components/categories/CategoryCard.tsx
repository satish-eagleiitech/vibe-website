import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CategoryCardData } from "@/types/category";

type CategoryCardProps = {
  category: CategoryCardData;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl p-4 text-white shadow-sm transition-all duration-300 hover:shadow-xl md:min-h-[220px]"
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${category.gradientFrom}, ${category.gradientTo})`,
      }}
    >
      <div className="relative z-10">
        <span className="block text-[22px] font-extrabold tracking-tight">
          {category.title}
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-[12px] font-bold text-white/85 transition-transform group-hover:translate-x-1">
          {category.subtitle}
          <ChevronRight className="size-3.5" />
        </span>
      </div>
      <div className="relative z-10 mt-2 flex justify-end self-end">
        <div className="relative h-[108px] w-[108px] transition-transform duration-300 group-hover:scale-110 md:h-[120px] md:w-[120px]">
          <Image
            src={category.imageUrl}
            alt=""
            fill
            unoptimized
            className="object-contain drop-shadow-lg ml-6 mt-6"
            sizes="120px"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute -right-4 -bottom-4 size-32 rounded-full bg-white/5 blur-2xl" />
    </Link>
  );
}
