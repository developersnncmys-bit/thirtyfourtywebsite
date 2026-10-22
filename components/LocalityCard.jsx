"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Sparkline from "./Sparkline";
import Stars from "./Stars";
import Icon from "./Icon";
import { perSqft } from "@/lib/format";
import { listingsIn } from "@/lib/data";

export default function LocalityCard({ l, index = 0 }) {
  const count = listingsIn(l.slug).length;
  return (
    <motion.article
      className="lcard"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/localities/${l.slug}`} className="lcard-link">
        <div className="lcard-top">
          <span>
            <h3>{l.name}</h3>
            <small>{l.tagline}</small>
          </span>
          <span className="lcard-rating">
            <b>{l.rating.toFixed(1)}</b>
            <Stars value={l.rating} size={11} />
          </span>
        </div>
        <div className="lcard-mid">
          <span>
            <small>Avg. price</small>
            <b>{perSqft(l.avgPrice)}</b>
            <em className="up">▲ {l.change}% · 1 yr</em>
          </span>
          <Sparkline values={l.trend} label={`${l.name} price trend, now ${perSqft(l.avgPrice)}`} />
        </div>
        <div className="lcard-foot">
          <span>
            {count} {count === 1 ? "listing" : "listings"}
          </span>
          <span className="pcard-go">
            Explore <Icon name="arrow" size={14} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
