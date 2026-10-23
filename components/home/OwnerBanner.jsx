"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Icon from "../Icon";
import Phone from "../Phone";

// "Sell or rent faster at the right price!" — the owner banner on 99acres
export default function OwnerBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  return (
    <section ref={ref} className="ownb">
      <div className="container">
        <div className="ownb-card">
          <motion.div className="ownb-bg" style={{ y: bgY }} />
          <div className="ownb-copy">
            <span className="eyebrow eyebrow-light">For owners</span>
            <h2>
              Sell or rent faster at <em className="hl">the right price!</em>
            </h2>
            <ul>
              {["Post FREE in 3 simple steps", "Enquiries straight to your WhatsApp", "See every lead in your Dashboard", "Go Premium for top placement"].map((t) => (
                <li key={t}>
                  <Icon name="check" size={16} strokeWidth={2.8} /> {t}
                </li>
              ))}
            </ul>
            <div className="ownb-cta">
              <Link href="/post-property" className="btn btn-yellow btn-shine">
                Post Property <span className="free">FREE</span>
              </Link>
              <Link href="/premium" className="btn btn-ghost">
                <Icon name="crown" size={16} /> Premium ₹199
              </Link>
            </div>
          </div>
          <motion.div className="ownb-phone" style={{ y: phoneY }}>
            <Phone src="/screens/app-home.jpg" alt="Thirty Forty app" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
