import Link from "next/link";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import Icon, { WhatsAppIcon } from "@/components/Icon";
import { SITE, whatsappLink, telLink, helpMail } from "@/lib/site";

export const metadata = { title: "Help & Support", description: "Contact Thirty Forty support — email, phone, WhatsApp and office address in Mysore." };

// The app's Profile menu, on the web
const MENU = [
  { href: "/premium", icon: "crown", label: "Subscriptions", sub: "Go Premium for ₹199/month" },
  { href: "/favourites", icon: "heart", label: "Favorite", sub: "Saved properties and searches" },
  { href: "/post-property", icon: "upload", label: "Post Property", sub: "List your property free" },
  { href: "/privacy-policy", icon: "lock", label: "Privacy Policy", sub: "How we use your data" },
  { href: "/terms-and-conditions", icon: "doc", label: "Terms & Conditions", sub: "Rules for using Thirty Forty" },
  { href: "/refund-policy", icon: "rupee", label: "Refund Policy", sub: "Subscriptions and refunds" },
];

export default function HelpPage() {
  const cards = [
    { icon: <Icon name="mail" />, label: "Email", value: SITE.email, href: helpMail },
    { icon: <Icon name="phone" />, label: "Call", value: SITE.phone, href: telLink() },
    { icon: <WhatsAppIcon />, label: "WhatsApp", value: "Chat with us", href: whatsappLink("Hi Thirty Forty team!") },
    { icon: <Icon name="pin" />, label: "Office", value: SITE.address.join(", ") },
  ];
  return (
    <>
      <PageHero eyebrow="Help & Support" title="We're here to help" text="Questions about a listing, your account or Premium? Reach out anytime." />
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

        <div className="container help-menu-wrap">
          <Reveal className="section-head">
            <span className="eyebrow">More</span>
            <h2>Everything else</h2>
          </Reveal>
          <div className="help-menu">
            {MENU.map((m, i) => (
              <Reveal key={m.href} delay={(i % 3) * 0.06}>
                <Link href={m.href} className="help-item">
                  <span className="why-icon sm">
                    <Icon name={m.icon} size={20} />
                  </span>
                  <span>
                    <b>{m.label}</b>
                    <small>{m.sub}</small>
                  </span>
                  <Icon name="arrow" size={18} />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
