"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import LocalityCard from "./LocalityCard";
import MapView from "./MapView";
import Icon from "./Icon";
import { LOCALITIES } from "@/lib/data";
import { perSqft } from "@/lib/format";

const SORTS = {
  growth: { label: "Highest growth", fn: (a, b) => b.change - a.change },
  rating: { label: "Top rated", fn: (a, b) => b.rating - a.rating },
  low: { label: "Most affordable", fn: (a, b) => a.avgPrice - b.avgPrice },
  high: { label: "Most premium", fn: (a, b) => b.avgPrice - a.avgPrice },
};

export default function LocalitiesList() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("growth");
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return LOCALITIES.filter((l) => !term || `${l.name} ${l.tagline}`.toLowerCase().includes(term)).sort(SORTS[sort].fn);
  }, [q, sort]);

  return (
    <section className="section">
      <div className="container">
        <div className="proj-filters">
          <div className="search-field">
            <Icon name="search" size={20} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search localities" aria-label="Search localities" />
          </div>
          <div className="chips">
            {Object.entries(SORTS).map(([k, s]) => (
              <motion.button key={k} whileTap={{ scale: 0.94 }} className={`chip ${sort === k ? "on" : ""}`} aria-pressed={sort === k} onClick={() => setSort(k)}>
                {s.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="loc-map">
          <MapView
            points={list.map((l) => ({
              id: l.slug,
              lat: l.lat,
              lng: l.lng,
              label: perSqft(l.avgPrice).replace("/sqft", ""),
              title: l.name,
              sub: `${perSqft(l.avgPrice)} · ▲ ${l.change}%`,
              href: `/localities/${l.slug}`,
            }))}
            height={360}
          />
        </div>

        <div className="grid-cards">
          {list.map((l, i) => (
            <LocalityCard key={l.slug} l={l} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
