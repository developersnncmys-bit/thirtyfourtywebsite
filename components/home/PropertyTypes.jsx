import Link from "next/link";
import ParallaxImg from "../ParallaxImg";
import Reveal from "../Reveal";
import Icon from "../Icon";

// The six property groups from the Play Store description
const GROUPS = [
  { title: "Flats & Apartments", img: "/props/flat1.jpg", href: "/properties?type=flat" },
  { title: "Independent Houses & Villas", img: "/props/house3.jpg", href: "/properties?type=house" },
  { title: "Plots & Land", img: "/props/plot-30x40.svg", href: "/properties?type=plot" },
  { title: "PG / Hostels", img: "/props/pg1.jpg", href: "/properties?mode=pg" },
  { title: "Commercial Spaces", img: "/props/office1.jpg", href: "/properties?cat=commercial" },
  { title: "Agricultural Land / Farm Plots", img: "/props/farm1.jpg", href: "/properties?type=agri" },
];

export default function PropertyTypes() {
  return (
    <section className="section types">
      <div className="container">
        <Reveal className="section-head center">
          <span className="eyebrow">Property types</span>
          <h2>
            Every kind of property, <em className="hl-green">one app</em>
          </h2>
        </Reveal>
        <div className="types-grid">
          {GROUPS.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 0.08} className={`type-tile t${i}`}>
              <Link href={g.href}>
                <ParallaxImg src={g.img} alt={g.title} speed={10} />
                <span className="type-shade" />
                <span className="type-title">
                  {g.title}
                  <span className="type-arrow">
                    <Icon name="arrow" size={18} />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
