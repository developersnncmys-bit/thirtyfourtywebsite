import PageHero from "@/components/PageHero";
import FavouritesList from "@/components/FavouritesList";

export const metadata = { title: "Favorite" };

export default function FavouritesPage() {
  return (
    <>
      <PageHero eyebrow="Favorite" title="Your favourites" text="Properties you have saved with the heart." />
      <FavouritesList />
    </>
  );
}
