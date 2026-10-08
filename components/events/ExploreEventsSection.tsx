import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { eventExploreCategories } from "@/lib/data/eventCategories";

export function ExploreEventsSection() {
  return (
    <section
      id="explore-events"
      className="w-full scroll-mt-[var(--vybe-header-h)] py-6 md:py-8"
    >
      <Container>
        <h2 className="text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
          Explore Events
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {eventExploreCategories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex flex-col items-center rounded-2xl border border-border bg-surface px-2 py-3 transition-transform hover:-translate-y-0.5"
            >
              <div className="relative size-[56px] sm:size-[64px]">
                <Image
                  src={category.imageUrl}
                  alt=""
                  fill
                  className="object-contain drop-shadow-sm"
                  sizes="64px"
                />
              </div>
              <span className="mt-2 line-clamp-2 text-center text-[11px] font-bold leading-tight text-text sm:text-[12px]">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
