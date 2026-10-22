"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "../Reveal";
import Skyline from "../Skyline";
import { formatPrice } from "@/lib/format";

// Typical broker fees in India: 1–2% of the sale price, or 1–2 months' rent
const CONFIG = {
  buy: { min: 1000000, max: 50000000, step: 100000, initial: 6000000, label: "Property price", range: [0.01, 0.02], note: "1–2% of the sale price" },
  rent: { min: 5000, max: 200000, step: 1000, initial: 20000, label: "Monthly rent", range: [1, 2], note: "1–2 months' rent" },
};

export default function BrokerageCalc() {
  const [mode, setMode] = useState("buy");
  const cfg = CONFIG[mode];
  const [value, setValue] = useState({ buy: CONFIG.buy.initial, rent: CONFIG.rent.initial });
  const v = value[mode];
  const lo = Math.round(v * cfg.range[0]);
  const hi = Math.round(v * cfg.range[1]);
  const pct = ((v - cfg.min) / (cfg.max - cfg.min)) * 100;

  return (
    <section id="brokerage" className="section calc">
      <Skyline seed={33} count={14} tone="rgba(255,255,255,.035)" windows="rgba(246,208,11,.07)" className="calc-sky" />
      <div className="container calc-grid">
        <Reveal>
          <span className="eyebrow eyebrow-light">Brokerage calculator</span>
          <h2>
            See what you <em className="hl">keep</em> with 30Forty
          </h2>
          <p className="calc-lead">
            Brokers usually charge {cfg.note}. On 30Forty you pay nothing — not as a buyer, not as a tenant, not as an
            owner.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="calc-card">
          <div className="seg seg-dark" role="tablist">
            {["buy", "rent"].map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? "on" : ""} onClick={() => setMode(m)}>
                {mode === m && <motion.span layoutId="calc-pill" className="seg-pill" />}
                <span>{m === "buy" ? "BUYING" : "RENTING"}</span>
              </button>
            ))}
          </div>

          <label className="calc-label" htmlFor="calc-range">
            {cfg.label}
            <b>{formatPrice(v)}</b>
          </label>
          <input
            id="calc-range"
            type="range"
            min={cfg.min}
            max={cfg.max}
            step={cfg.step}
            value={v}
            onChange={(e) => setValue((s) => ({ ...s, [mode]: Number(e.target.value) }))}
            className="range"
            style={{ "--pct": `${pct}%` }}
          />

          <div className="calc-out">
            <span>You save</span>
            <motion.strong key={`${mode}${lo}`} initial={{ opacity: 0.4, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {formatPrice(lo)} – {formatPrice(hi)}
            </motion.strong>
            <small>compared with a typical broker fee of {cfg.note}</small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
