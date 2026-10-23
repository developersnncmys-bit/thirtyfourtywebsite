"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BrandWaves from "./BrandWaves";

const ease = [0.22, 1, 0.36, 1];

// Green title band, like the app's screen headers, with the brand ribbons
// drifting behind the title as you scroll
export default function PageHero({ eyebrow, title, text, children, compact = false }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const wavesY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={ref} className={`phero ${compact ? "phero-compact" : ""}`}>
      <motion.div className="phero-waves" style={{ y: wavesY }}>
        <BrandWaves />
      </motion.div>
      <div className="phero-grid" aria-hidden="true" />
      <motion.div className="container phero-inner" style={{ y, opacity: fade }}>
        {eyebrow && (
          <motion.span className="eyebrow eyebrow-light" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            {eyebrow}
          </motion.span>
        )}
        <h1>
          <span className="mask">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease }}>
              {title}
            </motion.span>
          </span>
        </h1>
        {text && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease }}>
            {text}
          </motion.p>
        )}
        {children}
      </motion.div>
    </section>
  );
}
