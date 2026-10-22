import Link from "next/link";
import Reveal from "../Reveal";
import Icon from "../Icon";
import { TOOLS } from "@/lib/tools";

export default function ToolsStrip() {
  return (
    <section className="section tools-strip">
      <div className="container">
        <Reveal className="section-head center">
          <span className="eyebrow">Tools</span>
          <h2>
            Plan your budget with <em className="hl-green">confidence</em>
          </h2>
        </Reveal>
        <div className="tools-grid">
          {TOOLS.map((t, i) => (
            <Reveal key={t.href} delay={i * 0.07}>
              <Link href={t.href} className="tool-card">
                <span className="why-icon">
                  <Icon name={t.icon} size={26} />
                </span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <span className="pcard-go">
                  Open <Icon name="arrow" size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
