"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import StreakLogo from "@/components/graphics/StreakLogo";
import useBreakpoint from "@/hooks/useBreakpoint";

// Slow, calm drift — but still perceptible so the loop reads as alive. Each
// cloud sits at a distinct height and starts at a distinct point along its path
// (negative delays), and one drifts the opposite way (reverse) from the right.
const CLOUDS = [
  { src: "/assets/cloud/cloud1.png", top: "8%", width: 260, dur: 350, delay: -35, opacity: 0.9, reverse: false },
  { src: "/assets/cloud/cloud2.png", top: "6%", width: 190, dur: 290, delay: -57, opacity: 0.7, reverse: false },
  { src: "/assets/cloud/cloud3.png", top: "5%", width: 150, dur: 370, delay: -79, opacity: 0.6, reverse: false },
  { src: "/assets/cloud/cloud4.png", top: "2%", width: 220, dur: 230, delay: -74, opacity: 0.5, reverse: false },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      // The logo rises out of the soil on load, like a mushroom breaking ground.
      gsap.from(".hero-logo", {
        y: 120,
        scale: 0.6,
        opacity: 0,
        duration: 1.6,
        ease: "power3.out",
        delay: 0.2,
      });
      gsap.from(".scroll-hint", {
        opacity: 0,
        duration: 1,
        delay: 1.6,
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      className="relative h-svh w-full overflow-hidden"
      style={{
        // background:
        //   "linear-gradient(180deg, var(--sky-top) 10%, var(--sky-bottom) 41%, var(--grass) 53%, var(--soil-top) 100%)",
        background:
          "linear-gradient(180deg, var(--sky-top) 10%, var(--sky-bottom) 41%, var(--soil-top) 100%)"
      }}
      aria-label="Streak — surface"
    >
      {/* stars */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full bg-white"
            style={{
              top: `${(i * 53) % 45}%`,
              left: `${(i * 37) % 100}%`,
              width: i % 3 === 0 ? 2 : 1,
              height: i % 3 === 0 ? 2 : 1,
              opacity: 0.15 + ((i * 7) % 50) / 100,
            }}
          />
        ))}
      </div>

      {/* drifting clouds */}
      <div className="pointer-events-none absolute inset-0">
        {CLOUDS.map((c, i) => (
          <img
            key={i}
            src={c.src}
            alt=""
            aria-hidden="true"
            className="cloud absolute left-0 top-0 max-w-none select-none"
            style={{
              top: c.top,
              width: c.width,
              opacity: c.opacity,
              animation: `drift ${c.dur}s linear ${c.delay}s infinite`,
              animationDirection: c.reverse ? "reverse" : "normal",
            }}
          />
        ))}
      </div>

      {/* slogan, whispered at the very top */}
      <p className="font-display absolute left-1/2 top-[7%] -translate-x-1/2 text-center text-sm tracking-[0.35em] text-white/55 uppercase">
        Rooted in community
      </p>

      {/* the logo, sitting on the surface */}
      <div className="logo-bob absolute bottom-[8%] lg:bottom-[28%] left-1/2 -translate-x-1/2 z-10">
        <div
          className="logo-halo absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 360,
            height: 360,
            background:
              "radial-gradient(circle, rgba(125,255,87,0.55) 0%, rgba(255,122,24,0.18) 40%, transparent 70%)",
            animation: "halo 3.2s ease-in-out infinite",
          }}
        />
        <div className="origin-bottom"
        // style={{ animation: "sway 3.5s ease-in-out infinite" }}
        >
          <StreakLogo className="hero-logo h-[38vh] max-h-80 w-auto lg:h-[50vh] lg:max-h-84 object-contain" />
        </div>
      </div>

      {/* photographic grass & soil ground — a background layer (z-0) anchored
          to the bottom, so the Descent section's root lines read above it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[25vh] lg:h-[80vh] w-full"
      // style={{
      //   maskImage: "linear-gradient(to bottom, transparent 0%, #000 14%)",
      //   WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 14%)",
      // }}
      >
        <Image
          src="/assets/hero/grass-bg3.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="select-none object-cover object-top"
        />
      </div>

      {/* glowing fireflies drifting over the grass */}
      <Fireflies />

      {/* wordless scroll cue */}
      <div className="scroll-hint absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <svg
          width="26"
          height="40"
          viewBox="0 0 26 40"
          fill="none"
          aria-hidden="true"
        >
          {[0, 1, 2].map((n) => (
            <path
              key={n}
              d={`M3 ${8 + n * 9} L13 ${16 + n * 9} L23 ${8 + n * 9}`}
              stroke="var(--green)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: `hint 1.8s ease-in-out ${n * 0.18}s infinite`,
              }}
            />
          ))}
        </svg>
      </div>
    </section>
  );
}

function Fireflies() {
  const breakpoint = useBreakpoint();
  const count = (breakpoint === "lg" || breakpoint === "xl") ? 16 : 10;
  const baseBottom = (breakpoint === "lg" || breakpoint === "xl") ? 30 : 10;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-2"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 61) % 100;

        // 3. Apply your dynamic logic here
        const bottom = baseBottom + ((i * 37) % 34);

        // (Alternatively, you can write it exactly as you drafted:)
        // const bottom = breakpoint === "lg" ? 30 + ((i * 37) % 34) : 10 + ((i * 37) % 34);

        const size = 4 + (i % 4) * 1.5; // 4–8.5px
        const dur = 4 + ((i * 13) % 6); // 4–10s float cycle
        const delay = -((i * 0.7) % 9); // staggered, already mid-flight

        return (
          <span
            key={i}
            className="firefly absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: `${bottom}%`,
              width: size,
              height: size,
              background:
                "radial-gradient(circle, #ffffff 0%, #fff39a 35%, #ffd23d 60%, rgba(255,190,40,0) 78%)",
              boxShadow:
                "0 0 8px 2px rgba(255,224,77,0.95), 0 0 18px 6px rgba(255,180,40,0.55)",
              animation: `firefly ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
