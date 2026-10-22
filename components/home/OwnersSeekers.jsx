import Link from "next/link";
import Reveal from "../Reveal";
import Icon from "../Icon";

const SIDES = [
  {
    key: "owners",
    eyebrow: "For owners",
    title: "List free. Get genuine enquiries.",
    text: "List your flat, house, plot, PG or commercial space for free, add photos and details, and start receiving enquiries directly from interested buyers and tenants.",
    points: ["Post in minutes", "Add photos & full details", "Get notified on every enquiry"],
    cta: { href: "/post-property", label: "Post property free" },
  },
  {
    key: "seekers",
    eyebrow: "For seekers",
    title: "Browse. Filter. Call the owner.",
    text: "Browse listings, filter by type, budget and location, and reach out to owners directly — saving you time and brokerage fees.",
    points: ["Search by locality or Near me", "Filter by type & budget", "Call or WhatsApp in one tap"],
    cta: { href: "/properties", label: "Explore properties" },
  },
];

export default function OwnersSeekers() {
  return (
    <section className="section sides">
      <div className="container sides-grid">
        {SIDES.map((s, i) => (
          <Reveal key={s.key} delay={i * 0.12} x={i ? 40 : -40} y={0} className={`side side-${s.key}`}>
            <span className="eyebrow">{s.eyebrow}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <ul>
              {s.points.map((p) => (
                <li key={p}>
                  <Icon name="check" size={18} strokeWidth={2.4} /> {p}
                </li>
              ))}
            </ul>
            <Link href={s.cta.href} className={`btn ${i ? "btn-green" : "btn-yellow"}`}>
              {s.cta.label} <Icon name="arrow" size={18} />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
