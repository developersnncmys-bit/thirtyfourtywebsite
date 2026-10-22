"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Oversized words that slide sideways as you scroll past
export default function ScrollText({ text, direction = 1, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], direction > 0 ? ["5%", "-35%"] : ["-35%", "5%"]);
  const row = Array.from({ length: 4 }, () => text).join("  •  ");
  return (
    <div ref={ref} className={`scroll-text ${className}`} aria-hidden="true">
      <motion.div style={{ x }}>{row}</motion.div>
    </div>
  );
}
