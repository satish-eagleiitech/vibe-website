"use client";

import { useEffect, useState } from "react";

export type PolicyTocItem = {
  id: string;
  heading: string;
};

type PolicyTocProps = {
  items: PolicyTocItem[];
};

export function PolicyToc({ items }: PolicyTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
          return;
        }

        // Fallback: nearest section above the fold
        const fromTop = elements
          .map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }))
          .filter((item) => item.top <= 140)
          .sort((a, b) => b.top - a.top);

        if (fromTop[0]) setActiveId(fromTop[0].id);
      },
      {
        rootMargin: "-120px 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-text-muted uppercase">
          On this page
        </p>
        <nav aria-label="On this page" className="space-y-0.5 border-l border-border">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block border-l-2 py-1.5 pl-3 text-[12px] leading-snug transition-colors ${
                  active
                    ? "-ml-px border-text font-semibold text-text"
                    : "border-transparent text-text-muted hover:border-text/40 hover:text-text"
                }`}
              >
                {item.heading}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
