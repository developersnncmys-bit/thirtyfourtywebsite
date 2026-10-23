"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Icon from "./Icon";
import { useListings } from "./ListingsProvider";
import { typeInfo } from "@/lib/options";

// The 99acres-style search card: tabs, a property-type picker, a free-text box
// that understands "2 BHK flat for rent in Mysore", and Near me — the same
// categories as the app (Buy · Rent · PG · Commercial · Agricultural Land).
const TABS = [
  { id: "buy", label: "Buy", params: { mode: "buy" } },
  { id: "rent", label: "Rent", params: { mode: "rent" } },
  { id: "pg", label: "PG", params: { mode: "pg" } },
  { id: "commercial", label: "Commercial", params: { cat: "commercial" } },
  { id: "agri", label: "Agricultural Land/Farm Plot", params: { type: "agri" } },
];

const KINDS = {
  residential: [
    { id: "", label: "All Residential", types: "flat,house,villa,plot" },
    { id: "flat", label: "Flat / Apartment", types: "flat" },
    { id: "house", label: "Independent House", types: "house" },
    { id: "villa", label: "Villa", types: "villa" },
    { id: "plot", label: "Residential Plot", types: "plot" },
  ],
  commercial: [
    { id: "", label: "All Commercial", types: "" },
    { id: "office", label: "Office Space", types: "office" },
    { id: "shop", label: "Shop", types: "shop" },
    { id: "showroom", label: "Showroom", types: "showroom" },
    { id: "commercial", label: "Other Commercial", types: "commercial" },
  ],
  pg: [
    { id: "", label: "All PG", pgfor: "" },
    { id: "boys", label: "Boys PG", pgfor: "Boys PG" },
    { id: "girls", label: "Girls PG", pgfor: "Girls PG" },
    { id: "co", label: "Co-Living PG", pgfor: "Co-Living PG" },
  ],
};
const kindsFor = (tab) => (tab === "commercial" ? KINDS.commercial : tab === "agri" ? [{ id: "", label: "Agricultural Land", types: "agri" }] : tab === "pg" ? KINDS.pg : KINDS.residential);

const WORDS = [
  [/\b(flats?|apartments?)\b/, "flat"],
  [/\b(independent )?houses?\b/, "house"],
  [/\bvillas?\b/, "villa"],
  [/\b(plots?|sites?)\b/, "plot"],
  [/\b(farm|agricultural|agri)( land| plots?)?\b/, "agri"],
  [/\boffices?( space)?\b/, "office"],
  [/\bshops?\b/, "shop"],
  [/\bshowrooms?\b/, "showroom"],
];

// "2 bhk flat for rent in mysore" → { bhk: 2, type: flat, mode: rent, city: Mysore }
function parse(text, cities) {
  let t = ` ${text.toLowerCase()} `;
  const out = {};
  const bhk = t.match(/(\d)\s*bhk/);
  if (bhk) {
    out.bhk = Math.min(5, Number(bhk[1]));
    t = t.replace(bhk[0], " ");
  }
  for (const [re, type] of WORDS)
    if (re.test(t)) {
      out.type = type;
      t = t.replace(re, " ");
      break;
    }
  if (/\b(rent|rental|lease)\b/.test(t)) out.mode = "rent";
  else if (/\b(sale|buy|sell)\b/.test(t)) out.mode = "buy";
  if (/\bpg\b|hostel|co-?living/.test(t)) out.mode = "pg";
  const city = cities.find((c) => t.includes(` ${c.toLowerCase()} `) || t.includes(` ${c.toLowerCase()}`));
  if (city) {
    out.city = city;
    t = t.replace(city.toLowerCase(), " ");
  }
  const rest = t
    .replace(/\b(for|in|at|near|the|a|an|rent|rental|lease|sale|buy|sell|pg|hostel|property|properties)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (rest) out.q = rest;
  return out;
}

export default function PortalSearch({ className = "", compact = false, initialTab = "buy" }) {
  const router = useRouter();
  const listings = useListings();
  const listId = useId();
  const [tab, setTab] = useState(initialTab);
  const [kind, setKind] = useState("");
  const [kindOpen, setKindOpen] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const kindRef = useRef(null);
  const blur = useRef(null);
  const kinds = kindsFor(tab);
  const kindLabel = kinds.find((k) => k.id === kind)?.label || kinds[0].label;

  useEffect(() => setKind(""), [tab]);
  useEffect(() => {
    if (!kindOpen) return;
    const close = (e) => !kindRef.current?.contains(e.target) && setKindOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [kindOpen]);

  const cities = useMemo(() => {
    const m = new Map();
    listings.forEach((p) => p.city && m.set(p.city, (m.get(p.city) || 0) + 1));
    return [...m].sort((a, b) => b[1] - a[1]);
  }, [listings]);

  const buildUrl = (text, extra = {}) => {
    const t = TABS.find((x) => x.id === tab);
    const p = new URLSearchParams(t.params);
    const k = kinds.find((x) => x.id === kind);
    if (k?.types) p.set("type", k.types);
    if (k?.pgfor) p.set("pgfor", k.pgfor);
    const parsed = parse(text, cities.map(([c]) => c));
    if (parsed.mode && tab !== "commercial" && tab !== "agri") p.set("mode", parsed.mode);
    if (parsed.type) p.set("type", parsed.type);
    if (parsed.bhk) p.set("bhk", parsed.bhk);
    if (parsed.city) p.set("city", parsed.city);
    if (parsed.q) p.set("q", parsed.q);
    Object.entries(extra).forEach(([key, v]) => p.set(key, v));
    if (p.get("type") === "flat,house,villa,plot") p.delete("type");
    return `/properties?${p}`;
  };

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    const cityHits = cities
      .filter(([c]) => !term || c.toLowerCase().includes(term) || term.includes(c.toLowerCase()))
      .slice(0, 5)
      .map(([c, n]) => ({ key: `c-${c}`, kind: "city", title: c, sub: `${n} ${n === 1 ? "property" : "properties"}`, city: c }));
    const hits = term
      ? listings
          .filter((p) => `${p.title} ${p.address || ""} ${p.landmark || ""}`.toLowerCase().includes(term))
          .slice(0, 4)
          .map((p) => ({ key: p.id, kind: "listing", title: p.title, sub: typeInfo(p.type).label, href: `/property/${p.id}` }))
      : [];
    return [...cityHits, ...hits];
  }, [q, cities, listings]);

  const go = (href) => {
    setOpen(false);
    router.push(href);
  };
  const pick = (s) => go(s.href || buildUrl(s.city));
  const submit = (e) => {
    e?.preventDefault();
    if (open && cursor >= 0 && suggestions[cursor]) return pick(suggestions[cursor]);
    go(buildUrl(q));
  };

  const nearMe = () => {
    setError("");
    if (!navigator.geolocation) return setError("Location isn't available in this browser.");
    setBusy("locate");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setBusy("");
        go(buildUrl(q, { near: `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}` }));
      },
      () => {
        setBusy("");
        setError("Allow location access to see properties near you.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className={`psearch ${compact ? "psearch-compact" : ""} ${className}`}>
      <div className="psearch-tabs" role="tablist" aria-label="What are you looking for?">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
            {t.label}
            {t.dot && <i className="psearch-dot" />}
            {tab === t.id && <motion.span layoutId={compact ? "ps-line-c" : "ps-line"} className="psearch-line" />}
          </button>
        ))}
        <span className="psearch-sep" />
        <Link href="/post-property" className="psearch-post">
          Post Property <span className="free">FREE</span>
        </Link>
      </div>

      <form className="psearch-row" onSubmit={submit} role="search">
        <div className="psearch-kind" ref={kindRef}>
          <button type="button" aria-haspopup="listbox" aria-expanded={kindOpen} onClick={() => setKindOpen((o) => !o)}>
            {kindLabel}
            <Icon name="chevron" size={16} strokeWidth={2.4} />
          </button>
          <AnimatePresence>
            {kindOpen && (
              <motion.ul className="psearch-menu" role="listbox" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
                {kinds.map((k) => (
                  <li key={k.id || "all"}>
                    <button
                      type="button"
                      className={k.id === kind ? "on" : ""}
                      onClick={() => {
                        setKind(k.id);
                        setKindOpen(false);
                      }}
                    >
                      <span className="psearch-check">{k.id === kind && <Icon name="check" size={13} strokeWidth={3} />}</span>
                      {k.label}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="psearch-input">
          <Icon name="search" size={20} />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setCursor(-1);
            }}
            onFocus={() => {
              clearTimeout(blur.current);
              setOpen(true);
            }}
            onBlur={() => (blur.current = setTimeout(() => setOpen(false), 150))}
            onKeyDown={(e) => {
              if (!open) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(suggestions.length - 1, c + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(-1, c - 1));
              } else if (e.key === "Escape") setOpen(false);
            }}
            placeholder={`Search by Locality — e.g. "2 BHK flat in ${cities[0]?.[0] || "Mysore"}"`}
            aria-label="Search by city, locality or property"
            role="combobox"
            aria-expanded={open && suggestions.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
          />
          <AnimatePresence>
            {open && suggestions.length > 0 && (
              <motion.ul
                id={listId}
                role="listbox"
                className="psearch-suggest"
                data-lenis-prevent
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
                {!q.trim() && <li className="psearch-head">Cities with properties</li>}
                {suggestions.map((s, i) => (
                  <li key={s.key} role="option" aria-selected={i === cursor}>
                    <button type="button" className={i === cursor ? "on" : ""} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(s)}>
                      <span className={`psearch-ico ${s.kind}`}>
                        <Icon name={s.kind === "city" ? "pin" : "home"} size={16} />
                      </span>
                      <span className="psearch-txt">
                        <b>{s.title}</b>
                        <small>{s.sub}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <button type="button" className={`psearch-round ${busy === "locate" ? "busy" : ""}`} onClick={nearMe} aria-label="Search near me" title="Near me">
          <Icon name="target" size={20} strokeWidth={2} />
        </button>
        <button type="submit" className="psearch-go">
          Search
        </button>
      </form>
      {error && <p className="psearch-error">{error}</p>}
    </div>
  );
}
