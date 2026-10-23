"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import Icon from "./Icon";
import { useShortlist, useRecent, useSavedSearches } from "@/lib/store";
import { useListings } from "./ListingsProvider";

function Empty({ icon, title, text }) {
  return (
    <motion.div className="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <span className="empty-icon">
        <Icon name={icon} size={34} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      <Link href="/properties" className="btn btn-green">
        Explore properties
      </Link>
    </motion.div>
  );
}

// Shortlist hub: saved properties, recently viewed and saved searches
export default function FavouritesList() {
  const [tab, setTab] = useState("saved");
  const shortlist = useShortlist();
  const recent = useRecent();
  const searches = useSavedSearches();
  const listings = useListings();
  const byIds = (ids) => ids.map((id) => listings.find((p) => p.id === id)).filter(Boolean);
  const tabs = [
    { id: "saved", label: "Favorites", n: shortlist.ids.length },
    { id: "recent", label: "Recently viewed", n: recent.ids.length },
    { id: "searches", label: "Saved searches", n: searches.list.length },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
              {tab === t.id && <motion.span layoutId="fav-tab" className="tabs-pill" />}
              <span>
                {t.label} <em>{t.n}</em>
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {tab === "saved" &&
              (shortlist.ids.length ? (
                <div className="grid-cards list-compact">
                  {byIds(shortlist.ids).map((p, i) => (
                    <PropertyCard key={p.id} p={p} index={i} />
                  ))}
                </div>
              ) : (
                <Empty icon="heart" title="No Favorites" text="Tap the heart on any listing to keep it here." />
              ))}

            {tab === "recent" &&
              (recent.ids.length ? (
                <>
                  <div className="tab-tools">
                    <button className="link-btn" onClick={recent.clear}>
                      Clear history
                    </button>
                  </div>
                  <div className="grid-cards list-compact">
                    {byIds(recent.ids).map((p, i) => (
                      <PropertyCard key={p.id} p={p} index={i} />
                    ))}
                  </div>
                </>
              ) : (
                <Empty icon="search" title="Nothing viewed yet" text="Properties you open will show up here." />
              ))}

            {tab === "searches" &&
              (searches.list.length ? (
                <ul className="saved-list">
                  {searches.list.map((s) => (
                    <li key={s.query}>
                      <Link href={`/properties${s.query ? `?${s.query}` : ""}`}>
                        <span className="why-icon sm">
                          <Icon name="bell" size={18} />
                        </span>
                        <span>
                          <b>{s.label}</b>
                          <small>Saved {new Date(s.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</small>
                        </span>
                        <Icon name="arrow" size={18} />
                      </Link>
                      <button className="saved-x" aria-label={`Delete saved search ${s.label}`} onClick={() => searches.remove(s.query)}>
                        <Icon name="close" size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty icon="bell" title="No saved searches" text="Set your filters on the search page and tap “Save this search”." />
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
