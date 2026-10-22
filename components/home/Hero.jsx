"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Skyline from "../Skyline";
import Wave from "../Wave";
import Phone from "../Phone";
import SearchBar from "../SearchBar";
import Icon, { WhatsAppIcon } from "../Icon";

const ease = [0.22, 1, 0.36, 1];
const line = (delay) => ({
  initial: { y: "110%" },
  animate: { y: 0 },
  transition: { duration: 1, delay, ease },
});

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Each layer moves at its own speed — far buildings slowest, phone fastest
  const skyBack = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const skyFront = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const cardA = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const cardB = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const glow = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  return (
    <section ref={ref} className="hero">
      <motion.div className="hero-glow" style={{ scale: glow }} />
      <div className="hero-beams" />
      <motion.div className="hero-sky hero-sky-back" style={{ y: skyBack }}>
        <Skyline seed={5} count={15} tone="rgba(80,190,110,.18)" windows="rgba(200,255,210,.12)" />
      </motion.div>
      <motion.div className="hero-sky hero-sky-front" style={{ y: skyFront }}>
        <Skyline seed={21} count={9} tone="rgba(10,90,40,.55)" windows="rgba(246,208,11,.16)" />
      </motion.div>

      <div className="container hero-grid">
        <motion.div className="hero-copy" style={{ y: copyY, opacity: copyFade }}>
          <motion.span
            className="eyebrow eyebrow-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <Icon name="shield" size={16} /> 100% Zero Brokerage
          </motion.span>
          <h1>
            <span className="mask">
              <motion.span {...line(1.6)}>Buy, Sell &amp; Rent</motion.span>
            </span>
            <span className="mask">
              <motion.span {...line(1.72)}>
                with <em className="hl">Zero Brokerage</em>
              </motion.span>
            </span>
          </h1>
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.9, ease }}
          >
            30Forty connects property owners and seekers directly — no middlemen, no hidden commissions. Flats, houses,
            plots, PG, commercial and farm land.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 2.05, ease }}>
            <SearchBar className="hero-search" />
          </motion.div>
          <motion.ul
            className="hero-ticks"
            initial="hide"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 2.25 } } }}
          >
            {["Free listings for owners", "Direct owner contact", "Chat on WhatsApp"].map((t) => (
              <motion.li key={t} variants={{ hide: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}>
                <Icon name="check" size={16} strokeWidth={2.6} /> {t}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <div className="hero-visual">
          <motion.div
            initial={{ opacity: 0, y: 120, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.3, delay: 1.7, ease }}
          >
            <motion.div style={{ y: phoneY }}>
              <Phone src="/screens/home.jpg" alt="30Forty app home screen" className="hero-phone" />
            </motion.div>
          </motion.div>

          <motion.div className="float-card fc-a" style={{ y: cardA }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.3, type: "spring", stiffness: 200, damping: 16 }}
              className="fc-inner bob"
            >
              <span className="fc-icon fc-yellow">₹0</span>
              <span>
                <b>Brokerage</b>
                <small>Deal directly with owners</small>
              </span>
            </motion.div>
          </motion.div>
          <motion.div className="float-card fc-b" style={{ y: cardB }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, type: "spring", stiffness: 200, damping: 16 }}
              className="fc-inner bob bob-2"
            >
              <span className="fc-icon fc-wa">
                <WhatsAppIcon size={20} />
              </span>
              <span>
                <b>New enquiry!</b>
                <small>Someone wants to visit your flat</small>
              </span>
            </motion.div>
          </motion.div>
          <motion.div className="float-card fc-c" style={{ y: cardA }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.7, type: "spring", stiffness: 200, damping: 16 }}
              className="fc-inner bob bob-3"
            >
              <span className="fc-icon fc-green">
                <Icon name="area" size={18} />
              </span>
              <span>
                <b>30 × 40 site</b>
                <small>Hootagalli · ₹42 L</small>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Link href="#categories" className="scroll-cue" aria-label="Scroll down">
        <span />
      </Link>
      <Wave className="hero-wave" />
    </section>
  );
}
