"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import MyceliumRoots from "@/components/graphics/MyceliumRoots";

const NODES = [
  { text: "Rooted in community", top: "20%", left: "50%" },
  { text: "Connect community", top: "34%", left: "26%" },
  { text: "Live events", top: "44%", left: "74%" },
  { text: "Exclusive rewards", top: "62%", left: "30%" },
  { text: "Endless possibilities", top: "72%", left: "70%" },
];

export default function Descent() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

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
      gsap.to(".root-core", {
        opacity: 0.6,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.1, from: "random" },
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
          "linear-gradient(180deg, var(--soil-top) 0%, var(--soil-bottom) 100%)",
      }}
      aria-label="Underground — the mycelium network"
    >
      {/* sticky viewport-sized canvas — overflow left visible so the root
          strands and their glow bleed past the edges instead of being clipped */}
      <div className="sticky top-0 h-svh w-full">
        <MyceliumRoots className="absolute inset-0 h-full w-full" />

        {NODES.map((n, i) => (
          <div
            key={i}
            className="node absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ top: n.top, left: n.left }}
          >
            <span
              className="mx-auto mb-3 block rounded-full"
              style={{
                width: 14,
                height: 14,
                background: "var(--green)",
                boxShadow:
                  "0 0 10px 3px rgba(125,255,87,0.8), 0 0 26px 8px rgba(255,122,24,0.35)",
                animation: `halo 2.4s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
            <span className="font-display text-glow-green block text-lg font-semibold tracking-wide sm:text-2xl">
              {n.text}
            </span>
          </div>
        ))}

        {/* a hint that there is more below */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs lg:text-xl uppercase tracking-[0.3em] text-white animate-pulse">
          keep digging
        </p>
      </div>
    </section>
  );
}
