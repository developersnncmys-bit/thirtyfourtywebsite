"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import { MODES } from "@/lib/data";

// "Buy ▾ | Search by Locality 🔍 | Near me ◎" — the pill from the app's Home screen
export default function SearchBar({ className = "" }) {
  const router = useRouter();
  const [mode, setMode] = useState("buy");
  const [q, setQ] = useState("");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ mode });
    if (q.trim()) params.set("q", q.trim());
    router.push(`/properties?${params}`);
  };

  const nearMe = () => {
    setError("");
    if (!navigator.geolocation) return setError("Location isn't available in this browser.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        router.push(`/properties?mode=${mode}&near=${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`);
      },
      () => {
        setLocating(false);
        setError("Allow location access to see properties near you.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className={className}>
      <form className="searchbar" onSubmit={submit} role="search">
        <label className="sb-mode">
          <span className="sr-only">Looking to</span>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            {MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <Icon name="chevron" size={18} />
        </label>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by Locality"
          aria-label="Search by locality"
        />
        <button type="submit" className="sb-go" aria-label="Search">
          <Icon name="search" size={22} />
        </button>
        <button type="button" className="sb-near" onClick={nearMe} disabled={locating}>
          <span>{locating ? "Locating…" : "Near me"}</span>
          <Icon name="target" size={22} />
        </button>
      </form>
      {error && <p className="sb-error">{error}</p>}
    </div>
  );
}
