"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Icon from "./Icon";

// Same bar as the app: Home · Search · (+) · Favorite · Profile
const ITEMS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/properties", label: "Search", icon: "search" },
  null,
  { href: "/favourites", label: "Favorite", icon: "heart" },
  { href: "/help", label: "More", icon: "settings" },
];

export default function BottomNav() {
  const pathname = usePathname();
  // The property page has its own sticky "Enquire Now" bar, like the app
  if (pathname.startsWith("/property/")) return null;
  return (
    <nav className="bnav" aria-label="Quick">
      {ITEMS.map((item, i) =>
        item ? (
          <Link key={item.href} href={item.href} className={pathname === item.href ? "on" : ""}>
            {pathname === item.href && <motion.span layoutId="bnav-pill" className="bnav-pill" />}
            <Icon name={item.icon} size={23} />
            <span>{item.label}</span>
          </Link>
        ) : (
          <Link key={i} href="/post-property" className="bnav-plus" aria-label="Post property">
            <Icon name="plus" size={28} strokeWidth={2.2} />
          </Link>
        )
      )}
    </nav>
  );
}
