import PageHero from "@/components/PageHero";
import LocalitiesList from "@/components/LocalitiesList";

export const metadata = {
  title: "Localities, prices & trends in Mysuru",
  description: "Average property prices per sqft, yearly price trends, ratings and listings for every major Mysuru locality.",
};

export default function LocalitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Rates & trends"
        title="Know the locality before you buy"
        text="Average ₹/sqft, one-year growth, ratings and live listings across Mysuru."
      />
      <LocalitiesList />
    </>
  );
}
