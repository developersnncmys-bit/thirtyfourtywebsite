import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import PropertySearch from "@/components/PropertySearch";

export const metadata = {
  title: "Search properties",
  description: "Find flats, houses, villas, plots, PG, commercial spaces and farm land direct from owners — zero brokerage.",
};

export default function PropertiesPage() {
  return (
    <>
      <PageHero eyebrow="Search" title="Find your next property" text="Direct from owners. Zero brokerage." />
      <Suspense fallback={<div className="container section">Loading…</div>}>
        <PropertySearch />
      </Suspense>
    </>
  );
}
