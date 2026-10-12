import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { eventExploreCategories } from "@/lib/data/eventCategories";

export function ExploreEventsSection() {
  return (
    <section
      id="explore-events"
      className="w-full scroll-mt-[var(--vybe-header-h)] bg-bg py-7 md:py-9"
    >
      <Container>
        <h2 className="text-[22px] font-bold tracking-tight text-text md:text-[24px]">
          Explore Events
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {eventExploreCategories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex aspect-[5/6] flex-col overflow-hidden rounded-[18px] border border-[#E6E8EC] bg-white text-[#1C1C1C] shadow-none transition-colors hover:border-[#D4D7DE] dark:border-[#E4E4E7] dark:bg-white dark:text-[#1C1C1C]"
            >
              <span className="relative z-10 flex min-h-10 shrink-0 items-center justify-center bg-white px-2 pt-2.5 pb-1.5 text-center text-[12px] font-semibold leading-tight text-[#1C1C1C] sm:min-h-11 sm:text-[13px]">
                {category.label}
              </span>
              <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
                <Image
                  src={category.imageUrl}
                  alt=""
                  fill
                  className="origin-center object-contain object-center scale-[1.12]"
                  sizes="(max-width: 640px) 46vw, 150px"
                />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
