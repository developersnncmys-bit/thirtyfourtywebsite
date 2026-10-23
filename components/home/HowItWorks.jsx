"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Phone from "../Phone";
import Reveal from "../Reveal";
import Icon from "../Icon";

// The app's real flow, one screen per step. The phone stays pinned on desktop
// and swaps screens as each step scrolls into view.
const STEPS = [
  {
    screen: "/screens/splash.jpg",
    title: "Open Thirty Forty",
    text: "Download the app and log in with your phone number — we send a one-time password (OTP) to verify it. New here? Just add your name.",
    points: ["Free on Google Play", "Login with OTP", "No sign-up forms"],
  },
  {
    screen: "/screens/app-home.jpg",
    title: "Search your locality",
    text: "Type a locality or tap Near me to see properties around you. Jump straight to Buy, Rent, Commercial or Agricultural Land.",
    points: ["Search by Locality", "Near me", "Buy · Rent · Commercial · Farm"],
  },
  {
    screen: "/screens/search.jpg",
    title: "Filter what fits",
    text: "Pick Buy, Rent or PG, choose from 9 property types and set a budget anywhere from ₹1,000 to ₹10 Cr+. Narrow down by BHK, facing, furnishing and more.",
    points: ["Buy / Rent / PG", "9 property types", "Budget ₹1K – ₹10 Cr+"],
  },
  {
    screen: "/screens/detail.jpg",
    title: "Enquire Now",
    text: "Check every detail — dimensions, facing, approval authority, RERA, nearby places — then tap Enquire Now to message the owner on WhatsApp, or call.",
    points: ["Enquire on WhatsApp", "One-tap call", "Save to Favorite"],
  },
];

function Step({ step, index, onActive }) {
  const ref = useRef(null);
  // Active when the step crosses the middle of the screen
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  return (
    <div ref={ref} className={`hiw-step ${inView ? "on" : ""}`}>
      <div className="hiw-card">
        <span className="hiw-num">{String(index + 1).padStart(2, "0")}</span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        <ul className="hiw-points">
          {step.points.map((pt) => (
            <li key={pt}>
              <Icon name="check" size={15} strokeWidth={2.6} /> {pt}
            </li>
          ))}
        </ul>
      </div>
      <Phone src={step.screen} alt={step.title} className="hiw-phone-inline" />
    </div>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  return (
    <section id="how-it-works" className="section hiw">
      <div className="container">
        <Reveal className="section-head center">
          <span className="eyebrow">How it works</span>
          <h2>
            From search to site visit in <em className="hl-green">four taps</em>
          </h2>
          <p>The same simple flow you get in the Thirty Forty app.</p>
        </Reveal>

        <div className="hiw-grid">
          <div className="hiw-sticky">
            <div className="hiw-phone-wrap">
              <div className="hiw-ring" />
              <Phone className="hiw-phone">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={active}
                    src={STEPS[active].screen}
                    alt={STEPS[active].title}
                    initial={{ opacity: 0, y: 60, scale: 1.04 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -60 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>
              </Phone>
              <div className="hiw-dots">
                {STEPS.map((_, i) => (
                  <span key={i} className={i === active ? "on" : ""} />
                ))}
              </div>
            </div>
          </div>
          {/* On phones this becomes a swipeable row, one step per slide */}
          <div className="hiw-steps rail">
            {STEPS.map((s, i) => (
              <Step key={s.title} step={s} index={i} onActive={setActive} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
