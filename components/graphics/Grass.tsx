"use client";

/**
 * Dense, realistic grass. Renders many tapered, swaying blades that fill the
 * parent container from its bottom edge upward — so the parent's bottom edge
 * is the soil line. Use two instances for depth:
 *   <Grass layer="back" />  behind the logo (lighter, shorter)
 *   <Grass layer="front" /> in front of the logo base (darker, taller)
 * Values are derived deterministically from the index so server and client
 * render identically (no hydration mismatch, no Math.random).
 */
function rand(i: number, seed: number) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function Grass({
  layer = "back",
}: {
  layer?: "back" | "front";
}) {
  const front = layer === "front";
  const count = front ? 80 : 110;
  const shades = front
    ? ["#16400f", "#1f5a16", "#28691c"]
    : ["#357a22", "#458f2c", "#54a033"];
  const minH = front ? 80 : 46;
  const maxH = front ? 168 : 120;

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const r1 = rand(i, front ? 7 : 3);
        const r2 = rand(i, 11);
        const r3 = rand(i, 17);
        const h = minH + r1 * (maxH - minH);
        const left = (i / count) * 100 + (r2 - 0.5) * (100 / count);
        const w = 5 + r3 * 6;
        const rot = (r2 - 0.5) * 12;
        const dur = 2.4 + r3 * 2;
        const delay = r1 * 1.6;
        const shade = shades[i % shades.length];
        return (
          <span
            key={i}
            className="grass-blade"
            style={{
              position: "absolute",
              bottom: "12%",
              left: `${left}%`,
              width: w,
              height: h,
              background: `linear-gradient(to top, #0f2e0a 0%, ${shade} 55%, ${shade} 100%)`,
              clipPath: "polygon(50% 0%, 92% 100%, 8% 100%)",
              transformOrigin: "bottom center",
              transform: `rotate(${rot}deg)`,
              animation: `sway ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
