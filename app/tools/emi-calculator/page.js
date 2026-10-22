import PageHero from "@/components/PageHero";
import EmiCalculator from "@/components/EmiCalculator";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Home loan EMI calculator", description: "Calculate your home loan EMI, total interest and year-by-year repayment." };

export default function EmiPage() {
  return (
    <>
      <PageHero eyebrow="Tools · EMI" title="Home loan EMI calculator" text="Move the sliders to see your monthly EMI and how much interest you'll pay." />
      <section className="section">
        <div className="container tool-wrap">
          <Reveal className="tool-panel">
            <EmiCalculator full />
          </Reveal>
          <Reveal delay={0.1} className="tool-notes">
            <h3>How EMI is calculated</h3>
            <p>
              EMI = P × r × (1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1), where P is the loan amount, r the monthly interest rate and n
              the number of months.
            </p>
            <p className="muted">Results are estimates. Your bank's rate, fees and insurance can change the final EMI.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
