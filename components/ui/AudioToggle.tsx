"use client";

import { useRef, useState } from "react";

/**
 * Ambient sound toggle. Audio starts OFF — browsers block autoplay with
 * sound, and it's the polite default. The visitor opts in.
 * Drop your loop at /public/audio/ambient.mp3 (see /public/audio/README.txt).
 */
export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);

  async function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (on) {
      el.pause();
      setOn(false);
    } else {
      try {
        el.volume = 0.4;
        await el.play();
        setOn(true);
      } catch {
        // Autoplay/blocked or file missing — fail silently.
        setOn(false);
      }
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient.mp3" loop preload="none" />
      <button
        onClick={toggle}
        aria-label={on ? "Mute ambient sound" : "Play ambient sound"}
        aria-pressed={on}
        className="fixed bottom-5 right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur transition hover:border-[var(--green)]"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--green)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4z" />
          {on ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M19 5a9 9 0 0 1 0 14" />
            </>
          ) : (
            <>
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </>
          )}
        </svg>
      </button>
    </>
  );
}
