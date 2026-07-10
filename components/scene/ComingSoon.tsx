"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import StreakLogo from "@/components/graphics/StreakLogo";

const SLOGAN = ["Rooted", "in", "community"];

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function ComingSoon() {
  const section = useRef<HTMLElement>(null);
  const badges = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();

  // State for waitlist form
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Check local storage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("streak:waitlist_email");
    if (savedEmail) {
      setStatus("success");
    }
  }, []);

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(
          ".cs-logo, .cs-badge, .cs-eyebrow, .slogan-word, .cs-sub, .cs-form, .cs-roadmap, .cs-store-badge, .cs-foot",
          { autoAlpha: 1, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: "top 70%" },
      });

      tl.from(".cs-logo", {
        autoAlpha: 0,
        y: 24,
        scale: 0.85,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(".cs-badge", { autoAlpha: 0, y: 12, duration: 0.5 }, "-=0.4")
        .from(".cs-eyebrow", { autoAlpha: 0, y: 16, duration: 0.5 }, "-=0.3")
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
        .from(".cs-sub", { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(".cs-form", { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from(".cs-roadmap", { autoAlpha: 0, y: 20, duration: 0.7 }, "-=0.3")
        .from(".cs-foot", { autoAlpha: 0, duration: 0.6 }, "-=0.1");

      // Badges scroll-in stagger
      gsap.from(".cs-store-badge", {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    // Read Formspree ID from client environment variable or use the fallback ID from your env.local
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
    if (!formspreeId) {
      console.error("Formspree ID is not defined.");
      setStatus("error");
      setErrorMessage("Formspree ID is not defined.");
      return;
    }
    const formspreeEndpoint = formspreeId.startsWith("http")
      ? formspreeId
      : `https://formspree.io/f/${formspreeId}`;

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          phone: phone || "Not provided",
          _subject: `New Streak Waitlist Pre-Signup from ${email.toLowerCase()}`,
        }),
      });

      if (response.ok) {
        localStorage.setItem("streak:waitlist_email", email.toLowerCase());

        // Morph animation transition
        gsap.to(".cs-form-content", {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          onComplete: () => {
            setStatus("success");
            gsap.fromTo(
              ".cs-success-content",
              { opacity: 0, scale: 0.95, filter: "blur(5px)" },
              { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }
            );
          },
        });
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus("error");
        setErrorMessage(data.error || "Formspree submission failed. Check your Formspree settings.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Could not connect to Formspree. Check your network connection.");
    }
  };


  const handleLockedBadgeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll to form smoothly
    const formElement = document.getElementById("waitlist-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
      // Temporary pulsing highlight on input
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
          gsap.fromTo(
            inputRef.current,
            { boxShadow: "0 0 0px var(--green)" },
            {
              boxShadow: "0 0 20px 4px var(--green)",
              duration: 0.4,
              yoyo: true,
              repeat: 3
            }
          );
        }, 500);
      }
    }
  };

  return (
    <section
      ref={section}
      id="waitlist-section"
      className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
      style={{ background: "var(--soil-bottom)" }}
      aria-label="Streak Coming Soon"
    >
      {/* Ambient bioluminescent glow blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="blob-drift absolute left-1/2 top-1/3 h-[55vh] w-[55vh] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-linear(circle, rgba(125,255,87,0.1) 0%, rgba(125,255,87,0.02) 40%, transparent 70%)",
          }}
        />
        <div
          className="blob-drift absolute right-[12%] top-[18%] h-[38vh] w-[38vh] rounded-full"
          style={{
            background:
              "radial-linear(circle, rgba(255,122,24,0.08) 0%, rgba(255,122,24,0.01) 40%, transparent 70%)",
            animationDelay: "-6s",
          }}
        />
      </div>

      {/* Faint floating spores for depth (deterministic positions) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {Array.from({ length: 16 }).map((_, i) => {
          const left = (i * 59) % 100;
          const top = (i * 37) % 100;
          const size = 2 + (i % 3);
          const dur = 6 + ((i * 8) % 6);
          const delay = -((i * 0.7) % 8);
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

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        {/* Logo */}
        <div
          className="cs-logo logo-bob mb-8"
          style={{ filter: "drop-shadow(0 0 30px rgba(125,255,87,0.45))" }}
        >
          <StreakLogo className="h-20 w-auto sm:h-24" />
        </div>

        {/* Premium Stage Badge */}
        <div className="cs-badge mb-6 inline-flex items-center gap-2 rounded-full border border-(--green)/45 bg-[#0b140c] px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--green) opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-(--green)" />
          </span>
          <span className="font-display text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-(--green)">
            Coming Soon
          </span>
        </div>

        <p className="cs-eyebrow mb-6 text-xs uppercase tracking-[0.45em] text-white/55">
          Ecosystem Launch
        </p>

        {/* Hero slogan — the centerpiece */}
        <h2 className="font-display slogan-glow mb-7 text-balance text-5xl font-bold leading-[1.05] sm:text-7xl md:text-8xl">
          {SLOGAN.map((word, i) => (
            <span key={i} className="slogan-word mr-[0.25em] inline-block">
              {word}
            </span>
          ))}
        </h2>

        <p className="cs-sub mb-10 max-w-2xl text-base text-white/65 sm:text-lg leading-relaxed">
          The mycelium network is growing underground. While our developers build the mobile ecosystem for connecting live events, early community members can secure access keys and receive unique launch rewards.
        </p>

        {/* Waitlist Subscription Widget */}
        <div className="cs-form w-full max-w-lg mb-16">
          {status !== "success" ? (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="cs-form-content relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#0c120c] p-6 sm:p-8 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
              style={{
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 50px rgba(0,0,0,0.7)"
              }}
            >
              <div className="absolute -top-px left-1/2 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-(--green)/50 to-transparent"></div>

              <div className="flex flex-col gap-1 text-left mb-2">
                <h3 className="font-display text-lg font-bold text-white tracking-wide">The ecosystem is almost ready</h3>
                <p className="text-xs text-white/50">Be the first to know when Streak goes live. Drop your email and we'll let you know the moment the doors open.</p>
              </div>

              {/* Email Address */}
              <div className="relative flex flex-col gap-1.5 text-left">
                <label htmlFor="cs-email" className="text-xs font-semibold text-white/70 uppercase tracking-wider ml-1">
                  Email Address <span className="text-(--green)">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="cs-email"
                    type="email"
                    required
                    disabled={status === "loading"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/15 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-(--green)/60 focus:bg-black/60 focus:ring-1 focus:ring-(--green)/25"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Phone Number (Optional) */}
              <div className="relative flex flex-col gap-1.5 text-left">
                <label htmlFor="cs-phone" className="text-xs font-semibold text-white/70 uppercase tracking-wider ml-1 flex justify-between">
                  <span>Phone Number</span>
                  <span className="text-white/40 normal-case font-normal">Optional SMS alerts</span>
                </label>
                <div className="relative">
                  <input
                    id="cs-phone"
                    type="tel"
                    disabled={status === "loading"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-2xl border border-white/15 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-(--green)/60 focus:bg-black/60 focus:ring-1 focus:ring-(--green)/25"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-(--green) to-(--green-deep) py-3.5 font-display text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  boxShadow: "0 8px 24px rgba(125,255,87,0.35)"
                }}
              >
                {/* Shine effect */}
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

                {status === "loading" ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Join the Network</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>

              {status === "error" && (
                <div className="mt-2 text-xs font-semibold text-(--orange) flex items-center justify-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>
          ) : (
            <div className="cs-success-content relative flex flex-col items-center gap-6 rounded-3xl border border-(--green)/35 bg-[#09150b] p-8 sm:p-10 shadow-[0_20px_50px_rgba(125,255,87,0.15)]">
              <div className="absolute -top-px left-1/2 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-(--green) to-transparent"></div>

              {/* Pulsing check circle */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-(--green)/10 border border-(--green)/30">
                <span className="absolute inset-0 rounded-full border border-(--green)/40 animate-ping opacity-25" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-display text-2xl font-bold text-white tracking-wide">Root System Connected</h3>
                <p className="text-sm text-white/60 max-w-sm">
                  You are officially locked into early access. We will alert you the moment our sprout breaks ground.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Project Roadmap Visualizer */}
        {/* <EcosystemRoadmap /> */}

        {/* Store Badges - Locked State */}
        <div className="flex flex-col items-center">
          <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-white/35 font-bold">
            Future App Store Availability
          </p>
          <div ref={badges} className="flex flex-col items-center gap-4 sm:flex-row">
            <StoreBadgeLocked
              onClick={handleLockedBadgeClick}
              ariaLabel="Download Streak on the App Store (Locked - Available in Phase 3)"
              eyebrow="Download on the"
              title="App Store"
              icon={<AppleIcon />}
            />
            <StoreBadgeLocked
              onClick={handleLockedBadgeClick}
              ariaLabel="Get Streak on Google Play (Locked - Available in Phase 3)"
              eyebrow="Get it on"
              title="Google Play"
              icon={<PlayIcon />}
            />
          </div>
        </div>

        {/* Footer */}
        <p className="cs-foot font-display mt-20 text-sm uppercase tracking-[0.4em] text-white/45">
          Streak — Rooted in community
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */

function StoreBadgeLocked({
  icon,
  eyebrow,
  title,
  ariaLabel,
  onClick,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  ariaLabel: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <a
      href="#waitlist-section"
      onClick={onClick}
      aria-label={ariaLabel}
      className="cs-store-badge group relative flex w-60 items-center gap-3 overflow-visible rounded-2xl border border-white/10 px-5 py-3 transition-all duration-300 opacity-40 hover:opacity-75 sm:w-56 cursor-pointer"
      style={{
        background: "linear-linear(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)"
      }}
    >
      <span className="shrink-0 text-white/50">{icon}</span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-white/40">
          {eyebrow}
        </span>
        <span className="font-display text-lg font-semibold text-white/50">
          {title}
        </span>
      </span>

      {/* Locked Badge Overlay */}
      <span className="absolute -top-2 right-3 rounded-full bg-[#1b221b] border border-white/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white/70 flex items-center gap-1">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Soon</span>
      </span>
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
        fill="currentColor"
      />
      <path d="M16.8 8.3 13 12l3.8 3.7 3.9-2.2c1.1-.6 1.1-2.2 0-2.9l-3.9-2.3z" fill="currentColor" />
      <path d="M3.5 2.2 12.8 12l3.5-3.4L5.6 1.5C4.9 1.1 4 1.4 3.5 2.2z" fill="currentColor" />
      <path d="M3.5 21.8c.5.8 1.4 1.1 2.1.7l10.7-7.1L12.8 12 3.5 21.8z" fill="currentColor" />
    </svg>
  );
}
