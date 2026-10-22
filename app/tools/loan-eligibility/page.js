import PageHero from "@/components/PageHero";
import LoanEligibility from "@/components/LoanEligibility";

export const metadata = { title: "Home loan eligibility calculator", description: "Find out how much home loan you can get and which properties fit your budget." };

export default function LoanEligibilityPage() {
  return (
    <>
      <PageHero eyebrow="Tools · Eligibility" title="How much home loan can you get?" text="Based on your income and existing EMIs — then see properties in your budget." />
      <LoanEligibility />
    </>
  );
}
