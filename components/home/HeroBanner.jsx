"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import PortalSearch from "../PortalSearch";
import BrandWaves from "../BrandWaves";
import Phone from "../Phone";
import Icon from "../Icon";
import { useListings } from "../ListingsProvider";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1];

// Promo banners above the search card, like the 99acres home page carousel
function useSlides() {
  const listings = useListings();
  const plots = listings.filter((p) => p.type === "plot" && p.mode === "buy" && p.price);
  const plotCity = plots[0]?.city;
  const from = plots.length ? Math.min(...plots.map((p) => p.price)) : 0;
  const auths = [...new Set(plots.map((p) => p.approval).filter(Boolean))].slice(0, 2).join(" & ");
  return [
    {
      id: "brand",
      bg: "/props/house-mysore.webp",
      kicker: "Thirty Forty · 3040 Property",
      title: (
        <>
          Real Estate. <em className="hl">Simplified.</em>
        </>
      ),
      text: "Buy, sell and rent flats, houses, villas, plots, PG, commercial spaces and farm land.",
      cta: { label: "Explore properties", href: "/properties" },
      phone: "/screens/app-home.jpg",
    },
    {
      id: "plots",
      bg: "/props/plot-kadakola.webp",
      kicker: plotCity ? `Plots in ${plotCity} & around` : "Plots & land",
      title: (
        <>
          {plots.length ? `${plots.length} plots` : "Plots"} ready for your <em className="hl">dream home</em>
        </>
      ),
      text: from ? `${auths ? `${auths} approved sites` : "Sites"} starting ${formatPrice(from)}. See dimensions, facing and token amount up front.` : "See dimensions, facing, approval authority and token amount up front.",
      cta: { label: "View plots", href: "/properties?mode=buy&type=plot" },
      badge: from ? { big: formatPrice(from), small: "starting price" } : null,
    },
    {
      id: "post",
      bg: "/props/apartment-bangalore.webp",
      kicker: "For owners",
      title: (
        <>
          Sell or rent faster — <em className="hl">post FREE</em>
        </>
      ),
      text: "List your property in 3 steps. Buyers and tenants enquire straight to your WhatsApp.",
      cta: { label: "Post Property FREE", href: "/post-property" },
      badge: { big: "₹0", small: "to post a property" },
    },
    {
      id: "premium",
      bg: "/props/office-bangalore.webp",
      kicker: "Go Premium",
      title: (
        <>
          Top placement & <em className="hl">more leads</em>
        </>
      ),
      text: `Premium Listing at ₹${SITE.premiumPrice}/month — boosted reach, verified badge and priority support.`,
      cta: { label: "See Premium", href: "/premium" },
      badge: { big: `₹${SITE.premiumPrice}`, small: "per month" },
    },
  ];
}

export default function HeroBanner() {
  const slides = useSlides();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const copyFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const s = slides[i];

  const go = (step) => {
    setDir(step);
    setI((x) => (x + step + slides.length) % slides.length);
  };

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(1), 6500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, paused]);

  return (
    <section ref={ref} className="hb" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hb-banner">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={s.id}
            className="hb-slide"
            custom={dir}
            initial={{ opacity: 0, x: `${dir * 6}%` }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: `${-dir * 6}%` }}
            transition={{ duration: 0.9, ease }}
          >
            <motion.div className="hb-bg" style={{ y: bgY, backgroundImage: `url(${s.bg})` }} />
            <span className="hb-shade" />
          </motion.div>
        </AnimatePresence>
        <div className="hb-waves">
          <BrandWaves />
        </div>

        <motion.div className="container hb-inner" style={{ y: copyY, opacity: copyFade }}>
          <AnimatePresence mode="wait">
            <motion.div key={s.id} className="hb-copy" initial="hide" animate="show" exit="out" variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}>
              <motion.span className="hb-kicker" variants={{ hide: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 }, out: { opacity: 0 } }}>
                <span className="live-dot" /> {s.kicker}
              </motion.span>
              <motion.h1 variants={{ hide: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } }, out: { opacity: 0, y: -20 } }}>{s.title}</motion.h1>
              <motion.p variants={{ hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, out: { opacity: 0 } }}>{s.text}</motion.p>
              <motion.div variants={{ hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, out: { opacity: 0 } }}>
                <Link href={s.cta.href} className="btn btn-yellow btn-shine">
                  {s.cta.label} <Icon name="arrow" size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {s.phone ? (
              <motion.div key="phone" className="hb-phone" initial={{ opacity: 0, y: 80, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: 60 }} transition={{ duration: 0.9, ease }}>
                <Phone src={s.phone} alt="Thirty Forty app home screen" />
              </motion.div>
            ) : s.badge ? (
              <motion.div key={s.id + "-b"} className="hb-badge" initial={{ opacity: 0, scale: 0.6, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}>
                <b>{s.badge.big}</b>
                <small>{s.badge.small}</small>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <button className="hb-arrow left" aria-label="Previous banner" onClick={() => go(-1)}>
          <Icon name="back" />
        </button>
        <button className="hb-arrow right" aria-label="Next banner" onClick={() => go(1)}>
          <Icon name="back" style={{ transform: "rotate(180deg)" }} />
        </button>
        <div className="hb-dots">
          {slides.map((x, j) => (
            <button
              key={x.id}
              aria-label={`Banner ${j + 1}`}
              className={j === i ? "on" : ""}
              onClick={() => {
                setDir(j > i ? 1 : -1);
                setI(j);
              }}
            >
              {j === i && !paused && <motion.i key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 6.5, ease: "linear" }} />}
            </button>
          ))}
        </div>
      </div>

      {/* CSS entrance (not JS) so the search card can never stay hidden */}
      <div className="container hb-search">
        <PortalSearch />
      </div>
    </section>
  );
}
