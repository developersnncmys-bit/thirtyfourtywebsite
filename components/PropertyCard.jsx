"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import FavButton from "./FavButton";
import Icon from "./Icon";
import { priceLabel } from "@/lib/format";
import { TYPES } from "@/lib/data";

const typeLabel = (id) => TYPES.find((t) => t.id === id)?.label.split("/")[0];
const MODE_TAG = { buy: "For Sale", rent: "For Rent", pg: "PG" };

export default function PropertyCard({ p, index = 0, distance }) {
  return (
    <motion.article
      className="card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/property/${p.id}`} className="card-link">
        <div className="card-img">
          <img src={p.images[0]} alt={p.title} loading="lazy" />
          <span className={`card-tag tag-${p.mode}`}>{MODE_TAG[p.mode]}</span>
          <FavButton id={p.id} className="card-fav" />
        </div>
        <div className="card-body">
          <h3>{p.title}</h3>
          <p className="card-loc">
            <Icon name="pin" size={15} /> {p.locality}, {p.city}
            {distance != null && <span className="card-dist"> · {distance.toFixed(1)} km away</span>}
          </p>
          <div className="card-meta">
            <span>{typeLabel(p.type)}</span>
            <span>
              {p.area} {p.areaUnit}
            </span>
            {p.beds && <span>{p.beds} Bed</span>}
          </div>
          <p className="card-price">{priceLabel(p)}</p>
        </div>
      </Link>
    </motion.article>
  );
}
