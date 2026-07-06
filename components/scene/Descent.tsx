"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import MyceliumRoots from "@/components/graphics/MyceliumRoots";
import useBreakpoint from "@/hooks/useBreakpoint";

const NODES = [
  { text: "Rooted in community", top: "20%", leftBase: "50%", leftLg: "50%", img: "/assets/nodes/rooted.png" },
  { text: "Connect community", top: "34%", leftBase: "26%", leftLg: "28%", img: "/assets/nodes/connect.png" },
  { text: "Live events", top: "44%", leftBase: "74%", leftLg: "74%", img: "/assets/nodes/live.png" },
  { text: "Exclusive rewards", top: "65%", leftBase: "30%", leftLg: "13%", img: "/assets/nodes/rewards.png" },
  { text: "Endless possibilities", top: "75%", leftBase: "70%", leftLg: "87%", img: "/assets/nodes/possibilities.png" },
];

export default function Descent() {
  const section = useRef<HTMLElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const breakpoint = useBreakpoint();
  const isLg = breakpoint === "lg" || breakpoint === "xl" || breakpoint === "2xl";

  useGSAP(
    () => {
      const roots = gsap.utils.toArray<SVGPathElement>(".root");
      roots.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      if (reduced) {
        // Show everything immediately, no scroll-linked motion.
        gsap.set(roots, { strokeDashoffset: 0 });
        gsap.set(".node", { autoAlpha: 1 });
        gsap.set(hint.current, { autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // Roots grow into the soil across the descent.
      tl.to(roots, {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.05,
        duration: 1,
      });

      // Messages light up at points along the way.
      tl.from(
        ".node",
        {
          autoAlpha: 0,
          scale: 0.6,
          y: 24,
          stagger: 0.18,
          ease: "power2.out",
          duration: 0.4,
        },
        0.2
      );

      // A continuous energy pulse along the network, independent of scroll.
      // Targets only the crisp cores so the wide glow strokes are left for the
      // scroll-draw above (and to keep the idle animation light).
      gsap.to(".root", {
        opacity: 0.6,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.1, from: "random" },
      });

      // Scroll cue — fixed to the viewport, so it can show during the
      // Hero→Descent transition. It fades in as the Hero scrolls up and this
      // section starts entering, then fades out the moment the section pins at
      // the top and the root-drawing animation begins. A single onToggle
      // handles show/hide in both directions, so there's nothing to conflict.
      // xPercent keeps it horizontally centered: GSAP owns the transform, so a
      // Tailwind -translate-x-1/2 would be overwritten the moment y animates.
      gsap.set(hint.current, { autoAlpha: 0, y: 16, xPercent: -50 });

      ScrollTrigger.create({
        trigger: section.current,
        start: "top 80%", // section starts entering — Hero is scrolling away
        // end: "top top",
        onToggle: (self) =>
          gsap.to(hint.current, {
            autoAlpha: self.isActive ? 1 : 0,
            y: self.isActive ? 0 : 12,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
          }),
      });
    },
    { scope: section, dependencies: [reduced] }
  );

  return (
    <section
      ref={section}
      className="relative w-full"
      style={{
        height: "340vh",
        background:
          // "linear-gradient(180deg, var(--soil-top) 0%, var(--soil-bottom) 100%)",
          "black"
      }}
      aria-label="Underground — the mycelium network"
    >
      {/* sticky viewport-sized canvas — overflow left visible so the root
          strands and their glow bleed past the edges instead of being clipped */}
      <div className="sticky top-0 h-svh w-full">
        <MyceliumRoots className="absolute inset-0 h-full w-full" />

        {NODES.map((n, i) => {
          const left = isLg ? n.leftLg : n.leftBase;
          return (
            <div
              key={i}
              className="node absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ top: n.top, left: left, willChange: "opacity, transform" }}
            >
              <div
                className="mx-auto mb-3 relative rounded-full overflow-hidden w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
                style={{
                  boxShadow:
                    "0 0 10px 3px rgba(125,255,87,0.8), 0 0 26px 8px rgba(255,122,24,0.35)",
                  animation: `halo 2.4s ease-in-out ${i * 0.3}s infinite`,
                  willChange: "opacity, transform",
                }}
              >
                <Image src={n.img} alt="" fill sizes="112px" className="object-cover" />
              </div>
              <span className="font-display text-glow-green block text-lg font-semibold tracking-wide sm:text-2xl">
                {n.text}
              </span>
            </div>
          );
        })}

        {/* Scroll cue — fixed to the viewport so it shows during the
            Hero→Descent transition. Visibility is driven by GSAP (autoAlpha),
            so it starts hidden. */}
        <div
          ref={hint}
          className="invisible fixed bottom-8 left-1/2 flex flex-col items-center gap-3 rounded-full px-6 py-3"
          style={{
            willChange: "opacity, transform",
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
          }}
        >
          <span className="font-display text-glow-green text-base font-semibold uppercase tracking-[0.3em] sm:text-lg lg:text-xl">
            Keep digging
          </span>
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--green)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="descent-arrow"
            style={{ filter: "drop-shadow(0 0 10px rgba(125,255,87,0.9))" }}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
