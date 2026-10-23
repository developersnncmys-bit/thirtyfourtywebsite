import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function NotFound() {
  return (
    <PageHero eyebrow="404" title="This property isn't listed" text="The page you're looking for has moved, or the listing was removed in the app.">
      <div className="nf-actions">
        <Link href="/properties" className="btn btn-yellow">
          Browse properties
        </Link>
        <Link href="/" className="btn btn-ghost">
          Go home
        </Link>
      </div>
    </PageHero>
  );
}
