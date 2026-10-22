// Sample data so the website can be shown end to end.
// Replace with the 30Forty app's API once it is available — the field names
// mirror the "Property Details" screen in the app.

export const MODES = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "pg", label: "PG" },
];

// Property type chips — same order as the app's Search screen
export const TYPES = [
  { id: "flat", label: "Flat" },
  { id: "house", label: "House" },
  { id: "villa", label: "Villa" },
  { id: "plot", label: "Plot" },
  { id: "office", label: "Office Space" },
  { id: "shop", label: "Shop" },
  { id: "showroom", label: "Showroom" },
  { id: "commercial", label: "Commercial" },
  { id: "agri", label: "Agricultural Land/Farm Plot" },
];

export const COMMERCIAL_TYPES = ["office", "shop", "showroom", "commercial"];
export const RESIDENTIAL_TYPES = ["flat", "house", "villa"];

// 30Forty is zero brokerage, so listings come from owners or builders — no dealers
export const POSTED_BY = [
  { id: "owner", label: "Owner" },
  { id: "builder", label: "Builder" },
];

export const BHK_OPTIONS = [1, 2, 3, 4, 5];
export const STATUSES = ["Ready to Move", "Under Construction"];
export const FURNISHING = ["Furnished", "Semi-Furnished", "Unfurnished"];
export const SALE_TYPES = ["New", "Resale"];
export const FACINGS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

export const AMENITIES = [
  "Lift",
  "Parking",
  "Power backup",
  "Security",
  "CCTV",
  "Gym",
  "Swimming pool",
  "Park",
  "Club house",
  "Gated community",
  "24x7 water",
  "Rainwater harvesting",
];

// The four round shortcuts on the app's Home screen
export const CATEGORIES = [
  { id: "buy", label: "Buy", icon: "home", href: "/properties?mode=buy" },
  { id: "rent", label: "Rent", icon: "key", href: "/properties?mode=rent" },
  { id: "commercial", label: "Commercial", icon: "building", href: "/properties?cat=commercial" },
  { id: "agri", label: "Agricultural Land/Farm Plot", icon: "tractor", href: "/properties?type=agri" },
];

// Budget slider stops (the app goes from 1 K to 10 Cr+)
export const BUDGET_STEPS = [
  1e3, 5e3, 1e4, 2e4, 5e4, 1e5, 5e5, 1e6, 2.5e6, 5e6, 7.5e6, 1e7, 2.5e7, 5e7, 1e8,
];

// Area slider stops in sqft
export const AREA_STEPS = [0, 300, 600, 900, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 10000];

// Deterministic random so server and browser build the same data
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/* ------------------------------------------------------------------ */
/* Localities                                                          */
/* ------------------------------------------------------------------ */

export const QUARTERS = ["Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25", "Q1 '26", "Q2 '26", "Q3 '26"];

const LOCALITY_BASE = [
  {
    slug: "vijayanagar",
    name: "Vijayanagar",
    lat: 12.327,
    lng: 76.615,
    avgPrice: 7200,
    rent2bhk: 18000,
    change: 8.4,
    rating: 4.5,
    reviews: 128,
    tagline: "Planned stages, wide roads, close to Ring Road",
    pros: ["Wide, well-planned roads", "Close to Outer Ring Road", "Good schools and hospitals"],
    cons: ["Prices higher than nearby stages", "Traffic at peak hours on main road"],
  },
  {
    slug: "kuvempunagar",
    name: "Kuvempunagar",
    lat: 12.29,
    lng: 76.626,
    avgPrice: 6400,
    rent2bhk: 15000,
    change: 6.9,
    rating: 4.4,
    reviews: 96,
    tagline: "Settled residential area with colleges nearby",
    pros: ["Quiet residential blocks", "Many colleges and schools", "Daily needs within walking distance"],
    cons: ["Older buildings in some blocks", "Limited new projects"],
  },
  {
    slug: "gokulam",
    name: "Gokulam",
    lat: 12.326,
    lng: 76.633,
    avgPrice: 7800,
    rent2bhk: 22000,
    change: 7.2,
    rating: 4.6,
    reviews: 141,
    tagline: "Green, international yoga hub with strong rental demand",
    pros: ["High rental demand from yoga students", "Tree-lined streets", "Cafés and restaurants"],
    cons: ["Seasonal rental swings", "Parking is tight on busy streets"],
  },
  {
    slug: "saraswathipuram",
    name: "Saraswathipuram",
    lat: 12.308,
    lng: 76.629,
    avgPrice: 7400,
    rent2bhk: 17000,
    change: 5.8,
    rating: 4.5,
    reviews: 110,
    tagline: "Old Mysuru charm near Kukkarahalli Lake",
    pros: ["Close to University and lake", "Established neighbourhood", "Good public transport"],
    cons: ["Few vacant plots", "Narrow inner roads"],
  },
  {
    slug: "jp-nagar",
    name: "JP Nagar",
    lat: 12.275,
    lng: 76.655,
    avgPrice: 5600,
    rent2bhk: 13000,
    change: 9.1,
    rating: 4.2,
    reviews: 74,
    tagline: "Growing area on the southern Ring Road",
    pros: ["Affordable compared to central areas", "New apartments coming up", "Easy Ring Road access"],
    cons: ["Some roads still developing", "Fewer malls nearby"],
  },
  {
    slug: "bogadi",
    name: "Bogadi",
    lat: 12.293,
    lng: 76.588,
    avgPrice: 5200,
    rent2bhk: 12000,
    change: 11.3,
    rating: 4.1,
    reviews: 62,
    tagline: "Fast-growing western suburb with new layouts",
    pros: ["Strong price growth", "New villa and plot layouts", "Cleaner air, less congestion"],
    cons: ["Farther from the city centre", "Public transport still limited"],
  },
  {
    slug: "hootagalli",
    name: "Hootagalli",
    lat: 12.34,
    lng: 76.585,
    avgPrice: 4300,
    rent2bhk: 10000,
    change: 12.6,
    rating: 4.0,
    reviews: 55,
    tagline: "Industrial-belt growth with affordable plots",
    pros: ["Most affordable plots in west Mysuru", "Close to IT and industrial jobs", "High appreciation"],
    cons: ["Still developing civic amenities", "Industrial traffic on main roads"],
  },
  {
    slug: "hebbal",
    name: "Hebbal",
    lat: 12.354,
    lng: 76.61,
    avgPrice: 5800,
    rent2bhk: 14000,
    change: 8.0,
    rating: 4.2,
    reviews: 81,
    tagline: "Mysuru's IT hub with steady rental demand",
    pros: ["Near Infosys and IT parks", "Steady rental demand", "Good for office space"],
    cons: ["Busy during office hours", "Mixed industrial surroundings"],
  },
  {
    slug: "jayalakshmipuram",
    name: "Jayalakshmipuram",
    lat: 12.32,
    lng: 76.63,
    avgPrice: 8200,
    rent2bhk: 21000,
    change: 6.1,
    rating: 4.6,
    reviews: 119,
    tagline: "Premium, central and close to the University",
    pros: ["Central location", "Premium, well-kept homes", "Students drive PG demand"],
    cons: ["Expensive", "Very few new plots"],
  },
  {
    slug: "devaraja-mohalla",
    name: "Devaraja Mohalla",
    lat: 12.31,
    lng: 76.652,
    avgPrice: 9000,
    rent2bhk: 16000,
    change: 4.8,
    rating: 4.0,
    reviews: 67,
    tagline: "The commercial heart around Devaraja Market",
    pros: ["Highest footfall in the city", "Best for shops and showrooms", "Walk to the Palace"],
    cons: ["Congested streets", "Noisy for residential use"],
  },
  {
    slug: "srirampura",
    name: "Srirampura",
    lat: 12.28,
    lng: 76.62,
    avgPrice: 5400,
    rent2bhk: 12500,
    change: 10.2,
    rating: 4.2,
    reviews: 58,
    tagline: "Value-for-money homes on the south side",
    pros: ["Reasonable prices", "New independent houses", "Quiet neighbourhoods"],
    cons: ["Fewer commercial hubs", "Some areas lack street lights"],
  },
  {
    slug: "yelwal",
    name: "Yelwal",
    lat: 12.39,
    lng: 76.58,
    avgPrice: 2600,
    rent2bhk: 8000,
    change: 13.5,
    rating: 3.9,
    reviews: 31,
    tagline: "Farm land and weekend homes on Hunsur Road",
    pros: ["Large land parcels", "Very affordable per sqft", "Fastest appreciation"],
    cons: ["Far from city amenities", "Limited public transport"],
  },
  {
    slug: "kadakola",
    name: "Kadakola",
    lat: 12.205,
    lng: 76.68,
    avgPrice: 2200,
    rent2bhk: 7000,
    change: 12.1,
    rating: 3.8,
    reviews: 27,
    tagline: "Farm plots along Nanjangud Road",
    pros: ["Ideal for farm houses", "Rail and highway access", "Low entry price"],
    cons: ["Rural infrastructure", "Far from city centre"],
  },
];

// Eight quarters of ₹/sqft ending at today's average, growing at the yearly rate
function trendFor(l, seed) {
  const r = rng(seed);
  return QUARTERS.map((_, i) => {
    const back = (QUARTERS.length - 1 - i) / 4;
    const base = l.avgPrice / Math.pow(1 + l.change / 100, back);
    const wiggle = i === QUARTERS.length - 1 ? 0 : (r() - 0.5) * 0.02 * base;
    return Math.round((base + wiggle) / 10) * 10;
  });
}

export const LOCALITIES = LOCALITY_BASE.map((l, i) => ({
  ...l,
  city: "Mysuru",
  trend: trendFor(l, 101 + i * 7),
  about: `${l.tagline}. Homes in ${l.name} sell for around ₹${l.avgPrice.toLocaleString(
    "en-IN"
  )}/sqft on average, up ${l.change}% over the last year, and a 2BHK rents for about ₹${l.rent2bhk.toLocaleString("en-IN")} a month.`,
}));

export const getLocality = (slug) => LOCALITIES.find((l) => l.slug === slug);
export const localityByName = (name) => LOCALITIES.find((l) => l.name === name);

/* ------------------------------------------------------------------ */
/* New projects                                                        */
/* ------------------------------------------------------------------ */

export const PROJECTS = [
  {
    id: "chamundi-greens",
    name: "Chamundi Greens",
    builder: "Greenline Builders",
    locality: "vijayanagar",
    status: "Under Construction",
    possession: "Dec 2027",
    launched: "Mar 2026",
    rera: true,
    units: 240,
    towers: 3,
    land: "4.2 acres",
    images: ["/props/flat1.jpg", "/props/interior2.jpg", "/props/interior1.jpg"],
    configs: [
      { bhk: 2, area: 1150, price: 7200000 },
      { bhk: 3, area: 1580, price: 9900000 },
      { bhk: 4, area: 2100, price: 13800000 },
    ],
    amenities: ["Club house", "Swimming pool", "Gym", "Park", "Power backup", "Security", "Lift", "Gated community"],
    about:
      "Three towers of 2, 3 and 4 BHK homes with views of Chamundi Hills, a 20,000 sqft clubhouse and 70% open space, minutes from the Outer Ring Road.",
  },
  {
    id: "kaveri-heights",
    name: "Kaveri Heights",
    builder: "Mysore Habitat",
    locality: "jp-nagar",
    status: "New Launch",
    possession: "Jun 2028",
    launched: "Sep 2026",
    rera: true,
    units: 180,
    towers: 2,
    land: "2.8 acres",
    images: ["/props/flat1.jpg", "/props/interior1.jpg"],
    configs: [
      { bhk: 1, area: 650, price: 3600000 },
      { bhk: 2, area: 1050, price: 5700000 },
      { bhk: 3, area: 1420, price: 7600000 },
    ],
    amenities: ["Gym", "Park", "Lift", "Power backup", "CCTV", "Rainwater harvesting"],
    about:
      "Affordable 1, 2 and 3 BHK apartments on the southern Ring Road with launch-phase pricing and flexible payment plans.",
  },
  {
    id: "palace-view-residency",
    name: "Palace View Residency",
    builder: "Heritage Homes",
    locality: "jayalakshmipuram",
    status: "Ready to Move",
    possession: "Ready",
    launched: "Jan 2024",
    rera: true,
    units: 64,
    towers: 1,
    land: "1.1 acres",
    images: ["/props/interior2.jpg", "/props/flat1.jpg", "/props/interior1.jpg"],
    configs: [
      { bhk: 3, area: 1750, price: 15500000 },
      { bhk: 4, area: 2400, price: 21000000 },
    ],
    amenities: ["Lift", "Security", "Power backup", "Club house", "Gym", "24x7 water"],
    about: "A boutique block of 64 premium homes in central Jayalakshmipuram, ready to move in with OC received.",
  },
  {
    id: "ring-road-enclave",
    name: "Ring Road Enclave",
    builder: "Greenline Builders",
    locality: "bogadi",
    status: "Under Construction",
    possession: "Mar 2027",
    launched: "Aug 2025",
    rera: true,
    units: 96,
    towers: 0,
    land: "12 acres",
    images: ["/props/house2.jpg", "/props/house1.jpg", "/props/villa1.jpg"],
    configs: [
      { bhk: 3, area: 2200, price: 14500000 },
      { bhk: 4, area: 3000, price: 19800000 },
    ],
    amenities: ["Gated community", "Club house", "Swimming pool", "Park", "Security", "CCTV"],
    about: "96 independent villas in a gated layout off the Outer Ring Road, each with a private garden and terrace.",
  },
  {
    id: "hootagalli-layout",
    name: "Hootagalli Sunrise Layout",
    builder: "Mysore Habitat",
    locality: "hootagalli",
    status: "Ready to Move",
    possession: "Ready",
    launched: "Feb 2025",
    rera: true,
    units: 210,
    towers: 0,
    land: "18 acres",
    images: ["/props/plot-30x40.svg", "/props/farm1.jpg"],
    configs: [
      { bhk: 0, label: "30 x 40 plot", area: 1200, price: 4500000 },
      { bhk: 0, label: "30 x 50 plot", area: 1500, price: 5500000 },
      { bhk: 0, label: "40 x 60 plot", area: 2400, price: 8600000 },
    ],
    amenities: ["Gated community", "Park", "Security", "24x7 water", "Rainwater harvesting"],
    about: "MUDA-approved residential plots with underground drainage, tar roads and street lights already in place.",
  },
].map((p) => {
  const prices = p.configs.map((c) => c.price);
  return { ...p, minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
});

export const getProject = (id) => PROJECTS.find((p) => p.id === id);

/* ------------------------------------------------------------------ */
/* Listings                                                            */
/* ------------------------------------------------------------------ */

const HANDPICKED = [
  {
    id: "residential-plot-hootagalli",
    title: "Residential Plot in Hootagalli",
    mode: "buy",
    type: "plot",
    locality: "Hootagalli",
    price: 4200000,
    area: 1200,
    areaUnit: "sqft",
    dimensions: "30 x 40",
    facing: "East",
    saleType: "New",
    status: "Ready to Move",
    possession: "Immediate",
    approval: "MUDA",
    rera: true,
    postedBy: "owner",
    verified: true,
    address: "Hootagalli Industrial Layout, 3rd Cross",
    landmark: "Near Hootagalli Bus Stop",
    postedOn: "2026-10-12",
    lat: 12.34,
    lng: 76.585,
    images: ["/props/plot-30x40.svg", "/props/farm1.jpg"],
    amenities: ["Park", "24x7 water", "Rainwater harvesting"],
    nearby: ["Infosys Campus – 3 km", "Ring Road – 1.5 km", "Hootagalli Lake – 800 m"],
    description:
      "A clear-title 30x40 site in a MUDA-approved layout, ready for registration. East facing with a 30 ft road in front and all civic amenities already in place.",
  },
  {
    id: "residential-flat-kuvempunagar",
    title: "3 BHK Flat in Kuvempunagar",
    mode: "buy",
    type: "flat",
    locality: "Kuvempunagar",
    price: 6800000,
    area: 1200,
    areaUnit: "sqft",
    bhk: 3,
    beds: 3,
    baths: 3,
    facing: "West",
    saleType: "New",
    status: "Ready to Move",
    furnishing: "Furnished",
    possession: "Ready to Move",
    floor: 2,
    totalFloors: 4,
    approval: "MUDA",
    rera: false,
    postedBy: "owner",
    verified: true,
    address: "Kuvempunagar M Block",
    landmark: "Near Vidyavardhaka College",
    postedOn: "2026-10-01",
    lat: 12.29,
    lng: 76.626,
    images: ["/props/flat1.jpg", "/props/interior1.jpg", "/props/interior2.jpg"],
    amenities: ["Lift", "Parking", "24x7 water", "Power backup", "CCTV"],
    nearby: ["Apollo BGS Hospital – 2 km", "Kuvempunagar Complex – 500 m", "Ring Road – 2.5 km"],
    description:
      "A bright 3BHK on the second floor with cross ventilation, modular kitchen and fitted wardrobes. Ready to move in, sold directly by the owner.",
  },
  {
    id: "independent-house-saraswathipuram",
    title: "4 BHK Independent House in Saraswathipuram",
    mode: "buy",
    type: "house",
    locality: "Saraswathipuram",
    price: 13900000,
    area: 2400,
    areaUnit: "sqft",
    bhk: 4,
    beds: 4,
    baths: 3,
    dimensions: "30 x 40",
    facing: "North",
    saleType: "Resale",
    status: "Ready to Move",
    age: "10+ yrs",
    furnishing: "Semi-Furnished",
    possession: "Ready to Move",
    floor: 0,
    totalFloors: 2,
    approval: "MUDA",
    rera: false,
    postedBy: "owner",
    verified: true,
    address: "8th Main, Saraswathipuram",
    landmark: "Near Kamakshi Hospital",
    postedOn: "2026-09-24",
    lat: 12.308,
    lng: 76.629,
    images: ["/props/house3.jpg", "/props/interior2.jpg"],
    amenities: ["Parking", "Park", "24x7 water", "Rainwater harvesting"],
    nearby: ["Kamakshi Hospital – 400 m", "Kukkarahalli Lake – 1.2 km", "University of Mysore – 2 km"],
    description:
      "Two-storey family home on a 30x40 site in one of Mysuru's quietest old neighbourhoods. Front garden, separate staircase to the first floor and a sunny terrace.",
  },
  {
    id: "luxury-villa-vijayanagar",
    title: "4 BHK Luxury Villa in Vijayanagar",
    mode: "buy",
    type: "villa",
    locality: "Vijayanagar",
    price: 28500000,
    area: 3200,
    areaUnit: "sqft",
    bhk: 4,
    beds: 4,
    baths: 4,
    dimensions: "40 x 60",
    facing: "East",
    saleType: "New",
    status: "Ready to Move",
    furnishing: "Furnished",
    possession: "Ready to Move",
    floor: 0,
    totalFloors: 3,
    approval: "MUDA",
    rera: true,
    postedBy: "owner",
    verified: true,
    address: "Vijayanagar 2nd Stage",
    landmark: "Near Vijayanagar Water Tank",
    postedOn: "2026-10-08",
    lat: 12.327,
    lng: 76.615,
    images: ["/props/villa1.jpg", "/props/interior2.jpg", "/props/interior1.jpg"],
    amenities: ["Swimming pool", "Parking", "Security", "CCTV", "Power backup"],
    nearby: ["Ring Road – 1 km", "Columbia Asia Hospital – 3 km", "Mall of Mysore – 6 km"],
    description:
      "A contemporary villa with double-height living, a private pool and imported fittings throughout. Built and sold directly by the owner — no agents.",
  },
  {
    id: "modern-villa-bogadi",
    title: "5 BHK Villa with Pool in Bogadi",
    mode: "buy",
    type: "villa",
    locality: "Bogadi",
    price: 36000000,
    area: 4100,
    areaUnit: "sqft",
    bhk: 5,
    beds: 5,
    baths: 5,
    dimensions: "50 x 80",
    facing: "North",
    saleType: "New",
    status: "Under Construction",
    furnishing: "Semi-Furnished",
    possession: "Within 3 months",
    floor: 0,
    totalFloors: 3,
    approval: "MUDA",
    rera: true,
    postedBy: "builder",
    verified: true,
    projectId: "ring-road-enclave",
    address: "Bogadi 2nd Stage",
    landmark: "Near Gangothri Layout",
    postedOn: "2026-10-15",
    lat: 12.293,
    lng: 76.588,
    images: ["/props/house2.jpg", "/props/house1.jpg", "/props/house4.jpg"],
    amenities: ["Swimming pool", "Lift", "Gym", "Rainwater harvesting", "Gated community"],
    nearby: ["Ring Road – 600 m", "JSS Public School – 2 km", "Bogadi Lake – 1 km"],
    description:
      "Five-bedroom statement home with a lap pool, lift to all floors and solar power. Possession in three months.",
  },
  {
    id: "house-for-rent-gokulam",
    title: "3 BHK House for Rent in Gokulam",
    mode: "rent",
    type: "house",
    locality: "Gokulam",
    price: 28000,
    deposit: 150000,
    area: 1800,
    areaUnit: "sqft",
    bhk: 3,
    beds: 3,
    baths: 2,
    dimensions: "30 x 40",
    facing: "South",
    furnishing: "Semi-Furnished",
    possession: "Immediate",
    floor: 1,
    totalFloors: 2,
    approval: "MUDA",
    rera: false,
    postedBy: "owner",
    verified: true,
    tenants: "Family",
    address: "Gokulam 3rd Stage",
    landmark: "Near Gokulam Yoga Shala",
    postedOn: "2026-10-10",
    lat: 12.326,
    lng: 76.633,
    images: ["/props/house4.jpg", "/props/interior1.jpg"],
    amenities: ["Parking", "24x7 water", "Security"],
    nearby: ["Yoga shalas – 300 m", "Gokulam Main Road – 400 m", "Railway Station – 4 km"],
    description:
      "Spacious first-floor house in Gokulam with a large balcony and covered car parking. Ideal for families; deal directly with the owner.",
  },
  {
    id: "2bhk-flat-rent-jp-nagar",
    title: "2 BHK Flat for Rent in JP Nagar",
    mode: "rent",
    type: "flat",
    locality: "JP Nagar",
    price: 15000,
    deposit: 60000,
    area: 1050,
    areaUnit: "sqft",
    bhk: 2,
    beds: 2,
    baths: 2,
    facing: "East",
    furnishing: "Furnished",
    possession: "Immediate",
    floor: 3,
    totalFloors: 5,
    approval: "MUDA",
    rera: false,
    postedBy: "owner",
    verified: false,
    tenants: "Family / Bachelors",
    address: "JP Nagar 2nd Stage",
    landmark: "Near Bannimantap Grounds",
    postedOn: "2026-10-14",
    lat: 12.275,
    lng: 76.655,
    images: ["/props/interior1.jpg", "/props/flat1.jpg"],
    amenities: ["Lift", "Security", "Power backup"],
    nearby: ["Ring Road – 1 km", "JSS Hospital – 3 km", "Mysuru Palace – 5 km"],
    description: "Furnished 2BHK with sofa, beds, fridge and washing machine. Move in with just your suitcase.",
  },
  {
    id: "pg-for-students-jayalakshmipuram",
    title: "PG for Students in Jayalakshmipuram",
    mode: "pg",
    type: "flat",
    locality: "Jayalakshmipuram",
    price: 7500,
    deposit: 7500,
    area: 180,
    areaUnit: "sqft",
    beds: 1,
    baths: 1,
    furnishing: "Furnished",
    possession: "Immediate",
    floor: 1,
    approval: "—",
    rera: false,
    postedBy: "owner",
    verified: true,
    tenants: "Students",
    address: "Jayalakshmipuram 4th Cross",
    landmark: "Near University of Mysore",
    postedOn: "2026-10-16",
    lat: 12.32,
    lng: 76.63,
    images: ["/props/pg1.jpg", "/props/interior1.jpg"],
    amenities: ["CCTV", "Power backup", "24x7 water"],
    nearby: ["University of Mysore – 700 m", "NIE College – 2 km", "Bus stop – 200 m"],
    description: "Clean, safe twin-sharing PG with home-style food, Wi-Fi and laundry, a short walk from the university.",
  },
  {
    id: "office-space-hebbal",
    title: "Office Space in Hebbal",
    mode: "rent",
    type: "office",
    locality: "Hebbal",
    price: 65000,
    deposit: 390000,
    area: 2500,
    areaUnit: "sqft",
    baths: 2,
    facing: "North",
    furnishing: "Furnished",
    possession: "Immediate",
    floor: 1,
    totalFloors: 3,
    approval: "KIADB",
    rera: false,
    postedBy: "owner",
    verified: true,
    address: "Hebbal Industrial Area",
    landmark: "Near Infosys Gate 2",
    postedOn: "2026-10-05",
    lat: 12.354,
    lng: 76.61,
    images: ["/props/office1.jpg"],
    amenities: ["Lift", "Parking", "Power backup", "Security"],
    nearby: ["Infosys – 1 km", "Ring Road – 2 km", "KRS Road – 3 km"],
    description: "Plug-and-play office with 40 workstations, a conference room and full power backup in Mysuru's IT hub.",
  },
  {
    id: "retail-shop-devaraja-mohalla",
    title: "Retail Shop in Devaraja Mohalla",
    mode: "rent",
    type: "shop",
    locality: "Devaraja Mohalla",
    price: 35000,
    deposit: 300000,
    area: 450,
    areaUnit: "sqft",
    facing: "East",
    furnishing: "Furnished",
    possession: "Immediate",
    floor: 0,
    approval: "MCC",
    rera: false,
    postedBy: "owner",
    verified: true,
    address: "Sayyaji Rao Road",
    landmark: "Near Devaraja Market",
    postedOn: "2026-09-30",
    lat: 12.31,
    lng: 76.652,
    images: ["/props/shop1.jpg"],
    amenities: ["Power backup", "CCTV"],
    nearby: ["Devaraja Market – 200 m", "Mysuru Palace – 1 km", "City Bus Stand – 800 m"],
    description: "Ground-floor shop on Sayyaji Rao Road with glass frontage and steady footfall all day.",
  },
  {
    id: "agricultural-land-yelwal",
    title: "2 Acre Agricultural Land in Yelwal",
    mode: "buy",
    type: "agri",
    locality: "Yelwal",
    price: 12000000,
    area: 2,
    areaUnit: "acre",
    facing: "East",
    saleType: "Resale",
    status: "Ready to Move",
    possession: "Immediate",
    approval: "RTC clear",
    rera: false,
    postedBy: "owner",
    verified: true,
    address: "Yelwal Hobli, Hunsur Road",
    landmark: "Near Yelwal Village",
    postedOn: "2026-10-03",
    lat: 12.39,
    lng: 76.58,
    images: ["/props/farm1.jpg", "/props/plot1.jpg"],
    amenities: ["24x7 water"],
    nearby: ["Hunsur Road – 500 m", "Mysuru city – 12 km"],
    description:
      "Fertile red-soil land with a working borewell and 3-phase power, fenced on all sides with direct road access.",
  },
  {
    id: "farm-plot-kadakola",
    title: "1 Acre Farm Plot with Farmhouse in Kadakola",
    mode: "buy",
    type: "agri",
    locality: "Kadakola",
    price: 8500000,
    area: 1,
    areaUnit: "acre",
    facing: "West",
    saleType: "Resale",
    status: "Ready to Move",
    possession: "Immediate",
    approval: "DC conversion",
    rera: false,
    postedBy: "owner",
    verified: false,
    address: "Kadakola, Nanjangud Road",
    landmark: "Near Kadakola Railway Station",
    postedOn: "2026-09-27",
    lat: 12.205,
    lng: 76.68,
    images: ["/props/plot1.jpg", "/props/farm1.jpg"],
    amenities: ["24x7 water", "Security"],
    nearby: ["Nanjangud Road – 1 km", "Mysuru city – 14 km"],
    description: "A one-acre weekend farm with a small farmhouse, coconut trees and a compound wall — ready to enjoy.",
  },
];

// More listings, generated from the localities so filters, the map and the
// locality pages have enough to show. Same seed → same listings every build.
const IMAGES = {
  flat: [["/props/flat1.jpg", "/props/interior1.jpg"], ["/props/interior2.jpg", "/props/flat1.jpg"], ["/props/interior1.jpg", "/props/interior2.jpg"]],
  house: [["/props/house3.jpg", "/props/interior2.jpg"], ["/props/house4.jpg", "/props/interior1.jpg"]],
  villa: [["/props/villa1.jpg", "/props/interior2.jpg"], ["/props/house2.jpg", "/props/house1.jpg"], ["/props/house1.jpg", "/props/house4.jpg"]],
  plot: [["/props/plot-30x40.svg", "/props/farm1.jpg"]],
  pg: [["/props/pg1.jpg", "/props/interior1.jpg"]],
  office: [["/props/office1.jpg"]],
  shop: [["/props/shop1.jpg"]],
  showroom: [["/props/shop1.jpg", "/props/office1.jpg"]],
};

const RECIPES = [
  { mode: "buy", type: "flat", bhk: [2, 3] },
  { mode: "rent", type: "flat", bhk: [1, 2, 3] },
  { mode: "buy", type: "house", bhk: [2, 3, 4] },
  { mode: "rent", type: "house", bhk: [2, 3] },
  { mode: "buy", type: "plot" },
  { mode: "buy", type: "villa", bhk: [3, 4] },
  { mode: "pg", type: "flat" },
  { mode: "rent", type: "office" },
  { mode: "rent", type: "showroom" },
];

const PLOT_SIZES = [
  { dimensions: "30 x 40", area: 1200 },
  { dimensions: "30 x 50", area: 1500 },
  { dimensions: "40 x 60", area: 2400 },
];

const TYPE_WORD = { flat: "Flat", house: "Independent House", villa: "Villa", plot: "Residential Plot", office: "Office Space", showroom: "Showroom" };

function generated() {
  const r = rng(2024);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  const round = (n, to) => Math.round(n / to) * to;
  const out = [];
  const towns = LOCALITIES.filter((l) => !["yelwal", "kadakola"].includes(l.slug));

  towns.forEach((loc, li) => {
    // Four listings per locality, rotating through the recipes
    for (let k = 0; k < 4; k++) {
      const rec = RECIPES[(li * 4 + k) % RECIPES.length];
      const bhk = rec.bhk ? pick(rec.bhk) : undefined;
      const factor = 0.88 + r() * 0.28;
      let area, price, dimensions, deposit;

      if (rec.type === "plot") {
        ({ area, dimensions } = pick(PLOT_SIZES));
        price = round(area * loc.avgPrice * 0.62 * factor, 50000);
      } else if (rec.mode === "pg") {
        area = 160 + round(r() * 80, 10);
        price = round(5000 + r() * 4500, 500);
        deposit = price;
      } else if (rec.type === "office" || rec.type === "showroom") {
        area = round(600 + r() * 2400, 50);
        price = round(area * (loc.avgPrice / 220) * factor, 1000);
        deposit = price * 6;
      } else {
        const per = { flat: 380, house: 520, villa: 700 }[rec.type];
        area = round(450 + bhk * per * (0.9 + r() * 0.25), 10);
        if (rec.mode === "buy") {
          const premium = { flat: 1, house: 1.12, villa: 1.3 }[rec.type];
          price = round(area * loc.avgPrice * premium * factor, 50000);
        } else {
          price = round(loc.rent2bhk * (0.55 + bhk * 0.25) * factor * (rec.type === "house" ? 1.15 : 1), 500);
          deposit = price * (rec.type === "house" ? 5 : 4);
        }
      }

      const buyNew = r() > 0.45;
      const builder = rec.mode === "buy" && rec.type !== "plot" && r() > 0.6;
      const day = 1 + Math.floor(r() * 50);
      const posted = new Date(Date.UTC(2026, 9, 21) - day * 864e5).toISOString().slice(0, 10);
      const title =
        rec.mode === "pg"
          ? `PG / Hostel in ${loc.name}`
          : `${bhk ? `${bhk} BHK ` : ""}${TYPE_WORD[rec.type]}${rec.mode === "buy" ? "" : " for Rent"} in ${loc.name}`;
      const imgKey = rec.mode === "pg" ? "pg" : rec.type;
      const amenities = AMENITIES.filter(() => r() > 0.55).slice(0, 6);
      const residential = RESIDENTIAL_TYPES.includes(rec.type) && rec.mode !== "pg";

      out.push({
        id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${li}${k}`,
        title,
        mode: rec.mode,
        type: rec.type,
        locality: loc.name,
        price,
        deposit,
        area,
        areaUnit: "sqft",
        bhk,
        beds: bhk ?? (rec.mode === "pg" ? 1 : undefined),
        baths: bhk ? Math.max(1, bhk - (r() > 0.5 ? 1 : 0)) : rec.type === "office" ? 2 : undefined,
        dimensions,
        facing: pick(FACINGS),
        saleType: rec.mode === "buy" ? (buyNew ? "New" : "Resale") : undefined,
        status: rec.mode === "buy" ? (buyNew && r() > 0.5 ? "Under Construction" : "Ready to Move") : undefined,
        age: rec.mode === "buy" && !buyNew ? pick(["1-5 yrs", "5-10 yrs", "10+ yrs"]) : undefined,
        furnishing: rec.type === "plot" ? undefined : pick(FURNISHING),
        possession: rec.mode === "buy" ? (buyNew ? pick(["Ready to Move", "Within 6 months", "Dec 2027"]) : "Ready to Move") : "Immediate",
        floor: residential || rec.mode === "pg" ? Math.floor(r() * 4) : rec.type === "plot" ? undefined : Math.floor(r() * 2),
        totalFloors: residential ? 4 : undefined,
        approval: rec.type === "office" ? "KIADB" : "MUDA",
        rera: rec.mode === "buy" && (builder || r() > 0.6),
        postedBy: builder ? "builder" : "owner",
        verified: r() > 0.3,
        tenants: rec.mode === "rent" && residential ? pick(["Family", "Family / Bachelors"]) : rec.mode === "pg" ? "Students / Working" : undefined,
        address: `${loc.name}, Mysuru`,
        landmark: loc.tagline.split(",")[0],
        postedOn: posted,
        lat: loc.lat + (r() - 0.5) * 0.014,
        lng: loc.lng + (r() - 0.5) * 0.014,
        images: pick(IMAGES[imgKey]),
        amenities,
        nearby: loc.pros.slice(0, 2),
        description: `${title} — ${loc.tagline.toLowerCase()}. ${residential ? "Bright rooms, good ventilation and" : "Well maintained with"} easy access to ${loc.name}'s main road. Contact the ${builder ? "builder" : "owner"} directly — zero brokerage.`,
      });
    }
  });
  return out;
}

export const PROPERTIES = [...HANDPICKED, ...generated()].map((p) => {
  const loc = localityByName(p.locality);
  return {
    ...p,
    city: "Mysuru",
    localitySlug: loc?.slug,
    photos: p.images.length,
    pricePerSqft: p.mode === "buy" && p.areaUnit === "sqft" ? Math.round(p.price / p.area) : undefined,
  };
});

export const getProperty = (id) => PROPERTIES.find((p) => p.id === id);
export const listingsIn = (slug) => PROPERTIES.filter((p) => p.localitySlug === slug);
