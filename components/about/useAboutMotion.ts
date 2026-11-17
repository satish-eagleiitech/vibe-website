"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Luxury reveal motions for the About page — respects reduced-motion. */
export function useAboutMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root
        .querySelectorAll<HTMLElement>(
          "[data-about-hero], [data-about-reveal], [data-about-item]",
        )
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-about-hero]",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "transform",
        },
      );

      const ken = root.querySelector("[data-about-ken]");
      if (ken) {
        gsap.fromTo(
          ken,
          { scale: 1.12 },
          { scale: 1, duration: 6.5, ease: "power1.out" },
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-about-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            immediateRender: false,
            clearProps: "transform",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-about-stagger]").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-about-item]");
        if (!items.length) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            immediateRender: false,
            clearProps: "transform",
            scrollTrigger: {
              trigger: group,
              start: "top 92%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-about-float]").forEach((el) => {
        gsap.to(el, {
          y: -8,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // Ensure anything already in view actually plays (SPA / mid-page load).
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
