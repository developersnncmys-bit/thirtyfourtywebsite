"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "../Reveal";
import Icon from "../Icon";
import { useListings } from "../ListingsProvider";

// "Apartments, Villas and more" — property types with live counts
const GROUPS = [
  { title: "Flats / Apartments", icon: "/icons/flat.webp", img: "/props/apartment-bangalore.webp", types: ["flat"], q: "type=flat" },
  { title: "Independent Houses & Villas", icon: "/icons/house-villa.webp", img: "/props/house-mysore.webp", types: ["house", "villa"], q: "type=house,villa" },
  { title: "Residential Plots", icon: "/icons/plot.webp", img: "/props/plot-kadakola.webp", types: ["plot"], q: "type=plot" },
  { title: "PG / Co-living", icon: "/icons/appartment.webp", img: "/props/hostel-bangalore.webp", types: ["pg"], q: "mode=pg" },
  { title: "Office Space", icon: "/icons/office_space.webp", img: "/props/office-bangalore.webp", types: ["office"], q: "type=office" },
  { title: "Shops & Showrooms", icon: "/icons/shop-showroom.webp", img: "/props/shops-mysore.webp", types: ["shop", "showroom", "commercial"], q: "type=shop,showroom,commercial" },
  { title: "Agricultural Land / Farm Plot", icon: "/icons/agricultural-land.webp", img: "/props/farm-karnataka.webp", types: ["agri"], q: "type=agri" },
];

export default function TypeCounts() {
  const list = useListings();
  return (
    <section className="section tcounts">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Property types</span>
          <h2>
            Apartments, Villas <em className="hl-green">and more</em>
          </h2>
        </Reveal>
        <div className="tcounts-grid">
          {GROUPS.map((g, i) => {
            const n = list.filter((p) => g.types.includes(p.type)).length;
            return (
              <motion.div
                key={g.title}
                className={`tc tc-${i}`}
                initial={{ opacity: 0, y: 50, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/properties?${g.q}`}>
                  <img src={g.img} alt="" loading="lazy" className="tc-photo" />
                  <span className="tc-shade" />
                  <span className="tc-icon">
                    <img src={g.icon} alt="" />
                  </span>
                  <span className="tc-text">
                    <b>{g.title}</b>
                    <small>{n ? `${n} ${n === 1 ? "Property" : "Properties"}` : "Be the first to post"}</small>
                  </span>
                  <span className="tc-go">
                    <Icon name="arrow" size={18} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
