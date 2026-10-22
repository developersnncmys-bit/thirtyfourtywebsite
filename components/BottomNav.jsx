"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

// Same five-slot bar as the app: Home · Search · (+) · Saved · Contact
const ITEMS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/properties", label: "Search", icon: "search" },
  null,
  { href: "/favourites", label: "Saved", icon: "heart" },
  { href: "/contact", label: "Contact", icon: "settings" },
];

export default function BottomNav() {
  const pathname = usePathname();
  // The property page has its own sticky "Enquire Now" bar, like the app
  if (pathname.startsWith("/property/")) return null;
  return (
    <nav className="bottom-nav" aria-label="Quick">
      {ITEMS.map((item, i) =>
        item ? (
          <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
            <span className="bn-icon">
              <Icon name={item.icon} size={24} />
            </span>
            <span className="bn-label">{item.label}</span>
          </Link>
        ) : (
          <Link key={i} href="/post-property" className="bn-plus" aria-label="Post property">
            <Icon name="plus" size={28} strokeWidth={2.2} />
          </Link>
        )
      )}
    </nav>
  );
}
