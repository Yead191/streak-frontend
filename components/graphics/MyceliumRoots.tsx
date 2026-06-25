/**
 * The mycelium network. Each path is drawn twice — a soft blurred copy for
 * the bioluminescent glow and a crisp copy on top. The glow layer renders
 * fully from the start as a faint "where the roots will grow" preview; only
 * the crisp layer carries the `.root` class, so it's the one the Descent
 * timeline "draws" with stroke-dashoffset as the visitor scrolls.
 * Colours alternate green / orange per the brief.
 */
const ROOTS: { d: string; color: "green" | "orange"; w: number }[] = [
  {
    d: "M600 0 C 560 120 520 200 540 320 C 555 420 500 520 520 640 C 535 740 590 820 560 1000",
    color: "green",
    w: 3.5,
  },
  {
    d: "M600 0 C 640 120 690 220 660 340 C 635 450 700 540 680 660 C 665 770 620 860 650 1000",
    color: "orange",
    w: 3,
  },
  {
    d: "M600 0 C 540 140 420 220 360 360 C 300 480 360 600 320 760",
    color: "green",
    w: 2.5,
  },
  {
    d: "M600 0 C 660 140 800 220 860 360 C 920 470 860 600 900 760",
    color: "orange",
    w: 2.5,
  },
  { d: "M540 320 C 460 380 380 420 300 520", color: "green", w: 2 },
  { d: "M660 340 C 760 400 840 440 920 540", color: "orange", w: 2 },
  { d: "M520 640 C 440 700 380 760 300 900", color: "green", w: 2 },
  { d: "M680 660 C 780 720 840 780 920 900", color: "orange", w: 2 },
  { d: "M600 0 C 600 240 600 520 600 1000", color: "green", w: 1.6 },
  { d: "M360 360 C 300 460 320 560 260 660", color: "green", w: 1.4 },
  { d: "M860 360 C 920 460 900 560 960 660", color: "orange", w: 1.4 },
];

const stroke = (c: "green" | "orange") =>
  c === "green" ? "var(--green)" : "var(--orange)";

export default function MyceliumRoots({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 1000"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="rootGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* soft glow layer — always fully rendered as a faint preview */}
      <g filter="url(#rootGlow)" opacity="0.4">
        {ROOTS.map((r, i) => (
          <path
            key={`g-${i}`}
            d={r.d}
            fill="none"
            stroke={stroke(r.color)}
            strokeWidth={r.w + 5}
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* crisp layer */}
      <g>
        {ROOTS.map((r, i) => (
          <path
            key={`c-${i}`}
            className="root"
            d={r.d}
            fill="none"
            stroke={stroke(r.color)}
            strokeWidth={r.w}
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}
