// Tiny trend line for locality cards: no axes, the end dot marks "now"
export default function Sparkline({ values, width = 120, height = 36, label }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const x = (i) => 3 + ((width - 6) * i) / (values.length - 1);
  const y = (v) => height - 4 - ((v - min) / (max - min || 1)) * (height - 8);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = values.length - 1;
  return (
    <svg className="spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <path d={`${d} L${x(last)},${height} L${x(0)},${height} Z`} className="spark-area" />
      <path d={d} className="spark-line" />
      <circle cx={x(last)} cy={y(values[last])} r="4.5" className="trend-ring" />
      <circle cx={x(last)} cy={y(values[last])} r="3" className="trend-dot" />
    </svg>
  );
}
