"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Icon, { WhatsAppIcon } from "./Icon";
import FavButton from "./FavButton";
import CompareButton from "./CompareButton";
import Reveal from "./Reveal";
import EmiCalculator from "./EmiCalculator";
import TrendChart from "./TrendChart";
import MapView from "./MapView";
import Stars from "./Stars";
import { TYPES, getLocality, getProject, QUARTERS } from "@/lib/data";
import { priceLabel, perSqft, formatDate, formatInr, areaLabel } from "@/lib/format";
import { SITE, whatsappLink, telLink } from "@/lib/site";
import { useRecent } from "@/lib/store";

const LISTED_FOR = { buy: "Sell", rent: "Rent", pg: "PG" };
const MODE_TAG = { buy: "For Sale", rent: "For Rent", pg: "PG" };

export default function PropertyView({ p }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [copied, setCopied] = useState(false);
  const [lead, setLead] = useState({ name: "", phone: "" });
  const [leadError, setLeadError] = useState("");
  const recent = useRecent();
  const count = p.images.length;
  const loc = getLocality(p.localitySlug);
  const project = p.projectId && getProject(p.projectId);

  // Remember this visit for "Recently viewed"
  useEffect(() => {
    recent.add(p.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.id]);

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
    ["Floor", p.floor != null ? (p.floor === 0 ? "Ground" : `${p.floor}${p.totalFloors ? ` of ${p.totalFloors}` : ""}`) : null],
    ["Approval authority", p.approval],
    ["RERA registered", p.rera ? "Yes" : "No"],
    ["Address", p.address],
    ["Landmark", p.landmark],
  ].filter(([, v]) => v != null && v !== "");

  // Overview tiles, 99acres-style
  const overview = [
    { icon: "area", label: p.areaUnit === "acre" ? "Land area" : "Built-up area", value: areaLabel(p) },
    p.bhk && { icon: "bed", label: "Configuration", value: `${p.bhk} BHK` },
    p.baths && { icon: "bath", label: "Bathrooms", value: p.baths },
    p.pricePerSqft && { icon: "rupee", label: "Price per sqft", value: perSqft(p.pricePerSqft) },
    p.status && { icon: "building", label: "Status", value: p.status },
    p.age && { icon: "sparkle", label: "Age of property", value: p.age },
    p.deposit && { icon: "shield", label: "Security deposit", value: formatInr(p.deposit) },
    p.tenants && { icon: "user", label: "Preferred tenants", value: p.tenants },
    p.facing && { icon: "compass", label: "Facing", value: p.facing },
    p.furnishing && { icon: "home", label: "Furnishing", value: p.furnishing },
  ].filter(Boolean);

  const enquiry = `Hi, I'm interested in "${p.title}" (${p.locality}, ${priceLabel(p)}) listed on 30Forty. Is it still available?`;
  const phone = p.ownerPhone || SITE.phoneRaw;

  const sendLead = (e) => {
    e.preventDefault();
    if (!lead.name.trim()) return setLeadError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(lead.phone.replace(/\D/g, "").slice(-10))) return setLeadError("Enter a valid 10-digit mobile number.");
    setLeadError("");
    window.open(whatsappLink(`${enquiry}\n\nName: ${lead.name}\nPhone: ${lead.phone}`, phone), "_blank", "noopener");
  };

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
            <div className="pv-badges">
              <span className={`card-tag tag-${p.mode} static`}>{MODE_TAG[p.mode]}</span>
              {p.verified && (
                <span className="badge badge-verified">
                  <Icon name="shield" size={14} /> Verified
                </span>
              )}
              {p.rera && <span className="badge">RERA</span>}
              <span className="badge">{p.postedBy === "builder" ? "Builder" : "Owner"}</span>
            </div>
            <h1 className="pv-title">{p.title}</h1>
            <p className="pv-loc">
              <Icon name="pin" size={18} />
              <span>
                {loc ? <Link href={`/localities/${loc.slug}`}>{p.locality}</Link> : p.locality}, {p.city}
              </span>
            </p>
            <div className="pv-pricebar">
              <strong className="pv-price">{priceLabel(p)}</strong>
              {p.pricePerSqft && <span className="muted">{perSqft(p.pricePerSqft)}</span>}
              {p.deposit && <span className="muted">Deposit {formatInr(p.deposit)}</span>}
            </div>
          </Reveal>

          <div className="pv-overview">
            {overview.map((o, i) => (
              <Reveal key={o.label} delay={(i % 4) * 0.05} className="pv-ov">
                <span className="pv-ov-icon">
                  <Icon name={o.icon} size={20} />
                </span>
                <span>
                  <small>{o.label}</small>
                  <b>{o.value}</b>
                </span>
              </Reveal>
            ))}
          </div>

          {project && (
            <Reveal>
              <Link href={`/projects/${project.id}`} className="pv-project">
                <img src={project.images[0]} alt="" />
                <span>
                  <small>Part of project</small>
                  <b>{project.name}</b>
                  <em>
                    by {project.builder} · {project.status}
                  </em>
                </span>
                <Icon name="arrow" size={18} />
              </Link>
            </Reveal>
          )}

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

          {p.mode === "buy" && p.price >= 500000 && (
            <Reveal className="pv-block">
              <h2>EMI calculator</h2>
              <p className="muted pv-note">Pre-filled with an 80% home loan on this property. Adjust to see your monthly EMI.</p>
              <EmiCalculator price={p.price} />
            </Reveal>
          )}

          <Reveal className="pv-block">
            <h2>Location</h2>
            <MapView points={[{ id: p.id, lat: p.lat, lng: p.lng }]} single zoom={15} height={300} />
            {p.nearby?.length > 0 && (
              <ul className="pv-near">
                {p.nearby.map((n) => (
                  <li key={n}>
                    <Icon name="compass" size={18} /> {n}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          {loc && (
            <Reveal className="pv-block pv-locality">
              <h2>About {loc.name}</h2>
              <div className="loc-snap">
                <div>
                  <small>Rating</small>
                  <b>
                    {loc.rating.toFixed(1)} <Stars value={loc.rating} />
                  </b>
                  <span className="muted">{loc.reviews} reviews</span>
                </div>
                <div>
                  <small>Avg. price</small>
                  <b>{perSqft(loc.avgPrice)}</b>
                  <span className="up">▲ {loc.change}% in 1 yr</span>
                </div>
                <div>
                  <small>2 BHK rent</small>
                  <b>{formatInr(loc.rent2bhk)}</b>
                  <span className="muted">per month</span>
                </div>
              </div>
              <h3 className="chart-title">Price trend in {loc.name} (₹/sqft)</h3>
              <TrendChart labels={QUARTERS} values={loc.trend} height={200} caption={`Average price in ${loc.name}`} />
              <Link href={`/localities/${loc.slug}`} className="pv-more">
                Explore {loc.name} <Icon name="arrow" size={16} />
              </Link>
            </Reveal>
          )}

          <Reveal className="pv-safety">
            <Icon name="shield" size={22} />
            <p>
              <b>Zero brokerage.</b> You deal with the {p.postedBy === "builder" ? "builder" : "owner"} directly. Visit the
              property and check its documents before paying any advance.
            </p>
          </Reveal>
        </div>

        <aside className="pv-side">
          <div className="pv-card">
            <span className="muted">Price</span>
            <strong className="pv-price">{priceLabel(p)}</strong>
            {p.pricePerSqft && <span className="muted pv-psf">{perSqft(p.pricePerSqft)}</span>}
            <span className="pv-nob">
              <Icon name="check" size={14} strokeWidth={2.6} /> No brokerage
            </span>
            <a className="btn btn-enquire btn-block" href={whatsappLink(enquiry, phone)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> Enquire Now
            </a>
            <a className="btn btn-outline btn-block" href={telLink(phone)}>
              <Icon name="phone" size={18} /> Call {p.postedBy === "builder" ? "builder" : "owner"}
            </a>
            <div className="pv-side-row">
              <CompareButton id={p.id} />
              <FavButton id={p.id} className="pv-fav" />
            </div>
          </div>

          <form className="pv-card pv-lead" onSubmit={sendLead} noValidate>
            <h3>Get a call back</h3>
            <label className="field">
              <span>Your name</span>
              <input value={lead.name} onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))} autoComplete="name" />
            </label>
            <label className="field">
              <span>Mobile number</span>
              <input value={lead.phone} onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))} inputMode="tel" autoComplete="tel" />
            </label>
            {leadError && <p className="form-error">{leadError}</p>}
            <button className="btn btn-green btn-block" type="submit">
              Contact {p.postedBy === "builder" ? "builder" : "owner"}
            </button>
          </form>
        </aside>
      </div>

      {/* Sticky bar from the app: price · Enquire Now · call */}
      <div className="pv-bar">
        <strong>{priceLabel(p)}</strong>
        <a className="btn btn-enquire" href={whatsappLink(enquiry, phone)} target="_blank" rel="noopener noreferrer">
          Enquire Now
        </a>
        <a className="call-round" href={telLink(phone)} aria-label="Call owner">
          <Icon name="phone" size={22} />
        </a>
      </div>
    </article>
  );
}
