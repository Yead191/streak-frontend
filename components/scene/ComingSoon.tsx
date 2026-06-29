"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import StreakLogo from "@/components/graphics/StreakLogo";

// Wire these to the real listings once the apps are published.
const APP_STORE_URL = "#";
const PLAY_STORE_URL = "#";

const SLOGAN = ["Rooted", "in", "community"];

type Platform = "ios" | "android" | null;

export default function ComingSoon() {
  const section = useRef<HTMLElement>(null);
  const badges = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [platform, setPlatform] = useState<Platform>(null);

  // Subtly emphasise the store that matches the visitor's device. Done after
  // mount so server and client markup stay identical (no hydration mismatch).
  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua)) setPlatform("ios");
    else if (/Android/i.test(ua)) setPlatform("android");
  }, []);

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(
          ".end-logo, .end-eyebrow, .slogan-word, .end-sub, .end-badge, .end-foot",
          { autoAlpha: 1, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: "top 70%" },
      });

      tl.from(".end-logo", {
        autoAlpha: 0,
        y: 24,
        scale: 0.85,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(".end-eyebrow", { autoAlpha: 0, y: 16, duration: 0.5 }, "-=0.3")
        .from(
          ".slogan-word",
          {
            autoAlpha: 0,
            y: 40,
            filter: "blur(10px)",
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .from(".end-sub", { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(".end-foot", { autoAlpha: 0, duration: 0.6 }, "-=0.1");

      // Badges get their OWN trigger on the badge row itself (not the tall
      // section) so the animation fires exactly when they enter the viewport.
      // immediateRender:false keeps them visible by default — they can never
      // get stuck hidden if the trigger/refresh misbehaves.
      gsap.from(".end-badge", {
        scrollTrigger: { trigger: badges.current, start: "top 90%" },
        autoAlpha: 0,
        y: 28,
        scale: 0.9,
        stagger: 0.15,
        duration: 0.6,
        ease: "back.out(1.6)",
        immediateRender: false,
      });
    },
    { scope: section, dependencies: [reduced] }
  );

  return (
    <section
      ref={section}
      className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden px-6 py-28  text-center"
      style={{ background: "var(--soil-bottom)" }}
      aria-label="Download Streak"
    >
      {/* Ambient bioluminescent glow blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="blob-drift absolute left-1/2 top-1/3 h-[55vh] w-[55vh] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-linear(circle, rgba(125,255,87,0.18) 0%, rgba(125,255,87,0) 70%)",
            filter: "blur(20px)",
          }}
        />
        <div
          className="blob-drift absolute right-[12%] top-[18%] h-[38vh] w-[38vh] rounded-full"
          style={{
            background:
              "radial-linear(circle, rgba(255,122,24,0.14) 0%, rgba(255,122,24,0) 70%)",
            filter: "blur(20px)",
            animationDelay: "-6s",
          }}
        />
      </div>

      {/* Faint floating spores for depth (deterministic positions) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => {
          const left = (i * 67) % 100;
          const top = (i * 41) % 100;
          const size = 2 + (i % 3);
          const dur = 5 + ((i * 7) % 5);
          const delay = -((i * 0.9) % 8);
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                background: "rgba(125,255,87,0.7)",
                boxShadow: "0 0 8px 2px rgba(125,255,87,0.5)",
                animation: `firefly ${dur}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div
          className="end-logo logo-bob mb-8"
          style={{ filter: "drop-shadow(0 0 30px rgba(125,255,87,0.45))" }}
        >
          <StreakLogo className="h-20 w-auto sm:h-24" isFooter={true} />
        </div>

        <p className="end-eyebrow mb-6 text-xs uppercase tracking-[0.45em] text-(--green)">
          The Streak app is here
        </p>

        {/* Hero slogan — the centerpiece */}
        <h2 className="font-display slogan-glow mb-7 text-balance text-5xl font-bold leading-[1.05] sm:text-7xl md:text-8xl">
          {SLOGAN.map((word, i) => (
            <span key={i} className="slogan-word mr-[0.25em] inline-block">
              {word}
            </span>
          ))}
        </h2>

        <p className="end-sub mb-12 max-w-lg text-base text-white/65 sm:text-lg">
          Join the ecosystem in your pocket. Discover live events, connect with
          your community, and unlock exclusive rewards — wherever you go.
        </p>

        {/* Store badges */}
        <div ref={badges} className="flex flex-col items-center gap-4 sm:flex-row">
          <StoreBadge
            href={APP_STORE_URL}
            recommended={platform === "ios"}
            ariaLabel="Download Streak on the App Store"
            eyebrow="Download on the"
            title="App Store"
            icon={<AppleIcon />}
          />
          <StoreBadge
            href={PLAY_STORE_URL}
            recommended={platform === "android"}
            ariaLabel="Get Streak on Google Play"
            eyebrow="Get it on"
            title="Google Play"
            icon={<PlayIcon />}
          />
        </div>

        {/* Footer */}
        <p className="end-foot font-display mt-16 text-sm uppercase tracking-[0.4em] text-white/45">
          Streak — Rooted in community
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */

function StoreBadge({
  href,
  icon,
  eyebrow,
  title,
  ariaLabel,
  recommended,
}: {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  ariaLabel: string;
  recommended?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={`end-badge group relative flex w-60 items-center gap-3 overflow-visible rounded-2xl border px-5 py-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 sm:w-56 ${recommended
        ? "border-(--green)/70"
        : "border-white/25 hover:border-white/45"
        }`}
      style={{
        background: recommended
          ? "linear-linear(180deg, rgba(125,255,87,0.16) 0%, rgba(125,255,87,0.06) 100%)"
          : "linear-linear(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
        boxShadow: recommended
          ? "0 8px 28px rgba(0,0,0,0.45), 0 0 28px rgba(125,255,87,0.28), inset 0 1px 0 rgba(255,255,255,0.12)"
          : "0 8px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      {/* shine sweep on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
      />
      <span className="shrink-0 text-white">{icon}</span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-white/60">
          {eyebrow}
        </span>
        <span className="font-display text-lg font-semibold text-white">
          {title}
        </span>
      </span>
      {recommended && (
        <span className="absolute -top-2 right-3 rounded-full bg-(--green) px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-black">
          For you
        </span>
      )}
    </a>
  );
}

function AppleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 14.25 3.51 5.88 9.05 5.6c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.6l.01-.01zM12.03 5.55C11.88 3.32 13.69 1.48 15.77 1.3c.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3.5 2.2C3.2 2.4 3 2.8 3 3.3v17.4c0 .5.2.9.5 1.1l9.3-9.8L3.5 2.2z"
        fill="#00D2FF"
      />
      <path d="M16.8 8.3 13 12l3.8 3.7 3.9-2.2c1.1-.6 1.1-2.2 0-2.9l-3.9-2.3z" fill="#FFCE00" />
      <path d="M3.5 2.2 12.8 12l3.5-3.4L5.6 1.5C4.9 1.1 4 1.4 3.5 2.2z" fill="#00F076" />
      <path d="M3.5 21.8c.5.8 1.4 1.1 2.1.7l10.7-7.1L12.8 12 3.5 21.8z" fill="#FF3333" />
    </svg>
  );
}
