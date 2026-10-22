"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import Icon from "./Icon";
import { PROJECTS, LOCALITIES } from "@/lib/data";

const STATUS = ["New Launch", "Under Construction", "Ready to Move"];

export default function ProjectsList() {
  const params = useSearchParams();
  const [status, setStatus] = useState("");
  const [loc, setLoc] = useState(params.get("loc") || "");
  const [q, setQ] = useState(params.get("q") || "");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PROJECTS.filter(
      (p) =>
        (!status || p.status === status) &&
        (!loc || p.locality === loc) &&
        (!term || `${p.name} ${p.builder} ${p.locality}`.toLowerCase().includes(term))
    );
  }, [status, loc, q]);

  const locs = LOCALITIES.filter((l) => PROJECTS.some((p) => p.locality === l.slug));

  return (
    <section className="section">
      <div className="container">
        <div className="proj-filters">
          <div className="search-field">
            <Icon name="search" size={20} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects or builders" aria-label="Search projects" />
          </div>
          <div className="chips">
            <button className={`chip ${!status ? "on" : ""}`} onClick={() => setStatus("")}>
              All
            </button>
            {STATUS.map((s) => (
              <button key={s} className={`chip ${status === s ? "on" : ""}`} aria-pressed={status === s} onClick={() => setStatus(status === s ? "" : s)}>
                {s}
              </button>
            ))}
          </div>
          <label className="sort">
            <span className="sr-only">Locality</span>
            <select value={loc} onChange={(e) => setLoc(e.target.value)}>
              <option value="">All localities</option>
              {locs.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={16} />
          </label>
        </div>

        <p className="results-count">
          <b>{list.length}</b> {list.length === 1 ? "project" : "projects"} in Mysuru
        </p>

        <AnimatePresence mode="popLayout">
          {list.length ? (
            <motion.div key="grid" layout className="grid-cards">
              {list.map((pr, i) => (
                <motion.div key={pr.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                  <ProjectCard pr={pr} index={i} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="empty-icon">
                <Icon name="building" size={34} />
              </span>
              <h3>No projects match</h3>
              <p>Try another locality or status.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
