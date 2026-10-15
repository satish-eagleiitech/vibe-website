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
 * One-shot stand-up reveal on first enter (load / first scroll into view).
 * No scrub — after playing once, cards stay in the normal flat pose.
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
    let played = false;

    const build = () => {
      ctx?.revert();
      const cards = [...grid.querySelectorAll<HTMLElement>("[data-stand-card]")].slice(
        0,
        ANIMATED_CARDS,
      );
      if (!cards.length) return;

      ctx = gsap.context(() => {
        const words = section.querySelectorAll("[data-stand-word]");

        cards.forEach((card, i) => {
          gsap.set(card, {
            ...cardStart(i, cards.length),
            transformOrigin: "50% 100%",
            transformPerspective: 1560,
          });
        });
        if (words.length) {
          gsap.set(words, { "--stand-mix": 1 });
        }

        ScrollTrigger.create({
          trigger: section,
          start: "top 78%",
          once: true,
          onEnter: () => {
            if (played) return;
            played = true;
            if (words.length) {
              gsap.to(words, {
                "--stand-mix": 0,
                duration: 0.7,
                stagger: 0.12,
                ease: "power2.out",
              });
            }
            gsap.to(cards, {
              rotateX: 0,
              rotateY: 0,
              y: 0,
              duration: 0.85,
              stagger: 0.06,
              ease: "power2.out",
            });
          },
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
