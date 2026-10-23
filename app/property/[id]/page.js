import { notFound } from "next/navigation";
import PropertyView from "@/components/PropertyView";
import PropertyCard from "@/components/PropertyCard";
import Reveal from "@/components/Reveal";
import { getListings, getListing } from "@/lib/listings";
import { priceLabel, areaLabel } from "@/lib/format";

export const revalidate = 120;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await getListing(id);
  if (!p) return {};
  return {
    title: `${p.title} · ${priceLabel(p)}`,
    description: [p.title, priceLabel(p), areaLabel(p), p.facing && `${p.facing} facing`, p.landmark].filter(Boolean).join(" · "),
    openGraph: p.images[0] ? { images: [p.images[0]] } : undefined,
  };
}

export default async function PropertyPage({ params }) {
  const { id } = await params;
  const all = await getListings();
  const p = all.find((x) => x.id === id);
  if (!p) notFound();

  // "Related Properties", like the app: same type first, then same listing mode
  const related = [
    ...all.filter((x) => x.id !== p.id && x.type === p.type),
    ...all.filter((x) => x.id !== p.id && x.type !== p.type && x.mode === p.mode),
  ].slice(0, 3);

  return (
    <>
      <PropertyView p={p} />
      {related.length > 0 && (
        <section className="section similar">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">You may also like</span>
              <h2>Related Properties</h2>
            </Reveal>
            <div className="grid-cards rail">
              {related.map((s, i) => (
                <PropertyCard key={s.id} p={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
