import PageHero from "@/components/PageHero";
import AreaConverter from "@/components/AreaConverter";

export const metadata = { title: "Land area converter", description: "Convert sqft, sq m, sq yards, guntas, cents, acres and hectares. Plot size calculator for 30 × 40 and more." };

export default function AreaPage() {
  return (
    <>
      <PageHero eyebrow="Tools · Area" title="Land area converter" text="Sqft, guntas, acres and more — plus a plot size calculator for 30 × 40 sites." />
      <AreaConverter />
    </>
  );
}
