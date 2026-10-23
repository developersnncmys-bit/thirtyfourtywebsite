"use client";
import Link from "next/link";
import Rail from "../Rail";
import Reveal from "../Reveal";
import PropertyCard from "../PropertyCard";
import Icon from "../Icon";
import { useListings } from "../ListingsProvider";
import { useCity } from "@/lib/city";

const FILTERS = {
  all: () => true,
  newLaunch: (p) => p.mode === "buy" && p.saleType === "New",
  rent: (p) => p.mode !== "buy",
};

// A titled row of listings with arrows. Uses the city picked in the header
// when that city has matches, like 99acres does.
export default function ListingRail({ eyebrow, title, sub, filter = "all", href = "/properties", empty, tone = "" }) {
  const all = useListings();
  const city = useCity();
  const test = FILTERS[filter];
  const inCity = all.filter((p) => !city || p.city === city);
  const useCityList = inCity.some(test);
  const list = (useCityList ? inCity : all).filter(test).slice(0, 10);
  if (!list.length && !empty) return null;

  return (
    <section className={`section lrail ${tone}`}>
      <div className="container">
        <div className="section-head split">
          <Reveal>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2>{title}</h2>
            {sub && <p>{city && useCityList ? `${sub} in ${city}` : sub}</p>}
          </Reveal>
          <Link href={city && useCityList ? `${href}${href.includes("?") ? "&" : "?"}city=${encodeURIComponent(city)}` : href} className="see-all">
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
