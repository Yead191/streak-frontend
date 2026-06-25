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
}: {
  className?: string;
  title?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="337 470 579 556"
      className={className}
      role="img"
      aria-label={title}
      style={{ color }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix(1,0,0,1,43.255245,42.506786)">
        <g transform="matrix(0.418407,0,0,0.760576,332.407257,181.768723)">
          <path fill="currentColor" d="M 874.277 912.415 C 1330.916 927.48 1430.443 554.862 853.284 559.93 C 740.864 560.917 716.082 561.752 714.796 501.833 C 712.574 398.281 578.585 342.371 352.297 344.045 C 133.652 345.662 -38.727 402.476 -51.168 494.797 C -57.778 531.85 -54.128 567.118 -7.472 599.828 C 82.99 665.666 279.541 704.911 440.035 693.065 C 544.007 685.391 535.127 779.774 491.436 795.393 C 419.364 821.158 360.53 806.999 282.197 791.173 C 223.62 779.338 82.441 708.157 64.82 698.829 C 28.707 685.655 -24.471 688.687 -22.952 723.305 C -22.826 736.447 1.64 797.999 108.755 864.07 C 172.726 903.529 414.392 934.721 507.472 921.085 C 654.302 1160.087 724.761 945.672 725.411 914.594 C 722.689 905.18 852.831 911.707 874.277 912.415 Z M 414.681 464.497 C 525.057 500.987 504.596 556.573 479.519 565.46 C 397.36 594.577 66.448 531.976 258.175 451.603 C 296.946 435.35 380.68 453.256 414.681 464.497 Z M 725.537 676.182 C 758.262 651.094 921.398 666.148 965.563 681.446 C 1046.005 709.309 1121.453 794.364 797.041 783.593 C 703.472 780.486 690.431 703.096 725.537 676.182 Z" />
        </g>
      </g>
    </svg>
  );
}

