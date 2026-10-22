import Link from "next/link";
import Skyline from "@/components/Skyline";

export default function NotFound() {
  return (
    <section className="page-hero not-found">
      <Skyline seed={4} count={14} tone="rgba(80,190,110,.14)" windows="rgba(246,208,11,.1)" className="page-hero-sky" />
      <div className="container page-hero-inner center">
        <span className="eyebrow eyebrow-light">404</span>
        <h1>This property isn&apos;t listed</h1>
        <p>The page you&apos;re looking for has moved or never existed.</p>
        <Link href="/properties" className="btn btn-yellow">
          Browse properties
        </Link>
      </div>
    </section>
  );
}
