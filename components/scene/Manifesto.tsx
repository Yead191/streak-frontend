"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

const LINES = [
  "Welcome to Streak.",
  "A new live-events platform",
  "embodying the meaning of connection.",
  "Support one business.",
  "Support every business.",
  "Welcome to the ecosystem.",
];

export default function Manifesto() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(".manifesto-line", { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.from(".manifesto-line", {
        scrollTrigger: {
          trigger: section.current,
          start: "top 70%",
          end: "bottom 70%",
          scrub: 0.4,
        },
        autoAlpha: 0,
        y: 30,
        filter: "blur(8px)",
        stagger: 0.4,
        ease: "power2.out",
      });
    },
    { scope: section, dependencies: [reduced] }
  );

  return (
    <section
      ref={section}
      className="relative flex min-h-[80vh] w-full flex-col items-center justify-center px-6 py-32"
      style={{
        background: "var(--soil-bottom)",
      }}
      aria-label="Welcome to Streak"
    >
      <div className="max-w-3xl text-center">
        {LINES.map((line, i) => (
          <p
            key={i}
            className={`manifesto-line font-display mb-2 text-balance text-2xl font-semibold leading-tight sm:text-4xl md:text-5xl ${i === 0 ? "text-glow-green mb-6" : ""
              } ${i >= 3 && i <= 4 ? "text-glow-orange" : ""}`}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
