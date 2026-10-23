"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";
import Reveal from "./Reveal";
import RequireLogin from "./RequireLogin";
import { getUser, updateUser } from "@/lib/appApi";
import { signOut, updateSession } from "@/lib/session";

const GENDERS = ["Male", "Female", "Other"];
const PROFESSIONS = ["Salaried", "Business Owner", "Freelancer", "Student", "Unemployed", "Retired", "Self Employed", "Other"];

// The app's Profile tab
const MENU = [
  { href: "/dashboard", icon: "dashboard", label: "My Property List", sub: "Your listings and the enquiries they got" },
  { href: "/enquiries", icon: "chat", label: "My Enquiries", sub: "Properties you have enquired about" },
  { href: "/notifications", icon: "bell", label: "Notifications", sub: "New enquiries and updates" },
  { href: "/favourites", icon: "heart", label: "Favorite", sub: "Properties you have saved" },
  { href: "/post-property", icon: "upload", label: "Post Property", sub: "List your property free" },
  { href: "/premium", icon: "crown", label: "Subscriptions", sub: "Go Premium for ₹199/month" },
  { href: "/help", icon: "help", label: "Help & Support", sub: "Email, call or WhatsApp us" },
  { href: "/privacy-policy", icon: "lock", label: "Privacy Policy", sub: "How we use your data" },
  { href: "/terms-and-conditions", icon: "doc", label: "Terms & Conditions", sub: "Rules for using Thirty Forty" },
  { href: "/refund-policy", icon: "rupee", label: "Refund Policy", sub: "Subscriptions and refunds" },
];

function EditProfile({ user, onDone }) {
  const [f, setF] = useState({ userName: user.userName, email: user.email, gender: "", professional: "", socialmedialink: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  // Load the rest of the profile the app keeps (gender, profession, link)
  useEffect(() => {
    getUser(user.id)
      .then((u) =>
        setF((s) => ({
          ...s,
          userName: u.userName || s.userName,
          email: u.email || s.email,
          gender: u.gender || "",
          professional: u.professional || "",
          socialmedialink: u.socialmedialink || "",
        }))
      )
      .catch(() => {});
  }, [user.id]);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (!f.userName.trim()) return setError("Please enter your name.");
    setBusy(true);
    try {
      await updateUser(user.id, { ...f, userName: f.userName.trim(), phonenumber: user.phone });
      updateSession({ userName: f.userName.trim(), email: f.email });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.form className="acct-edit" onSubmit={save} noValidate initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
      <div className="pf-row">
        <label className="field">
          <span>Name</span>
          <input value={f.userName} onChange={set("userName")} autoComplete="name" />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={f.email} onChange={set("email")} type="email" autoComplete="email" />
        </label>
        <label className="field">
          <span>Phone Number</span>
          <input value={`+91 ${user.phone}`} disabled />
        </label>
        <label className="field">
          <span>Gender</span>
          <select value={f.gender} onChange={set("gender")}>
            <option value="">Select</option>
            {GENDERS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Profession</span>
          <select value={f.professional} onChange={set("professional")}>
            <option value="">Select</option>
            {PROFESSIONS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Social Media Link</span>
          <input value={f.socialmedialink} onChange={set("socialmedialink")} placeholder="https://" />
        </label>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="acct-edit-actions">
        <button type="button" className="btn btn-outline" onClick={onDone}>
          Cancel
        </button>
        <button className="btn btn-green" disabled={busy}>
          {busy ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </motion.form>
  );
}

export default function AccountView() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  return (
    <RequireLogin title="Your Thirty Forty account" text="Log in to see your profile, properties, enquiries and notifications.">
      {(user) => (
        <section className="section acct">
          <div className="container">
            <Reveal className="acct-card">
              <span className="acct-avatar">{(user.userName || "U").charAt(0).toUpperCase()}</span>
              <div className="acct-who">
                <h2>{user.userName || "User"}</h2>
                <p>
                  +91 {user.phone}
                  {user.email && ` · ${user.email}`}
                </p>
              </div>
              {!editing && (
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                  <Icon name="user" size={16} /> Edit Profile
                </button>
              )}
            </Reveal>
            <AnimatePresence>{editing && <EditProfile user={user} onDone={() => setEditing(false)} />}</AnimatePresence>

            <div className="help-menu acct-menu">
              {MENU.map((m, i) => (
                <Reveal key={m.href} delay={(i % 3) * 0.05}>
                  <Link href={m.href} className="help-item">
                    <span className="why-icon sm">
                      <Icon name={m.icon} size={20} />
                    </span>
                    <span>
                      <b>{m.label}</b>
                      <small>{m.sub}</small>
                    </span>
                    <Icon name="arrow" size={18} />
                  </Link>
                </Reveal>
              ))}
              <Reveal delay={0.1}>
                <button
                  className="help-item acct-logout"
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                >
                  <span className="why-icon sm">
                    <Icon name="back" size={20} />
                  </span>
                  <span>
                    <b>Logout</b>
                    <small>Sign out of this browser</small>
                  </span>
                </button>
              </Reveal>
            </div>
          </div>
        </section>
      )}
    </RequireLogin>
  );
}
