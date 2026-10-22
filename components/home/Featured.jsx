"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import PropertyCard from "../PropertyCard";
import Reveal from "../Reveal";
import Icon from "../Icon";
import { PROPERTIES, MODES } from "@/lib/data";

export default function Featured() {
  const [mode, setMode] = useState("buy");
  const list = PROPERTIES.filter((p) => p.mode === mode).slice(0, 6);
  return (
    <section className="section featured">
      <div className="container">
        <div className="section-head split">
          <Reveal>
            <span className="eyebrow">Fresh listings</span>
            <h2>
              Posted by owners, <em className="hl-green">not brokers</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="seg" role="tablist" aria-label="Listing type">
            {MODES.map((m) => (
              <button key={m.id} role="tab" aria-selected={mode === m.id} className={mode === m.id ? "on" : ""} onClick={() => setMode(m.id)}>
                {mode === m.id && <motion.span layoutId="seg-pill" className="seg-pill" />}
                <span>{m.label.toUpperCase()}</span>
              </button>
            ))}
          </Reveal>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            className="grid-cards rail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {list.map((p, i) => (
              <PropertyCard key={p.id} p={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        <Reveal className="center mt-48">
          <Link href={`/properties?mode=${mode}`} className="btn btn-green">
            View all properties <Icon name="arrow" size={18} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
