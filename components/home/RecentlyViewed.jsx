"use client";
import Link from "next/link";
import Reveal from "../Reveal";
import PropertyCard from "../PropertyCard";
import Icon from "../Icon";
import { useListings } from "../ListingsProvider";
import { useRecent } from "@/lib/store";

// Only appears for returning visitors who have opened a listing before
export default function RecentlyViewed() {
  const { ids } = useRecent();
  const listings = useListings();
  const items = ids.map((id) => listings.find((p) => p.id === id)).filter(Boolean).slice(0, 3);
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
            Favorite <Icon name="arrow" size={16} />
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
