import Image from "next/image";
import Link from "next/link";

export type ExploreCategoryItem = {
  id: string;
  label: string;
  href: string;
  imageUrl: string;
  imageClassName?: string;
};

type ExploreCategoryRailProps = {
  title: string;
  items: ExploreCategoryItem[];
  sectionId?: string;
};

function CategoryCard({
  item,
  compact,
}: {
  item: ExploreCategoryItem;
  compact?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`group flex h-full w-full flex-col overflow-hidden border border-[#E6E8EC] bg-white text-[#1C1C1C] transition-colors hover:border-[#D4D7DE] dark:border-[#E4E4E7] dark:bg-white dark:text-[#1C1C1C] ${
        compact ? "rounded-[14px]" : "rounded-[18px]"
      }`}
    >
      <span
        className={`relative z-10 flex shrink-0 items-center justify-center bg-white px-1.5 text-center font-semibold leading-tight text-[#1C1C1C] dark:bg-white dark:text-[#1C1C1C] ${
          compact
            ? "min-h-8 pt-1.5 pb-1 text-[11px] sm:min-h-9 sm:text-[12px]"
            : "min-h-10 pt-2 pb-1.5 text-[13px]"
        }`}
      >
        {item.label}
      </span>
      <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-white dark:bg-white">
        <Image
          src={item.imageUrl}
          alt=""
          fill
          className={
            item.imageClassName ??
            "origin-center object-contain object-center scale-[1.08]"
          }
          sizes={compact ? "124px" : "160px"}
        />
      </div>
    </Link>
  );
}

/** Explore cards: 2-row horizontal scroll (district-style) until xl; denser grid after. */
export function ExploreCategoryRail({
  title,
  items,
  sectionId,
}: ExploreCategoryRailProps) {
  return (
    <section
      id={sectionId}
      className="scroll-mt-[var(--vybe-header-h)] w-full bg-bg py-4 md:py-6 xl:py-9"
    >
      <div className="mx-auto w-full max-w-[1360px] px-0 md:px-8 lg:px-12 3xl:max-w-[1520px] 4xl:max-w-[1920px] 4xl:px-16">
        <h2 className="px-4 text-[20px] font-bold tracking-tight text-text md:px-0 md:text-[22px] xl:text-[24px]">
          {title}
        </h2>

        {/* Phone → laptop (~1050): 2 rows, swipe sideways */}
        <div className="mt-3 hide-scrollbar overflow-x-auto px-4 pb-1 md:mt-4 md:px-0 xl:hidden">
          <div className="grid auto-cols-[108px] grid-flow-col grid-rows-2 gap-2.5 sm:auto-cols-[116px] sm:gap-3 md:auto-cols-[122px] lg:auto-cols-[128px]">
            {items.map((item) => (
              <div key={item.id} className="aspect-[5/6] w-full">
                <CategoryCard item={item} compact />
              </div>
            ))}
          </div>
        </div>

        {/* xl+: compact multi-column grid */}
        <div className="mt-5 hidden grid-cols-6 gap-3 xl:grid 2xl:grid-cols-8">
          {items.map((item) => (
            <div key={item.id} className="aspect-[5/6]">
              <CategoryCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
