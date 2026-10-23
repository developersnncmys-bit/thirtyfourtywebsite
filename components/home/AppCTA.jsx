"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Phone from "../Phone";
import Skyline from "../Skyline";
import BrandWaves from "../BrandWaves";
import Icon from "../Icon";
import { SITE } from "@/lib/site";

export default function AppCTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const up = useTransform(scrollYProgress, [0, 1], [140, -140]);
  const down = useTransform(scrollYProgress, [0, 1], [-60, 120]);
  const rotA = useTransform(scrollYProgress, [0, 1], [-14, -4]);
  const rotB = useTransform(scrollYProgress, [0, 1], [14, 4]);
  const sky = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="app-cta">
      <motion.div className="app-cta-sky" style={{ y: sky }}>
        <Skyline seed={14} count={16} tone="rgba(80,190,110,.16)" windows="rgba(246,208,11,.12)" />
      </motion.div>
      <div className="container app-cta-grid">
        <motion.div
          className="app-cta-copy"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src="/brand/logo-light.png" alt="3040 Property" className="app-cta-logo" />
          <h2>
            Real estate, <em className="hl">simplified</em> — in your pocket
          </h2>
          <p>Download Thirty Forty to post properties, get enquiry notifications, manage your listings from the Dashboard and chat with buyers on WhatsApp.</p>
          <a className="play-badge play-badge-lg" href={SITE.playStore} target="_blank" rel="noopener noreferrer">
            <Icon name="playFilled" size={26} />
            <span>
              <small>GET IT ON</small>Google Play
            </span>
          </a>
        </motion.div>
        <div className="app-cta-phones">
          <motion.div style={{ y: down, rotate: rotA }} className="acp acp-1">
            <Phone src="/screens/search.jpg" alt="Thirty Forty search screen" />
          </motion.div>
          <motion.div style={{ y: up, rotate: rotB }} className="acp acp-2">
            <Phone src="/screens/splash.jpg" alt="Thirty Forty splash screen" />
          </motion.div>
        </div>
      </div>
      <div className="app-cta-waves">
        <BrandWaves />
      </div>
    </section>
  );
}
