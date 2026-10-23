"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Logo from "./Logo";
import Icon from "./Icon";
import { SITE } from "@/lib/site";
import { useShortlist } from "@/lib/store";
import { useSession, signOut } from "@/lib/session";

// The app's categories: Buy · Rent · PG · Commercial · Agricultural Land
const LINKS = [
  { href: "/properties?mode=buy", label: "Buy", match: (p) => p.get("mode") === "buy" },
  { href: "/properties?mode=rent", label: "Rent", match: (p) => p.get("mode") === "rent" },
  { href: "/properties?mode=pg", label: "PG", match: (p) => p.get("mode") === "pg" },
  { href: "/properties?cat=commercial", label: "Commercial", match: (p) => p.get("cat") === "commercial" },
  { href: "/properties?type=agri", label: "Agricultural Land", match: (p) => p.get("type") === "agri" },
  { href: "/premium", label: "Premium", premium: true },
];

// Mobile drawer — the app's side drawer
const DRAWER = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/properties?mode=buy", label: "Buy", icon: "key" },
  { href: "/post-property", label: "Sell", icon: "upload" },
  { href: "/properties?mode=rent", label: "Rent", icon: "home" },
  { href: "/properties?mode=pg", label: "PG", icon: "bed" },
  { href: "/properties?cat=commercial", label: "Commercial", icon: "building" },
  { href: "/properties?type=agri", label: "Agricultural Land/Farm Plot", icon: "tractor" },
  { href: "/enquiries", label: "Enquiry", icon: "chat" },
  { href: "/dashboard", label: "My Property List", icon: "dashboard" },
  { href: "/notifications", label: "Notifications", icon: "bell" },
  { href: "/favourites", label: "Favorite", icon: "heart" },
  { href: "/premium", label: "Subscriptions", icon: "crown" },
  { href: "/help", label: "Help & Support", icon: "help" },
];

function NavLinks() {
  const pathname = usePathname();
  const params = useSearchParams();
  return LINKS.map((l) => {
    const on = l.premium ? pathname === "/premium" : pathname === "/properties" && l.match(params);
    return (
      <Link key={l.href} href={l.href} className={`${l.premium ? "nav-premium" : ""} ${on ? "on" : ""}`}>
        {l.premium && <Icon name="crown" size={15} />}
        {l.label}
      </Link>
    );
  });
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const shortlist = useShortlist();
  const user = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const me = mounted ? user : null;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", open);
  }, [open]);

  const clear = pathname === "/" && !scrolled && !open;

  return (
    <>
      <header className={`nav ${clear ? "nav-clear" : "nav-solid"}`}>
        <div className="nav-inner container">
          <Logo height={46} />
          <nav className="nav-links" aria-label="Main">
            <Suspense fallback={null}>
              <NavLinks />
            </Suspense>
          </nav>
          <div className="nav-actions">
            <Link href="/favourites" className="nav-icon" aria-label="Favorite">
              <Icon name="heart" />
              {shortlist.ids.length > 0 && <span className="nav-count">{shortlist.ids.length}</span>}
            </Link>
            {me ? (
              <Link href="/notifications" className="nav-icon" aria-label="Notifications">
                <Icon name="bell" />
              </Link>
            ) : (
              <Link href="/help" className="nav-icon" aria-label="Help & Support">
                <Icon name="help" />
              </Link>
            )}
            {me ? (
              <Link href="/account" className="nav-me" aria-label="My Profile">
                <span>{(me.userName || "U").charAt(0).toUpperCase()}</span>
                <b>{(me.userName || "Profile").split(" ")[0]}</b>
              </Link>
            ) : (
              <Link href="/login" className="nav-login">
                <Icon name="user" size={18} /> Login
              </Link>
            )}
            <Link href="/post-property" className="post-pill">
              Post Property <span className="free">FREE</span>
            </Link>
            <button className="nav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <span className={open ? "x" : ""} />
            </button>
          </div>
        </div>
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
                {me ? (
                  <Link href="/account" className="drawer-me" onClick={() => setOpen(false)}>
                    <span>{(me.userName || "U").charAt(0).toUpperCase()}</span>
                    <span>
                      <b>{me.userName || "User"}</b>
                      <small>+91 {me.phone}</small>
                    </span>
                  </Link>
                ) : (
                  <Link href="/login" className="btn btn-yellow btn-sm drawer-login" onClick={() => setOpen(false)}>
                    <Icon name="user" size={16} /> Login / Sign up
                  </Link>
                )}
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
              {me && (
                <button className="drawer-logout" onClick={() => (signOut(), setOpen(false))}>
                  <Icon name="back" size={18} /> Logout
                </button>
              )}
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
