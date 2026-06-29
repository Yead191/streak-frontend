import Image from "next/image";

/**
 * Streak's official mark (from Streak_vector_logo.svg).
 * Single-path glyph, brand green #7DFF57. Rendered with fill="currentColor"
 * so colour is driven by the `color` prop / CSS — defaults to the brand green
 * token. The raw file is preserved at /public/streak-logo.svg.
 */
export default function StreakLogo({
  className = "",
  title = "Streak",
  color = "var(--green)",
  isFooter
}: {
  className?: string;
  title?: string;
  color?: string;
  isFooter?: boolean;
}) {
  return (
    <Image
      src={isFooter ? '/streak-logo.svg' : '/assets/hero/logo2.png'}
      alt={title}
      width={1000}
      height={1000}
      draggable={false}
      className={`${className} `}
    />
  );
}

