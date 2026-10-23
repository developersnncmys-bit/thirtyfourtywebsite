import HeroBanner from "@/components/home/HeroBanner";
import ExploreOptions from "@/components/home/ExploreOptions";
import ListingRail from "@/components/home/ListingRail";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import TypeCounts from "@/components/home/TypeCounts";
import BudgetBhk from "@/components/home/BudgetBhk";
import OwnerBanner from "@/components/home/OwnerBanner";
import Cities from "@/components/home/Cities";
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
      <RecentlyViewed />
      <TypeCounts />
      <ListingRail eyebrow="New Launch" title="Newly launched properties" sub="Brand-new homes, plots and spaces for sale" filter="newLaunch" href="/properties?mode=buy&sale=New" tone="lrail-tint" />
      <BudgetBhk />
      <OwnerBanner />
      <ListingRail eyebrow="For tenants" title="Properties for rent & PG" sub="Homes, PG and commercial spaces on rent" filter="rent" href="/properties?mode=rent" />
      <Cities />
      <HowItWorks />
      <PremiumTeaser />
      <AppCTA />
      <FAQ />
    </>
  );
}
