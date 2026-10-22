// City silhouette from the app's splash screen. Buildings are generated from a
// fixed seed so server and client render the same SVG.
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export default function Skyline({ seed = 7, count = 16, tone = "rgba(60,170,90,.35)", windows = "rgba(170,255,190,.22)", className = "" }) {
  const r = rng(seed);
  const W = 1440;
  const step = W / count;
  const blocks = Array.from({ length: count }, (_, i) => {
    const w = step * (0.55 + r() * 0.4);
    const h = 140 + r() * 300;
    const x = i * step + r() * (step - w);
    return { x, w, h };
  });
  return (
    <svg className={`skyline ${className}`} viewBox="0 0 1440 460" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={460 - b.h} width={b.w} height={b.h} fill={tone} />
          {Array.from({ length: Math.floor(b.h / 26) - 1 }, (_, row) =>
            [0.22, 0.6].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={b.x + b.w * col}
                y={460 - b.h + 16 + row * 26}
                width={b.w * 0.18}
                height="7"
                fill={windows}
              />
            ))
          )}
        </g>
      ))}
    </svg>
  );
}
