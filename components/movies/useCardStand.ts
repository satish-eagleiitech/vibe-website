"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Only the first N cards get the stand-up reveal; the rest stay flat. */
const ANIMATED_CARDS = 6;

function cardStart(index: number, count: number) {
  const t = count === 1 ? 0 : (index / (count - 1)) * 2 - 1;
  const abs = Math.abs(t);
  return {
    rotateX: 90 - abs * 32,
    rotateY: -t * 18,
    y: 18 + abs * 30,
  };
}

/**
 * Scroll-scrubbed "stand up" reveal for the first few `[data-stand-card]` elements,
 * and `[data-stand-word]` heading words fading from accent pink to the text colour.
 */
export function useCardStand(
  sectionRef: RefObject<HTMLElement | null>,
  gridRef: RefObject<HTMLElement | null>,
  layoutKey: unknown,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | undefined;

    const build = () => {
      ctx?.revert();
      const cards = [...grid.querySelectorAll<HTMLElement>("[data-stand-card]")].slice(
        0,
        ANIMATED_CARDS,
      );
      if (!cards.length) return;

      ctx = gsap.context(() => {
        const words = section.querySelectorAll("[data-stand-word]");
        if (words.length) {
          gsap.fromTo(
            words,
            { "--stand-mix": 1 },
            {
              "--stand-mix": 0,
              stagger: 0.2,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top 80%", end: "top 30%", scrub: 1 },
            },
          );
        }

        cards.forEach((card, i) => {
          gsap.set(card, {
            ...cardStart(i, cards.length),
            transformOrigin: "50% 100%",
            transformPerspective: 1560,
          });
        });
        gsap.to(cards, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          ease: "power1.inOut",
          scrollTrigger: { trigger: cards[0], start: "top 98%", end: "top 55%", scrub: 1 },
        });
      }, section);
      ScrollTrigger.refresh();
    };

    build();

    return () => {
      ctx?.revert();
    };
  }, [sectionRef, gridRef, layoutKey]);
}
