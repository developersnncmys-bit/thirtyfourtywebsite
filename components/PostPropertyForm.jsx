"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon, { WhatsAppIcon } from "./Icon";
import Reveal from "./Reveal";
import {
  BHK_OPTIONS,
  BATHROOMS,
  FURNISHING,
  POSSESSION,
  SALE_TYPES,
  FACINGS,
  AMENITIES,
  APPROVAL_AUTHORITIES,
  DIET,
  OCCUPANCY,
  FOOD,
  PG_AMENITIES,
  PROFESSION,
  NEARBY_CATEGORIES,
} from "@/lib/options";
import { SITE, whatsappLink } from "@/lib/site";

// Same three steps as the app's "Add Property": property type → details → images.
// Publishing needs the app (it uploads photos and verifies your number), so
// from the website the finished listing goes to the Thirty Forty team on WhatsApp.
const STEPS = ["Property", "Details", "Publish"];
const RES_TYPES = ["Flat", "House", "Villa", "Plot"];
const COM_TYPES = ["Office Space", "Shop", "Showroom", "Commercial"];

const EMPTY = {
  want: "",
  lease: "Rent",
  property: "",
  sub: "",
  occupancy: [],
  food: "",
  pgAmenities: [],
  profession: [],
  saleType: "",
  facing: "",
  unit: "Feet",
  len: "",
  wid: "",
  acre: "",
  kunte: "",
  city: "",
  address: "",
  landmark: "",
  bedrooms: "",
  bathrooms: "",
  furnishing: "",
  floor: "",
  possession: "",
  diet: "",
  bachelor: "",
  approval: "Others",
  rera: "No",
  reraNo: "",
  amenities: [],
  seats: "",
  price: "",
  token: "",
  nearby: [],
  name: "",
  phone: "",
};

const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

// Price in words, like the app's helper under "Price you expect"
function inWords(n) {
  n = Math.floor(Number(n) || 0);
  if (!n) return "Zero Rupees";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (x) => (x < 20 ? a[x] : `${b[Math.floor(x / 10)]}${x % 10 ? ` ${a[x % 10]}` : ""}`);
  const three = (x) => (x >= 100 ? `${a[Math.floor(x / 100)]} Hundred${x % 100 ? ` ${two(x % 100)}` : ""}` : two(x));
  const parts = [];
  const cr = Math.floor(n / 1e7);
  const lakh = Math.floor((n % 1e7) / 1e5);
  const th = Math.floor((n % 1e5) / 1e3);
  const rest = n % 1e3;
  if (cr) parts.push(`${three(cr)} Crore`);
  if (lakh) parts.push(`${two(lakh)} Lakh`);
  if (th) parts.push(`${two(th)} Thousand`);
  if (rest) parts.push(three(rest));
  return `${parts.join(" ")} Rupees`;
}

function Choice({ label, options, value, onChange, multi = false, required = false }) {
  return (
    <div className="pf-group">
      <p className="pf-label">
        {label}
        {required && <em>*</em>}
      </p>
      <div className="chips">
        {options.map((o) => {
          const id = o.id ?? o;
          const text = o.label ?? o;
          const on = multi ? value.includes(text) : value === text;
          return (
            <motion.button key={id} type="button" whileTap={{ scale: 0.94 }} className={`chip ${on ? "on" : ""}`} aria-pressed={on} onClick={() => onChange(multi ? toggleIn(value, text) : on ? "" : text)}>
              {text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Sections slide in one after another as each answer is given, like the app
const Appear = ({ show, children }) => (
  <AnimatePresence initial={false}>
    {show && (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default function PostPropertyForm() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [place, setPlace] = useState({ category: NEARBY_CATEGORIES[0], name: "", distance: "" });
  const set = (patch) => setF((s) => ({ ...s, ...patch }));
  const input = (k) => ({ value: f[k], onChange: (e) => set({ [k]: e.target.value }) });

  const isPg = f.want === "PG";
  const isAgri = f.property === "Agricultural Land";
  const isRes = f.property === "Residential";
  const isCom = f.property === "Commercial";
  const isPlot = f.sub === "Plot";
  const homeLike = isRes && !isPlot;
  const mult = f.unit === "Meters" ? 10.7639 : 1;
  const total = f.len && f.wid ? Math.round(Number(f.len) * Number(f.wid) * mult * 100) / 100 : 0;
  const agriTotal = Math.round((Number(f.acre) || 0) * 43560 + (Number(f.kunte) || 0) * 1089);
  const typeDone = isPg ? f.occupancy.length > 0 : isAgri || ((isRes || isCom) && f.sub);

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!f.want) e.want = "Choose Sell, Rent/Lease or PG";
      else if (!f.property) e.property = "Choose the property";
      else if (!typeDone) e.sub = isPg ? "Choose the occupancy type" : "Choose the type";
      if (!f.city.trim()) e.city = "Enter City";
      if (!f.address.trim()) e.address = "Enter Full Address";
    }
    if (s === 1) {
      if (!(Number(f.price) > 0)) e.price = "Enter the price you expect";
      if (homeLike && !f.bedrooms) e.bedrooms = "Choose bedrooms";
      if (f.rera === "Yes" && !f.reraNo.trim()) e.reraNo = "Enter RERA Number";
    }
    if (s === 2) {
      if (!f.name.trim()) e.name = "Enter your name";
      if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").slice(-10))) e.phone = "Enter a valid 10-digit mobile number";
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => s + 1);
    window.__lenis?.scrollTo(".post-card", { offset: -110 });
  };

  const addPlace = () => {
    if (!place.name.trim()) return;
    set({ nearby: [...f.nearby, { ...place, name: place.name.trim() }] });
    setPlace({ category: NEARBY_CATEGORIES[0], name: "", distance: "" });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate(2)) return;
    const want = f.want === "Rent/Lease" ? f.lease : f.want;
    const lines = [
      "New property from the Thirty Forty website",
      "",
      `I want to: ${want}`,
      `Property: ${f.property}${f.sub ? ` — ${f.sub}` : ""}`,
      isPg && `Occupancy: ${f.occupancy.join(", ")}`,
      isPg && f.food && `Food Provided: ${f.food}`,
      isPg && f.pgAmenities.length && `Amenities: ${f.pgAmenities.join(", ")}`,
      isPg && f.profession.length && `Profession: ${f.profession.join(", ")}`,
      f.saleType && `Sale Type: ${f.saleType}`,
      f.facing && `Facing: ${f.facing}`,
      isAgri ? (f.acre || f.kunte) && `Covered Area: ${f.acre || 0} Acre ${f.kunte || 0} Kunte (${agriTotal} sqft)` : total && `Dimensions: ${f.len} x ${f.wid} ${f.unit === "Meters" ? "m" : "ft"} (${total} sqft)`,
      `City: ${f.city}`,
      `Address: ${f.address}`,
      f.landmark && `Landmark: ${f.landmark}`,
      f.bedrooms && `Bedrooms: ${f.bedrooms}`,
      f.bathrooms && `Bathrooms: ${f.bathrooms}`,
      f.furnishing && `Furnishing: ${f.furnishing}`,
      f.floor && `Floor No.: ${f.floor}`,
      f.possession && `Possession Status: ${f.possession}`,
      f.diet && `Diet: ${f.diet}`,
      f.bachelor && `Bachelor Allowed: ${f.bachelor}`,
      f.seats && `No. of sites: ${f.seats}`,
      (homeLike || isPlot) && `Approval Authority: ${f.approval}`,
      homeLike && `RERA registered: ${f.rera}${f.rera === "Yes" ? ` (${f.reraNo})` : ""}`,
      f.amenities.length && `Amenities: ${f.amenities.join(", ")}`,
      `Price you expect: ₹${Number(f.price).toLocaleString("en-IN")}`,
      f.token && `Booking/Token Amount: ₹${Number(f.token).toLocaleString("en-IN")}`,
      f.nearby.length && `Nearby places: ${f.nearby.map((n) => `${n.name} (${n.category}${n.distance ? `, ${n.distance} km` : ""})`).join("; ")}`,
      "",
      `Posted by: ${f.name}, +91 ${f.phone.replace(/\D/g, "").slice(-10)}`,
      "I'll share photos in this chat.",
    ].filter(Boolean);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
    setSent(true);
  };

  return (
    <section className="section post">
      <div className="container post-grid">
        <Reveal className="post-card">
          {sent ? (
            <motion.div className="post-done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <motion.span className="post-done-icon" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}>
                <Icon name="check" size={44} strokeWidth={3} />
              </motion.span>
              <h2>Almost done!</h2>
              <p>
                Send the WhatsApp message that just opened and attach a few photos. The Thirty Forty team will publish your listing
                and you'll get enquiries straight to your phone.
              </p>
              <div className="post-done-actions">
                <a className="btn btn-yellow" href={SITE.playStore} target="_blank" rel="noopener noreferrer">
                  <Icon name="playFilled" size={18} /> Manage it in the app
                </a>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setF(EMPTY);
                    setStep(0);
                    setSent(false);
                  }}
                >
                  Post another
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={submit} noValidate>
              <ol className="steps-bar">
                {STEPS.map((s, i) => (
                  <li key={s} className={i === step ? "on" : i < step ? "done" : ""}>
                    <span>{i < step ? <Icon name="check" size={14} strokeWidth={3} /> : i + 1}</span>
                    {s}
                  </li>
                ))}
                <motion.i className="steps-fill" animate={{ scaleX: step / (STEPS.length - 1) }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
              </ol>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  {step === 0 && (
                    <>
                      <h2 className="pf-title">Add Property</h2>
                      <Choice label="I want to" required options={["Sell", "Rent/Lease", "PG"]} value={f.want} onChange={(want) => set({ want, property: "", sub: "", occupancy: [] })} />
                      {errors.want && <p className="form-error">{errors.want}</p>}
                      <Appear show={f.want === "Rent/Lease"}>
                        <Choice label="Type" options={["Rent", "Lease"]} value={f.lease} onChange={(lease) => set({ lease: lease || "Rent" })} />
                      </Appear>
                      <Appear show={!!f.want}>
                        <Choice
                          label="Property"
                          required
                          options={isPg ? ["Boys PG", "Girls PG", "Co-Living PG"] : ["Residential", "Commercial", "Agricultural Land"]}
                          value={f.property}
                          onChange={(property) => set({ property, sub: "" })}
                        />
                        {errors.property && <p className="form-error">{errors.property}</p>}
                      </Appear>
                      <Appear show={isRes}>
                        <Choice label="Residential Type" required options={RES_TYPES} value={f.sub} onChange={(sub) => set({ sub })} />
                      </Appear>
                      <Appear show={isCom}>
                        <Choice label="Commercial Type" required options={COM_TYPES} value={f.sub} onChange={(sub) => set({ sub })} />
                      </Appear>
                      <Appear show={isPg && !!f.property}>
                        <Choice label="Occupancy Type" required multi options={OCCUPANCY} value={f.occupancy} onChange={(occupancy) => set({ occupancy })} />
                        <Choice label="Food Provided" options={FOOD} value={f.food} onChange={(food) => set({ food })} />
                        <Choice label="Amenities" multi options={PG_AMENITIES} value={f.pgAmenities} onChange={(pgAmenities) => set({ pgAmenities })} />
                        <Choice label="Profession Type" multi options={PROFESSION} value={f.profession} onChange={(profession) => set({ profession })} />
                      </Appear>
                      {errors.sub && <p className="form-error">{errors.sub}</p>}

                      <Appear show={!!typeDone}>
                        {!isPg && <Choice label="Sale Type" options={SALE_TYPES} value={f.saleType} onChange={(saleType) => set({ saleType })} />}
                        <Choice label="Facing" options={FACINGS} value={f.facing} onChange={(facing) => set({ facing })} />

                        {isAgri ? (
                          <div className="pf-group">
                            <p className="pf-label">Covered Area</p>
                            <div className="pf-row">
                              <label className="field">
                                <span>Acre</span>
                                <input inputMode="decimal" {...input("acre")} placeholder="e.g. 2" />
                              </label>
                              <label className="field">
                                <span>Kunte / Gunta</span>
                                <input inputMode="decimal" {...input("kunte")} placeholder="e.g. 10" />
                              </label>
                            </div>
                            {agriTotal > 0 && (
                              <p className="pf-total">
                                Total Area (in sqft): <b>{agriTotal.toLocaleString("en-IN")}</b>
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="pf-group">
                            <p className="pf-label">Property Area</p>
                            <div className="mini-seg">
                              {["Feet", "Meters"].map((u) => (
                                <button key={u} type="button" className={f.unit === u ? "on" : ""} onClick={() => set({ unit: u })}>
                                  {u}
                                </button>
                              ))}
                            </div>
                            <div className="pf-row pf-dims">
                              <label className="field">
                                <span>Length</span>
                                <input inputMode="decimal" {...input("len")} placeholder={f.unit === "Feet" ? "ft (eg. 30)" : "m (eg. 9)"} />
                              </label>
                              <span className="pf-x">×</span>
                              <label className="field">
                                <span>Breadth</span>
                                <input inputMode="decimal" {...input("wid")} placeholder={f.unit === "Feet" ? "ft (eg. 40)" : "m (eg. 12)"} />
                              </label>
                            </div>
                            <AnimatePresence>
                              {total > 0 && (
                                <motion.p className="pf-total" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                  Total Area (in sqft): <b>{total.toLocaleString("en-IN")}</b>
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </Appear>

                      <div className="pf-group">
                        <p className="pf-label">Property Location</p>
                        <label className="field">
                          <span>Enter City*</span>
                          <input {...input("city")} placeholder="e.g. Mysore" autoComplete="address-level2" />
                          {errors.city && <em className="field-err">{errors.city}</em>}
                        </label>
                        <label className="field">
                          <span>Enter Full Address*</span>
                          <textarea rows={2} {...input("address")} placeholder="Door no., street, area" />
                          {errors.address && <em className="field-err">{errors.address}</em>}
                        </label>
                        <label className="field">
                          <span>Landmark</span>
                          <input {...input("landmark")} placeholder="e.g. Near TVS factory" />
                        </label>
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <h2 className="pf-title">{isPg ? f.property : f.sub || f.property} details</h2>
                      {homeLike && (
                        <>
                          <Choice label="Bedrooms" required options={BHK_OPTIONS.map((b) => b.label)} value={f.bedrooms} onChange={(bedrooms) => set({ bedrooms })} />
                          {errors.bedrooms && <p className="form-error">{errors.bedrooms}</p>}
                          {f.sub === "Flat" && <Choice label="Bathrooms" options={BATHROOMS.map(String)} value={f.bathrooms} onChange={(bathrooms) => set({ bathrooms })} />}
                        </>
                      )}
                      {isCom && f.sub === "Office Space" && (
                        <label className="field">
                          <span>No. of sites</span>
                          <input inputMode="numeric" {...input("seats")} />
                        </label>
                      )}
                      {(homeLike || isCom) && <Choice label="Furnishing" options={FURNISHING} value={f.furnishing} onChange={(furnishing) => set({ furnishing })} />}
                      {(homeLike || isCom) && (
                        <label className="field">
                          <span>Floor No.</span>
                          <input {...input("floor")} placeholder="Enter Floor Details" />
                        </label>
                      )}
                      {homeLike && <Choice label="Possession Status" options={POSSESSION} value={f.possession} onChange={(possession) => set({ possession })} />}
                      {homeLike && f.want === "Rent/Lease" && (
                        <>
                          <Choice label="Diet" options={DIET} value={f.diet} onChange={(diet) => set({ diet })} />
                          <Choice label="Bachelor Allowed" options={["Yes", "No"]} value={f.bachelor} onChange={(bachelor) => set({ bachelor })} />
                        </>
                      )}
                      {(homeLike || isPlot) && (
                        <Choice label="Approval Authority" options={[...APPROVAL_AUTHORITIES, "Others"]} value={f.approval} onChange={(approval) => set({ approval: approval || "Others" })} />
                      )}
                      {homeLike && (
                        <>
                          <Choice label="Is your property RERA registered?" options={["Yes", "No"]} value={f.rera} onChange={(rera) => set({ rera: rera || "No" })} />
                          <Appear show={f.rera === "Yes"}>
                            <label className="field">
                              <span>Enter RERA Number</span>
                              <input {...input("reraNo")} />
                              {errors.reraNo && <em className="field-err">{errors.reraNo}</em>}
                            </label>
                          </Appear>
                        </>
                      )}
                      {(homeLike || isCom) && <Choice label="Amenities" multi options={AMENITIES} value={f.amenities} onChange={(amenities) => set({ amenities })} />}

                      <div className="pf-group">
                        <label className="field">
                          <span>Price you expect*</span>
                          <div className="field-prefix">
                            <em>₹</em>
                            <input inputMode="numeric" value={f.price} onChange={(e) => set({ price: e.target.value.replace(/\D/g, "") })} />
                          </div>
                          <small className="pf-words">{inWords(f.price)}</small>
                          {errors.price && <em className="field-err">{errors.price}</em>}
                        </label>
                        <label className="field">
                          <span>Booking/Token Amount</span>
                          <div className="field-prefix">
                            <em>₹</em>
                            <input inputMode="numeric" value={f.token} onChange={(e) => set({ token: e.target.value.replace(/\D/g, "") })} placeholder="500" />
                          </div>
                        </label>
                      </div>

                      <div className="pf-group">
                        <p className="pf-label">Nearby places (optional)</p>
                        {f.nearby.length > 0 && (
                          <ul className="pf-near">
                            {f.nearby.map((n, i) => (
                              <motion.li key={n.name + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                <Icon name="compass" size={16} />
                                <span>
                                  <b>{n.name}</b> {n.category}
                                  {n.distance && ` • ${n.distance} KM`}
                                </span>
                                <button type="button" aria-label={`Remove ${n.name}`} onClick={() => set({ nearby: f.nearby.filter((_, j) => j !== i) })}>
                                  <Icon name="close" size={14} />
                                </button>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                        <div className="pf-near-add">
                          <select value={place.category} onChange={(e) => setPlace((p) => ({ ...p, category: e.target.value }))} aria-label="Category">
                            {NEARBY_CATEGORIES.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                          <input value={place.name} onChange={(e) => setPlace((p) => ({ ...p, name: e.target.value }))} placeholder="Place Name (e.g., Green Line Metro)" aria-label="Place name" />
                          <input value={place.distance} onChange={(e) => setPlace((p) => ({ ...p, distance: e.target.value }))} inputMode="decimal" placeholder="Distance in km (e.g., 1.2)" aria-label="Distance in km" />
                          <button type="button" className="btn btn-outline" onClick={addPlace}>
                            <Icon name="plus" size={16} /> Add Place
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <h2 className="pf-title">Publish</h2>
                      <div className="pf-photos">
                        <Icon name="image" size={30} />
                        <div>
                          <b>Photos</b>
                          <p>Photos are optional. After you tap Send, attach them in the WhatsApp chat — or post from the app to upload them yourself.</p>
                        </div>
                      </div>
                      <label className="field">
                        <span>Your name</span>
                        <input {...input("name")} autoComplete="name" />
                        {errors.name && <em className="field-err">{errors.name}</em>}
                      </label>
                      <label className="field">
                        <span>Phone Number</span>
                        <div className="field-prefix">
                          <em>+91</em>
                          <input {...input("phone")} inputMode="tel" autoComplete="tel-national" placeholder="Enter your number" />
                        </div>
                        {errors.phone && <em className="field-err">{errors.phone}</em>}
                      </label>
                      <p className="muted pf-terms">By continuing you agree to our Terms &amp; Privacy Policy.</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="post-actions">
                {step > 0 && (
                  <button type="button" className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>
                    <Icon name="back" size={18} /> Back
                  </button>
                )}
                {step < 2 ? (
                  <button type="button" className="btn btn-green" onClick={next}>
                    Next <Icon name="arrow" size={18} />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-enquire">
                    <WhatsAppIcon /> Send to Thirty Forty
                  </button>
                )}
              </div>
            </form>
          )}
        </Reveal>

        <aside className="post-aside">
          <Reveal delay={0.1} className="post-app">
            <img src="/brand/logo-light.png" alt="" />
            <h3>Fastest way: post in the app</h3>
            <p>Upload photos, pick the location on a map, edit anytime and see every enquiry in your Dashboard.</p>
            <a className="btn btn-yellow btn-block" href={SITE.playStore} target="_blank" rel="noopener noreferrer">
              <Icon name="playFilled" size={18} /> Get it on Google Play
            </a>
          </Reveal>
          <Reveal delay={0.15}>
            <h3>Why post on Thirty Forty</h3>
            <ul>
              {[
                ["sparkle", "Posting is free"],
                ["bell", "Instant notification for every enquiry"],
                ["chat", "Buyers and tenants reach you on WhatsApp"],
                ["dashboard", "Manage listings from your Dashboard"],
                ["crown", "Go Premium for top placement"],
              ].map(([icon, t]) => (
                <li key={t}>
                  <span className="why-icon sm">
                    <Icon name={icon} size={20} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </aside>
      </div>
    </section>
  );
}
