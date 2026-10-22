"use client";
import { useState } from "react";
import { WhatsAppIcon } from "./Icon";
import { whatsappLink } from "@/lib/site";

// Builder enquiry: pick the unit you're interested in, send on WhatsApp
export default function ProjectEnquiry({ name, builder, configs }) {
  const [form, setForm] = useState({ name: "", phone: "", unit: configs[0] });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "").slice(-10))) return setError("Enter a valid 10-digit mobile number.");
    setError("");
    const text = `Hi, I'm interested in ${form.unit} at ${name} (${builder}) on 30Forty. Please share the price sheet and brochure.\n\nName: ${form.name}\nPhone: ${form.phone}`;
    window.open(whatsappLink(text), "_blank", "noopener");
  };

  return (
    <form className="pv-card pv-lead" onSubmit={submit} noValidate>
      <h3>Get price sheet & brochure</h3>
      <p className="muted">Direct from {builder} — no brokerage.</p>
      <label className="field">
        <span>Interested in</span>
        <select value={form.unit} onChange={set("unit")}>
          {configs.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Your name</span>
        <input value={form.name} onChange={set("name")} autoComplete="name" />
      </label>
      <label className="field">
        <span>Mobile number</span>
        <input value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-enquire btn-block" type="submit">
        <WhatsAppIcon /> Request details
      </button>
    </form>
  );
}
