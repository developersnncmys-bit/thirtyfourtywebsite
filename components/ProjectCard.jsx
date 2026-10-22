"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "./Icon";
import { getLocality } from "@/lib/data";
import { projectPriceRange, configLabel } from "@/lib/format";

export default function ProjectCard({ pr, index = 0 }) {
  const loc = getLocality(pr.locality);
  return (
    <motion.article
      className="pcard"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/projects/${pr.id}`} className="pcard-link">
        <div className="pcard-img">
          <img src={pr.images[0]} alt={pr.name} loading="lazy" />
          <span className={`pcard-status st-${pr.status.replace(/\s+/g, "-").toLowerCase()}`}>{pr.status}</span>
          {pr.rera && <span className="pcard-rera">RERA</span>}
        </div>
        <div className="pcard-body">
          <small className="pcard-builder">{pr.builder}</small>
          <h3>{pr.name}</h3>
          <p className="card-loc">
            <Icon name="pin" size={15} /> {loc?.name}, Mysuru
          </p>
          <p className="pcard-price">{projectPriceRange(pr)}</p>
          <div className="pcard-configs">
            {pr.configs.map((c) => (
              <span key={configLabel(c)}>{configLabel(c)}</span>
            ))}
          </div>
          <div className="pcard-foot">
            <span>
              <Icon name="building" size={14} /> {pr.possession === "Ready" ? "Ready to move" : `Possession ${pr.possession}`}
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
