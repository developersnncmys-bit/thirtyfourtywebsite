"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import MapView from "./MapView";
import Icon from "./Icon";
import { useListings } from "./ListingsProvider";
import {
  MODES,
  TYPES,
  BUDGET_STEPS,
  AREA_STEPS,
  COMMERCIAL_TYPES,
  BHK_OPTIONS,
  BATHROOMS,
  POSSESSION,
  SALE_TYPES,
  FURNISHING,
  AMENITIES,
  FACINGS,
  APPROVAL_AUTHORITIES,
  POSTED_SINCE,
  DIET,
  PG_FOR,
  FOOD,
  OCCUPANCY,
  PROFESSION,
} from "@/lib/options";
import { formatBudget, formatPrice, distanceKm } from "@/lib/format";
import { useSavedSearches } from "@/lib/store";

const B_LAST = BUDGET_STEPS.length - 1;
const A_LAST = AREA_STEPS.length - 1;
const PAGE = 12;
const PLURAL = { flat: "Flats", house: "Houses", villa: "Villas", plot: "Plots", office: "Office spaces", shop: "Shops", showroom: "Showrooms", commercial: "Commercial properties", agri: "Agricultural land" };

const list = (v) => (v ? v.split(",").filter(Boolean) : []);

// Everything the page can filter on lives in the URL, so searches can be shared and saved
function fromParams(params) {
  const types = params.get("cat") === "commercial" ? COMMERCIAL_TYPES : list(params.get("type"));
  const range = (key, last) => {
    const [a, b] = (params.get(key) || "").split("-").map(Number);
    return Number.isFinite(a) && Number.isFinite(b) && params.get(key) ? [a, b] : [0, last];
  };
  return {
    mode: params.get("mode") || "",
    types,
    q: params.get("q") || "",
    city: list(params.get("city")),
    bhk: list(params.get("bhk")).map(Number),
    bath: list(params.get("bath")).map(Number),
    budget: range("price", B_LAST),
    area: range("area", A_LAST),
    since: params.get("since") || "",
    rera: params.get("rera") === "1",
    approval: list(params.get("approval")),
    diet: params.get("diet") || "",
    pgFor: list(params.get("pgfor")),
    food: list(params.get("food")),
    occ: list(params.get("occ")),
    prof: list(params.get("prof")),
    status: params.get("status") || "",
    sale: params.get("sale") || "",
    furn: list(params.get("furn")),
    amen: list(params.get("amen")),
    facing: list(params.get("facing")),
    sort: params.get("sort") || (params.get("near") ? "near" : "new"),
    view: params.get("view") || "list",
  };
}

function toQuery(f, near) {
  const p = new URLSearchParams();
  if (f.mode) p.set("mode", f.mode);
  const isCommercial = f.types.length === COMMERCIAL_TYPES.length && COMMERCIAL_TYPES.every((t) => f.types.includes(t));
  if (isCommercial) p.set("cat", "commercial");
  else if (f.types.length) p.set("type", f.types.join(","));
  if (f.q) p.set("q", f.q);
  if (f.city.length) p.set("city", f.city.join(","));
  if (f.bhk.length) p.set("bhk", f.bhk.join(","));
  if (f.bath.length) p.set("bath", f.bath.join(","));
  if (f.budget[0] !== 0 || f.budget[1] !== B_LAST) p.set("price", f.budget.join("-"));
  if (f.area[0] !== 0 || f.area[1] !== A_LAST) p.set("area", f.area.join("-"));
  if (f.since) p.set("since", f.since);
  if (f.rera) p.set("rera", "1");
  if (f.approval.length) p.set("approval", f.approval.join(","));
  if (f.diet) p.set("diet", f.diet);
  if (f.pgFor.length) p.set("pgfor", f.pgFor.join(","));
  if (f.food.length) p.set("food", f.food.join(","));
  if (f.occ.length) p.set("occ", f.occ.join(","));
  if (f.prof.length) p.set("prof", f.prof.join(","));
  if (f.status) p.set("status", f.status);
  if (f.sale) p.set("sale", f.sale);
  if (f.furn.length) p.set("furn", f.furn.join(","));
  if (f.amen.length) p.set("amen", f.amen.join(","));
  if (f.facing.length) p.set("facing", f.facing.join(","));
  if (f.sort !== "new" && !(near && f.sort === "near")) p.set("sort", f.sort);
  if (f.view !== "list") p.set("view", f.view);
  if (near) p.set("near", `${near.lat},${near.lng}`);
  return p.toString();
}

const EMPTY_F = fromParams(new URLSearchParams());
const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function Group({ title, children, defaultOpen = true, count = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`fgroup ${open ? "open" : ""}`}>
      <button type="button" className="fgroup-head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>
          {title}
          {count > 0 && <em>{count}</em>}
        </span>
        <Icon name="chevron" size={18} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="fgroup-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="fgroup-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Chips({ options, value, onToggle, render = (o) => o.label ?? o }) {
  return (
    <div className="chips">
      {options.map((o) => {
        const id = o.id ?? o;
        const on = Array.isArray(value) ? value.includes(id) : value === id;
        return (
          <motion.button key={id} type="button" whileTap={{ scale: 0.94 }} className={`chip ${on ? "on" : ""}`} aria-pressed={on} onClick={() => onToggle(id)}>
            {render(o)}
          </motion.button>
        );
      })}
    </div>
  );
}

function Dual({ steps, value, onChange, fmt, label }) {
  const last = steps.length - 1;
  return (
    <>
      <div className="dual" style={{ "--lo": `${(value[0] / last) * 100}%`, "--hi": `${(value[1] / last) * 100}%` }}>
        <div className="dual-track" />
        <input type="range" min={0} max={last} value={value[0]} aria-label={`Minimum ${label}`} onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - 1), value[1]])} />
        <input type="range" min={0} max={last} value={value[1]} aria-label={`Maximum ${label}`} onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + 1)])} />
      </div>
      <div className="dual-labels">
        <span>{value[0] === 0 ? "Min" : fmt(steps[value[0]])}</span>
        <span>{value[1] === last ? "Max" : fmt(steps[value[1]])}</span>
      </div>
    </>
  );
}

export default function PropertySearch() {
  const PROPERTIES = useListings();
  const params = useSearchParams();
  const router = useRouter();
  const [f, setF] = useState(() => fromParams(params));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [hoverId, setHoverId] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const saved = useSavedSearches();
  const set = (patch) => setF((s) => ({ ...s, ...patch }));

  const near = useMemo(() => {
    const n = params.get("near");
    if (!n) return null;
    const [lat, lng] = n.split(",").map(Number);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  }, [params]);

  // Keep the URL in step with the filters; follow it when a link changes it
  const written = useRef(params.toString());
  useEffect(() => {
    const now = params.toString();
    if (now === written.current) return;
    written.current = now;
    setF(fromParams(params));
  }, [params]);
  const query = toQuery(f, near);
  useEffect(() => {
    if (query === written.current) return;
    written.current = query;
    router.replace(`/properties${query ? `?${query}` : ""}`, { scroll: false });
  }, [query, router]);

  const results = useMemo(() => {
    const term = f.q.trim().toLowerCase();
    const [bLo, bHi] = [BUDGET_STEPS[f.budget[0]], f.budget[1] === B_LAST ? Infinity : BUDGET_STEPS[f.budget[1]]];
    const [aLo, aHi] = [AREA_STEPS[f.area[0]], f.area[1] === A_LAST ? Infinity : AREA_STEPS[f.area[1]]];
    const sinceDays = POSTED_SINCE.find((x) => x.id === f.since)?.days || 0;
    const hits = PROPERTIES.filter(
      (p) =>
        (!f.mode || p.mode === f.mode) &&
        (!f.types.length || f.types.includes(p.type)) &&
        (!f.city.length || f.city.includes(p.city)) &&
        (!f.bhk.length || f.bhk.some((b) => (b === 5 ? (p.bhk || 0) >= 5 : p.bhk === b))) &&
        (!f.bath.length || f.bath.includes(p.baths)) &&
        (f.budget[0] === 0 || p.price >= bLo) &&
        p.price <= bHi &&
        (f.area[0] === 0 || (p.area && p.area >= aLo)) &&
        (f.area[1] === A_LAST || (p.area && p.area <= aHi)) &&
        (!sinceDays || Date.now() - new Date(p.postedOn).getTime() <= sinceDays * 864e5) &&
        (!f.rera || p.rera) &&
        (!f.approval.length || f.approval.includes(p.approval)) &&
        (!f.diet || p.diet === f.diet) &&
        (!f.pgFor.length || f.pgFor.includes(p.category)) &&
        (!f.food.length || f.food.includes(p.food)) &&
        (!f.occ.length || f.occ.some((o) => p.occupancy.includes(o))) &&
        (!f.prof.length || f.prof.some((o) => p.profession.includes(o))) &&
        (!f.status || p.status === f.status) &&
        (!f.sale || p.saleType === f.sale) &&
        (!f.furn.length || f.furn.includes(p.furnishing)) &&
        (!f.amen.length || f.amen.every((a) => p.amenities?.includes(a))) &&
        (!f.facing.length || f.facing.includes(p.facing)) &&
        (!term || `${p.title} ${p.city} ${p.address || ""} ${p.landmark || ""} ${p.dimensions || ""}`.toLowerCase().includes(term))
    ).map((p) => ({ p, d: near && p.lat ? distanceKm(near, p) : null }));

    const psf = (x) => x.p.pricePerSqft ?? Infinity;
    const by = {
      new: (a, b) => String(b.p.postedOn).localeCompare(String(a.p.postedOn)),
      low: (a, b) => a.p.price - b.p.price,
      high: (a, b) => b.p.price - a.p.price,
      psfLow: (a, b) => psf(a) - psf(b),
      psfHigh: (a, b) => (b.p.pricePerSqft ?? -1) - (a.p.pricePerSqft ?? -1),
      area: (a, b) => (b.p.area || 0) - (a.p.area || 0),
      near: (a, b) => (a.d ?? Infinity) - (b.d ?? Infinity),
    };
    return hits.sort(by[f.sort] || by.new);
  }, [f, near, PROPERTIES]);

  // New filters → start from the first page again and bring results into view
  const resultsRef = useRef(null);
  const firstRun = useRef(true);
  const filterKey = JSON.stringify({ ...f, view: undefined });
  useEffect(() => {
    setShown(PAGE);
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
  }, [filterKey]);

  // Removable chips for everything that's applied
  const chips = [];
  if (f.mode) chips.push({ k: "mode", label: MODES.find((m) => m.id === f.mode)?.label, clear: () => set({ mode: "" }) });
  f.types.forEach((t) => chips.push({ k: `t${t}`, label: TYPES.find((x) => x.id === t)?.label, clear: () => set({ types: f.types.filter((x) => x !== t) }) }));
  f.city.forEach((l) => chips.push({ k: `l${l}`, label: l, clear: () => set({ city: f.city.filter((x) => x !== l) }) }));
  f.bhk.forEach((b) => chips.push({ k: `b${b}`, label: BHK_OPTIONS.find((x) => x.id === b)?.label, clear: () => set({ bhk: f.bhk.filter((x) => x !== b) }) }));
  f.bath.forEach((b) => chips.push({ k: `ba${b}`, label: `${b} Bath`, clear: () => set({ bath: f.bath.filter((x) => x !== b) }) }));
  if (f.budget[0] !== 0 || f.budget[1] !== B_LAST)
    chips.push({
      k: "price",
      label: `₹${f.budget[0] ? formatBudget(BUDGET_STEPS[f.budget[0]]) : "0"} – ${f.budget[1] === B_LAST ? "Max" : `₹${formatBudget(BUDGET_STEPS[f.budget[1]])}`}`,
      clear: () => set({ budget: [0, B_LAST] }),
    });
  if (f.area[0] !== 0 || f.area[1] !== A_LAST)
    chips.push({ k: "area", label: `${AREA_STEPS[f.area[0]]} – ${f.area[1] === A_LAST ? "Max" : AREA_STEPS[f.area[1]]} sqft`, clear: () => set({ area: [0, A_LAST] }) });
  if (f.since) chips.push({ k: "since", label: POSTED_SINCE.find((x) => x.id === f.since)?.label, clear: () => set({ since: "" }) });
  if (f.rera) chips.push({ k: "rera", label: "RERA", clear: () => set({ rera: false }) });
  f.approval.forEach((x) => chips.push({ k: `ap${x}`, label: x, clear: () => set({ approval: f.approval.filter((y) => y !== x) }) }));
  if (f.diet) chips.push({ k: "diet", label: f.diet, clear: () => set({ diet: "" }) });
  [["pgFor", "pg"], ["food", "fd"], ["occ", "oc"], ["prof", "pr"]].forEach(([key, k]) =>
    f[key].forEach((x) => chips.push({ k: `${k}${x}`, label: x, clear: () => set({ [key]: f[key].filter((y) => y !== x) }) }))
  );
  if (f.status) chips.push({ k: "st", label: f.status, clear: () => set({ status: "" }) });
  if (f.sale) chips.push({ k: "sale", label: f.sale, clear: () => set({ sale: "" }) });
  f.furn.forEach((x) => chips.push({ k: `f${x}`, label: x, clear: () => set({ furn: f.furn.filter((y) => y !== x) }) }));
  f.amen.forEach((x) => chips.push({ k: `a${x}`, label: x, clear: () => set({ amen: f.amen.filter((y) => y !== x) }) }));
  f.facing.forEach((x) => chips.push({ k: `fc${x}`, label: `${x} facing`, clear: () => set({ facing: f.facing.filter((y) => y !== x) }) }));
  if (f.q) chips.push({ k: "q", label: `“${f.q}”`, clear: () => set({ q: "" }) });

  const reset = () => setF({ ...EMPTY_F, view: f.view, sort: f.sort });
  const isMap = f.view === "map";
  const buyish = f.mode !== "rent" && f.mode !== "pg";
  const isPg = f.mode === "pg";
  // "Plots for sale in Mysore", like the 99acres results heading
  const typeWord = f.types.length === 1 ? PLURAL[f.types[0]] : isPg ? "PG / Co-living" : "Properties";
  const modeWord = f.mode === "buy" ? (f.sale === "New" ? " — new launch" : " for sale") : f.mode === "rent" ? " for rent" : "";
  const headline = `${typeWord}${modeWord}${f.city.length === 1 ? ` in ${f.city[0]}` : ""}${near ? " near you" : ""}`;
  const cities = useMemo(() => {
    const m = new Map();
    PROPERTIES.forEach((p) => p.city && m.set(p.city, (m.get(p.city) || 0) + 1));
    return [...m].sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [PROPERTIES]);

  const searchQuery = toQuery({ ...f, view: "list", sort: "new" }, null);
  const isSaved = saved.has(searchQuery);
  const saveLabel = chips.length ? chips.slice(0, 4).map((c) => c.label).join(" · ") : "All properties";

  const points = results.filter(({ p }) => p.lat).map(({ p }) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: formatPrice(p.price),
    title: p.title,
    sub: [p.city, p.area && `${Math.round(p.area)} sqft`].filter(Boolean).join(" · "),
    href: `/property/${p.id}`,
    image: p.images[0] || null,
  }));

  return (
    <section className={`section search-page ${isMap ? "is-map" : ""}`}>
      <div className="container search-layout">
        <aside className={`filters ${filtersOpen ? "open" : ""}`} aria-label="Filters">
          <div className="filters-head">
            <h2>Filters</h2>
            <button className="link-btn" onClick={reset}>
              Clear all
            </button>
            <button className="filters-close" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
              <Icon name="close" />
            </button>
          </div>

          <div className="filters-scroll" data-lenis-prevent>
            <div className="search-field">
              <Icon name="search" size={20} />
              <input type="search" value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search by area or locality" aria-label="Search by area or locality" />
            </div>

            <div className="seg seg-3" role="tablist" aria-label="Looking to">
              {MODES.map((m) => (
                <button key={m.id} role="tab" aria-selected={f.mode === m.id} className={f.mode === m.id ? "on" : ""} onClick={() => set({ mode: f.mode === m.id ? "" : m.id })}>
                  {f.mode === m.id && <motion.span layoutId="search-seg" className="seg-pill" />}
                  <span>{m.label.toUpperCase()}</span>
                </button>
              ))}
            </div>

            <Group title="Budget" count={f.budget[0] !== 0 || f.budget[1] !== B_LAST ? 1 : 0}>
              <Dual steps={BUDGET_STEPS} value={f.budget} onChange={(budget) => set({ budget })} fmt={formatBudget} label="budget" />
            </Group>
            {!isPg && (
              <Group title="Property Type" count={f.types.length}>
                <Chips options={TYPES} value={f.types} onToggle={(id) => set({ types: toggleIn(f.types, id) })} />
              </Group>
            )}
            {cities.length > 0 && (
              <Group title="City" count={f.city.length}>
                <Chips options={cities} value={f.city} onToggle={(c) => set({ city: toggleIn(f.city, c) })} />
              </Group>
            )}
            {isPg ? (
              <>
                <Group title="Boys / Girls" count={f.pgFor.length}>
                  <Chips options={PG_FOR} value={f.pgFor} onToggle={(x) => set({ pgFor: toggleIn(f.pgFor, x) })} />
                </Group>
                <Group title="Occupancy Type" count={f.occ.length}>
                  <Chips options={OCCUPANCY} value={f.occ} onToggle={(x) => set({ occ: toggleIn(f.occ, x) })} />
                </Group>
                <Group title="Food" count={f.food.length} defaultOpen={false}>
                  <Chips options={FOOD} value={f.food} onToggle={(x) => set({ food: toggleIn(f.food, x) })} />
                </Group>
                <Group title="Profession" count={f.prof.length} defaultOpen={false}>
                  <Chips options={PROFESSION} value={f.prof} onToggle={(x) => set({ prof: toggleIn(f.prof, x) })} />
                </Group>
              </>
            ) : (
              <>
                <Group title="Bedrooms" count={f.bhk.length}>
                  <Chips options={BHK_OPTIONS} value={f.bhk} onToggle={(b) => set({ bhk: toggleIn(f.bhk, b) })} />
                </Group>
                <Group title="Covered Area (sqft)" count={f.area[0] !== 0 || f.area[1] !== A_LAST ? 1 : 0} defaultOpen={false}>
                  <Dual steps={AREA_STEPS} value={f.area} onChange={(area) => set({ area })} fmt={(v) => `${v.toLocaleString("en-IN")}`} label="area" />
                </Group>
                {buyish && (
                  <>
                    <Group title="Possession Status" count={f.status ? 1 : 0} defaultOpen={false}>
                      <Chips options={POSSESSION} value={f.status} onToggle={(s) => set({ status: f.status === s ? "" : s })} />
                    </Group>
                    <Group title="Sale Type" count={f.sale ? 1 : 0} defaultOpen={false}>
                      <Chips options={SALE_TYPES} value={f.sale} onToggle={(s) => set({ sale: f.sale === s ? "" : s })} />
                    </Group>
                  </>
                )}
                {f.mode === "rent" && (
                  <Group title="Diet" count={f.diet ? 1 : 0} defaultOpen={false}>
                    <Chips options={DIET} value={f.diet} onToggle={(s) => set({ diet: f.diet === s ? "" : s })} />
                  </Group>
                )}
              </>
            )}
            <div className="toggles">
              <label className="switch">
                <input type="checkbox" checked={f.rera} onChange={(e) => set({ rera: e.target.checked })} />
                <span className="switch-ui" />
                <span>
                  <b>RERA registered properties</b>
                  <small>Only listings with a RERA number</small>
                </span>
              </label>
            </div>
            <Group title="Posted since" count={f.since ? 1 : 0} defaultOpen={false}>
              <Chips options={POSTED_SINCE} value={f.since} onToggle={(id) => set({ since: f.since === id ? "" : id })} />
            </Group>
            {!isPg && (
              <>
                <Group title="Furnishing Status" count={f.furn.length} defaultOpen={false}>
                  <Chips options={FURNISHING} value={f.furn} onToggle={(x) => set({ furn: toggleIn(f.furn, x) })} />
                </Group>
                <Group title="Amenities" count={f.amen.length} defaultOpen={false}>
                  <Chips options={AMENITIES} value={f.amen} onToggle={(x) => set({ amen: toggleIn(f.amen, x) })} />
                </Group>
                <Group title="Facing" count={f.facing.length} defaultOpen={false}>
                  <Chips options={FACINGS} value={f.facing} onToggle={(x) => set({ facing: toggleIn(f.facing, x) })} />
                </Group>
                <Group title="Bathroom" count={f.bath.length} defaultOpen={false}>
                  <Chips options={BATHROOMS} value={f.bath} onToggle={(x) => set({ bath: toggleIn(f.bath, x) })} />
                </Group>
                <Group title="Approval Authority" count={f.approval.length} defaultOpen={false}>
                  <Chips options={APPROVAL_AUTHORITIES} value={f.approval} onToggle={(x) => set({ approval: toggleIn(f.approval, x) })} />
                </Group>
              </>
            )}
          </div>

          <button className="btn btn-green btn-block filters-apply" onClick={() => setFiltersOpen(false)}>
            Show {results.length} {results.length === 1 ? "property" : "properties"}
          </button>
        </aside>

        <div className="results" ref={resultsRef}>
          <div className="results-bar">
            <h1 className="results-title">
              {results.length} {results.length === 1 ? "result" : "results"} <span>| {headline}</span>
            </h1>
            <div className="results-tools">
              <button className="btn btn-outline filters-toggle" onClick={() => setFiltersOpen(true)}>
                <Icon name="list" size={18} /> Filters{chips.length ? ` (${chips.length})` : ""}
              </button>
              <div className="view-toggle" role="tablist" aria-label="View">
                {[
                  ["list", "list", "List"],
                  ["map", "pin", "Map"],
                ].map(([v, icon, label]) => (
                  <button key={v} role="tab" aria-selected={f.view === v} className={f.view === v ? "on" : ""} onClick={() => set({ view: v })}>
                    {f.view === v && <motion.span layoutId="view-pill" className="seg-pill" />}
                    <Icon name={icon} size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <label className="sort">
                <span className="sr-only">Sort by</span>
                <select value={f.sort} onChange={(e) => set({ sort: e.target.value })}>
                  <option value="new">Newest first</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                                    <option value="area">Largest area</option>
                  {near && <option value="near">Nearest first</option>}
                </select>
                <Icon name="chevron" size={16} />
              </label>
            </div>
          </div>

          <div className="applied">
            <AnimatePresence initial={false}>
              {chips.map((c) => (
                <motion.button
                  key={c.k}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="applied-chip"
                  onClick={c.clear}
                  aria-label={`Remove filter ${c.label}`}
                >
                  {c.label} <Icon name="close" size={13} strokeWidth={2.4} />
                </motion.button>
              ))}
            </AnimatePresence>
            {chips.length > 0 && (
              <button className="link-btn" onClick={reset}>
                Clear all
              </button>
            )}
            <button
              className={`save-search ${isSaved ? "on" : ""}`}
              onClick={() => {
                if (isSaved) saved.remove(searchQuery);
                else {
                  saved.save(searchQuery, saveLabel);
                  setSavedFlash(true);
                  setTimeout(() => setSavedFlash(false), 1800);
                }
              }}
            >
              <Icon name={isSaved ? "heartFilled" : "bell"} size={16} />
              {isSaved ? "Search saved" : "Save this search"}
            </button>
            <AnimatePresence>
              {savedFlash && (
                <motion.span className="saved-flash" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  Find it under Favorite → Saved searches
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className={isMap ? "map-split" : ""}>
            {isMap && (
              <div className="map-pane">
                <MapView points={points} activeId={hoverId} height="100%" />
              </div>
            )}
            <div className="list-pane">
              <AnimatePresence mode="popLayout">
                {results.length ? (
                  <motion.div key="grid" layout className={isMap ? "grid-cards grid-cards-1 list-compact" : "row-list"}>
                    {results.slice(0, shown).map(({ p, d }, i) => (
                      <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                        <PropertyCard p={p} index={i} distance={d} row={!isMap} onHover={isMap ? setHoverId : undefined} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="empty" className="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="empty-icon">
                      <Icon name="search" size={34} />
                    </span>
                    <h3>There is no such property</h3>
                    <p>{PROPERTIES.length ? "Try another locality or remove a filter." : "Listings could not be loaded right now. Please refresh in a moment."}</p>
                    <button className="btn btn-green" onClick={reset}>
                      Clear filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {shown < results.length && (
                <div className="center load-more">
                  <button className="btn btn-outline" onClick={() => setShown((s) => s + PAGE)}>
                    Load more ({results.length - shown} left)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {filtersOpen && <div className="filters-backdrop" onClick={() => setFiltersOpen(false)} />}
    </section>
  );
}
