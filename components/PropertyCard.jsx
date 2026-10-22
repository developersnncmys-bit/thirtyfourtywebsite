"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import FavButton from "./FavButton";
import CompareButton from "./CompareButton";
import Icon from "./Icon";
import { priceLabel, perSqft, areaLabel, formatDate } from "@/lib/format";

const MODE_TAG = { buy: "For Sale", rent: "For Rent", pg: "PG" };

export default function PropertyCard({ p, index = 0, distance, onHover }) {
  const facts = [
    areaLabel(p),
    p.status === "Under Construction" ? "Under construction" : p.mode === "buy" && p.status ? "Ready to move" : null,
    p.furnishing,
  ].filter(Boolean);

  return (
    <motion.article
      className="card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover ? () => onHover(p.id) : undefined}
      onMouseLeave={onHover ? () => onHover(null) : undefined}
    >
      <Link href={`/property/${p.id}`} className="card-link">
        <div className="card-img">
          <img src={p.images[0]} alt={p.title} loading="lazy" />
          <span className={`card-tag tag-${p.mode}`}>{MODE_TAG[p.mode]}</span>
          {p.verified && (
            <span className="card-verified">
              <Icon name="shield" size={13} strokeWidth={2.2} /> Verified
            </span>
          )}
          <span className="card-photos">
            <Icon name="camera" size={13} /> {p.photos}
          </span>
          <FavButton id={p.id} className="card-fav" />
        </div>
        <div className="card-body">
          <div className="card-pricerow">
            <p className="card-price">{priceLabel(p)}</p>
            {p.pricePerSqft && <span className="card-psf">{perSqft(p.pricePerSqft)}</span>}
          </div>
          <h3>{p.title}</h3>
          <p className="card-loc">
            <Icon name="pin" size={15} /> {p.locality}, {p.city}
            {distance != null && <span className="card-dist"> · {distance.toFixed(1)} km away</span>}
          </p>
          <div className="card-meta">
            {facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
          <div className="card-foot">
            <span className={`card-by by-${p.postedBy}`}>
              {p.postedBy === "builder" ? "Builder" : "Owner"} · {formatDate(p.postedOn)}
            </span>
            <CompareButton id={p.id} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
