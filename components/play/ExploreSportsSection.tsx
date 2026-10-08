import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { playSports } from "@/lib/data/playSports";

const sceneSports = new Set([
  "turf-football",
  "box-cricket",
  "cricket-nets",
  "football",
]);

export function ExploreSportsSection() {
  return (
    <section className="w-full bg-bg py-7 md:py-9">
      <Container>
        <h2 className="text-[22px] font-bold tracking-tight text-[#111827] md:text-[24px] dark:text-white">
          Explore Sports
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {playSports.map((sport) => {
            const scene = sceneSports.has(sport.id);
            return (
              <Link
                key={sport.id}
                href={sport.href}
                className="group flex aspect-[5/6] flex-col overflow-hidden rounded-[18px] border border-[#E6E8EC] bg-white text-[#1C1C1C] shadow-none transition-colors hover:border-[#D4D7DE] dark:border-[#E4E4E7] dark:bg-white dark:text-[#1C1C1C]"
              >
                <span className="flex h-9 shrink-0 items-center justify-center px-1.5 text-center text-[12px] font-semibold leading-[1.15] text-[#1C1C1C] sm:text-[13px] dark:text-[#1C1C1C]">
                  {sport.label}
                </span>
                <div className="relative min-h-0 flex-1">
                  <Image
                    src={sport.imageUrl}
                    alt=""
                    fill
                    className={
                      scene
                        ? "object-cover object-[center_68%]"
                        : "origin-center object-contain object-center scale-[1.22]"
                    }
                    sizes="(max-width: 640px) 46vw, 150px"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
