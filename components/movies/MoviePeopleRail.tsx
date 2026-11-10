"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MoviePerson } from "@/types/movie";

type MoviePeopleRailProps = {
  title: string;
  people: MoviePerson[];
  kind: "cast" | "crew";
};

export function MoviePeopleRail({ title, people, kind }: MoviePeopleRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      setCanScroll(el.scrollWidth - el.clientWidth - el.scrollLeft > 8);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [people.length]);

  function scrollNext() {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-person-card]");
    const step = card ? card.offsetWidth + 20 : 144;
    el.scrollBy({ left: step * 2, behavior: "smooth" });
  }

  if (people.length === 0) return null;

  return (
    <div>
      <h2 className="mb-5 text-[22px] font-bold tracking-[-0.02em] text-text">
        {title}
      </h2>
      <div className="relative">
        <div
          ref={scrollerRef}
          className="hide-scrollbar flex gap-5 overflow-x-auto pb-1"
        >
          {people.map((person) => (
            <PersonCard
              key={`${person.id}-${person.role ?? person.name}`}
              person={person}
              kind={kind}
            />
          ))}
        </div>
        {canScroll ? (
          <button
            type="button"
            aria-label={`Scroll ${title}`}
            onClick={scrollNext}
            className="absolute top-[calc((9.25rem*5/4-2.5rem)/2)] right-1 grid size-10 place-items-center rounded-full border border-black/5 bg-white text-[#3a3a3a] shadow-[0_4px_16px_rgba(0,0,0,0.14)] transition-transform hover:scale-105 dark:border-white/10 dark:bg-[#2a2a2e] dark:text-white"
          >
            <ChevronRight className="size-5" strokeWidth={2.25} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function roleLine(person: MoviePerson, kind: "cast" | "crew") {
  const role = person.role?.trim();
  if (!role) return null;
  if (kind === "crew") return role;
  return /^as\b/i.test(role) ? role : `as ${role}`;
}

function PersonCard({
  person,
  kind,
}: {
  person: MoviePerson;
  kind: "cast" | "crew";
}) {
  const role = roleLine(person, kind);

  return (
    <div data-person-card className="w-[9.25rem] shrink-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#ececee] dark:bg-[#1c1c20]">
        {person.imageUrl ? (
          <Image
            src={person.imageUrl}
            alt=""
            fill
            className="object-cover object-[center_22%]"
            sizes="280px"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-lg font-bold text-text-muted">
            {person.name.slice(0, 1)}
          </span>
        )}
      </div>
      <p className="mt-2.5 line-clamp-2 text-[14px] leading-tight font-bold tracking-[-0.01em] text-text">
        {person.name}
      </p>
      {role ? (
        <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#8a8a90]">
          {role}
        </p>
      ) : null}
    </div>
  );
}
