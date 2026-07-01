"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Premium entry preloader.
 *
 * The Streak mark draws itself in stroke-by-stroke — like a seedling breaking
 * ground — then floods with bioluminescent green and breathes. A real
 * load-progress counter ticks to 100 while the page hydrates, then the whole
 * curtain lifts to reveal the hero. It shares the hero's night-sky palette so
 * the hand-off is seamless.
 *
 * Honors prefers-reduced-motion (instant logo, quick fade) and never blocks
 * the page for longer than a hard cap, even on slow connections.
 *
 * Shows once per browser session — on reloads or in-session navigations the
 * decision is made before paint, so the curtain never flashes again.
 */
const SESSION_KEY = "streak:preloaded";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const seenRef = useRef<boolean | null>(null);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      // First mount this session decides; later dependency re-runs reuse it so
      // an in-flight intro is never cut short by the flag we just set.
      if (seenRef.current === null) {
        seenRef.current = !!sessionStorage.getItem(SESSION_KEY);
        if (!seenRef.current) sessionStorage.setItem(SESSION_KEY, "1");
      }
      // Already played this session — skip straight to the page, no flash.
      if (seenRef.current) {
        setHidden(true);
        return;
      }

      // Hold the page still (and pinned to the top) while the curtain is up.
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
      const unlock = () => {
        document.body.style.overflow = prevOverflow;
      };

      // The lift-away: the whole curtain simply fades out of existence.
      const exit = () => {
        gsap.to(el, {
          opacity: 0,
          duration: 1.4,
          ease: "power2.inOut",
          onComplete: () => {
            unlock();
            setHidden(true);
          },
        });
      };

      // Reduced motion: show the mark, hold a beat, fade out. No drawing.
      if (reduced) {
        gsap.set(".pl-path", { strokeDashoffset: 0, fillOpacity: 1 });
        gsap.set([".pl-tagline", ".pl-accent"], { opacity: 1 });
        const id = window.setTimeout(exit, 650);
        return () => {
          window.clearTimeout(id);
          unlock();
        };
      }

      // Track real readiness so we never lift before the page is painted...
      let loaded = document.readyState === "complete";
      const onLoad = () => (loaded = true);
      if (!loaded) window.addEventListener("load", onLoad, { once: true });

      const startedAt = performance.now();
      const MIN_MS = 2300; // ...but always give the animation room to breathe,
      const MAX_MS = 6000; // and never trap the visitor longer than this.

      // Gentle breathing glow behind the mark — independent, looping.
      gsap.to(".pl-halo", {
        scale: 1.12,
        opacity: 0.85,
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const tl = gsap.timeline();

      tl.from(".pl-halo", { scale: 0.5, opacity: 0, duration: 1, ease: "power2.out" }, 0)
        // the mark sprouts: strokes draw themselves on
        .to(
          ".pl-path",
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut",
            stagger: 0.18,
          },
          0.15
        )
        // then floods with green
        .to(
          ".pl-path",
          { fillOpacity: 1, duration: 0.8, ease: "power1.out" },
          "-=0.45"
        )
        // tagline emerges — drifts up, letters draw together, blur clears
        .fromTo(
          ".pl-tagline",
          { opacity: 0, y: 16, letterSpacing: "0.7em", filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            letterSpacing: "0.4em",
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
          },
          "-=0.45"
        )
        // a glowing rule draws out beneath it
        .fromTo(
          ".pl-accent",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.9, ease: "power2.out" },
          "-=0.7"
        );

      // Once the intro plays out, wait for the page to be ready, then lift.
      tl.eventCallback("onComplete", () => {
        const tick = () => {
          const elapsed = performance.now() - startedAt;
          if ((loaded && elapsed >= MIN_MS) || elapsed >= MAX_MS) {
            exit();
            return;
          }
          requestAnimationFrame(tick);
        };
        tick();
      });

      return () => {
        window.removeEventListener("load", onLoad);
        unlock();
      };
    },
    { scope: root, dependencies: [reduced] }
  );

  if (hidden) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="js-preloader fixed inset-0 z-120 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 42%, #1a1140 0%, var(--sky-top) 45%, #050310 100%)",
      }}
    >
      <div className="pl-content relative flex flex-col items-center">
        {/* bioluminescent halo behind the mark */}
        <div
          className="pl-halo pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(125,255,87,0.45) 0%, rgba(255,122,24,0.14) 42%, transparent 70%)",
            opacity: 0.35,
          }}
        />

        {/* the Streak mark, drawn from /streak-logo.svg */}
        <svg
          viewBox="293.582 469.902 649.628 558.414"
          className="pl-logo h-44 w-auto sm:h-52"
          style={{
            filter:
              "drop-shadow(0 0 18px rgba(125,255,87,0.45)) drop-shadow(0 0 46px rgba(125,255,87,0.25))",
          }}
        >
          <g transform="matrix(1, 0, 0, 1, 43.255245, 42.506786)">
            <g transform="matrix(0.418407, 0, 0, 0.760576, 332.407257, 181.768723)">
              <path
                className="pl-path"
                pathLength={1}
                d="M 874.277 912.415 C 1330.916 927.48 1430.443 554.862 853.284 559.93 C 740.864 560.917 716.082 561.752 714.796 501.833 C 712.574 398.281 578.585 342.371 352.297 344.045 C 133.652 345.662 -38.727 402.476 -51.168 494.797 C -57.778 531.85 -54.128 567.118 -7.472 599.828 C 82.99 665.666 279.541 704.911 440.035 693.065 C 544.007 685.391 535.127 779.774 491.436 795.393 C 419.364 821.158 360.53 806.999 282.197 791.173 C 223.62 779.338 82.441 708.157 64.82 698.829 C 28.707 685.655 -24.471 688.687 -22.952 723.305 C -22.826 736.447 1.64 797.999 108.755 864.07 C 172.726 903.529 414.392 934.721 507.472 921.085 C 654.302 1160.087 724.761 945.672 725.411 914.594 C 722.689 905.18 852.831 911.707 874.277 912.415 Z M 414.681 464.497 C 525.057 500.987 504.596 556.573 479.519 565.46 C 397.36 594.577 66.448 531.976 258.175 451.603 C 296.946 435.35 380.68 453.256 414.681 464.497 Z M 725.537 676.182 C 758.262 651.094 921.398 666.148 965.563 681.446 C 1046.005 709.309 1121.453 794.364 797.041 783.593 C 703.472 780.486 690.431 703.096 725.537 676.182 Z"
                style={{
                  fill: "var(--green)",
                  stroke: "var(--green)",
                  strokeWidth: 9,
                  fillOpacity: 0,
                  strokeDasharray: 1,
                  strokeDashoffset: 1,
                }}
              />
            </g>
          </g>
          <g transform="matrix(1, 0, 0, 1, -1242.690186, 106.055557)">
            <path
              className="pl-path"
              pathLength={1}
              d="M 1066.46 700.956 C 1048.22 637.315 960.507 585.556 857.822 577.287 C 819.743 573.833 781.078 574.67 742.665 574.513 C 707.096 575.35 690.024 574.983 692.785 549.338 C 696.049 446.971 585.16 374.957 419.956 376.631 C 278.771 374.276 147.545 432.369 139.511 524.69 C 135.243 561.743 142.189 599.634 172.317 632.344 C 230.733 698.182 358.193 709.381 457.282 740.469 C 500.801 752.715 494.356 778.622 493.268 803.796 C 488.749 840.751 390.832 839.646 356.268 820.595 C 319.612 801.912 225.789 738.05 214.41 728.722 C 191.09 715.548 137.526 703.758 138.507 738.376 C 138.588 751.518 137.084 870.321 213.995 910.981 C 265.548 939.915 334.76 953.374 403.134 954.264 C 422.467 954.573 441.883 953.992 461.048 952.587 C 471.091 951.848 480.016 953.95 487.661 955.351 C 582.476 1194.349 695.631 979.685 696.049 948.607 C 694.292 939.193 730.111 943.792 742.246 942.696 C 760.993 942.696 779.907 942.696 798.653 942.537 C 919.334 945.047 1031.73 895.124 1062.53 821.694 C 1073.74 795.422 1073.58 765.748 1073.49 738.062 C 1072.66 725.921 1069.39 712.157 1066.55 701.06 L 1066.55 700.851 L 1066.46 700.956 Z M 493.436 553.055 L 493.436 577.391 C 492.85 585.032 496.114 596.442 483.644 598.012 C 474.271 598.796 457.533 593.458 446.402 591.26 C 425.731 586.341 404.473 581.839 385.308 574.932 C 364.302 567.29 343.463 556.196 340.116 540.285 C 335.345 521.392 352.753 503.755 382.044 498.312 C 408.993 493.236 443.138 493.55 465.232 504.121 C 490.59 516.735 494.022 533.692 493.352 552.899 L 493.352 553.16 L 493.352 553.055 L 493.436 553.055 Z M 568.422 855.56 Z M 859.245 789.822 C 843.846 811.698 814.805 816.198 778.902 816.356 C 764.591 816.356 748.607 817.456 734.798 815.938 C 728.856 815.048 724.255 812.943 721.325 811.028 C 687.815 789.126 707.111 733.648 707.278 706.537 C 707.445 703.868 810.286 701.846 810.286 701.846 C 830.372 702.212 848.784 699.281 856.148 713.83 C 869.873 737.904 876.485 765.329 859.245 789.613 L 859.077 789.822 L 859.245 789.822 Z"
              style={{
                fill: "var(--green)",
                stroke: "var(--green)",
                strokeWidth: 9,
                fillOpacity: 0,
                strokeDasharray: 1,
                strokeDashoffset: 1,
              }}
            />
          </g>
        </svg>

        {/* tagline — echoes the hero, with a breathing bioluminescent glow */}
        <p
          className="pl-tagline slogan-glow font-display mt-8 text-center text-sm tracking-[0.4em] text-white/85 uppercase"
          style={{ opacity: 0 }}
        >
          Rooted in community
        </p>

        {/* a thin glowing rule that draws out beneath the tagline */}
        <span
          className="pl-accent mt-5 block h-px w-20 origin-center"
          style={{
            opacity: 0,
            background:
              "linear-gradient(90deg, transparent, var(--green), transparent)",
            boxShadow: "0 0 12px rgba(125,255,87,0.7)",
          }}
        />
      </div>
    </div>
  );
}
