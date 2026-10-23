import PageHero from "@/components/PageHero";
import FavouritesList from "@/components/FavouritesList";

export const metadata = { title: "Favorite" };

export default function FavouritesPage() {
  return (
    <>
      <PageHero eyebrow="Favorite" title="Your favourites" text="Saved properties, recently viewed and saved searches — all in one place." />
      <FavouritesList />
    </>
  );
}
