"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import FavButton from "./FavButton";
import PropertyImage from "./PropertyImage";
import Icon, { WhatsAppIcon } from "./Icon";
import { priceLabel, perSqft, areaLabel, timeAgo, formatPrice } from "@/lib/format";
import { typeInfo } from "@/lib/options";

const MODE_TAG = { buy: "For Sale", rent: "For Rent", pg: "PG" };

// Grid card (home rails) or, with `row`, the wide 99acres-style results card
export default function PropertyCard({ p, index = 0, distance, onHover, row = false }) {
  const facts = [
    p.bedrooms,
    areaLabel(p),
    p.type === "plot" || p.type === "agri" ? p.dimensions : p.furnishing,
    p.facing && `${p.facing} facing`,
  ].filter(Boolean);
  const tag = p.mode === "rent" && p.listedFor === "Lease" ? "For Lease" : MODE_TAG[p.mode];
  const place = [p.landmark, p.city].filter(Boolean).join(", ");

  if (row) {
    // Key facts in the columns 99acres shows: area, configuration, status
    const cols = [
      areaLabel(p) && { k: p.acre || p.kunte ? "Land area" : p.type === "plot" ? "Plot area" : "Area", v: areaLabel(p), s: p.pricePerSqft ? perSqft(p.pricePerSqft) : null },
      p.bedrooms ? { k: "Configuration", v: p.bedrooms, s: p.baths ? `${p.baths} Bath` : null } : p.dimensions ? { k: "Dimensions", v: p.dimensions, s: p.facing ? `${p.facing} facing` : null } : null,
      { k: p.mode === "buy" ? "Status" : "Furnishing", v: p.mode === "buy" ? p.status || p.saleType || "—" : p.furnishing || "—", s: p.mode === "buy" && p.saleType && p.status ? p.saleType : p.approval },
    ].filter(Boolean);

    return (
      <motion.article
        className="rcard"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href={`/property/${p.id}`} className="rcard-img">
          <PropertyImage p={p} />
          <span className={`pcard-tag tag-${p.mode}`}>{tag}</span>
          {p.images.length > 1 && (
            <span className="pcard-photos">
              <Icon name="camera" size={13} /> {p.images.length} Photos
            </span>
          )}
        </Link>
        <FavButton id={p.id} className="rcard-fav" />
        <div className="rcard-body">
          <p className="rcard-type">
            {p.type === "pg" ? p.category : typeInfo(p.type).label}
            {p.rera && <span className="badge">RERA</span>}
          </p>
          <Link href={`/property/${p.id}`} className="rcard-title">
            <h3>{p.title}</h3>
          </Link>
          {place && (
            <p className="pcard-loc">
              <Icon name="pin" size={15} />
              <span>{place}</span>
              {distance != null && <em> · {distance.toFixed(1)} km</em>}
            </p>
          )}
          <div className="rcard-cols">
            <div>
              <small>Price</small>
              <b className="rcard-price">{priceLabel(p)}</b>
              {p.token && <span>Token {formatPrice(p.token)}</span>}
            </div>
            {cols.map((c) => (
              <div key={c.k}>
                <small>{c.k}</small>
                <b>{c.v}</b>
                {c.s && <span>{c.s}</span>}
              </div>
            ))}
          </div>
          {p.amenities.length > 0 && (
            <p className="rcard-amen">
              {p.amenities.slice(0, 4).join(" · ")}
              {p.amenities.length > 4 && ` +${p.amenities.length - 4} more`}
            </p>
          )}
          <div className="rcard-foot">
            <span className="pcard-by">
              <span className="pcard-avatar">{p.owner.charAt(0).toUpperCase()}</span>
              <span>
                {p.owner}
                <small>Posted {timeAgo(p.postedOn).toLowerCase()}</small>
              </span>
            </span>
            <div className="rcard-actions">
              <Link href={`/property/${p.id}`} className="btn btn-outline btn-sm">
                View details
              </Link>
              <Link href={`/property/${p.id}?enquire=1`} className="btn btn-enquire btn-sm">
                <WhatsAppIcon size={17} /> Contact Owner
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      className="pcard"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover ? () => onHover(p.id) : undefined}
      onMouseLeave={onHover ? () => onHover(null) : undefined}
    >
      <Link href={`/property/${p.id}`} className="pcard-link">
        <div className="pcard-img">
          <PropertyImage p={p} />
          <span className={`pcard-tag tag-${p.mode}`}>{tag}</span>
          {p.images.length > 1 && (
            <span className="pcard-photos">
              <Icon name="camera" size={13} /> {p.images.length}
            </span>
          )}
          <FavButton id={p.id} className="pcard-fav" />
        </div>
        <div className="pcard-body">
          <div className="pcard-price">
            <strong>{priceLabel(p)}</strong>
            {p.pricePerSqft && <span>{perSqft(p.pricePerSqft)}</span>}
          </div>
          <h3>{p.title}</h3>
          <p className="pcard-loc">
            <Icon name="pin" size={15} />
            <span>{place}</span>
            {distance != null && <em> · {distance.toFixed(1)} km</em>}
          </p>
          {facts.length > 0 && (
            <div className="pcard-facts">
              {facts.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          )}
          <div className="pcard-foot">
            <span className="pcard-by">
              <span className="pcard-avatar">{p.owner.charAt(0).toUpperCase()}</span>
              <span>
                {p.owner}
                <small>{timeAgo(p.postedOn)}</small>
              </span>
            </span>
            <span className="pcard-go">
              View <Icon name="arrow" size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
