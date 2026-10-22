import { Poppins } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import CompareTray from "@/components/CompareTray";
import { SITE } from "@/lib/site";
import "./globals.css";
import "./features.css";

// The app is set in Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "3040 Property — Buy, Sell & Rent with Zero Brokerage", template: "%s · 3040 Property" },
  description:
    "30Forty is a zero-brokerage real estate app that connects property owners and seekers directly. Flats, houses, plots, PG, commercial and agricultural land.",
  openGraph: {
    title: "3040 Property — Zero Brokerage Real Estate",
    description: "Buy, sell & rent property with zero brokerage. Flats, plots, PG & more.",
    images: ["/logo.jpg"],
  },
};

export const viewport = {
  themeColor: "#024B1E",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      {/* Browser extensions add attributes to <body> before React loads */}
      <body suppressHydrationWarning>
        <Preloader />
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CompareTray />
          <BottomNav />
        </SmoothScroll>
      </body>
    </html>
  );
}
