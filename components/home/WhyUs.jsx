import Reveal from "../Reveal";
import Counter from "../Counter";
import ScrollText from "../ScrollText";
import Icon from "../Icon";

const FEATURES = [
  { icon: "shield", title: "100% zero brokerage", text: "Deal directly with owners. No middlemen, no hidden commissions — ever." },
  { icon: "sparkle", title: "Free, unlimited listings", text: "Owners post as many properties as they like, completely free." },
  { icon: "list", title: "Rich property details", text: "Price, area, amenities, nearby places, facing, approval authority and RERA status." },
  { icon: "chat", title: "Direct owner contact", text: "Call or message the owner on WhatsApp straight from the listing." },
  { icon: "heart", title: "Save favourites", text: "Shortlist properties and come back to them anytime." },
  { icon: "bell", title: "Instant enquiry alerts", text: "Owners are notified the moment someone enquires about their listing." },
];

export default function WhyUs() {
  return (
    <section className="section why">
      <ScrollText text="ZERO BROKERAGE" />
      <div className="container">
        <Reveal className="section-head center">
          <span className="eyebrow">Why 30Forty</span>
          <h2>
            Property, the <em className="hl-green">honest</em> way
          </h2>
        </Reveal>

        <div className="stats">
          {[
            { node: <Counter to={0} suffix="%" />, label: "Brokerage" },
            { node: <Counter to={0} prefix="₹" />, label: "Listing fee" },
            { node: <Counter to={10} suffix="+" />, label: "Property types" },
            { node: <Counter to={1} />, label: "Tap to WhatsApp" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="stat">
              <strong>{s.node}</strong>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>

        <div className="why-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08} className="why-card">
              <span className="why-icon">
                <Icon name={f.icon} size={26} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
      <ScrollText text="DIRECT FROM OWNERS" direction={-1} className="scroll-text-2" />
    </section>
  );
}
