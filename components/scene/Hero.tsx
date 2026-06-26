"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import StreakLogo from "@/components/graphics/StreakLogo";
import Grass from "../graphics/Grass";

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

      {/* trees on the grass line */}
      <Trees />

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

      {/* grass overlapping the logo base */}
      <Grass />

      {/* wordless scroll cue */}
      <div className="scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2">
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

function Trees() {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0"
      style={{ bottom: "45%" }}
      aria-hidden="true"
    >
      <div className="absolute left-[8%] bottom-0">
        <Tree h={120} />
      </div>
      <div className="absolute left-[20%] bottom-0 opacity-80">
        <Tree h={84} />
      </div>
      <div className="absolute right-[10%] bottom-0">
        <Tree h={104} />
      </div>
      <div className="absolute right-[24%] bottom-0 opacity-80">
        <Tree h={72} />
      </div>
    </div>
  );
}

function Tree({ h }: { h: number }) {
  return (
    <svg width={h * 0.7} height={h} viewBox="0 0 70 100" aria-hidden="true">
      <rect x="31" y="62" width="8" height="38" fill="#2e1c10" />
      <circle cx="35" cy="40" r="28" fill="#1f4a1a" />
      <circle cx="20" cy="52" r="18" fill="#24551f" />
      <circle cx="52" cy="50" r="16" fill="#1c421a" />
    </svg>
  );
}

