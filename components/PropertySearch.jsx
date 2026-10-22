"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import Icon from "./Icon";
import { PROPERTIES, MODES, TYPES, BUDGET_STEPS, COMMERCIAL_TYPES } from "@/lib/data";
import { formatBudget, distanceKm } from "@/lib/format";

const LAST = BUDGET_STEPS.length - 1;

function typesFrom(params) {
  if (params.get("cat") === "commercial") return COMMERCIAL_TYPES;
  return params.get("type") ? [params.get("type")] : [];
}

// The app's Search screen (BUY / RENT / PG, type chips, budget slider) plus results
export default function PropertySearch() {
  const params = useSearchParams();
  const router = useRouter();

  const [mode, setMode] = useState(params.get("mode") || "");
  const [types, setTypes] = useState(() => typesFrom(params));
  const [q, setQ] = useState(params.get("q") || "");
  const [budget, setBudget] = useState([0, LAST]);
  const [sort, setSort] = useState(params.get("near") ? "near" : "new");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const written = useRef(params.toString());

  // A link elsewhere on the page (navbar, footer) changed the URL — follow it
  useEffect(() => {
    const now = params.toString();
    if (now === written.current) return;
    written.current = now;
    setMode(params.get("mode") || "");
    setTypes(typesFrom(params));
    setQ(params.get("q") || "");
    if (params.get("near")) setSort("near");
  }, [params]);

  const near = useMemo(() => {
    const n = params.get("near");
    if (!n) return null;
    const [lat, lng] = n.split(",").map(Number);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  }, [params]);

  // Keep the address bar shareable
  useEffect(() => {
    const next = new URLSearchParams();
    if (mode) next.set("mode", mode);
    if (q) next.set("q", q);
    if (types.length === 1) next.set("type", types[0]);
    if (types.length > 1 && types.every((t) => COMMERCIAL_TYPES.includes(t)) && types.length === COMMERCIAL_TYPES.length)
      next.set("cat", "commercial");
    if (near) next.set("near", `${near.lat},${near.lng}`);
    const str = next.toString();
    if (str === written.current) return;
    written.current = str;
    router.replace(`/properties${str ? `?${str}` : ""}`, { scroll: false });
  }, [mode, q, types, near, router]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const [lo, hi] = [BUDGET_STEPS[budget[0]], budget[1] === LAST ? Infinity : BUDGET_STEPS[budget[1]]];
    const list = PROPERTIES.filter(
      (p) =>
        (!mode || p.mode === mode) &&
        (!types.length || types.includes(p.type)) &&
        (budget[0] === 0 || p.price >= lo) &&
        p.price <= hi &&
        (!term || `${p.title} ${p.locality} ${p.city} ${p.address}`.toLowerCase().includes(term))
    ).map((p) => ({ p, d: near ? distanceKm(near, p) : null }));

    const by = {
      new: (a, b) => b.p.postedOn.localeCompare(a.p.postedOn),
      low: (a, b) => a.p.price - b.p.price,
      high: (a, b) => b.p.price - a.p.price,
      near: (a, b) => (a.d ?? 0) - (b.d ?? 0),
    };
    return list.sort(by[sort] || by.new);
  }, [mode, types, q, budget, sort, near]);

  // After a filter change the list can get much shorter. If you were scrolled
  // into the results, bring the first result back into view instead of being
  // left looking at the footer.
  const resultsRef = useRef(null);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const el = resultsRef.current;
    if (!el) return;
    const navH = document.querySelector(".nav")?.offsetHeight || 0;
    if (el.getBoundingClientRect().top < navH) {
      const y = el.getBoundingClientRect().top + window.scrollY - navH - 20;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.8 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [mode, types, q, budget, sort]);

  const toggleType = (id) => setTypes((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  const reset = () => {
    setMode("");
    setTypes([]);
    setQ("");
    setBudget([0, LAST]);
  };
  const activeCount = (mode ? 1 : 0) + types.length + (budget[0] !== 0 || budget[1] !== LAST ? 1 : 0);

  const lowPct = (budget[0] / LAST) * 100;
  const highPct = (budget[1] / LAST) * 100;

  return (
    <section className="section search-page">
      <div className="container search-layout">
        <aside className={`filters ${filtersOpen ? "open" : ""}`} aria-label="Filters">
          <div className="filters-head">
            <h2>Filters</h2>
            <button className="link-btn" onClick={reset}>
              Reset
            </button>
            <button className="filters-close" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
              <Icon name="close" />
            </button>
          </div>

          <div className="search-field">
            <Icon name="search" size={20} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by area or locality" aria-label="Search by area or locality" />
          </div>

          <div className="seg seg-3" role="tablist" aria-label="Looking to">
            {MODES.map((m) => (
              <button key={m.id} role="tab" aria-selected={mode === m.id} className={mode === m.id ? "on" : ""} onClick={() => setMode(mode === m.id ? "" : m.id)}>
                {mode === m.id && <motion.span layoutId="search-seg" className="seg-pill" />}
                <span>{m.label.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <h3 className="filter-title">Property Type</h3>
          <div className="chips">
            {TYPES.map((t) => (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.94 }}
                className={`chip ${types.includes(t.id) ? "on" : ""}`}
                aria-pressed={types.includes(t.id)}
                onClick={() => toggleType(t.id)}
              >
                {t.label}
              </motion.button>
            ))}
          </div>

          <h3 className="filter-title with-rule">Budget</h3>
          <div className="dual" style={{ "--lo": `${lowPct}%`, "--hi": `${highPct}%` }}>
            <div className="dual-track" />
            <input
              type="range"
              min={0}
              max={LAST}
              value={budget[0]}
              aria-label="Minimum budget"
              onChange={(e) => setBudget(([, h]) => [Math.min(Number(e.target.value), h - 1), h])}
            />
            <input
              type="range"
              min={0}
              max={LAST}
              value={budget[1]}
              aria-label="Maximum budget"
              onChange={(e) => setBudget(([l]) => [l, Math.max(Number(e.target.value), l + 1)])}
            />
          </div>
          <div className="dual-labels">
            <span>{formatBudget(BUDGET_STEPS[budget[0]])}</span>
            <span>
              {formatBudget(BUDGET_STEPS[budget[1]])}
              {budget[1] === LAST ? "+" : ""}
            </span>
          </div>

          <button className="btn btn-green btn-block filters-apply" onClick={() => setFiltersOpen(false)}>
            Search
          </button>
        </aside>

        <div className="results" ref={resultsRef}>
          <div className="results-bar">
            <p>
              <b>{results.length}</b> {results.length === 1 ? "property" : "properties"}
              {near && " near you"}
            </p>
            <div className="results-tools">
              <button className="btn btn-outline filters-toggle" onClick={() => setFiltersOpen(true)}>
                <Icon name="list" size={18} /> Filters{activeCount ? ` (${activeCount})` : ""}
              </button>
              <label className="sort">
                <span className="sr-only">Sort by</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="new">Newest first</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  {near && <option value="near">Nearest first</option>}
                </select>
                <Icon name="chevron" size={16} />
              </label>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {results.length ? (
              <motion.div key="grid" layout className="grid-cards grid-cards-2">
                {results.map(({ p, d }, i) => (
                  <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                    <PropertyCard p={p} index={i} distance={d} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" className="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="empty-icon">
                  <Icon name="search" size={34} />
                </span>
                <h3>No properties match yet</h3>
                <p>Try another locality or widen your budget.</p>
                <button className="btn btn-green" onClick={reset}>
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {filtersOpen && <div className="filters-backdrop" onClick={() => setFiltersOpen(false)} />}
    </section>
  );
}
