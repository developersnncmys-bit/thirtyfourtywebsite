import PageHero from "@/components/PageHero";
import FavouritesList from "@/components/FavouritesList";

export const metadata = { title: "Shortlist" };

export default function FavouritesPage() {
  return (
    <>
      <PageHero eyebrow="Shortlist" title="Your shortlist" text="Saved properties, recently viewed and saved searches — all in one place." />
      <FavouritesList />
    </>
  );
}
