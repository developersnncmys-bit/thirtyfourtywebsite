import { Suspense } from "react";
import Link from "next/link";
import PropertySearch from "@/components/PropertySearch";
import PortalSearch from "@/components/PortalSearch";
import Icon from "@/components/Icon";

export const metadata = {
  title: "Search properties",
  description: "Find flats, houses, villas, plots, PG, commercial spaces and agricultural land on Thirty Forty.",
};

const TAB = { buy: "buy", rent: "rent", pg: "pg" };

export default async function PropertiesPage({ searchParams }) {
  const sp = await searchParams;
  const tab = sp?.sale === "New" ? "new" : sp?.cat === "commercial" ? "commercial" : TAB[sp?.mode] || "buy";
  return (
    <>
      {/* Search strip at the top of results, like 99acres */}
      <section className="sstrip">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <Icon name="chevron" size={14} style={{ transform: "rotate(-90deg)" }} />
            <span>Search properties</span>
          </nav>
          <PortalSearch compact initialTab={tab} />
        </div>
      </section>
      <Suspense fallback={<div className="container section">Loading…</div>}>
        <PropertySearch />
      </Suspense>
    </>
  );
}
