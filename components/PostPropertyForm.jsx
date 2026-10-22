"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon, { WhatsAppIcon } from "./Icon";
import Reveal from "./Reveal";
import { TYPES } from "@/lib/data";
import { SITE, whatsappLink } from "@/lib/site";

const STEPS = ["Basics", "Details", "Contact"];
const FACING = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const FURNISHING = ["Unfurnished", "Semi-Furnished", "Furnished"];

const EMPTY = {
  listing: "Sell",
  type: "flat",
  title: "",
  locality: "",
  price: "",
  area: "",
  dimensions: "",
  beds: "",
  baths: "",
  facing: "",
  furnishing: "",
  name: "",
  phone: "",
  notes: "",
};

// There's no web backend yet, so the finished listing is sent to the
// 30Forty team on WhatsApp. Photos are added in the app.
export default function PostPropertyForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.title.trim()) e.title = "Give your listing a title";
      if (!form.locality.trim()) e.locality = "Enter the locality";
    }
    if (s === 1) {
      if (!(Number(form.price) > 0)) e.price = "Enter a price in rupees";
      if (!(Number(form.area) > 0)) e.area = "Enter the area";
    }
    if (s === 2) {
      if (!form.name.trim()) e.name = "Enter your name";
      if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "").slice(-10))) e.phone = "Enter a valid 10-digit mobile number";
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => validate(step) && setStep((s) => s + 1);

  const submit = (e) => {
    e.preventDefault();
    if (!validate(2)) return;
    const type = TYPES.find((t) => t.id === form.type)?.label;
    const lines = [
      "New property listing from the 30Forty website",
      "",
      `Listing for: ${form.listing}`,
      `Type: ${type}`,
      `Title: ${form.title}`,
      `Locality: ${form.locality}`,
      `Price: ₹${Number(form.price).toLocaleString("en-IN")}${form.listing === "Sell" ? "" : "/month"}`,
      `Area: ${form.area} sqft`,
      form.dimensions ? `Dimensions: ${form.dimensions}` : null,
      form.beds ? `Bedrooms: ${form.beds}` : null,
      form.baths ? `Bathrooms: ${form.baths}` : null,
      form.facing ? `Facing: ${form.facing}` : null,
      form.furnishing ? `Furnishing: ${form.furnishing}` : null,
      form.notes ? `Notes: ${form.notes}` : null,
      "",
      `Owner: ${form.name}, ${form.phone}`,
    ].filter((l) => l !== null);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
    setSent(true);
  };

  const field = (k, label, props = {}) => (
    <label className={`field ${errors[k] ? "has-error" : ""}`}>
      <span>{label}</span>
      <input value={form[k]} onChange={set(k)} {...props} />
      {errors[k] && <small>{errors[k]}</small>}
    </label>
  );

  return (
    <section className="section post">
      <div className="container post-grid">
        <Reveal className="post-card">
          {sent ? (
            <motion.div className="post-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <span className="done-icon">
                <Icon name="check" size={40} strokeWidth={2.6} />
              </span>
              <h2>Almost done!</h2>
              <p>
                Send the WhatsApp message that just opened and our team will publish your listing. Add photos anytime from
                the 30Forty app.
              </p>
              <div className="post-done-actions">
                <a className="btn btn-green" href={SITE.playStore} target="_blank" rel="noopener noreferrer">
                  <Icon name="playFilled" size={18} /> Get the app
                </a>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setForm(EMPTY);
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
              <ol className="stepper">
                {STEPS.map((s, i) => (
                  <li key={s} className={i === step ? "on" : i < step ? "done" : ""}>
                    <span>{i < step ? <Icon name="check" size={14} strokeWidth={3} /> : i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="post-step"
                >
                  {step === 0 && (
                    <>
                      <h3 className="filter-title">I want to</h3>
                      <div className="seg seg-3">
                        {["Sell", "Rent", "PG"].map((m) => (
                          <button type="button" key={m} className={form.listing === m ? "on" : ""} onClick={() => set("listing")(m)}>
                            {form.listing === m && <motion.span layoutId="post-seg" className="seg-pill" />}
                            <span>{m.toUpperCase()}</span>
                          </button>
                        ))}
                      </div>
                      <h3 className="filter-title">Property Type</h3>
                      <div className="chips">
                        {TYPES.map((t) => (
                          <button type="button" key={t.id} className={`chip ${form.type === t.id ? "on" : ""}`} onClick={() => set("type")(t.id)}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                      {field("title", "Listing title", { placeholder: "e.g. 3BHK flat near Ring Road" })}
                      {field("locality", "Locality", { placeholder: "e.g. Vijayanagar, Mysuru" })}
                    </>
                  )}

                  {step === 1 && (
                    <div className="field-grid">
                      {field("price", form.listing === "Sell" ? "Expected price (₹)" : "Monthly rent (₹)", { inputMode: "numeric", placeholder: "e.g. 4500000" })}
                      {field("area", "Area (sqft)", { inputMode: "numeric", placeholder: "e.g. 1200" })}
                      {field("dimensions", "Dimensions", { placeholder: "e.g. 30 x 40" })}
                      {field("beds", "Bedrooms", { inputMode: "numeric", placeholder: "e.g. 3" })}
                      {field("baths", "Bathrooms", { inputMode: "numeric", placeholder: "e.g. 2" })}
                      <label className="field">
                        <span>Facing</span>
                        <select value={form.facing} onChange={set("facing")}>
                          <option value="">Select</option>
                          {FACING.map((f) => (
                            <option key={f}>{f}</option>
                          ))}
                        </select>
                      </label>
                      <label className="field span-2">
                        <span>Furnishing</span>
                        <select value={form.furnishing} onChange={set("furnishing")}>
                          <option value="">Select</option>
                          {FURNISHING.map((f) => (
                            <option key={f}>{f}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}

                  {step === 2 && (
                    <>
                      {field("name", "Your name", { autoComplete: "name" })}
                      {field("phone", "Mobile number", { inputMode: "tel", autoComplete: "tel", placeholder: "10-digit mobile number" })}
                      <label className="field">
                        <span>Anything else? (optional)</span>
                        <textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Amenities, landmark, best time to call…" />
                      </label>
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
                    Continue <Icon name="arrow" size={18} />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-enquire">
                    <WhatsAppIcon /> Send listing
                  </button>
                )}
              </div>
            </form>
          )}
        </Reveal>

        <aside className="post-aside">
          <Reveal delay={0.1}>
            <h3>Why owners choose 30Forty</h3>
            <ul>
              {[
                ["sparkle", "Free, unlimited listings"],
                ["shield", "Zero brokerage — keep 100%"],
                ["bell", "Instant alert for every enquiry"],
                ["chat", "Buyers reach you on WhatsApp"],
                ["camera", "Add photos from the app"],
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
