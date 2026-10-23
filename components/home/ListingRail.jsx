"use client";
import Link from "next/link";
import Rail from "../Rail";
import Reveal from "../Reveal";
import PropertyCard from "../PropertyCard";
import Icon from "../Icon";
import { useListings } from "../ListingsProvider";

const FILTERS = {
  all: () => true,
  rent: (p) => p.mode !== "buy",
};

// A titled row of listings with arrows
export default function ListingRail({ eyebrow, title, sub, filter = "all", href = "/properties", empty, tone = "" }) {
  const all = useListings();
  const list = all.filter(FILTERS[filter]).slice(0, 10);
  if (!list.length && !empty) return null;

  return (
    <section className={`section lrail ${tone}`}>
      <div className="container">
        <div className="section-head split">
          <Reveal>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2>{title}</h2>
            {sub && <p>{sub}</p>}
          </Reveal>
          <Link href={href} className="see-all">
            See all <Icon name="arrow" size={16} />
          </Link>
        </div>
        {list.length ? (
          <Rail label={title}>
            {list.map((p, i) => (
              <div key={p.id} role="listitem" className="lrail-item">
                <PropertyCard p={p} index={i} />
              </div>
            ))}
          </Rail>
        ) : (
          <div className="empty">
            <span className="empty-icon">
              <Icon name="home" size={34} />
            </span>
            <h3>{empty}</h3>
            <Link href="/post-property" className="btn btn-green">
              Post Property FREE
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
