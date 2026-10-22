import PageHero from "@/components/PageHero";
import CompareTable from "@/components/CompareTable";

export const metadata = { title: "Compare properties" };

export default function ComparePage() {
  return (
    <>
      <PageHero eyebrow="Compare" title="Compare side by side" text="Price, size, ₹/sqft and amenities for up to 4 properties." />
      <CompareTable />
    </>
  );
}
