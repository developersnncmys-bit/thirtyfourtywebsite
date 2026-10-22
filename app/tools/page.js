import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { TOOLS } from "@/lib/tools";

export const metadata = { title: "Property tools", description: "EMI calculator, home loan eligibility and land area converter for property buyers." };

export default function ToolsPage() {
  return (
    <>
      <PageHero eyebrow="Tools" title="Do the maths before you decide" text="Free calculators for buyers, tenants and owners." />
      <section className="section">
        <div className="container tools-grid">
          {TOOLS.map((t, i) => (
            <Reveal key={t.href} delay={i * 0.07}>
              <Link href={t.href} className="tool-card">
                <span className="why-icon">
                  <Icon name={t.icon} size={26} />
                </span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <span className="pcard-go">
                  Open <Icon name="arrow" size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
