import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import Icon, { WhatsAppIcon } from "@/components/Icon";
import { SITE, whatsappLink, telLink } from "@/lib/site";

export const metadata = { title: "Contact", description: "Get in touch with the 30Forty team in Mysuru." };

export default function ContactPage() {
  const cards = [
    { icon: <Icon name="mail" />, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: <Icon name="phone" />, label: "Call", value: SITE.phone, href: telLink() },
    { icon: <WhatsAppIcon />, label: "WhatsApp", value: "Chat with us", href: whatsappLink("Hi 30Forty team!") },
    { icon: <Icon name="pin" />, label: "Office", value: SITE.address.join(", ") },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="We're here to help" text="Questions about a listing or the app? Reach out anytime." />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-cards">
            {cards.map((c, i) => {
              const body = (
                <>
                  <span className="why-icon">{c.icon}</span>
                  <span>
                    <small>{c.label}</small>
                    <b>{c.value}</b>
                  </span>
                </>
              );
              return (
                <Reveal key={c.label} delay={i * 0.06}>
                  {c.href ? (
                    <a className="contact-card" href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {body}
                    </a>
                  ) : (
                    <div className="contact-card">{body}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
