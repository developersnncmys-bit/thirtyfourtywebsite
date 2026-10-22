"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "../Reveal";
import Icon from "../Icon";

const QA = [
  {
    q: "Is 30Forty really free?",
    a: "Yes. Buyers, tenants and owners pay zero brokerage, and owners can post unlimited listings for free.",
  },
  {
    q: "How do I contact an owner?",
    a: "Open any listing and tap Enquire Now to message the owner on WhatsApp, or tap the call button to phone them directly.",
  },
  {
    q: "How do I post my property?",
    a: "Tap Post Property (the + button), choose sell, rent or PG, add photos and details, and publish. It takes a few minutes.",
  },
  {
    q: "What kinds of property can I find?",
    a: "Flats and apartments, independent houses and villas, plots and land, PG and hostels, offices, shops and showrooms, and agricultural land or farm plots.",
  },
  {
    q: "Should I check anything before paying?",
    a: "Always. Since you deal directly with owners, visit the property and check documents such as the title deed, khata, RTC and approvals before paying any advance.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq">
      <div className="container faq-grid">
        <Reveal>
          <span className="eyebrow">FAQ</span>
          <h2>
            Questions? <em className="hl-green">Answered.</em>
          </h2>
          <p className="muted">Anything else — write to us from the Contact page.</p>
        </Reveal>
        <div className="faq-list">
          {QA.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.06} className={`faq-item ${open === i ? "open" : ""}`}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{item.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="faq-plus">
                  <Icon name="plus" size={20} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="faq-a"
                  >
                    <p>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
