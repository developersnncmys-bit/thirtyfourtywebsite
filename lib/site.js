// Business details shown across the site — taken from the Thirty Forty app
// (Profile → Help & Support, policies). Update here and every page picks it up.
export const SITE = {
  name: "Thirty Forty",
  brand: "3040 Property",
  tagline: "Real Estate. Simplified.",
  url: "https://3040property.com",
  playStore: "https://play.google.com/store/apps/details?id=com.ororegencompanies.thirtyforty",
  appLink: "https://ororegencompanies.in/apps/30forty",
  company: "Thirty Forty",
  poweredBy: "Nakshatra Namaha Creations Pvt. Ltd.",
  email: "thirtyfortysupport@gmail.com",
  phone: "+91 80889 93253",
  phoneRaw: "918088993253", // used for tel: and WhatsApp links
  address: ["#36 A-Wing, 2nd Main, Srinagara Badavane", "Srinagara, Mysore - 570008", "Karnataka, India"],
  premiumPrice: 199,
};

// The app's backend (view/config.dart)
export const API = {
  base: "https://api.30forty.in/api",
  images: "https://api.30forty.in",
};

export const whatsappLink = (text, phone = SITE.phoneRaw) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

export const telLink = (phone = SITE.phoneRaw) => `tel:+${phone}`;

export const helpMail = `mailto:${SITE.email}?subject=${encodeURIComponent("Help & Support - Thirty Forty App")}`;

// The app's "Go Premium" screen
export const PREMIUM_TICKS = [
  "Top placement in search results",
  "More visibility for your listing",
  "Direct lead notifications",
  "Premium support",
];
