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
    title: "Open 30Forty",
    text: "Download the app and sign in with your phone number. No forms, no fees, no agent calling you back.",
    points: ["Free on Google Play", "Login with mobile number", "No sign-up fee"],
  },
  {
    screen: "/screens/home.jpg",
    title: "Search your locality",
    text: "Type a locality or tap Near me to see owners' listings around you. Jump straight to Buy, Rent, Commercial or Farm land.",
    points: ["Search by locality", "Near me", "Buy · Rent · Commercial · Farm"],
  },
  {
    screen: "/screens/search.jpg",
    title: "Filter what fits",
    text: "Pick Buy, Rent or PG, choose the property type and set a budget anywhere from 1 K to 10 Cr+.",
    points: ["Buy / Rent / PG", "10 property types", "Budget 1 K – 10 Cr+"],
  },
  {
    screen: "/screens/detail.jpg",
    title: "Talk to the owner",
    text: "Check every detail — facing, dimensions, approval authority, RERA status — then tap Enquire Now or call the owner directly.",
    points: ["Enquire on WhatsApp", "Call the owner", "Zero brokerage"],
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
            From search to handshake in <em className="hl-green">four taps</em>
          </h2>
          <p>The same simple flow you get in the 30Forty app.</p>
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
