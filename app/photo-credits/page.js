import PageHero from "@/components/PageHero";
import { PHOTO_CREDITS } from "@/lib/photoCredits";

export const metadata = { title: "Photo credits" };

export default function PhotoCreditsPage() {
  return (
    <>
      <PageHero eyebrow="Credits" title="Photo credits" text="Category photos taken in Bengaluru and Mysuru, from Wikimedia Commons. Resized and cropped for this site." compact />
      <section className="section">
        <div className="container credits">
          {PHOTO_CREDITS.map((c) => (
            <figure key={c.src} className="credit">
              <img src={c.src} alt={c.title} loading="lazy" />
              <figcaption>
                <a href={c.page} target="_blank" rel="noopener noreferrer">
                  {c.title}
                </a>
                <span>
                  by {c.author} ·{" "}
                  <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">
                    {c.license}
                  </a>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
