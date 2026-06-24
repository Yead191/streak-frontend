"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import StreakLogo from "@/components/graphics/StreakLogo";

export default function ComingSoon() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".cs-reveal", {
        scrollTrigger: { trigger: section.current, start: "top 75%" },
        autoAlpha: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    { scope: section, dependencies: [reduced] }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: wire this to your provider (Resend / Mailchimp / ConvertKit, etc.)
    setSubmitted(true);
  }

  return (
    <section
      ref={section}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 py-32 text-center"
      style={{ background: "var(--soil-bottom)" }}
      aria-label="Streak is coming soon"
    >
      <div
        className="cs-reveal logo-bob relative mb-10"
        style={{ filter: "drop-shadow(0 0 30px rgba(125,255,87,0.5))" }}
      >
        <StreakLogo className="h-28 w-auto" />
      </div>

      <p className="cs-reveal mb-3 text-xs uppercase tracking-[0.4em] text-[var(--green)]">
        Coming soon
      </p>
      <h2 className="cs-reveal font-display mb-5 text-3xl font-bold sm:text-5xl">
        The ecosystem is almost ready
      </h2>
      <p className="cs-reveal mb-10 max-w-md text-white/60">
        Be the first to know when Streak goes live. Drop your email and we&apos;ll
        let you know the moment the doors open.
      </p>

      {submitted ? (
        <p className="cs-reveal text-glow-green font-display text-xl">
          You&apos;re on the list. See you underground. 🌱
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="cs-reveal flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            aria-label="Email address"
            className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white placeholder-white/40 outline-none transition focus:border-[var(--green)]"
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--green)] px-7 py-3 font-medium text-black transition hover:brightness-110"
          >
            Notify me
          </button>
        </form>
      )}

      {/* App store badges — disabled until the app ships */}
      <div className="cs-reveal mt-10 flex items-center gap-4 opacity-50">
        <span className="rounded-xl border border-white/20 px-5 py-2 text-sm">
          App Store — soon
        </span>
        <span className="rounded-xl border border-white/20 px-5 py-2 text-sm">
          Google Play — soon
        </span>
      </div>

      {/* slogan, rooted at the deepest point */}
      <p className="font-display absolute bottom-8 left-1/2 -translate-x-1/2 text-sm uppercase tracking-[0.4em] text-white/70">
        Rooted in community
      </p>
    </section>
  );
}
