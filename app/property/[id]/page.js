import { notFound } from "next/navigation";
import PropertyView from "@/components/PropertyView";
import PropertyCard from "@/components/PropertyCard";
import Reveal from "@/components/Reveal";
import { PROPERTIES, getProperty } from "@/lib/data";
import { priceLabel } from "@/lib/format";

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = getProperty(id);
  if (!p) return {};
  return {
    title: `${p.title} · ${priceLabel(p)}`,
    description: p.description,
    openGraph: { images: [p.images[0]] },
  };
}

export default async function PropertyPage({ params }) {
  const { id } = await params;
  const p = getProperty(id);
  if (!p) notFound();

  const similar = PROPERTIES.filter((x) => x.id !== p.id && (x.mode === p.mode || x.type === p.type)).slice(0, 3);

  return (
    <>
      <PropertyView p={p} />
      {similar.length > 0 && (
        <section className="section similar">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">You may also like</span>
              <h2>Similar properties</h2>
            </Reveal>
            <div className="grid-cards">
              {similar.map((s, i) => (
                <PropertyCard key={s.id} p={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
