"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import StreakLogo from "@/components/graphics/StreakLogo";

const CLOUDS = [
  { src: "/assets/cloud/cloud1.png", top: "12%", width: 260, dur: 140, delay: 0, opacity: 0.9 },
  { src: "/assets/cloud/cloud2.png", top: "24%", width: 190, dur: 180, delay: -60, opacity: 0.7 },
  { src: "/assets/cloud/cloud3.png", top: "8%", width: 150, dur: 210, delay: -120, opacity: 0.6 },
  { src: "/assets/cloud/cloud4.png", top: "20%", width: 220, dur: 165, delay: -90, opacity: 0.5 },
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
          "linear-gradient(180deg, var(--sky-top) 10%, var(--sky-bottom) 41%, var(--grass) 50%, var(--soil-top) 100%)"
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
            }}
          />
        ))}
      </div>

      {/* slogan, whispered at the very top */}
      <p className="font-display absolute left-1/2 top-[7%] -translate-x-1/2 text-center text-sm tracking-[0.35em] text-white/55 uppercase">
        Rooted in community
      </p>

      {/* the logo, sitting on the surface */}
      <div className="logo-bob absolute bottom-[25%] left-1/2 -translate-x-1/2 z-10">
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
        <div className="origin-bottom" style={{ animation: "sway 3.5s ease-in-out infinite" }}>
          <StreakLogo className="hero-logo h-[34vh] max-h-80 w-auto drop-shadow-[0_0_25px_rgba(125,255,87,0.4)] " />
        </div>
      </div>

      {/* photographic grass & soil ground — a background layer (z-0) anchored
          to the bottom, so the Descent section's root lines read above it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[52vh] w-full"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 14%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 14%)",
        }}
      >
        <Image
          src="/assets/hero/grass-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="select-none object-cover object-bottom"
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

// Glowing fireflies hovering over the grass. Positions/timings are derived
// deterministically from the index so server and client render identically.
function Fireflies() {
  const count = 22;
  return (
    <div
      className="pointer-events-none absolute inset-0 z-2"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 61) % 100;
        const bottom = 24 + ((i * 37) % 24); // 24%–48% — over the grass band
        const size = 2 + (i % 3); // 2–4px
        const dur = 5 + ((i * 13) % 7); // 5–11s float cycle
        const delay = -((i * 0.9) % 8); // staggered, already mid-flight
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
                "radial-gradient(circle, #fff6b0 0%, #ffdf4d 45%, rgba(255,200,40,0) 72%)",
              boxShadow: "0 0 7px 2px rgba(255,224,77,0.75)",
              animation: `firefly ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

