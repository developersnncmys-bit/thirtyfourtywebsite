"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import Icon from "./Icon";
import { SITE } from "@/lib/site";
import { useShortlist } from "@/lib/store";

const LINKS = [
  { href: "/properties?mode=buy", label: "Buy" },
  { href: "/properties?mode=rent", label: "Rent" },
  { href: "/projects", label: "Projects" },
  { href: "/localities", label: "Localities" },
  { href: "/tools", label: "Tools" },
];

// The mobile drawer has room for everything
const DRAWER = [
  ...LINKS,
  { href: "/properties?mode=pg", label: "PG / Hostels" },
  { href: "/properties?cat=commercial", label: "Commercial" },
  { href: "/compare", label: "Compare" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const shortlist = useShortlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // The home page has a green hero, so the bar stays transparent until you scroll
  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <header className={`nav ${overHero ? "nav-hero" : "nav-solid"}`}>
      <div className="nav-inner container">
        <Logo size={44} withText />
        <nav className="nav-links" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link href="/favourites" className="nav-icon" aria-label="Shortlist">
            <Icon name="heart" />
            {shortlist.ids.length > 0 && <span className="nav-count">{shortlist.ids.length}</span>}
          </Link>
          <Link href="/post-property" className="post-pill">
            Post Property <span className="free">FREE</span>
          </Link>
          <button className="nav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-drawer"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {DRAWER.map((l, i) => (
              <motion.div key={l.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <a className="btn btn-yellow" href={SITE.playStore} target="_blank" rel="noopener noreferrer">
              <Icon name="playFilled" size={18} /> Get the app
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
