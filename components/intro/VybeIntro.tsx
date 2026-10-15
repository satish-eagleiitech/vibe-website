"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const CARDS = [
  { src: "/images/intro/toxic.jpg", alt: "Toxic" },
  { src: "/images/intro/dune.jpg", alt: "Dune" },
  { src: "/images/intro/oppenheimer.jpg", alt: "Oppenheimer" },
  { src: "/images/intro/pushpa.jpg", alt: "Pushpa" },
  { src: "/images/intro/kgf.jpg", alt: "KGF" },
  { src: "/images/intro/spiderman-poster.jpg", alt: "Spider-Man" },
] as const;

const ROTATIONS = [8, -3, -10, 10, -7, 5];

const SESSION_KEY = "vybe-intro-seen";

export function VybeIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"boot" | "play" | "done">("boot");

  useEffect(() => {
    try {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        sessionStorage.getItem(SESSION_KEY) === "1"
      ) {
        setPhase("done");
        return;
      }
    } catch {
      /* ignore */
    }
    setPhase("play");
  }, []);

  useEffect(() => {
    if (phase !== "play") return;
    const root = rootRef.current;
    if (!root) return;

    const counter = root.querySelector<HTMLElement>(".vybe-intro-count p");
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const start = () => {
      if (cancelled || !root) return;

      ctx = gsap.context(() => {
        const title = new SplitText(".vybe-intro-title", {
          type: "chars",
          mask: "chars",
        });

        gsap.set(".vybe-intro-card", {
          xPercent: -50,
          yPercent: -50,
          scale: 0,
          rotate: (i) => ROTATIONS[i] ?? 0,
        });

        gsap.set(title.chars, {
          yPercent: 100,
          rotation: 10,
          transformOrigin: "0% 100%",
        });

        gsap.set(".vybe-intro-count p", { yPercent: 100 });

        const tl = gsap.timeline({
          delay: 0.5,
          onComplete: () => {
            try {
              sessionStorage.setItem(SESSION_KEY, "1");
            } catch {
              /* ignore */
            }
            document.body.style.overflow = prevOverflow;
            setPhase("done");
          },
        });

        tl.to(".vybe-intro-card", {
          scale: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "power3.inOut",
          stagger: 0.2,
        });

        tl.set(".vybe-intro-brand", { visibility: "visible" }, 0.35);

        tl.to(
          title.chars,
          {
            yPercent: 0,
            rotation: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.04,
          },
          0.35,
        );

        tl.to(".vybe-intro-count p", { yPercent: 0, duration: 1, ease: "power3.out" }, "<");

        tl.to(
          { value: 0 },
          {
            value: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate() {
              if (!counter) return;
              const v = (this.targets()[0] as { value: number }).value;
              counter.textContent = String(Math.round(v)).padStart(3, "0");
            },
          },
          "<0.5",
        );

        tl.to(
          title.chars,
          {
            yPercent: -100,
            rotation: -10,
            duration: 0.75,
            ease: "power3.in",
            stagger: 0.04,
          },
          3.25,
        );

        tl.to(".vybe-intro-count p", { yPercent: -100, duration: 0.75, ease: "power3.in" }, 3.25);

        tl.to(
          ".vybe-intro-card",
          {
            scale: 0,
            clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
            duration: 1,
            ease: "power3.inOut",
            stagger: -0.075,
          },
          3.5,
        );

        tl.to(
          ".vybe-intro-loader",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            ease: "power3.inOut",
          },
          4.35,
        );
      }, root);
    };

    document.fonts.ready.then(() => {
      if (!cancelled) start();
    });

    return () => {
      cancelled = true;
      document.body.style.overflow = prevOverflow;
      ctx?.revert();
    };
  }, [phase]);

  if (phase === "done") return null;

  if (phase === "boot") {
    return (
      <div
        className="fixed inset-0 z-[200] bg-[#14161c]"
        aria-hidden
      />
    );
  }

  return (
    <div ref={rootRef} className="vybe-intro" aria-hidden>
      <div className="vybe-intro-loader">
        {CARDS.map((card) => (
          <div className="vybe-intro-card" key={card.alt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.src} alt="" />
          </div>
        ))}

        <div className="vybe-intro-brand">
          <h1 className="vybe-intro-title">Vybe</h1>
          <div className="vybe-intro-count">
            <p>000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
