"use client";
import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";
import { LOCALITIES, PROJECTS } from "@/lib/data";

// Tabs like the big property portals; each one maps to a search URL
const TABS = [
  { id: "buy", label: "Buy", base: "/properties?mode=buy" },
  { id: "rent", label: "Rent", base: "/properties?mode=rent" },
  { id: "pg", label: "PG", base: "/properties?mode=pg" },
  { id: "projects", label: "Projects", base: "/projects?" },
  { id: "commercial", label: "Commercial", base: "/properties?cat=commercial" },
  { id: "plots", label: "Plots", base: "/properties?mode=buy&type=plot" },
];

export default function SearchBar({ className = "" }) {
  const router = useRouter();
  const listId = useId();
  const [tab, setTab] = useState("buy");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const blurTimer = useRef(null);

  const current = TABS.find((t) => t.id === tab);
  const join = (base, extra) => `${base}${base.endsWith("?") ? "" : "&"}${extra}`.replace(/[?&]$/, "");

  // Suggestions: matching localities first, then projects
  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    const locs = LOCALITIES.filter((l) => !term || l.name.toLowerCase().includes(term)).slice(0, term ? 6 : 5);
    const projs = term ? PROJECTS.filter((p) => `${p.name} ${p.builder}`.toLowerCase().includes(term)).slice(0, 3) : [];
    return [
      ...locs.map((l) => ({
        key: l.slug,
        kind: "locality",
        title: l.name,
        sub: `₹${l.avgPrice.toLocaleString("en-IN")}/sqft · Mysuru`,
        href: tab === "projects" ? `/projects?loc=${l.slug}` : join(current.base, `loc=${l.slug}`),
      })),
      ...projs.map((p) => ({ key: p.id, kind: "project", title: p.name, sub: `${p.builder} · Project`, href: `/projects/${p.id}` })),
    ];
  }, [q, tab, current.base]);

  const go = (href) => {
    setOpen(false);
    router.push(href);
  };

  const submit = (e) => {
    e.preventDefault();
    if (open && cursor >= 0 && suggestions[cursor]) return go(suggestions[cursor].href);
    const term = q.trim();
    go(term ? join(current.base, `q=${encodeURIComponent(term)}`) : current.base.replace(/\?$/, ""));
  };

  const nearMe = () => {
    setError("");
    if (!navigator.geolocation) return setError("Location isn't available in this browser.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        const base = tab === "projects" ? TABS[0].base : current.base;
        go(join(base, `near=${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`));
      },
      () => {
        setLocating(false);
        setError("Allow location access to see properties near you.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className={`search-wrap ${className}`}>
      <div className="sb-tabs" role="tablist" aria-label="What are you looking for?">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
            {tab === t.id && <motion.span layoutId="sb-tab" className="sb-tab-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <form className="searchbar" onSubmit={submit} role="search">
        <Icon name="pin" size={20} className="sb-pin" />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setCursor(-1);
          }}
          onFocus={() => {
            clearTimeout(blurTimer.current);
            setOpen(true);
          }}
          onBlur={() => (blurTimer.current = setTimeout(() => setOpen(false), 150))}
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
          placeholder={tab === "projects" ? "Search projects or builders" : "Search by locality, project or landmark"}
          aria-label="Search by locality"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
        />
        <button type="button" className="sb-near" onClick={nearMe} disabled={locating} aria-label="Properties near me">
          <Icon name="target" size={20} />
          <span>{locating ? "Locating…" : "Near me"}</span>
        </button>
        <button type="submit" className="sb-go">
          <Icon name="search" size={20} />
          <span>Search</span>
        </button>

        <AnimatePresence>
          {open && suggestions.length > 0 && (
            <motion.ul
              id={listId}
              role="listbox"
              className="sb-suggest"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {!q.trim() && <li className="sb-suggest-head">Popular localities</li>}
              {suggestions.map((s, i) => (
                <li key={`${s.kind}-${s.key}`} role="option" aria-selected={i === cursor}>
                  <button
                    type="button"
                    className={i === cursor ? "on" : ""}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(s.href)}
                  >
                    <span className={`sb-ico ${s.kind}`}>
                      <Icon name={s.kind === "project" ? "building" : "pin"} size={16} />
                    </span>
                    <span className="sb-txt">
                      <b>{s.title}</b>
                      <small>{s.sub}</small>
                    </span>
                    <Icon name="arrow" size={16} className="sb-arrow" />
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </form>
      {error && <p className="sb-error">{error}</p>}
    </div>
  );
}
