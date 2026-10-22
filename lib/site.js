// Business details shown across the site — taken from the 3040 Google Play listing.
// Update here and every page picks it up.
export const SITE = {
  name: "3040 Property",
  brand: "30Forty",
  tagline: "Thirty Forty",
  url: "https://3040property.com",
  playStore: "https://play.google.com/store/apps/details?id=com.ororegencompanies.thirtyforty",
  company: "Ororegen Companies",
  email: "ororegenconpanies@gmail.com",
  phone: "+91 78291 25869",
  phoneRaw: "917829125869", // used for tel: and WhatsApp links
  address: [
    "No 202, 2nd Floor, RR Hill View Apartment",
    "Akkamahadevi Road, Vishweshwara Nagara",
    "Mysuru, Karnataka 570008",
  ],
};

export const whatsappLink = (text, phone = SITE.phoneRaw) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

export const telLink = (phone = SITE.phoneRaw) => `tel:+${phone}`;
