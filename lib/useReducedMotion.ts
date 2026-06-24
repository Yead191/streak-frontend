"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the user has asked the OS to reduce motion.
 * We use this to switch scrubbed animations for plain reveals and to
 * disable smooth-scroll inertia, so the experience stays comfortable.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
