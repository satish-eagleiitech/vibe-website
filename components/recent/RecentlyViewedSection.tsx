"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/common/Container";
import { readRecent, type RecentItem } from "@/lib/recent/storage";

function categoryLabel(category: RecentItem["category"]) {
  if (category === "play") return "Game Zone";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function RecentlyViewedSection() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    function refresh() {
      setItems(readRecent().slice(0, 12));
    }
    refresh();
    window.addEventListener("vybe-recent-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("vybe-recent-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="w-full py-8 md:py-10">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
              Recently viewed
            </h2>
            <p className="mt-1 text-[15px] text-text-secondary">
              Pick up where you left off
            </p>
          </div>
        </div>

        <div className="hide-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2">
          {items.map((item) => (
            <Link
              key={`${item.category}-${item.id}`}
              href={item.href}
              className="group flex w-[160px] shrink-0 snap-start flex-col sm:w-[180px]"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-[16px] bg-surface-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="180px"
                />
                <span className="absolute top-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                  {categoryLabel(item.category)}
                </span>
              </div>
              <div className="pt-3">
                <h3 className="line-clamp-2 text-[14px] font-extrabold text-text">
                  {item.title}
                </h3>
                {item.meta ? (
                  <p className="mt-1 line-clamp-1 text-[12px] text-text-secondary">
                    {item.meta}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
          <div className="flex w-8 shrink-0 items-center justify-center text-text-muted sm:hidden">
            <ChevronRight className="size-5" />
          </div>
        </div>
      </Container>
    </section>
  );
}
