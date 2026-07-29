import { MARK_BARS, MARK_GRID } from "@/lib/logo-mark";

/**
 * The LH mark. Geometry lives in lib/logo-mark so the favicon renders the
 * identical shape — see the note there on why it is drawn rather than set.
 */
export function Logo({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${MARK_GRID} ${MARK_GRID}`}
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="lh-mark" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>
      </defs>
      {MARK_BARS.map(([x, y, w, h]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={1.6}
          fill="url(#lh-mark)"
        />
      ))}
    </svg>
  );
}
