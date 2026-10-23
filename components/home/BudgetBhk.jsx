"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "../Reveal";
import Icon from "../Icon";
import { useListings } from "../ListingsProvider";
import { BUDGET_STEPS } from "@/lib/options";
import { useCity } from "@/lib/city";

// Budget chips map onto the search page's budget slider stops
const idx = (v) => BUDGET_STEPS.indexOf(v);
const LAST = BUDGET_STEPS.length - 1;
const BUDGETS = [
  { label: "Under ₹25 Lac", lo: 0, hi: idx(2.5e6), test: (p) => p.price <= 2.5e6 },
  { label: "₹25 – 50 Lac", lo: idx(2.5e6), hi: idx(5e6), test: (p) => p.price >= 2.5e6 && p.price <= 5e6 },
  { label: "₹50 Lac – 1 Cr", lo: idx(5e6), hi: idx(1e7), test: (p) => p.price >= 5e6 && p.price <= 1e7 },
  { label: "₹1 – 2.5 Cr", lo: idx(1e7), hi: idx(2.5e7), test: (p) => p.price >= 1e7 && p.price <= 2.5e7 },
  { label: "Above ₹2.5 Cr", lo: idx(2.5e7), hi: LAST, test: (p) => p.price >= 2.5e7 },
];
const BHKS = [1, 2, 3, 4, 5];
const POPULAR = [
  ["Ready to move", "mode=buy&status=Ready%20to%20Move"],
  ["Under construction", "mode=buy&status=Under%20Construction"],
  ["Resale", "mode=buy&sale=Resale"],
  ["RERA registered", "rera=1"],
  ["Furnished", "furn=Furnished"],
  ["East facing", "facing=East"],
  ["North facing", "facing=North"],
  ["30 × 40 sites", "mode=buy&type=plot&q=30%20x%2040"],
];

export default function BudgetBhk() {
  const all = useListings();
  const city = useCity();
  const buy = all.filter((p) => p.mode === "buy" && (!city || p.city === city));
  const homes = all.filter((p) => p.bhk && (!city || p.city === city));
  const c = city ? `&city=${encodeURIComponent(city)}` : "";

  return (
    <section className="section bb">
      <div className="container bb-grid">
        <Reveal className="bb-card">
          <span className="bb-icon">
            <Icon name="rupee" size={24} />
          </span>
          <h3>Explore by budget</h3>
          <p>Properties for sale{city ? ` in ${city}` : ""}</p>
          <div className="bb-chips">
            {BUDGETS.map((b, i) => {
              const n = buy.filter(b.test).length;
              return (
                <motion.div key={b.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <Link href={`/properties?mode=buy&price=${b.lo}-${b.hi}${c}`} className="bb-chip">
                    <span>{b.label}</span>
                    <em>{n}</em>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="bb-card">
          <span className="bb-icon">
            <Icon name="bed" size={24} />
          </span>
          <h3>Choose by BHK</h3>
          <p>Flats, houses and villas{city ? ` in ${city}` : ""}</p>
          <div className="bb-bhk">
            {BHKS.map((b, i) => {
              const n = homes.filter((p) => (b === 5 ? p.bhk >= 5 : p.bhk === b)).length;
              return (
                <motion.div key={b} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 18 }}>
                  <Link href={`/properties?bhk=${b}${c}`} className="bb-tile">
                    <b>{b === 5 ? ">4" : b}</b>
                    <span>BHK</span>
                    <small>{n} listed</small>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div className="bb-pop">
            <h4>Popular searches</h4>
            <div>
              {POPULAR.map(([label, q]) => (
                <Link key={label} href={`/properties?${q}${c}`}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
