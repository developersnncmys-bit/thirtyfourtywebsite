import Link from "next/link";
import PageHero from "./PageHero";
import Icon from "./Icon";

const LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Renders a policy exactly as the app's Profile → policy screens show it
export default function PolicyPage({ doc, eyebrow, current }) {
  const sections = doc.blocks.filter((b) => b.type === "sectiontitle");
  return (
    <>
      <PageHero eyebrow={eyebrow} title={doc.title} text={doc.subtitle} compact />
      <section className="section policy">
        <div className="container policy-grid">
          <aside className="policy-nav">
            <nav aria-label="Policies">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={l.href === current ? "on" : ""}>
                  <Icon name="doc" size={16} /> {l.label}
                </Link>
              ))}
            </nav>
            <ol className="policy-toc">
              {sections.map((s) => (
                <li key={s.text}>
                  <a href={`#${slug(s.text)}`}>{s.text}</a>
                </li>
              ))}
            </ol>
          </aside>
          <article className="policy-doc">
            <p className="policy-dates">
              {doc.effective} · {doc.updated}
            </p>
            {doc.blocks.map((b, i) => {
              if (b.type === "sectiontitle")
                return (
                  <h2 key={i} id={slug(b.text)}>
                    {b.text}
                  </h2>
                );
              if (b.type === "subtitle") return <h3 key={i}>{b.text}</h3>;
              if (b.type === "highlight")
                return (
                  <p key={i} className="policy-hl">
                    {b.text}
                  </p>
                );
              if (b.type === "bullet")
                return (
                  <p key={i} className="policy-bullet">
                    {b.text}
                  </p>
                );
              if (b.type === "table")
                return (
                  <div key={i} className="table-scroll" data-lenis-prevent>
                    <table className="policy-table">
                      <thead>
                        <tr>
                          {b.headers.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {b.rows.map((r, j) => (
                          <tr key={j}>
                            {r.map((c, k) => (
                              <td key={k}>{c}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              return <p key={i}>{b.text}</p>;
            })}
          </article>
        </div>
      </section>
    </>
  );
}
