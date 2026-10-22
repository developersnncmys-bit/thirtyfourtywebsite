"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import Icon from "./Icon";
import { principalFor, DEFAULT_RATE } from "@/lib/finance";
import { formatPrice, formatInr } from "@/lib/format";
import { BUDGET_STEPS } from "@/lib/data";

// Banks usually cap all EMIs at about half of take-home pay (FOIR) and lend up to ~80% of value
const FOIR = 0.5;
const LTV = 0.8;

function Field({ id, label, value, onChange, min, max, step, display }) {
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
        style={{ "--pct": `${((value - min) / (max - min)) * 100}%` }}
      />
    </div>
  );
}

export default function LoanEligibility() {
  const [income, setIncome] = useState(80000);
  const [other, setOther] = useState(0);
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [years, setYears] = useState(20);

  const maxEmi = Math.max(0, income * FOIR - other);
  const loan = principalFor(maxEmi, rate, years);
  const budget = loan / LTV;
  // Largest budget stop we can afford, for the "see properties" link
  const idx = Math.max(1, BUDGET_STEPS.findLastIndex((v) => v <= budget));

  return (
    <section className="section">
      <div className="container tool-wrap">
        <Reveal className="tool-panel">
          <div className="emi">
            <div className="emi-inputs">
              <Field id="le-income" label="Monthly take-home income" value={income} onChange={setIncome} min={15000} max={500000} step={5000} display={formatInr} />
              <Field id="le-other" label="Existing EMIs" value={other} onChange={setOther} min={0} max={200000} step={1000} display={formatInr} />
              <Field id="le-rate" label="Interest rate" value={rate} onChange={setRate} min={6} max={14} step={0.05} display={(v) => `${v.toFixed(2)}%`} />
              <Field id="le-years" label="Tenure" value={years} onChange={setYears} min={5} max={30} step={1} display={(v) => `${v} years`} />
            </div>
            <div className="emi-out">
              <span className="emi-label">You could borrow up to</span>
              <motion.strong key={Math.round(loan / 1e5)} initial={{ opacity: 0.5, y: 6 }} animate={{ opacity: 1, y: 0 }} className="emi-hero">
                {loan > 0 ? formatPrice(Math.floor(loan / 1e5) * 1e5) : "₹0"}
              </motion.strong>
              <ul className="emi-legend">
                <li>
                  Max EMI you can take <b>{formatInr(maxEmi)}</b>
                </li>
                <li>
                  Property budget (with 20% down payment) <b>{formatPrice(Math.floor(budget / 1e5) * 1e5)}</b>
                </li>
              </ul>
              {loan > 0 ? (
                <Link href={`/properties?mode=buy&price=0-${idx}`} className="btn btn-yellow btn-block">
                  See homes up to {formatPrice(BUDGET_STEPS[idx])} <Icon name="arrow" size={16} />
                </Link>
              ) : (
                <p className="form-error">Your existing EMIs already use half your income. Try a longer tenure or lower EMIs.</p>
              )}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="tool-notes">
          <h3>How we estimate this</h3>
          <p>
            Most banks allow your total EMIs to be about {FOIR * 100}% of your monthly income, and lend up to {LTV * 100}% of the property
            value. We use those rules with your rate and tenure.
          </p>
          <p className="muted">This is an estimate — each bank checks your credit score, age and employment before approving a loan.</p>
        </Reveal>
      </div>
    </section>
  );
}
