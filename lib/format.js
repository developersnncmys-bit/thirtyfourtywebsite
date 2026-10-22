// Indian-style money: ₹1.39 Cr, ₹45 L, ₹18,000
export function formatPrice(value) {
  if (value >= 1e7) return `₹${trim(value / 1e7)} Cr`;
  if (value >= 1e5) return `₹${trim(value / 1e5)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

// Short form for the budget slider: 1 K, 50 K, 25 L, 10 Cr
export function formatBudget(value) {
  if (value >= 1e7) return `${trim(value / 1e7)} Cr`;
  if (value >= 1e5) return `${trim(value / 1e5)} L`;
  return `${trim(value / 1e3)} K`;
}

const trim = (n) => Number(n.toFixed(2)).toString();

export function priceLabel(p) {
  const base = formatPrice(p.price);
  return p.mode === "buy" ? base : `${base}/month`;
}

export const formatInr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const perSqft = (n) => `₹${Math.round(n).toLocaleString("en-IN")}/sqft`;

// Axis ticks: 4.5K, 12K
export const compact = (n) => (n >= 1000 ? `${trim(n / 1000)}K` : String(n));

export function areaLabel(p) {
  return `${p.area.toLocaleString("en-IN")} ${p.areaUnit}`;
}

export const configLabel = (c) => c.label || `${c.bhk} BHK`;

export function projectPriceRange(pr) {
  return pr.minPrice === pr.maxPrice ? formatPrice(pr.minPrice) : `${formatPrice(pr.minPrice)} – ${formatPrice(pr.maxPrice)}`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
}

// Great-circle distance in km, for "Near me"
export function distanceKm(a, b) {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
