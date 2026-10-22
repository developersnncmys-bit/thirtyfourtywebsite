import PageHero from "@/components/PageHero";
import FavouritesList from "@/components/FavouritesList";

export const metadata = { title: "Saved properties" };

export default function FavouritesPage() {
  return (
    <>
      <PageHero eyebrow="Saved" title="Your favourite properties" text="Tap the heart on any listing to keep it here." />
      <FavouritesList />
    </>
  );
}
