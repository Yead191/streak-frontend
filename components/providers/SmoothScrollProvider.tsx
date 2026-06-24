"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Drives the whole page with Lenis inertia scrolling and keeps GSAP's
 * ScrollTrigger perfectly in sync by running a single RAF loop off GSAP's
 * ticker. This is the production-standard pairing: native scroll stays
 * intact (scrollbar, anchors, accessibility), we just smooth it.
 *
 * When the visitor prefers reduced motion we skip the inertia entirely so
 * scrolling is instant and comfortable.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch smoothing is opt-in; it can feel laggy on iOS, so keep it light.
      syncTouch: false,
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
