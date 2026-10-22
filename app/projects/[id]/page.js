import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import ParallaxImg from "@/components/ParallaxImg";
import PropertyCard from "@/components/PropertyCard";
import MapView from "@/components/MapView";
import Icon from "@/components/Icon";
import ProjectEnquiry from "@/components/ProjectEnquiry";
import { PROJECTS, PROPERTIES, getProject, getLocality } from "@/lib/data";
import { formatPrice, perSqft, projectPriceRange, configLabel } from "@/lib/format";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const pr = getProject(id);
  if (!pr) return {};
  return { title: `${pr.name} by ${pr.builder}`, description: pr.about, openGraph: { images: [pr.images[0]] } };
}

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const pr = getProject(id);
  if (!pr) notFound();
  const loc = getLocality(pr.locality);
  const listings = PROPERTIES.filter((p) => p.projectId === pr.id);

  const facts = [
    ["Status", pr.status],
    ["Possession", pr.possession === "Ready" ? "Ready to move" : pr.possession],
    ["Launched", pr.launched],
    ["Total units", pr.units],
    pr.towers ? ["Towers", pr.towers] : null,
    ["Land area", pr.land],
    ["RERA", pr.rera ? "Registered" : "—"],
  ].filter(Boolean);

  return (
    <>
      <section className="proj-hero">
        <ParallaxImg src={pr.images[0]} alt={pr.name} speed={12} className="proj-hero-img" />
        <div className="proj-hero-shade" />
        <div className="container proj-hero-inner">
          <Reveal>
            <span className="eyebrow eyebrow-light">{pr.status}</span>
            <h1>{pr.name}</h1>
            <p>
              by <b>{pr.builder}</b> · {loc?.name}, Mysuru
            </p>
            <strong className="proj-hero-price">{projectPriceRange(pr)}</strong>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container pv-body">
          <div className="pv-main">
            <Reveal className="proj-facts">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <b>{v}</b>
                </div>
              ))}
            </Reveal>

            <Reveal className="pv-block">
              <h2>Configurations & prices</h2>
              <div className="table-scroll">
                <table className="cfg-table">
                  <thead>
                    <tr>
                      <th scope="col">Unit</th>
                      <th scope="col">Area</th>
                      <th scope="col">Price</th>
                      <th scope="col">₹/sqft</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pr.configs.map((c) => (
                      <tr key={configLabel(c)}>
                        <td>
                          <b>{configLabel(c)}</b>
                        </td>
                        <td>{c.area.toLocaleString("en-IN")} sqft</td>
                        <td className="cfg-price">{formatPrice(c.price)}</td>
                        <td>{perSqft(c.price / c.area)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal className="pv-block">
              <h2>About the project</h2>
              <p>{pr.about}</p>
            </Reveal>

            <Reveal className="pv-block">
              <h2>Amenities</h2>
              <ul className="pv-chips">
                {pr.amenities.map((a) => (
                  <li key={a}>
                    <Icon name="check" size={16} strokeWidth={2.4} /> {a}
                  </li>
                ))}
              </ul>
            </Reveal>

            {pr.images.length > 1 && (
              <Reveal className="pv-block">
                <h2>Gallery</h2>
                <div className="proj-gallery">
                  {pr.images.map((src, i) => (
                    <ParallaxImg key={src + i} src={src} alt={`${pr.name} — image ${i + 1}`} speed={8} className="proj-gal-item" />
                  ))}
                </div>
              </Reveal>
            )}

            {loc && (
              <Reveal className="pv-block">
                <h2>Location</h2>
                <MapView points={[{ id: pr.id, lat: loc.lat, lng: loc.lng }]} single zoom={14} height={300} />
                <Link href={`/localities/${loc.slug}`} className="pv-more">
                  About {loc.name} · avg {perSqft(loc.avgPrice)} <Icon name="arrow" size={16} />
                </Link>
              </Reveal>
            )}
          </div>

          <aside className="pv-side">
            <ProjectEnquiry name={pr.name} builder={pr.builder} configs={pr.configs.map(configLabel)} />
          </aside>
        </div>
      </section>

      {listings.length > 0 && (
        <section className="section similar">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">Available now</span>
              <h2>Listings in {pr.name}</h2>
            </Reveal>
            <div className="grid-cards rail">
              {listings.map((p, i) => (
                <PropertyCard key={p.id} p={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
