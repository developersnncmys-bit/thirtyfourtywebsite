"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { loanSummary, schedule, DEFAULT_RATE } from "@/lib/finance";
import { formatPrice, formatInr } from "@/lib/format";

function Slider({ id, label, value, min, max, step, onChange, display }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="emi-field">
      <label htmlFor={id}>
        {label}
        <b>{display(value)}</b>
      </label>
      <input
        id={id}
        type="range"
        className="range range-light"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": `${pct}%` }}
      />
    </div>
  );
}

// `price` pre-fills an 80% loan for a property; `full` adds the yearly table
export default function EmiCalculator({ price, full = false }) {
  const [amount, setAmount] = useState(() => (price ? Math.round((price * 0.8) / 100000) * 100000 : 5000000));
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [years, setYears] = useState(20);
  const { monthly, total, interest } = loanSummary(amount, rate, years);
  const pPct = (amount / total) * 100;

  return (
    <div className={`emi ${full ? "emi-full" : ""}`}>
      <div className="emi-inputs">
        <Slider
          id="emi-amount"
          label="Loan amount"
          value={amount}
          min={500000}
          max={Math.max(50000000, price || 0)}
          step={100000}
          onChange={setAmount}
          display={formatPrice}
        />
        <Slider id="emi-rate" label="Interest rate" value={rate} min={6} max={14} step={0.05} onChange={setRate} display={(v) => `${v.toFixed(2)}%`} />
        <Slider id="emi-years" label="Tenure" value={years} min={1} max={30} step={1} onChange={setYears} display={(v) => `${v} years`} />
      </div>

      <div className="emi-out">
        <span className="emi-label">Monthly EMI</span>
        <motion.strong key={Math.round(monthly)} initial={{ opacity: 0.5, y: 6 }} animate={{ opacity: 1, y: 0 }} className="emi-hero">
          {formatInr(monthly)}
        </motion.strong>

        {/* Part-to-whole: principal vs interest, labelled so colour is never the only cue */}
        <div className="emi-bar" role="img" aria-label={`Principal ${formatInr(amount)}, interest ${formatInr(interest)}`}>
          <motion.span className="emi-seg emi-p" animate={{ width: `${pPct}%` }} transition={{ duration: 0.5 }} />
          <motion.span className="emi-seg emi-i" animate={{ width: `${100 - pPct}%` }} transition={{ duration: 0.5 }} />
        </div>
        <ul className="emi-legend">
          <li>
            <span className="key emi-p" />
            Principal <b>{formatInr(amount)}</b>
          </li>
          <li>
            <span className="key emi-i" />
            Interest <b>{formatInr(interest)}</b>
          </li>
          <li className="emi-total">
            Total payable <b>{formatInr(total)}</b>
          </li>
        </ul>
      </div>

      {full && (
        <details className="emi-schedule">
          <summary>Year-by-year breakdown</summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Year</th>
                  <th scope="col">Principal paid</th>
                  <th scope="col">Interest paid</th>
                  <th scope="col">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule(amount, rate, years).map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{formatInr(r.principal)}</td>
                    <td>{formatInr(r.interest)}</td>
                    <td>{formatInr(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
