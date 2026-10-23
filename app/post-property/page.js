import PageHero from "@/components/PageHero";
import PostPropertyForm from "@/components/PostPropertyForm";

export const metadata = {
  title: "Post Property FREE",
  description: "List your flat, house, villa, plot, PG, commercial space or farm land for free and get enquiries from buyers and tenants on WhatsApp.",
};

export default function PostPropertyPage() {
  return (
    <>
      <PageHero eyebrow="Post Property · FREE" title="Add Property" text="Three steps, the same as the app. Buyers and tenants contact you directly." />
      <PostPropertyForm />
    </>
  );
}
