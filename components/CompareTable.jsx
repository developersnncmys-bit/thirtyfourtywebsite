"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "./Icon";
import { useCompare } from "@/lib/store";
import { PROPERTIES, TYPES, AMENITIES } from "@/lib/data";
import { priceLabel, perSqft, areaLabel } from "@/lib/format";

export default function CompareTable() {
  const { ids, remove, clear } = useCompare();
  const items = ids.map((id) => PROPERTIES.find((p) => p.id === id)).filter(Boolean);

  if (!items.length)
    return (
      <section className="section">
        <div className="container">
          <div className="empty">
            <span className="empty-icon">
              <Icon name="list" size={34} />
            </span>
            <h3>Nothing to compare yet</h3>
            <p>Tick “Compare” on up to 4 listings and they'll line up here.</p>
            <Link href="/properties" className="btn btn-green">
              Browse properties
            </Link>
          </div>
        </div>
      </section>
    );

  // Best value per row, highlighted so the winner is easy to spot
  const psfs = items.map((p) => p.pricePerSqft).filter(Boolean);
  const bestPsf = psfs.length > 1 ? Math.min(...psfs) : null;
  const bigArea = items.length > 1 ? Math.max(...items.filter((p) => p.areaUnit === "sqft").map((p) => p.area)) : null;

  const rows = [
    ["Price", (p) => <b className="cmp-price">{priceLabel(p)}</b>],
    ["Price per sqft", (p) => (p.pricePerSqft ? <span className={p.pricePerSqft === bestPsf ? "best" : ""}>{perSqft(p.pricePerSqft)}</span> : "—")],
    ["Area", (p) => <span className={p.area === bigArea && p.areaUnit === "sqft" ? "best" : ""}>{areaLabel(p)}</span>],
    ["Type", (p) => TYPES.find((t) => t.id === p.type)?.label],
    ["Configuration", (p) => (p.bhk ? `${p.bhk} BHK` : "—")],
    ["Bathrooms", (p) => p.baths ?? "—"],
    ["Locality", (p) => p.locality],
    ["Status", (p) => p.status || p.possession || "—"],
    ["Furnishing", (p) => p.furnishing || "—"],
    ["Facing", (p) => p.facing || "—"],
    ["Floor", (p) => (p.floor != null ? (p.floor === 0 ? "Ground" : p.floor) : "—")],
    ["Posted by", (p) => (p.postedBy === "builder" ? "Builder" : "Owner")],
    ["Verified", (p) => (p.verified ? <Icon name="check" size={18} strokeWidth={2.6} className="yes" /> : "—")],
    ["RERA", (p) => (p.rera ? <Icon name="check" size={18} strokeWidth={2.6} className="yes" /> : "—")],
    ...AMENITIES.map((a) => [a, (p) => (p.amenities?.includes(a) ? <Icon name="check" size={18} strokeWidth={2.6} className="yes" /> : <span className="muted">—</span>)]),
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="cmp-head-row">
          <p>
            Comparing <b>{items.length}</b> {items.length === 1 ? "property" : "properties"}
          </p>
          <button className="link-btn" onClick={clear}>
            Clear all
          </button>
        </div>
        <div className="table-scroll cmp-scroll" data-lenis-prevent>
          <table className="cmp-table" style={{ "--cols": items.length }}>
            <thead>
              <tr>
                <th scope="col" className="cmp-label" />
                {items.map((p, i) => (
                  <th key={p.id} scope="col">
                    <motion.div className="cmp-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <button className="cmp-x" aria-label={`Remove ${p.title}`} onClick={() => remove(p.id)}>
                        <Icon name="close" size={14} strokeWidth={2.6} />
                      </button>
                      <Link href={`/property/${p.id}`}>
                        <img src={p.images[0]} alt="" />
                        <span>{p.title}</span>
                      </Link>
                    </motion.div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, cell]) => (
                <tr key={label}>
                  <th scope="row" className="cmp-label">
                    {label}
                  </th>
                  {items.map((p) => (
                    <td key={p.id}>{cell(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length < 4 && (
          <p className="center mt-48">
            <Link href="/properties" className="btn btn-outline">
              <Icon name="plus" size={16} /> Add another property
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
