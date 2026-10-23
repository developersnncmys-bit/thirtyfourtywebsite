"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Icon from "../Icon";
import { SITE, PREMIUM_TICKS } from "@/lib/site";

export default function PremiumTeaser() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rot = useTransform(scrollYProgress, [0, 1], [-6, 4]);
  const ringY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={ref} className="section prem">
      <motion.div className="prem-ring" style={{ y: ringY }} aria-hidden="true" />
      <div className="container prem-grid">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow eyebrow-light">
            <Icon name="crown" size={15} /> Go Premium
          </span>
          <h2>
            Post your property faster and <em className="hl">get more leads</em>
          </h2>
          <ul className="prem-ticks">
            {PREMIUM_TICKS.map((t) => (
              <li key={t}>
                <Icon name="check" size={16} strokeWidth={2.8} /> {t}
              </li>
            ))}
          </ul>
          <Link href="/premium" className="btn btn-yellow btn-shine">
            See Premium <Icon name="arrow" size={18} />
          </Link>
        </motion.div>

        <motion.div className="prem-card" style={{ y: cardY, rotate: rot }}>
          <span className="prem-badge">
            <Icon name="crown" size={16} /> Premium Listing
          </span>
          <p className="prem-price">
            ₹{SITE.premiumPrice}
            <small>/ month</small>
          </p>
          <div className="prem-pills">
            <span>Boosted reach</span>
            <span>Priority support</span>
            <span>Verified badge</span>
          </div>
          <div className="prem-mini">
            {[
              ["rocket", "Boost", "Get more views"],
              ["bell", "Leads", "Instant alerts"],
              ["shield", "Trust", "Verified badge"],
              ["help", "Support", "Priority help"],
            ].map(([icon, b, s]) => (
              <span key={b}>
                <Icon name={icon} size={18} />
                <b>{b}</b>
                <small>{s}</small>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
