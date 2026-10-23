"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "../Reveal";
import BrandWaves from "../BrandWaves";
import Icon, { WhatsAppIcon } from "../Icon";
import { whatsappLink } from "@/lib/site";

const GROUPS = [
  {
    id: "seekers",
    label: "Buying & renting",
    icon: "search",
    qa: [
      {
        q: "How do I contact the person who posted a property?",
        a: "Open any listing and tap Enquire Now. It sends them a WhatsApp message with your name and number, and the enquiry also shows up in their Dashboard. You can call them from the app too.",
      },
      {
        q: "What kinds of property can I find?",
        a: "Flats, houses, villas, plots, PG and hostels (boys, girls and co-living), office spaces, shops, showrooms, other commercial spaces and agricultural land or farm plots.",
      },
      {
        q: "Do I need an account?",
        a: "You can browse on this website without one. In the app you log in with your phone number and a one-time password (OTP) — no long sign-up forms.",
      },
      {
        q: "Should I check anything before paying?",
        a: "Always. Visit the property and check documents such as the title deed, khata, RTC, approvals and the RERA number (where applicable) before paying any advance or token amount.",
      },
    ],
  },
  {
    id: "owners",
    label: "Posting a property",
    icon: "upload",
    qa: [
      {
        q: "Is it free to post a property?",
        a: "Yes. Posting a property on Thirty Forty is free. If you want more visibility, Premium (₹199/month) gives your listing top placement in search results and direct lead notifications.",
      },
      {
        q: "How do I post my property?",
        a: "Tap Post Property (the + button in the app). Choose Sell, Rent/Lease or PG, add the property details and location, upload photos and tap Publish — three steps.",
      },
      {
        q: "Where do I see the enquiries I get?",
        a: "Every enquiry arrives as a notification on your phone and is listed in your Dashboard — with the person's name, phone number and message — under the property it is for.",
      },
      {
        q: "Can I edit or remove my listing later?",
        a: "Yes. Open the listing from your Dashboard in the app to edit its details and photos, or delete it once the property is sold or rented.",
      },
    ],
  },
];

export default function FAQ() {
  const [group, setGroup] = useState(GROUPS[0].id);
  const [open, setOpen] = useState(0);
  const items = GROUPS.find((g) => g.id === group).qa;

  return (
    <section className="section qa">
      <div className="container qa-grid">
        <Reveal className="qa-side">
          <div className="qa-side-waves">
            <BrandWaves />
          </div>
          <span className="eyebrow eyebrow-light">FAQ</span>
          <h2>
            Got questions? <em className="hl">We've got answers.</em>
          </h2>
          <p>Can't find what you're looking for? Our team in Mysore is happy to help.</p>
          <div className="qa-actions">
            <a className="btn btn-yellow" href={whatsappLink("Hi Thirty Forty team, I have a question.")} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> Chat with us
            </a>
            <Link href="/help" className="btn btn-ghost">
              Help &amp; Support <Icon name="arrow" size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="qa-main">
          <Reveal className="qa-tabs" role="tablist" aria-label="Question topics">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={group === g.id}
                className={group === g.id ? "on" : ""}
                onClick={() => {
                  setGroup(g.id);
                  setOpen(0);
                }}
              >
                {group === g.id && <motion.span layoutId="qa-tab" className="qa-tab-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <Icon name={g.icon} size={18} />
                <span>{g.label}</span>
              </button>
            ))}
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.ol key={group} className="qa-list" initial="hide" animate="show" exit="hide" variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
              {items.map((item, i) => {
                const isOpen = open === i;
                return (
                  <motion.li
                    key={item.q}
                    className={`qa-item ${isOpen ? "open" : ""}`}
                    variants={{ hide: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                  >
                    <button aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                      <span className="qa-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="qa-q">{item.q}</span>
                      <motion.span className="qa-toggle" animate={{ rotate: isOpen ? 135 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                        <Icon name="plus" size={20} strokeWidth={2.4} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className="qa-a"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p>{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </motion.ol>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
