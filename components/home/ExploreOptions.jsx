"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Rail from "../Rail";
import Icon from "../Icon";

// "Get started with exploring real estate options" — the 99acres card row
const OPTIONS = [
  { label: "Buying a home", href: "/properties?mode=buy", img: "/props/house-mysore.webp" },
  { label: "Renting a home", href: "/properties?mode=rent", img: "/props/apartment-bangalore.webp" },
  { label: "Sell/Rent your property", href: "/post-property", icon: "upload", tone: "green", text: "Post FREE in 3 steps" },
  { label: "Plots/Land", href: "/properties?type=plot", img: "/props/plot-kadakola.webp" },
  { label: "PG & Co-living", href: "/properties?mode=pg", img: "/props/hostel-bangalore.webp" },
  { label: "Buying commercial", href: "/properties?mode=buy&cat=commercial", img: "/props/office-bangalore.webp" },
  { label: "Shops & showrooms", href: "/properties?type=shop,showroom", img: "/props/shops-mysore.webp" },
  { label: "Agricultural Land", href: "/properties?type=agri", img: "/props/farm-karnataka.webp" },
  { label: "Go Premium", href: "/premium", icon: "crown", tone: "mint", text: "Top placement for ₹199/month" },
];

export default function ExploreOptions() {
  return (
    <section className="section explore">
      <div className="container">
        <p className="kicker-center">Get started with exploring real estate options</p>
        <Rail label="Real estate options">
          {OPTIONS.map((o, i) => (
            <motion.div
              key={o.label}
              role="listitem"
              className="xopt-wrap"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={o.href} className="xopt">
                <span className={`xopt-img ${o.tone ? `tone-${o.tone}` : ""}`}>
                  {o.img ? (
                    <img src={o.img} alt="" loading="lazy" />
                  ) : (
                    <span className="xopt-art">
                      <Icon name={o.icon} size={44} />
                      {o.text && <small>{o.text}</small>}
                    </span>
                  )}
                  {o.isNew && <em className="xopt-new">NEW</em>}
                </span>
                <span className="xopt-label">{o.label}</span>
              </Link>
            </motion.div>
          ))}
        </Rail>
      </div>
    </section>
  );
}
