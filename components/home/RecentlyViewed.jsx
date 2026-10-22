"use client";
import Link from "next/link";
import Reveal from "../Reveal";
import PropertyCard from "../PropertyCard";
import Icon from "../Icon";
import { useRecent } from "@/lib/store";
import { PROPERTIES } from "@/lib/data";

// Only appears for returning visitors who have opened a listing before
export default function RecentlyViewed() {
  const { ids } = useRecent();
  const items = ids.map((id) => PROPERTIES.find((p) => p.id === id)).filter(Boolean).slice(0, 6);
  if (!items.length) return null;
  return (
    <section className="section recent">
      <div className="container">
        <div className="section-head split">
          <Reveal>
            <span className="eyebrow">Pick up where you left off</span>
            <h2>Recently viewed</h2>
          </Reveal>
          <Link href="/favourites" className="btn btn-outline">
            Shortlist <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="grid-cards rail">
          {items.map((p, i) => (
            <PropertyCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
