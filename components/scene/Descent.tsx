"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import MyceliumRoots from "@/components/graphics/MyceliumRoots";
import useBreakpoint from "@/hooks/useBreakpoint";

type NodeType = {
  text: string;
  desc: string;
  top: string;
  leftBase: string;
  leftLg: string;
  img: string;
  side: "top" | "bottom" | "left" | "right";
};


export default function Descent() {
  const section = useRef<HTMLElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const breakpoint = useBreakpoint();
  const isLg = breakpoint === "lg" || breakpoint === "xl" || breakpoint === "2xl";


  const NODES: NodeType[] = [
    {
      text: "Rooted in Community",
      desc: "Streak's foundation stems from the unity that is created collectively.",
      top: "20%", leftBase: "50%", leftLg: "50%", img: "/assets/nodes/rooted.png",
      side: "bottom"
    },
    {
      text: "Connect Globally",
      desc: "Connect to worldwide businesses and unlock unique points and rewards from purchasing tickets to live events.",
      top: isLg ? "34%" : "44%", leftBase: "23%", leftLg: "28%", img: "/assets/nodes/connect.png",
      side: "right"
    },
    {
      text: "Live Events",
      desc: "Streaks' goal is to connect people with new experiences and exciting events around the world.",
      top: "44%", leftBase: "74%", leftLg: "74%", img: "/assets/nodes/live.png",
      side: "left"
    },
    {
      text: "Exclusive Rewards",
      desc: "Earn exclusive rewards only available in the Streaks ecosystem.",
      top: "65%", leftBase: "30%", leftLg: "13%", img: "/assets/nodes/rewards.png",
      side: "right"
    },
    {
      text: "Endless Possibilities",
      desc: "Tap into the shared collective experience.",
      top: "75%", leftBase: "70%", leftLg: "87%", img: "/assets/nodes/possibilities.png",
      side: "left"
    },
  ];


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
        stagger: 0.09,
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
        duration: 2.4,
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

        {NODES.map((n, i) => (
          <NodeItem key={i} n={n} i={i} isLg={isLg} />
        ))}

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

function NodeItem({ n, i, isLg }: { n: NodeType, i: number, isLg: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const left = isLg ? n.leftLg : n.leftBase;

  let positionClasses = "top-full left-1/2 -translate-x-1/2 mt-4";
  if (isLg) {
    switch (n.side) {
      case "top":
        positionClasses = "bottom-full left-1/2 -translate-x-1/2 mb-4";
        break;
      case "bottom":
        positionClasses = "top-full left-1/2 -translate-x-1/2 mt-4";
        break;
      case "left":
        positionClasses = "right-full top-1/2 -translate-y-1/2 mr-4";
        break;
      case "right":
        positionClasses = "left-full top-1/2 -translate-y-1/2 ml-4";
        break;
    }
  } else {
    // Smart mobile positioning: align inward if near viewport edges
    const leftVal = parseFloat(n.leftBase);
    if (leftVal < 40) {
      positionClasses = "top-full left-0 mt-4";
    } else if (leftVal > 60) {
      positionClasses = "top-full right-0 mt-4";
    }
  }

  return (
    <div
      className={`node group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer outline-none touch-manipulation ${isOpen ? 'z-50' : 'z-30'} lg:hover:z-50`}
      style={{ top: n.top, left: left, willChange: "transform" }}
      onClick={() => { if (!isLg) setIsOpen(!isOpen); }}
      onMouseLeave={() => { if (!isLg) setIsOpen(false); }}
    >
      <div className="relative">
        <div
          className="mx-auto relative rounded-full overflow-hidden w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 transition-transform duration-300 group-hover:scale-105"
          style={{
            boxShadow:
              "0 0 10px 3px rgba(125,255,87,0.8), 0 0 26px 8px rgba(255,122,24,0.35)",
            // animation: `halo 2.4s ease-in-out ${i * 0.3}s infinite`,
            willChange: "opacity, transform",
          }}
        >
          <Image src={n.img} alt="" fill sizes="112px" className="object-cover" />
        </div>
      </div>

      <span className="font-display text-glow-green mt-4 block text-lg font-semibold tracking-wide sm:text-2xl whitespace-nowrap transition-colors duration-300 pointer-events-none group-hover:text-white">
        {n.text}
      </span>

      <div
        className={`absolute z-[100] ${positionClasses} w-[85vw] max-w-[260px] sm:max-w-[280px] md:max-w-none md:w-[320px] rounded-[20px] p-px shadow-[0_15px_40px_-10px_rgba(125,255,87,0.25)] bg-transparent transition-all duration-300 pointer-events-none ${isOpen ? "opacity-100 visible" : "opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible"}`}
      >
        <div className="absolute inset-0 bg-linear-to-br from-(--green)/70 via-transparent to-(--orange)/60 opacity-90 rounded-[20px]"></div>

        <div className="relative flex flex-col gap-2 rounded-[19px] bg-[#050905]/95 backdrop-blur-3xl p-5 text-left">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"></div>

          <h4 className="font-display text-transparent bg-clip-text bg-linear-to-r from-(--green) to-(--white) text-[1.1rem] font-bold tracking-wide m-0 pb-2 border-b border-white/10">
            {n.text}
          </h4>

          <p className="text-white/90 text-[0.95rem] leading-relaxed font-sans m-0 mt-1 whitespace-normal">
            {n.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
