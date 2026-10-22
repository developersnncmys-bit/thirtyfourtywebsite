"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import Icon from "./Icon";
import { useFavourites } from "@/lib/favourites";
import { PROPERTIES } from "@/lib/data";

export default function FavouritesList() {
  const { ids } = useFavourites();
  const list = PROPERTIES.filter((p) => ids.includes(p.id));
  return (
    <section className="section">
      <div className="container">
        {list.length ? (
          <div className="grid-cards list-compact">
            {list.map((p, i) => (
              <PropertyCard key={p.id} p={p} index={i} />
            ))}
          </div>
        ) : (
          <motion.div className="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="empty-icon">
              <Icon name="heart" size={34} />
            </span>
            <h3>No saved properties yet</h3>
            <p>Browse listings and tap the heart to save the ones you like.</p>
            <Link href="/properties" className="btn btn-green">
              Explore properties
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
