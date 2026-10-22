"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Icon, { WhatsAppIcon } from "./Icon";
import FavButton from "./FavButton";
import Reveal from "./Reveal";
import { TYPES } from "@/lib/data";
import { priceLabel, formatDate } from "@/lib/format";
import { SITE, whatsappLink, telLink } from "@/lib/site";

const LISTED_FOR = { buy: "Sell", rent: "Rent", pg: "PG" };
const MODE_TAG = { buy: "For Sale", rent: "For Rent", pg: "PG" };

export default function PropertyView({ p }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [copied, setCopied] = useState(false);
  const count = p.images.length;

  const go = (step) => {
    setDir(step);
    setIndex((i) => (i + step + count) % count);
  };

  const share = async () => {
    const data = { title: p.title, text: `${p.title} — ${priceLabel(p)} on 30Forty`, url: location.href };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Rows from the app's "Property Details" list — only the ones this listing has
  const details = [
    ["Listed for", LISTED_FOR[p.mode]],
    ["Property type", TYPES.find((t) => t.id === p.type)?.label],
    ["Sale type", p.saleType],
    ["Facing", p.facing],
    ["Dimensions", p.dimensions],
    ["Furnishing", p.furnishing],
    ["Possession", p.possession],
    ["Floor", p.floor != null ? (p.floor === 0 ? "Ground" : p.floor) : null],
    ["Approval authority", p.approval],
    ["RERA registered", p.rera ? "Yes" : "No"],
    ["Address", p.address],
    ["Landmark", p.landmark],
  ].filter(([, v]) => v != null && v !== "");

  const specs = [
    { icon: "area", value: p.area, label: p.areaUnit },
    p.beds && { icon: "bed", value: p.beds, label: "Bedroom" },
    p.baths && { icon: "bath", value: p.baths, label: "Bathroom" },
    !p.beds && p.dimensions && { icon: "area", value: p.dimensions, label: "Dimensions" },
  ].filter(Boolean);

  const enquiry = `Hi, I'm interested in "${p.title}" (${p.locality}, ${priceLabel(p)}) listed on 30Forty. Is it still available?`;

  return (
    <article className="pv">
      <div className="pv-gallery">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={index}
            src={p.images[index]}
            alt={`${p.title} — photo ${index + 1}`}
            custom={dir}
            initial={{ x: `${dir * 100}%`, opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: `${-dir * 100}%`, opacity: 0.4 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
          />
        </AnimatePresence>
        <div className="pv-top container">
          <button className="sq-btn" aria-label="Back" onClick={() => (history.length > 1 ? router.back() : router.push("/properties"))}>
            <Icon name="back" />
          </button>
          <div className="pv-top-right">
            <FavButton id={p.id} className="sq-btn" />
            <button className="sq-btn" aria-label="Share" onClick={share}>
              <Icon name="share" />
            </button>
          </div>
        </div>
        <span className="pv-posted">Posted on {formatDate(p.postedOn)}</span>
        <span className="pv-count">
          {index + 1}/{count}
        </span>
        {count > 1 && (
          <>
            <button className="pv-arrow left" aria-label="Previous photo" onClick={() => go(-1)}>
              <Icon name="back" />
            </button>
            <button className="pv-arrow right" aria-label="Next photo" onClick={() => go(1)}>
              <Icon name="back" style={{ transform: "rotate(180deg)" }} />
            </button>
          </>
        )}
        <AnimatePresence>
          {copied && (
            <motion.span className="toast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              Link copied
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="container pv-thumbs">
          {p.images.map((src, i) => (
            <button
              key={src + i}
              className={i === index ? "on" : ""}
              aria-label={`Show photo ${i + 1}`}
              onClick={() => {
                setDir(i > index ? 1 : -1);
                setIndex(i);
              }}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      <div className="container pv-body">
        <div className="pv-main">
          <Reveal>
            <span className={`card-tag tag-${p.mode} static`}>{MODE_TAG[p.mode]}</span>
            <h1 className="pv-title">{p.title}</h1>
            <p className="pv-loc">
              <Icon name="pin" size={18} /> {p.locality}, {p.city}
            </p>
          </Reveal>

          <div className="pv-specs">
            {specs.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className="pv-spec">
                <Icon name={s.icon} size={24} />
                <b>{s.value}</b>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </div>

          <Reveal className="pv-block">
            <h2>Property Details</h2>
            <dl className="pv-table">
              {details.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="pv-block">
            <h2>About this property</h2>
            <p>{p.description}</p>
          </Reveal>

          {p.amenities?.length > 0 && (
            <Reveal className="pv-block">
              <h2>Amenities</h2>
              <ul className="pv-chips">
                {p.amenities.map((a) => (
                  <li key={a}>
                    <Icon name="check" size={16} strokeWidth={2.4} /> {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {p.nearby?.length > 0 && (
            <Reveal className="pv-block">
              <h2>Nearby</h2>
              <ul className="pv-near">
                {p.nearby.map((n) => (
                  <li key={n}>
                    <Icon name="compass" size={18} /> {n}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal className="pv-safety">
            <Icon name="shield" size={22} />
            <p>
              <b>Zero brokerage.</b> You deal with the owner directly. Visit the property and check its documents before
              paying any advance.
            </p>
          </Reveal>
        </div>

        <aside className="pv-side">
          <div className="pv-card">
            <span className="muted">Price</span>
            <strong className="pv-price">{priceLabel(p)}</strong>
            <span className="pv-nob">
              <Icon name="check" size={14} strokeWidth={2.6} /> No brokerage
            </span>
            <a className="btn btn-enquire btn-block" href={whatsappLink(enquiry, p.ownerPhone || SITE.phoneRaw)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> Enquire Now
            </a>
            <a className="btn btn-outline btn-block" href={telLink(p.ownerPhone || SITE.phoneRaw)}>
              <Icon name="phone" size={18} /> Call owner
            </a>
            <Link href="/properties" className="pv-more">
              Browse more properties <Icon name="arrow" size={16} />
            </Link>
          </div>
        </aside>
      </div>

      {/* Sticky bar from the app: price · Enquire Now · call */}
      <div className="pv-bar">
        <strong>{priceLabel(p)}</strong>
        <a className="btn btn-enquire" href={whatsappLink(enquiry, p.ownerPhone || SITE.phoneRaw)} target="_blank" rel="noopener noreferrer">
          Enquire Now
        </a>
        <a className="call-round" href={telLink(p.ownerPhone || SITE.phoneRaw)} aria-label="Call owner">
          <Icon name="phone" size={22} />
        </a>
      </div>
    </article>
  );
}
