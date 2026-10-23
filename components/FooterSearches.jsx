import Link from "next/link";
import { getListings } from "@/lib/listings";

const PLURAL = { flat: "Flats", house: "Houses", villa: "Villas", plot: "Plots", office: "Office spaces", shop: "Shops", showroom: "Showrooms", commercial: "Commercial properties", agri: "Agricultural land", pg: "PG" };

// Popular-search link lists above the footer, like 99acres — built only from
// cities and property types that actually have listings
export default async function FooterSearches() {
  const all = await getListings();
  const cities = [...new Set(all.map((p) => p.city).filter(Boolean))].slice(0, 8);
  if (!cities.length) return null;

  const combos = new Map();
  all.forEach((p) => {
    if (!p.city) return;
    const key = `${p.type}|${p.mode}|${p.city}`;
    if (!combos.has(key)) combos.set(key, { ...p });
  });
  const byType = [...combos.values()].slice(0, 10).map((p) => ({
    label: `${PLURAL[p.type]} ${p.mode === "buy" ? "for sale" : p.mode === "rent" ? "for rent" : ""} in ${p.city}`,
    href: p.type === "pg" ? `/properties?mode=pg&city=${encodeURIComponent(p.city)}` : `/properties?mode=${p.mode}&type=${p.type}&city=${encodeURIComponent(p.city)}`,
  }));

  const groups = [
    { title: "Property for sale", links: cities.map((c) => [`Property for sale in ${c}`, `/properties?mode=buy&city=${encodeURIComponent(c)}`]) },
    { title: "Property for rent", links: cities.map((c) => [`Property for rent in ${c}`, `/properties?mode=rent&city=${encodeURIComponent(c)}`]) },
    { title: "Popular searches", links: byType.map((x) => [x.label, x.href]) },
  ];

  return (
    <div className="fsearch">
      <div className="container fsearch-grid">
        {groups.map((g) => (
          <div key={g.title}>
            <h4>{g.title}</h4>
            {g.links.map(([label, href]) => (
              <Link key={href + label} href={href}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
