import Link from "next/link";
import Logo from "./Logo";
import Icon from "./Icon";
import Skyline from "./Skyline";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <Skyline seed={3} count={18} tone="rgba(255,255,255,.04)" windows="rgba(246,208,11,.08)" className="footer-sky" />
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo size={64} withText />
          <p>Buy, sell & rent property with zero brokerage. Flats, plots, PG & more — direct from owners.</p>
          <a className="play-badge" href={SITE.playStore} target="_blank" rel="noopener noreferrer">
            <Icon name="playFilled" size={22} />
            <span>
              <small>GET IT ON</small>Google Play
            </span>
          </a>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/properties?mode=buy">Buy property</Link>
          <Link href="/properties?mode=rent">Rent a home</Link>
          <Link href="/properties?mode=pg">PG / Hostels</Link>
          <Link href="/properties?cat=commercial">Commercial spaces</Link>
          <Link href="/projects">New projects</Link>
          <Link href="/localities">Localities & prices</Link>
        </div>
        <div>
          <h4>Tools</h4>
          <Link href="/tools/emi-calculator">EMI calculator</Link>
          <Link href="/tools/loan-eligibility">Loan eligibility</Link>
          <Link href="/tools/area-converter">Area converter</Link>
          <Link href="/compare">Compare properties</Link>
          <Link href="/post-property">Post property free</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={`tel:+${SITE.phoneRaw}`}>{SITE.phone}</a>
          <address>{SITE.address.join(", ")}</address>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {SITE.company}. All rights reserved.
        </span>
        <span>
          <b>0%</b> brokerage · <b>100%</b> direct
        </span>
      </div>
    </footer>
  );
}
