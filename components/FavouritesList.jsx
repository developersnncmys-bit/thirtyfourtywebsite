"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import Icon from "./Icon";
import { useListings } from "./ListingsProvider";
import { useShortlist } from "@/lib/store";

// The app's Favorite screen: the properties you've hearted
export default function FavouritesList() {
  const shortlist = useShortlist();
  const listings = useListings();
  const items = shortlist.ids.map((id) => listings.find((p) => p.id === id)).filter(Boolean);

  return (
    <section className="section">
      <div className="container">
        {items.length ? (
          <div className="row-list">
            {items.map((p, i) => (
              <PropertyCard key={p.id} p={p} index={i} row />
            ))}
          </div>
        ) : (
          <motion.div className="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="empty-icon">
              <Icon name="heart" size={34} />
            </span>
            <h3>No Favorites</h3>
            <p>Tap the heart on any property to save it here.</p>
            <Link href="/properties" className="btn btn-green">
              Explore properties
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
