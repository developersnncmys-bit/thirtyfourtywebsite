// Indian-style money, as in the app: ₹1.39 Cr, ₹45 Lac, ₹18,000
export function formatPrice(value) {
  if (!value) return "Price on request";
  if (value >= 1e7) return `₹${trim(value / 1e7)} Cr`;
  if (value >= 1e5) return `₹${trim(value / 1e5)} Lac`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
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
  return p.mode === "buy" || !p.price ? base : `${base}/month`;
}

export const formatInr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const perSqft = (n) => `₹${Math.round(n).toLocaleString("en-IN")}/sqft`;

export function areaLabel(p) {
  if (p.acre || p.kunte) return [p.acre && `${p.acre} Acre`, p.kunte && `${p.kunte} Kunte`].filter(Boolean).join(" ");
  if (!p.area) return null;
  return `${Math.round(p.area).toLocaleString("en-IN")} sqft`;
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
}

// "3 days ago" style, for cards
export function timeAgo(iso) {
  if (!iso) return "";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return formatDate(iso);
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
