// Option lists copied from the Thirty Forty app's search filters and
// "Add Property" screens, so the website offers exactly what the app does.

export const MODES = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "pg", label: "PG" },
];

// Property type chips — same order as the app's Search screen
export const TYPES = [
  { id: "flat", label: "Flat", icon: "/icons/flat.webp" },
  { id: "house", label: "House", icon: "/icons/house-villa.webp" },
  { id: "villa", label: "Villa", icon: "/icons/house-villa.webp" },
  { id: "plot", label: "Plot", icon: "/icons/plot.webp" },
  { id: "office", label: "Office Space", icon: "/icons/office_space.webp" },
  { id: "shop", label: "Shop", icon: "/icons/shop-showroom.webp" },
  { id: "showroom", label: "Showroom", icon: "/icons/shop-showroom.webp" },
  { id: "commercial", label: "Commercial", icon: "/icons/commercial.webp" },
  { id: "agri", label: "Agricultural Land/Farm Plot", icon: "/icons/agricultural-land.webp" },
];
export const PG_TYPE = { id: "pg", label: "PG / Hostel", icon: "/icons/appartment.webp" };
export const typeInfo = (id) => TYPES.find((t) => t.id === id) || (id === "pg" ? PG_TYPE : TYPES[0]);

export const COMMERCIAL_TYPES = ["office", "shop", "showroom", "commercial"];
export const RESIDENTIAL_TYPES = ["flat", "house", "villa"];

// The four round shortcuts on the app's Home screen
export const QUICK_ACTIONS = [
  { id: "buy", label: "Buy", icon: "home", href: "/properties?mode=buy" },
  { id: "rent", label: "Rent", icon: "key", href: "/properties?mode=rent" },
  { id: "commercial", label: "Commercial", icon: "building", href: "/properties?cat=commercial" },
  { id: "agri", label: "Agricultural Land/Farm Plot", icon: "tractor", href: "/properties?type=agri" },
];

export const BHK_OPTIONS = [
  { id: 1, label: "1 BHK" },
  { id: 2, label: "2 BHK" },
  { id: 3, label: "3 BHK" },
  { id: 4, label: "4 BHK" },
  { id: 5, label: ">4 BHK" },
];
export const BATHROOMS = [1, 2, 3, 4, 5];
export const POSSESSION = ["Under Construction", "Ready to Move"];
export const SALE_TYPES = ["New", "Resale"];
export const FURNISHING = ["Furnished", "Semi-Furnished", "Unfurnished"];
export const DIET = ["Veg Only", "Non-Veg Allowed"];
export const FACINGS = ["East", "North", "North East", "North West", "South", "South East", "South West", "West"];
export const AMENITIES = ["Parking", "Swimming Pool", "Lift", "Power Backup", "Gym", "Park", "Club House", "Helipad", "Jogging"];
export const APPROVAL_AUTHORITIES = ["BMRDA", "BBMP", "BMICAP", "CUDA", "MUDA", "STRRR", "BDA", "NPA", "DPA", "BIAAPA", "DTCP"];

export const POSTED_SINCE = [
  { id: "", label: "Any time", days: 0 },
  { id: "1d", label: "Yesterday", days: 1 },
  { id: "1w", label: "Last week", days: 7 },
  { id: "2w", label: "Last 2 weeks", days: 14 },
  { id: "1m", label: "Last month", days: 31 },
  { id: "3m", label: "Last 3 months", days: 92 },
];

// PG filters
export const PG_FOR = ["Boys PG", "Girls PG", "Co-Living PG"];
export const OCCUPANCY = ["Single", "Double", "Triple"];
export const FOOD = ["Food Not Provided", "Only Veg", "Non-Veg", "Self Cooking Allowed"];
export const PG_AMENITIES = ["Wifi", "AC", "Lift", "Power Backup", "Room Cleaning", "Attached Washroom", "Parking"];
export const PROFESSION = ["Students", "Professionals"];

export const NEARBY_CATEGORIES = ["Metro Station", "School", "Hospital", "Shopping Mall", "Bus Stop", "Park", "Bank", "Restaurant", "Other"];

// Budget slider stops — the app goes from ₹1,000 to ₹10 Cr+
export const BUDGET_STEPS = [1e3, 5e3, 1e4, 2e4, 5e4, 1e5, 5e5, 1e6, 2.5e6, 5e6, 7.5e6, 1e7, 2.5e7, 5e7, 1e8];
// Covered area slider stops in sqft
export const AREA_STEPS = [0, 300, 600, 900, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 10000, 50000];
