"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Logo from "./Logo";
import Icon from "./Icon";
import { useListings } from "./ListingsProvider";
import { SITE } from "@/lib/site";
import { useShortlist } from "@/lib/store";
import { useCity, setCity } from "@/lib/city";

// Mega menus, like the 99acres header: For Buyers · For Tenants · For Owners
function menus(cities) {
  const top = cities.slice(0, 4);
  return [
    {
      id: "buyers",
      label: "For Buyers",
      cols: [
        {
          title: "Buy a home",
          links: [
            ["Flats for sale", "/properties?mode=buy&type=flat"],
            ["Houses & villas for sale", "/properties?mode=buy&type=house,villa"],
            ["New launch properties", "/properties?mode=buy&sale=New"],
            ["Resale properties", "/properties?mode=buy&sale=Resale"],
            ["Ready to move", "/properties?mode=buy&status=Ready%20to%20Move"],
          ],
        },
        {
          title: "Land & plots",
          links: [
            ["Plots / Land", "/properties?mode=buy&type=plot"],
            ["Agricultural Land / Farm Plot", "/properties?type=agri"],
            ["RERA registered", "/properties?mode=buy&rera=1"],
          ],
        },
        {
          title: "Popular cities",
          links: top.length ? top.map((c) => [`Property in ${c}`, `/properties?mode=buy&city=${encodeURIComponent(c)}`]) : [["All properties", "/properties?mode=buy"]],
        },
        {
          title: "Your activity",
          links: [
            ["Favorite properties", "/favourites"],
            ["Recently viewed", "/favourites"],
          ],
        },
      ],
    },
    {
      id: "tenants",
      label: "For Tenants",
      cols: [
        {
          title: "Rent a home",
          links: [
            ["Flats for rent", "/properties?mode=rent&type=flat"],
            ["Houses for rent", "/properties?mode=rent&type=house,villa"],
            ["Furnished homes", "/properties?mode=rent&furn=Furnished"],
            ["Bachelor-friendly", "/properties?mode=rent"],
          ],
        },
        {
          title: "PG & Co-living",
          links: [
            ["Boys PG", "/properties?mode=pg&pgfor=Boys%20PG"],
            ["Girls PG", "/properties?mode=pg&pgfor=Girls%20PG"],
            ["Co-Living PG", "/properties?mode=pg&pgfor=Co-Living%20PG"],
          ],
        },
        {
          title: "Commercial on rent",
          links: [
            ["Office space", "/properties?mode=rent&type=office"],
            ["Shops & showrooms", "/properties?mode=rent&type=shop,showroom"],
          ],
        },
      ],
    },
    {
      id: "owners",
      label: "For Owners",
      cols: [
        {
          title: "Sell / Rent your property",
          links: [
            ["Post Property FREE", "/post-property"],
            ["Go Premium — ₹199/month", "/premium"],
            ["Manage listings in the app", SITE.playStore],
          ],
        },
        {
          title: "Owner help",
          links: [
            ["Help & Support", "/help"],
            ["Terms & Conditions", "/terms-and-conditions"],
            ["Refund Policy", "/refund-policy"],
          ],
        },
      ],
    },
  ];
}

// Mobile drawer, mirrors the app's side drawer
const DRAWER = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/properties?mode=buy", label: "Buy", icon: "key" },
  { href: "/post-property", label: "Sell", icon: "upload" },
  { href: "/properties?mode=rent", label: "Rent", icon: "home" },
  { href: "/properties?mode=buy&sale=New", label: "New Launch", icon: "sparkle" },
  { href: "/properties?mode=pg", label: "PG / Co-living", icon: "bed" },
  { href: "/properties?cat=commercial", label: "Commercial", icon: "building" },
  { href: "/properties?type=plot", label: "Plots / Land", icon: "area" },
  { href: "/properties?type=agri", label: "Agricultural Land/Farm Plot", icon: "tractor" },
  { href: "/favourites", label: "Favorite", icon: "heart" },
  { href: "/premium", label: "Go Premium", icon: "crown" },
  { href: "/help", label: "Help & Support", icon: "help" },
];

function CityPicker({ cities }) {
  const city = useCity();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div className="city-pick" ref={ref}>
      <button aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {city || "All India"} <Icon name="chevron" size={16} strokeWidth={2.4} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="city-menu"
            role="listbox"
            data-lenis-prevent
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {["", ...cities].map((c) => (
              <li key={c || "all"}>
                <button
                  className={c === city ? "on" : ""}
                  onClick={() => {
                    setCity(c);
                    setOpen(false);
                  }}
                >
                  <Icon name="pin" size={15} /> {c || "All India"}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const listings = useListings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(null);
  const shortlist = useShortlist();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const timer = useRef(null);

  const cities = useMemo(() => {
    const m = new Map();
    listings.forEach((p) => p.city && m.set(p.city, (m.get(p.city) || 0) + 1));
    return [...m].sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [listings]);
  const MENUS = useMemo(() => menus(cities), [cities]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(null);
  }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", open);
  }, [open]);

  const enter = (id) => {
    clearTimeout(timer.current);
    setMega(id);
  };
  const leave = () => {
    timer.current = setTimeout(() => setMega(null), 140);
  };

  const clear = pathname === "/" && !scrolled && !open && !mega;
  const active = MENUS.find((m) => m.id === mega);

  return (
    <>
      <header className={`nav ${clear ? "nav-clear" : "nav-solid"}`} onMouseLeave={leave}>
        <div className="nav-inner container">
          <Logo height={46} />
          <CityPicker cities={cities} />
          <nav className="nav-links" aria-label="Main">
            {MENUS.map((m) => (
              <button
                key={m.id}
                className={mega === m.id ? "on" : ""}
                aria-expanded={mega === m.id}
                onMouseEnter={() => enter(m.id)}
                onFocus={() => enter(m.id)}
                onClick={() => setMega(mega === m.id ? null : m.id)}
              >
                {m.label}
                <Icon name="chevron" size={14} strokeWidth={2.4} />
              </button>
            ))}
          </nav>
          <div className="nav-actions">
            <Link href="/favourites" className="nav-icon" aria-label="Favorite">
              <Icon name="heart" />
              {shortlist.ids.length > 0 && <span className="nav-count">{shortlist.ids.length}</span>}
            </Link>
            <Link href="/help" className="nav-icon" aria-label="Help & Support">
              <Icon name="help" />
            </Link>
            <Link href="/post-property" className="post-pill">
              Post property <span className="free">FREE</span>
            </Link>
            <button className="nav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <span className={open ? "x" : ""} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {active && (
            <motion.div
              key="mega"
              className="mega"
              onMouseEnter={() => enter(active.id)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="container mega-inner">
                <AnimatePresence mode="wait">
                  <motion.div key={active.id} className="mega-cols" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    {active.cols.map((col) => (
                      <div key={col.title}>
                        <h4>{col.title}</h4>
                        {col.links.map(([label, href]) =>
                          href.startsWith("http") ? (
                            <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                              {label}
                            </a>
                          ) : (
                            <Link key={label} href={href} onClick={() => setMega(null)}>
                              {label}
                            </Link>
                          )
                        )}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
                <Link href="/post-property" className="mega-promo" onClick={() => setMega(null)}>
                  <Icon name="upload" size={26} />
                  <b>Sell or rent faster</b>
                  <small>Post your property FREE in 3 steps</small>
                  <span>
                    Post now <Icon name="arrow" size={14} />
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.span className="nav-progress" style={{ scaleX: progress }} />
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="drawer-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="drawer"
              data-lenis-prevent
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="drawer-head">
                <Logo height={52} />
                <p>{SITE.tagline}</p>
                <CityPicker cities={cities} />
              </div>
              <nav>
                {DRAWER.map((l, i) => (
                  <motion.div key={l.href + l.label} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + 0.03 * i }}>
                    <Link href={l.href} onClick={() => setOpen(false)}>
                      <Icon name={l.icon} size={20} />
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <a className="btn btn-yellow btn-block" href={SITE.playStore} target="_blank" rel="noopener noreferrer">
                <Icon name="playFilled" size={18} /> Get the app
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
