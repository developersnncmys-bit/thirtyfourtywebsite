import PageHero from "@/components/PageHero";
import PostPropertyForm from "@/components/PostPropertyForm";

export const metadata = {
  title: "Post property free",
  description: "List your flat, house, plot, PG or commercial space for free and get enquiries directly from buyers and tenants.",
};

export default function PostPropertyPage() {
  return (
    <>
      <PageHero
        eyebrow="Post Property · FREE"
        title="List your property in minutes"
        text="No fees, no brokers. Interested buyers and tenants contact you directly."
      />
      <PostPropertyForm />
    </>
  );
}
