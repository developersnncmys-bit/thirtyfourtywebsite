import Link from "next/link";
import Reveal from "../Reveal";
import LocalityCard from "../LocalityCard";
import Icon from "../Icon";
import { LOCALITIES } from "@/lib/data";

// Rates & trends teaser — the six fastest-growing localities
export default function TopLocalities() {
  const top = [...LOCALITIES].sort((a, b) => b.change - a.change).slice(0, 6);
  return (
    <section className="section top-locs">
      <div className="container">
        <div className="section-head split">
          <Reveal>
            <span className="eyebrow">Rates & trends</span>
            <h2>
              Where prices are <em className="hl-green">rising</em>
            </h2>
            <p>Average ₹/sqft and one-year growth across Mysuru.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/localities" className="btn btn-outline">
              All localities <Icon name="arrow" size={16} />
            </Link>
          </Reveal>
        </div>
        <div className="grid-cards rail">
          {top.map((l, i) => (
            <LocalityCard key={l.slug} l={l} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
