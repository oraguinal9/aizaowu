export function Sparkline({
  seed = 1,
  className,
}: {
  seed?: number;
  className?: string;
}) {
  const n = 14;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const v =
      Math.sin(i * 0.8 + seed) * 0.28 +
      Math.cos(i * 0.45 + seed * 0.7) * 0.18 +
      0.55 +
      t * 0.12;
    return [t * 100, 22 - v * 18];
  });
  const d = "M" + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L");

  return (
    <svg
      viewBox="0 0 100 22"
      preserveAspectRatio="none"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d={d}
        stroke="var(--brand-2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
