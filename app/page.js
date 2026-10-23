import HeroBanner from "@/components/home/HeroBanner";
import ExploreOptions from "@/components/home/ExploreOptions";
import ListingRail from "@/components/home/ListingRail";
import TypeCounts from "@/components/home/TypeCounts";
import BudgetBhk from "@/components/home/BudgetBhk";
import OwnerBanner from "@/components/home/OwnerBanner";
import HowItWorks from "@/components/home/HowItWorks";
import PremiumTeaser from "@/components/home/PremiumTeaser";
import AppCTA from "@/components/home/AppCTA";
import FAQ from "@/components/home/FAQ";

// Laid out like the 99acres home page, with Thirty Forty's live listings
export default function Home() {
  return (
    <>
      <HeroBanner />
      <ExploreOptions />
      <ListingRail eyebrow="Fresh on Thirty Forty" title="Recommended properties" sub="Newest listings from the app" href="/properties" empty="No properties listed yet" />
      <TypeCounts />
      <BudgetBhk />
      <OwnerBanner />
      <ListingRail eyebrow="For tenants" title="Properties for rent & PG" sub="Homes, PG and commercial spaces on rent" filter="rent" href="/properties?mode=rent" />
      <HowItWorks />
      <PremiumTeaser />
      <AppCTA />
      <FAQ />
    </>
  );
}
