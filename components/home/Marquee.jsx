import Link from "next/link";
import { LOCALITIES } from "@/lib/data";

// Endless strip of Mysuru localities, in the app's yellow
export default function Marquee() {
  const row = [...LOCALITIES, ...LOCALITIES];
  return (
    <div className="marquee" aria-label="Popular localities">
      <div className="marquee-track">
        {row.map((l, i) => (
          <Link key={i} href={`/properties?q=${encodeURIComponent(l)}`} tabIndex={i >= LOCALITIES.length ? -1 : undefined}>
            {l}
            <span className="marquee-dot" />
          </Link>
        ))}
      </div>
    </div>
  );
}
