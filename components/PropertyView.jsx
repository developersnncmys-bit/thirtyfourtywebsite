"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Icon, { WhatsAppIcon } from "./Icon";
import FavButton from "./FavButton";
import PropertyImage from "./PropertyImage";
import Reveal from "./Reveal";
import { typeInfo } from "@/lib/options";
import { priceLabel, perSqft, formatDate, formatInr, areaLabel } from "@/lib/format";

const MODE_TAG = { buy: "For Sale", rent: "For Rent", pg: "PG" };

function EnquiryDialog({ p, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const send = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) return setError("Enter a valid 10-digit mobile number.");
    const q = new URLSearchParams({ via: "whatsapp", name: name.trim(), phone: phone.trim() });
    window.open(`/contact-owner/${p.id}?${q}`, "_blank", "noopener");
    onClose();
  };
  return (
    <motion.div className="dialog-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.form
        className="dialog"
        onSubmit={send}
        noValidate
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enq-title"
      >
        <span className="dialog-icon">
          <WhatsAppIcon size={26} />
        </span>
        <h3 id="enq-title">Send Enquiry</h3>
        <p className="muted">
          {p.owner} will get your message on WhatsApp with your name and number.
        </p>
        <label className="field">
          <span>Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" autoFocus />
        </label>
        <label className="field">
          <span>Phone Number</span>
          <div className="field-prefix">
            <em>+91</em>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel-national" placeholder="Enter your number" />
          </div>
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="dialog-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-enquire">
            Yes, Send
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default function PropertyView({ p }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [copied, setCopied] = useState(false);
  const [asking, setAsking] = useState(false);
  const [viewer, setViewer] = useState(false);
  const count = p.images.length;
  const galleryRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: galleryRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", asking || viewer);
  }, [asking, viewer]);

  // "Contact Owner" on the search results opens the enquiry form straight away
  useEffect(() => {
    if (new URLSearchParams(location.search).get("enquire")) setAsking(true);
  }, []);

  const go = (step) => {
    if (count < 2) return;
    setDir(step);
    setIndex((i) => (i + step + count) % count);
  };

  const share = async () => {
    const data = { title: p.title, text: `Check out this ${p.title} on Thirty Forty`, url: location.href };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Rows from the app's "Property Details" list — only the ones this listing has
  const details = [
    ["Listed for", p.listedFor],
    ["Property type", p.type === "pg" ? p.category : typeInfo(p.type).label],
    ["Sale type", p.saleType],
    ["Facing", p.facing],
    ["Dimensions", p.dimensions],
    ["Furnishing", p.furnishing],
    ["Possession", p.status],
    ["Floor", p.floor],
    ["Approval authority", p.approval],
    ["RERA registered", p.rera ? "Yes" : null],
    ["Booking / Token", p.token && formatInr(p.token)],
    ["Address", p.address],
    ["Landmark", p.landmark],
    ["City", p.city],
    ["Office seats", p.seats],
    ["Acre", p.acre],
    ["Kunte", p.kunte],
    ["Diet", p.diet],
    ["Food provided", p.food],
    ["Occupancy", p.occupancy.join(", ")],
    ["Profession", p.profession.join(", ")],
  ].filter(([, v]) => v != null && v !== "");

  // Feature cards under the title, like the app
  const overview = [
    areaLabel(p) && { icon: "area", label: p.acre || p.kunte ? "Land area" : "Area", value: areaLabel(p) },
    p.bedrooms && { icon: "bed", label: "Bedroom", value: p.bedrooms },
    p.baths && { icon: "bath", label: "Bathroom", value: p.baths },
    p.pricePerSqft && { icon: "rupee", label: "Price per sqft", value: perSqft(p.pricePerSqft) },
    p.facing && { icon: "compass", label: "Facing", value: p.facing },
    p.furnishing && { icon: "home", label: "Furnishing", value: p.furnishing },
  ].filter(Boolean);

  const tag = p.mode === "rent" && p.listedFor === "Lease" ? "For Lease" : MODE_TAG[p.mode];

  const place = [p.landmark, p.city].filter(Boolean).join(", ");
  const openAt = (i) => {
    setIndex(i);
    setViewer(true);
  };

  return (
    <article className="pv pv2">
      {/* Header like a 99acres listing: title on the left, price + contact on the right */}
      <div className="container pv2-head">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <Icon name="chevron" size={14} style={{ transform: "rotate(-90deg)" }} />
          <Link href={`/properties?mode=${p.mode}`}>{p.mode === "buy" ? "Buy" : p.mode === "rent" ? "Rent" : "PG"}</Link>
          {p.city && (
            <>
              <Icon name="chevron" size={14} style={{ transform: "rotate(-90deg)" }} />
              <Link href={`/properties?mode=${p.mode}&city=${encodeURIComponent(p.city)}`}>{p.city}</Link>
            </>
          )}
          <Icon name="chevron" size={14} style={{ transform: "rotate(-90deg)" }} />
          <span>{p.type === "pg" ? p.category : typeInfo(p.type).label}</span>
        </nav>
        <div className="pv2-top">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="pv-badges">
              <span className={`pcard-tag tag-${p.mode} static`}>{tag}</span>
              {p.rera && <span className="badge">RERA</span>}
              {p.saleType && <span className="badge">{p.saleType}</span>}
              <span className="badge">Posted {formatDate(p.postedOn)}</span>
            </div>
            <h1 className="pv-title">{p.title}</h1>
            {place && (
              <p className="pv-loc">
                <Icon name="pin" size={18} />
                <span>{place}</span>
              </p>
            )}
          </motion.div>
          <motion.div className="pv2-price" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <strong className="pv-price">{priceLabel(p)}</strong>
            <span className="muted">
              {[p.pricePerSqft && perSqft(p.pricePerSqft), p.token && `Token ${formatInr(p.token)}`].filter(Boolean).join(" · ")}
            </span>
            <div className="pv2-actions">
              <button className="sq-btn light" aria-label="Share" onClick={share}>
                <Icon name="share" />
              </button>
              <FavButton id={p.id} className="sq-btn light" />
              <button className="btn btn-enquire" onClick={() => setAsking(true)}>
                <WhatsAppIcon /> Contact Owner
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Photo grid: one large + two small, "+N photos" opens the viewer */}
      <div className="container">
        <div className={`pv2-grid n${Math.min(count, 3)}`} ref={galleryRef}>
          <button className="pv2-main" onClick={() => count && openAt(0)} aria-label="View photos">
            <motion.span className="pv2-par" style={{ y: imgY, scale: imgScale }}>
              <PropertyImage p={p} src={p.images[0]} alt={`${p.title} — photo 1`} />
            </motion.span>
            {count > 0 && (
              <span className="pv-count">
                <Icon name="camera" size={14} /> {count} {count === 1 ? "Photo" : "Photos"}
              </span>
            )}
          </button>
          {p.images.slice(1, 3).map((src, i) => (
            <button key={src} className="pv2-side" onClick={() => openAt(i + 1)} aria-label={`View photo ${i + 2}`}>
              <img src={src} alt="" loading="lazy" />
              {i === 1 && count > 3 && <span className="pv2-more">+{count - 3} Photos</span>}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {copied && (
            <motion.span className="toast pv2-toast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              Link copied
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen photo viewer */}
      <AnimatePresence>
        {viewer && (
          <motion.div className="viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Photos">
            <button className="viewer-x" aria-label="Close photos" onClick={() => setViewer(false)}>
              <Icon name="close" />
            </button>
            <div className="viewer-stage">
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.img
                  key={index}
                  src={p.images[index]}
                  alt={`${p.title} — photo ${index + 1}`}
                  initial={{ x: `${dir * 60}%`, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: `${-dir * 60}%`, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  drag={count > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) go(1);
                    else if (info.offset.x > 60) go(-1);
                  }}
                />
              </AnimatePresence>
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
            </div>
            <div className="viewer-thumbs">
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
            <p className="viewer-count">
              {index + 1} / {count}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container pv-body">
        <div className="pv-main">

          {overview.length > 0 && (
            <div className="pv-overview">
              {overview.map((o, i) => (
                <Reveal key={o.label} delay={(i % 3) * 0.06} className="pv-ov">
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

          {p.amenities.length > 0 && (
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

          <Reveal className="pv-block pv-owner">
            <h2>Posted by</h2>
            <div className="pv-owner-row">
              <span className="pv-avatar">{p.owner.charAt(0).toUpperCase()}</span>
              <span>
                <b>{p.owner}</b>
                <small>Posted on {formatDate(p.postedOn)}</small>
              </span>
              <button className="btn btn-enquire" onClick={() => setAsking(true)}>
                <WhatsAppIcon /> Contact Owner
              </button>
            </div>
          </Reveal>

          {p.nearby.length > 0 && (
            <Reveal className="pv-block">
              <h2>Nearby Places</h2>
              <ul className="pv-near">
                {p.nearby.map((n) => (
                  <li key={n.name + n.category}>
                    <span className="pv-near-icon">
                      <Icon name="compass" size={18} />
                    </span>
                    <span>
                      <b>{n.name}</b>
                      <small>
                        {n.category}
                        {n.distance != null && ` • ${n.distance} KM`}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal className="pv-safety">
            <Icon name="shield" size={22} />
            <p>
              <b>Stay safe.</b> Visit the property and check its documents — title deed, khata, approvals and RERA number where
              applicable — before paying any advance or token amount.
            </p>
          </Reveal>
        </div>

        <aside className="pv-side">
          <div className="pv-card">
            <span className="muted">Price</span>
            <strong className="pv-price">{priceLabel(p)}</strong>
            {p.pricePerSqft && <span className="muted pv-psf">{perSqft(p.pricePerSqft)}</span>}
            <button className="btn btn-enquire btn-block" onClick={() => setAsking(true)}>
              <WhatsAppIcon /> Contact Owner
            </button>
            <a className="btn btn-outline btn-block" href={`/contact-owner/${p.id}?via=call`}>
              <Icon name="phone" size={18} /> Call
            </a>
            <div className="pv-side-row">
              <span className="muted">Save to Favorite</span>
              <FavButton id={p.id} className="pv-fav" />
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky bar from the app: price · Enquire Now · call */}
      <div className="pv-bar">
        <strong>{priceLabel(p)}</strong>
        <button className="btn btn-enquire" onClick={() => setAsking(true)}>
          Enquire Now
        </button>
        <a className="call-round" href={`/contact-owner/${p.id}?via=call`} aria-label="Call">
          <Icon name="phone" size={22} />
        </a>
      </div>

      <AnimatePresence>{asking && <EnquiryDialog p={p} onClose={() => setAsking(false)} />}</AnimatePresence>
    </article>
  );
}
