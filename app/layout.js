import { Poppins } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingsProvider from "@/components/ListingsProvider";
import { getListings } from "@/lib/listings";
import { FavouritesSync } from "@/lib/store";
import { SITE } from "@/lib/site";
import "./globals.css";
import "./features.css";
import "./theme.css";
import "./portal.css";
import "./portal-pages.css";
import "./account.css";
import "./mobile.css";

// The app is set in Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description:
    "Thirty Forty (3040 Property) — buy, sell and rent flats, houses, villas, plots, PG, commercial spaces and agricultural land. Post your property free.",
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "Buy, sell & rent property. Flats, plots, PG, commercial & farm land. Post your property free.",
    images: ["/brand/logo.png"],
  },
};

export const viewport = {
  themeColor: "#024B20",
};

export default async function RootLayout({ children }) {
  const listings = await getListings();
  return (
    <html lang="en" className={poppins.variable}>
      {/* Browser extensions add attributes to <body> before React loads */}
      <body suppressHydrationWarning>
        <Preloader />
        <ListingsProvider listings={listings}>
          <SmoothScroll>
            <FavouritesSync />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </ListingsProvider>
      </body>
    </html>
  );
}
