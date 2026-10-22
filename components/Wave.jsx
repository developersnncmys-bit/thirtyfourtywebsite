"use client";
import { useId } from "react";
import { motion } from "framer-motion";

// The green-gold wave with glowing lines from the bottom of the app's splash screen
export default function Wave({ className = "" }) {
  const id = useId().replace(/:/g, "");
  const lines = [
    "M0 120 C 240 60, 480 150, 720 110 S 1200 40, 1440 100",
    "M0 140 C 260 90, 520 170, 760 130 S 1180 70, 1440 125",
    "M0 105 C 300 50, 560 140, 820 95 S 1220 30, 1440 80",
  ];
  return (
    <svg className={`wave ${className}`} viewBox="0 0 1440 240" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}f`} x1="0" x2="1">
          <stop offset="0" stopColor="#1f7a2c" />
          <stop offset=".45" stopColor="#9fb51c" />
          <stop offset="1" stopColor="#2f8f3a" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff3a0" stopOpacity=".2" />
          <stop offset=".5" stopColor="#ffe45c" />
          <stop offset="1" stopColor="#fff3a0" stopOpacity=".3" />
        </linearGradient>
      </defs>
      <path d="M0 120 C 240 60, 480 150, 720 110 S 1200 40, 1440 100 V240 H0Z" fill={`url(#${id}f)`} opacity=".55" />
      <path d="M0 160 C 280 110, 560 200, 860 150 S 1260 100, 1440 140 V240 H0Z" fill="var(--wave-base, #023919)" />
      {lines.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={`url(#${id}l)`}
          strokeWidth={i === 0 ? 2.5 : 1.2}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, delay: 0.4 + i * 0.25, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}
