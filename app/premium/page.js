import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { SITE, PREMIUM_TICKS } from "@/lib/site";

export const metadata = {
  title: "Go Premium",
  description: `Premium Listing for ₹${SITE.premiumPrice}/month — top placement in search results, more visibility and direct lead notifications.`,
};

const GRID = [
  ["rocket", "Boost", "Get more views"],
  ["bell", "Leads", "Instant alerts"],
  ["shield", "Trust", "Verified badge"],
  ["help", "Support", "Priority help"],
];

const COMPARE = [
  ["Post your property", true, true],
  ["Enquiries on WhatsApp", true, true],
  ["Dashboard & enquiry list", true, true],
  ["Top placement in search results", false, true],
  ["Boosted reach", false, true],
  ["Verified badge", false, true],
  ["Direct lead notifications", false, true],
  ["Priority support", false, true],
];

// The app's "Go Premium" screen (Profile → Subscriptions)
export default function PremiumPage() {
  return (
    <>
      <PageHero eyebrow="Go Premium" title="Premium" text="Post your property faster and get more leads." />
      <section className="section premium-page">
        <div className="container premium-grid">
          <Reveal className="premium-card">
            <div className="premium-card-top">
              <span className="prem-badge">
                <Icon name="crown" size={16} /> Premium Listing
              </span>
              <p className="prem-price">
                ₹{SITE.premiumPrice}
                <small>/ month</small>
              </p>
              <div className="prem-pills">
                <span>Boosted reach</span>
                <span>Priority support</span>
                <span>Verified badge</span>
              </div>
            </div>
            <ul className="premium-ticks">
              {PREMIUM_TICKS.map((t) => (
                <li key={t}>
                  <span>
                    <Icon name="check" size={14} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="premium-mini">
              {GRID.map(([icon, b, s]) => (
                <span key={b}>
                  <Icon name={icon} size={20} />
                  <b>{b}</b>
                  <small>{s}</small>
                </span>
              ))}
            </div>
            <a className="btn btn-yellow btn-block btn-shine" href={SITE.playStore} target="_blank" rel="noopener noreferrer">
              Subscribe for ₹{SITE.premiumPrice}/month
            </a>
            <p className="premium-note">Subscribe from Profile → Subscriptions in the Thirty Forty app. Premium stays active for 30 days.</p>
          </Reveal>

          <Reveal delay={0.1} className="premium-compare">
            <h2>Free vs Premium</h2>
            <table>
              <thead>
                <tr>
                  <th />
                  <th>Free</th>
                  <th>
                    <Icon name="crown" size={15} /> Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([label, free, prem]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{free ? <Icon name="check" size={18} strokeWidth={2.8} className="yes" /> : <span className="no">—</span>}</td>
                    <td>{prem && <Icon name="check" size={18} strokeWidth={2.8} className="yes" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted">
              Refunds follow our <Link href="/refund-policy">Refund Policy</Link>.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
