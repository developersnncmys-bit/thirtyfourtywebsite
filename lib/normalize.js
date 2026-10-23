// Turns one property record from the app's API into the shape the website's
// components use. Shared by the server (listings) and the browser (dashboard).
import { API } from "./site";
import { typeInfo, RESIDENTIAL_TYPES } from "./options";

const TYPE_MAP = {
  flat: "flat",
  house: "house",
  villa: "villa",
  plot: "plot",
  "office space": "office",
  shop: "shop",
  showroom: "showroom",
  commercial: "commercial",
};

// Owners type the city by hand in the app, so group common spellings
const CITY_ALIASES = {
  mysure: "Mysore",
  mysuru: "Mysore",
  mysor: "Mysore",
  bng: "Bengaluru",
  blr: "Bengaluru",
  bangalore: "Bengaluru",
  banglore: "Bengaluru",
  bengalore: "Bengaluru",
  bellari: "Bellary",
  ballari: "Bellary",
};

const clean = (v) => (typeof v === "string" ? v.trim() : v);
const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const titleCase = (s = "") => s.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

function typeOf(r) {
  if (/pg/i.test(r.propertytype || "") || r.type === "PG") return "pg";
  // The app saves farm land as propertytype "Commercial" + commercialtype "Agricultural Land"
  if (/agri/i.test(`${r.propertytype || ""} ${r.commercialtype || ""}`)) return "agri";
  const sub = (r.residentialtype || r.commercialtype || "").toLowerCase().trim();
  if (TYPE_MAP[sub]) return TYPE_MAP[sub];
  return r.propertytype === "Commercial" ? "commercial" : "house";
}

function image(src) {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  return `${API.images}/${src.replace(/^\/?public\/?/i, "").replace(/^\//, "")}`;
}

// Turn one API record into the shape the website's components use
export function normalize(r) {
  const type = typeOf(r);
  const mode = type === "pg" ? "pg" : r.type === "Sell" ? "buy" : "rent";
  const rawCity = titleCase(r.city || "");
  const city = CITY_ALIASES[rawCity.toLowerCase()] || rawCity;
  const bhkRaw = clean(r.bedrooms);
  const bhk = bhkRaw ? (bhkRaw.startsWith(">") ? 5 : parseInt(bhkRaw, 10) || null) : null;
  const area = num(r.totalarea);
  const price = num(r.expect_price) || 0;
  const lat = num(r.googleaddress?.lat);
  const lng = num(r.googleaddress?.long);
  const dims = clean(r.Dimensions);
  const label = type === "pg" ? clean(r.propertytype) || "PG" : typeInfo(type).label;
  const forWord = mode === "buy" ? " for Sale" : mode === "rent" ? (r.type === "Lease" ? " for Lease" : " for Rent") : "";

  return {
    id: r._id,
    title: `${bhk && RESIDENTIAL_TYPES.includes(type) ? `${bhkRaw} ` : ""}${label}${forWord}${city ? ` in ${city}` : ""}`,
    mode,
    listedFor: r.type === "Sell" ? "Sale" : r.type,
    type,
    category: clean(r.propertytype),
    city,
    address: capitalize(clean(r.address)) || null,
    landmark: capitalize(clean(r.landmark)) || null,
    price,
    token: num(r.booking_tokenamount),
    area,
    areaUnit: "sqft",
    acre: num(r.acre),
    kunte: num(r.kunte),
    bhk,
    bedrooms: bhkRaw || null,
    baths: num(r.bathrooms),
    dimensions: dims && /\d/.test(dims) ? dims : null,
    facing: clean(r.Facing) || null,
    saleType: clean(r.saletype) || null,
    status: clean(r.possessionstatus) || null,
    furnishing: clean(r.furnishing) || null,
    floor: clean(r.floor_no) || null,
    approval: clean(r.approvalauthority) || null,
    rera: !!r.reraregistered,
    seats: num(r.seats),
    diet: clean(r.diet) || null,
    food: clean(r.food_provided) || null,
    occupancy: (r.occupancy_type || []).map((o) => o.occupayname || o.name || o).filter((x) => typeof x === "string"),
    profession: (r.profession_Type || []).map((o) => o.name || o).filter((x) => typeof x === "string"),
    amenities: (r.amenities || []).map((a) => a.name || a).filter((x) => typeof x === "string"),
    nearby: (r.nearbyplace || [])
      .map((n) => ({ category: clean(n.category), name: clean(n.place_name), distance: num(n.distance) }))
      .filter((n) => n.name),
    images: (r.propertyimage || []).map(image).filter(Boolean),
    lat: lat && lng ? lat : null,
    lng: lat && lng ? lng : null,
    owner: clean(r.customerName) || "Thirty Forty user",
    ownerId: r.customerId || null,
    approval_status: r.approvalStatus || null,
    postedOn: r.createdAt,
    featured: !!r.featured,
    pricePerSqft: mode === "buy" && area && price ? Math.round(price / area) : null,
  };
}
