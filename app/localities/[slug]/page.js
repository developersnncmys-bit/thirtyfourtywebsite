import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import TrendChart from "@/components/TrendChart";
import MapView from "@/components/MapView";
import PropertyCard from "@/components/PropertyCard";
import ProjectCard from "@/components/ProjectCard";
import LocalityCard from "@/components/LocalityCard";
import Stars from "@/components/Stars";
import Icon from "@/components/Icon";
import { LOCALITIES, PROJECTS, QUARTERS, getLocality, listingsIn } from "@/lib/data";
import { perSqft, formatInr, formatPrice, distanceKm } from "@/lib/format";

export function generateStaticParams() {
  return LOCALITIES.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const l = getLocality(slug);
  if (!l) return {};
  return { title: `${l.name}, Mysuru — prices, trends & reviews`, description: l.about };
}

export default async function LocalityPage({ params }) {
  const { slug } = await params;
  const l = getLocality(slug);
  if (!l) notFound();
  const listings = listingsIn(slug);
  const projects = PROJECTS.filter((p) => p.locality === slug);
  const nearby = LOCALITIES.filter((x) => x.slug !== slug)
    .sort((a, b) => distanceKm(l, a) - distanceKm(l, b))
    .slice(0, 3);
  const forSale = listings.filter((p) => p.mode === "buy").length;
  const forRent = listings.filter((p) => p.mode !== "buy").length;

  return (
    <>
      <PageHero eyebrow={`Locality · Mysuru`} title={l.name} text={l.tagline} />

      <section className="section">
        <div className="container">
          <div className="loc-stats">
            {[
              { k: "Avg. price", v: perSqft(l.avgPrice), s: <span className="up">▲ {l.change}% in 1 year</span> },
              { k: "2 BHK rent", v: formatInr(l.rent2bhk), s: <span className="muted">per month</span> },
              {
                k: "Rating",
                v: (
                  <>
                    {l.rating.toFixed(1)} <Stars value={l.rating} size={14} />
                  </>
                ),
                s: <span className="muted">{l.reviews} resident reviews</span>,
              },
              { k: "Listings", v: listings.length, s: <span className="muted">{forSale} sale · {forRent} rent/PG</span> },
            ].map((t, i) => (
              <Reveal key={t.k} delay={i * 0.06} className="loc-stat">
                <small>{t.k}</small>
                <b>{t.v}</b>
                {t.s}
              </Reveal>
            ))}
          </div>

          <div className="loc-grid">
            <Reveal className="pv-block loc-chart">
              <h2>Price trend (₹/sqft)</h2>
              <p className="muted pv-note">Average asking price of homes for sale in {l.name}, last 8 quarters.</p>
              <TrendChart labels={QUARTERS} values={l.trend} caption={`Average price in ${l.name}`} />
            </Reveal>
            <Reveal className="pv-block" delay={0.1}>
              <h2>About {l.name}</h2>
              <p>{l.about}</p>
              <div className="proscons">
                <div>
                  <h3 className="good">What residents like</h3>
                  <ul>
                    {l.pros.map((x) => (
                      <li key={x}>
                        <Icon name="check" size={16} strokeWidth={2.6} /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="bad">Could be better</h3>
                  <ul>
                    {l.cons.map((x) => (
                      <li key={x}>
                        <Icon name="close" size={16} strokeWidth={2.4} /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="pv-block">
            <h2>On the map</h2>
            <MapView
              points={listings.map((p) => ({
                id: p.id,
                lat: p.lat,
                lng: p.lng,
                label: p.mode === "buy" ? formatPrice(p.price) : `₹${Math.round(p.price / 1000)}K/mo`,
                title: p.title,
                sub: `${p.area} ${p.areaUnit}`,
                href: `/property/${p.id}`,
                image: p.images[0],
              }))}
              height={380}
            />
          </Reveal>
        </div>
      </section>

      {listings.length > 0 && (
        <section className="section similar">
          <div className="container">
            <div className="section-head split">
              <Reveal>
                <span className="eyebrow">Live listings</span>
                <h2>Properties in {l.name}</h2>
              </Reveal>
              <Link href={`/properties?loc=${l.slug}`} className="btn btn-outline">
                See all {listings.length} <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="grid-cards rail">
              {listings.slice(0, 6).map((p, i) => (
                <PropertyCard key={p.id} p={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section similar">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">New projects</span>
              <h2>Projects in {l.name}</h2>
            </Reveal>
            <div className="grid-cards rail">
              {projects.map((pr, i) => (
                <ProjectCard key={pr.id} pr={pr} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section similar">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Nearby</span>
            <h2>Localities near {l.name}</h2>
          </Reveal>
          <div className="grid-cards rail">
            {nearby.map((x, i) => (
              <LocalityCard key={x.slug} l={x} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
