import Skyline from "./Skyline";
import Reveal from "./Reveal";

// Green title band, like the app's screen headers
export default function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="page-hero">
      <Skyline seed={8} count={16} tone="rgba(80,190,110,.14)" windows="rgba(246,208,11,.1)" className="page-hero-sky" />
      <div className="container page-hero-inner">
        <Reveal>
          {eyebrow && <span className="eyebrow eyebrow-light">{eyebrow}</span>}
          <h1>{title}</h1>
          {text && <p>{text}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
