import Link from "next/link";
import Logo from "./Logo";
import Icon from "./Icon";
import BrandWaves from "./BrandWaves";
import { SITE, helpMail } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-waves">
        <BrandWaves />
      </div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo height={70} />
          <p className="footer-tag">{SITE.tagline}</p>
          <p>Buy, sell and rent flats, houses, villas, plots, PG, commercial spaces and farm land — all in one app.</p>
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
          <Link href="/properties?type=plot">Plots</Link>
          <Link href="/properties?type=agri">Agricultural Land/Farm Plot</Link>
        </div>
        <div>
          <h4>Thirty Forty</h4>
          <Link href="/post-property">Post Property FREE</Link>
          <Link href="/premium">Go Premium</Link>
          <Link href="/favourites">Favorite</Link>
          <Link href="/help">Help &amp; Support</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={helpMail}>
            <Icon name="mail" size={16} /> {SITE.email}
          </a>
          <a href={`tel:+${SITE.phoneRaw}`}>
            <Icon name="phone" size={16} /> {SITE.phone}
          </a>
          <address>
            <Icon name="pin" size={16} /> {SITE.address.join(", ")}
          </address>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {SITE.company}. All rights reserved.
        </span>
        <nav aria-label="Legal">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          <Link href="/refund-policy">Refund Policy</Link>
          <Link href="/photo-credits">Photo credits</Link>
        </nav>
      </div>
    </footer>
  );
}
