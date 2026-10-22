"use client";
import { useState } from "react";
import { WhatsAppIcon } from "./Icon";
import { whatsappLink } from "@/lib/site";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", message: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return setError("Please fill in your name and message.");
    setError("");
    window.open(whatsappLink(`Hi, I'm ${form.name}.\n\n${form.message}`), "_blank", "noopener");
  };

  return (
    <form className="post-card contact-form" onSubmit={submit} noValidate>
      <h2>Send us a message</h2>
      <label className="field">
        <span>Your name</span>
        <input value={form.name} onChange={set("name")} autoComplete="name" />
      </label>
      <label className="field">
        <span>Message</span>
        <textarea rows={5} value={form.message} onChange={set("message")} placeholder="How can we help?" />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-enquire btn-block" type="submit">
        <WhatsAppIcon /> Send on WhatsApp
      </button>
    </form>
  );
}
