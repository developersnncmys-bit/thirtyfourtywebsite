// Live listings from the Thirty Forty app's API (the same feed the app's Home
// screen shows). Server-only: the owner's phone number never reaches the browser.
import { API } from "./site";
import { normalize } from "./normalize";

export { normalize };
export const LISTINGS_TAG = "listings";

const REVALIDATE = 120; // seconds — new app listings show up within two minutes

async function fetchRaw() {
  const res = await fetch(`${API.base}/sell/properties`, { next: { revalidate: REVALIDATE, tags: [LISTINGS_TAG] } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data || [];
}

// Approved, active listings, newest first. Returns [] if the API is unreachable.
export async function getListings() {
  try {
    const raw = await fetchRaw();
    return raw
      .filter((r) => r.approvalStatus !== "rejected" && r.approvalStatus !== "pending" && r.isActive !== false)
      .map(normalize)
      .sort((a, b) => (b.featured - a.featured) || String(b.postedOn).localeCompare(String(a.postedOn)));
  } catch (e) {
    console.error("Could not load listings:", e.message);
    return [];
  }
}

export async function getListing(id) {
  const all = await getListings();
  return all.find((p) => p.id === id) || null;
}

// The owner's number, for the server-side "contact owner" redirect only
export async function getOwnerPhone(id) {
  try {
    const raw = await fetchRaw();
    const r = raw.find((x) => x._id === id);
    const digits = String(r?.customerNumber || "").replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return digits;
    return null;
  } catch {
    return null;
  }
}
