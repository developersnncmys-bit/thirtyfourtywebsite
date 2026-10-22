"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

// Square feet in one of each unit. Gunta and cent are common in Karnataka land deals.
const UNITS = [
  { id: "sqft", label: "Square feet", per: 1 },
  { id: "sqm", label: "Square metres", per: 10.7639 },
  { id: "sqyd", label: "Square yards", per: 9 },
  { id: "gunta", label: "Guntas", per: 1089 },
  { id: "cent", label: "Cents", per: 435.6 },
  { id: "acre", label: "Acres", per: 43560 },
  { id: "hectare", label: "Hectares", per: 107639 },
];

const PRESETS = [
  [20, 30],
  [30, 40],
  [30, 50],
  [40, 60],
  [50, 80],
];

const fmt = (n) => (n >= 100 ? Math.round(n).toLocaleString("en-IN") : Number(n.toPrecision(4)).toLocaleString("en-IN"));

export default function AreaConverter() {
  const [value, setValue] = useState(1200);
  const [unit, setUnit] = useState("sqft");
  const [w, setW] = useState(30);
  const [l, setL] = useState(40);

  const sqft = value * UNITS.find((u) => u.id === unit).per;
  const plot = w * l;

  return (
    <section className="section">
      <div className="container tool-wrap">
        <Reveal className="tool-panel">
          <h2 className="tool-h">Convert area</h2>
          <div className="conv-input">
            <label className="field">
              <span>Value</span>
              <input type="number" min="0" inputMode="decimal" value={value} onChange={(e) => setValue(Math.max(0, Number(e.target.value)))} />
            </label>
            <label className="field">
              <span>From</span>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                {UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ul className="conv-list">
            {UNITS.filter((u) => u.id !== unit).map((u) => (
              <li key={u.id}>
                <span>{u.label}</span>
                <motion.b key={`${u.id}${sqft}`} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
                  {fmt(sqft / u.per)}
                </motion.b>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="tool-panel">
          <h2 className="tool-h">Plot size calculator</h2>
          <div className="chips">
            {PRESETS.map(([a, b]) => (
              <button
                key={`${a}x${b}`}
                className={`chip ${w === a && l === b ? "on" : ""}`}
                onClick={() => {
                  setW(a);
                  setL(b);
                }}
              >
                {a} × {b}
              </button>
            ))}
          </div>
          <div className="conv-input">
            <label className="field">
              <span>Width (ft)</span>
              <input type="number" min="0" inputMode="decimal" value={w} onChange={(e) => setW(Math.max(0, Number(e.target.value)))} />
            </label>
            <label className="field">
              <span>Length (ft)</span>
              <input type="number" min="0" inputMode="decimal" value={l} onChange={(e) => setL(Math.max(0, Number(e.target.value)))} />
            </label>
          </div>
          {/* The plot drawn to scale */}
          <div className="plot-viz">
            <motion.div
              className="plot-rect"
              animate={{ aspectRatio: `${Math.max(w, 1)} / ${Math.max(l, 1)}` }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
            >
              <span className="plot-w">{w} ft</span>
              <span className="plot-l">{l} ft</span>
              <b>{plot.toLocaleString("en-IN")} sqft</b>
            </motion.div>
          </div>
          <ul className="conv-list">
            <li>
              <span>Square metres</span>
              <b>{fmt(plot / 10.7639)}</b>
            </li>
            <li>
              <span>Guntas</span>
              <b>{fmt(plot / 1089)}</b>
            </li>
            <li>
              <span>Cents</span>
              <b>{fmt(plot / 435.6)}</b>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
