"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "../Reveal";
import Icon from "../Icon";
import { useListings } from "../ListingsProvider";
import { setCity } from "@/lib/city";

// Cities with live listings — "Top cities" on 99acres
export default function Cities() {
  const all = useListings();
  const map = new Map();
  all.forEach((p) => {
    if (!p.city) return;
    const c = map.get(p.city) || { n: 0, buy: 0, rent: 0, img: null };
    c.n++;
    if (p.mode === "buy") c.buy++;
    else c.rent++;
    c.img = c.img || p.images[0];
    map.set(p.city, c);
  });
  const cities = [...map].sort((a, b) => b[1].n - a[1].n).slice(0, 8);
  if (!cities.length) return null;

  return (
    <section className="section cities">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Top cities</span>
          <h2>
            Explore real estate in <em className="hl-green">popular cities</em>
          </h2>
        </Reveal>
        <div className="cities-grid">
          {cities.map(([name, c], i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.07, duration: 0.6 }}>
              <Link href={`/properties?city=${encodeURIComponent(name)}`} className="city" onClick={() => setCity(name)}>
                <span className="city-img">{c.img ? <img src={c.img} alt="" loading="lazy" /> : <Icon name="building" size={28} />}</span>
                <span className="city-txt">
                  <b>{name}</b>
                  <small>
                    {c.n} {c.n === 1 ? "Property" : "Properties"}
                    {c.buy > 0 && c.rent > 0 ? ` · ${c.buy} sale · ${c.rent} rent` : ""}
                  </small>
                </span>
                <Icon name="arrow" size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
