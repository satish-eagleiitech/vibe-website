import Image from "next/image";
import Link from "next/link";
import type { EventSubcategory } from "@/lib/data/eventCategories";

type EventSubcategoryGridProps = {
  items: EventSubcategory[];
  title?: string;
  /** Extra line under the title, e.g. parent category name */
  meta?: string;
};

export function EventSubcategoryGrid({
  items,
  title = "Subcategories",
  meta,
}: EventSubcategoryGridProps) {
  if (items.length === 0) return null;

  return (
    <div>
      {title ? (
        <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[24px]">{title}</h2>
      ) : null}
      <div
        className={`grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7 3xl:grid-cols-6 4xl:grid-cols-7 ${
          title ? "mt-4" : ""
        }`}
      >
        {items.map((item) => (
          <Link key={item.id} href={`/events/${item.eventId}`} className="group flex w-full flex-col">
            <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-muted">
              <Image
                src={item.imageUrl}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
            <h3 className="mt-2 line-clamp-1 text-[13px] font-semibold text-text sm:text-[14px]">
              {item.label}
            </h3>
            {meta ? (
              <p className="mt-0.5 line-clamp-1 text-[12px] text-text-secondary">{meta}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
