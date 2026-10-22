"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { compact } from "@/lib/format";

// Single-series line chart for ₹/sqft over quarters.
// One series → no legend box; the heading above it names what is plotted.
const PAD = { top: 18, right: 64, bottom: 28, left: 44 };

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step0 = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(v);
  return ticks;
}

export default function TrendChart({ labels, values, height = 220, unit = "/sqft", caption = "Average price per sqft" }) {
  const wrap = useRef(null);
  const [width, setWidth] = useState(560);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(260, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ticks = niceTicks(Math.min(...values), Math.max(...values));
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];
  const iw = width - PAD.left - PAD.right;
  const ih = height - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (iw * i) / (values.length - 1);
  const y = (v) => PAD.top + ih - ((v - yMin) / (yMax - yMin || 1)) * ih;

  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const area = `${line} L${x(values.length - 1)},${PAD.top + ih} L${x(0)},${PAD.top + ih} Z`;
  const last = values.length - 1;

  const pick = (clientX) => {
    const r = wrap.current.getBoundingClientRect();
    const rel = clientX - r.left - PAD.left;
    const i = Math.round((rel / iw) * last);
    setHover(Math.min(last, Math.max(0, i)));
  };

  const active = hover ?? null;
  const fmt = (v) => `₹${v.toLocaleString("en-IN")}${unit}`;

  return (
    <figure className="trend">
      <div
        ref={wrap}
        className="trend-plot"
        tabIndex={0}
        role="img"
        aria-label={`${caption}: from ${fmt(values[0])} in ${labels[0]} to ${fmt(values[last])} in ${labels[last]}`}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setHover((h) => Math.min(last, (h ?? -1) + 1));
          if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? last + 1) - 1));
        }}
        onBlur={() => setHover(null)}
      >
        <svg width={width} height={height} aria-hidden="true">
          {/* recessive hairline grid + y ticks */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={PAD.left + iw} y1={y(t)} y2={y(t)} className="trend-grid" />
              <text x={PAD.left - 8} y={y(t)} className="trend-tick" textAnchor="end" dominantBaseline="middle">
                {compact(t)}
              </text>
            </g>
          ))}
          {labels.map((l, i) =>
            i % 2 === last % 2 ? (
              <text key={l} x={x(i)} y={height - 8} className="trend-tick" textAnchor="middle">
                {l}
              </text>
            ) : null
          )}
          <motion.path
            d={area}
            className="trend-area"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.path
            d={line}
            className="trend-line"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* end marker + the one direct label */}
          <circle cx={x(last)} cy={y(values[last])} r="6" className="trend-ring" />
          <circle cx={x(last)} cy={y(values[last])} r="4" className="trend-dot" />
          <text x={x(last) + 10} y={y(values[last])} className="trend-end" dominantBaseline="middle">
            {compact(values[last])}
          </text>
          {active != null && (
            <g>
              <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + ih} className="trend-cross" />
              <circle cx={x(active)} cy={y(values[active])} r="7" className="trend-ring" />
              <circle cx={x(active)} cy={y(values[active])} r="5" className="trend-dot" />
            </g>
          )}
        </svg>
        {active != null && (
          <div
            className="trend-tip"
            style={{ left: Math.min(Math.max(x(active), 70), width - 70), top: y(values[active]) - 14 }}
          >
            <span>{labels[active]}</span>
            <b>{fmt(values[active])}</b>
          </div>
        )}
      </div>
      <details className="trend-table">
        <summary>View as table</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Quarter</th>
              <th scope="col">{caption}</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((l, i) => (
              <tr key={l}>
                <td>{l}</td>
                <td>{fmt(values[i])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
