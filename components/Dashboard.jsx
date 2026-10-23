"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Icon, { WhatsAppIcon } from "./Icon";
import PropertyImage from "./PropertyImage";
import RequireLogin from "./RequireLogin";
import { ownerDashboard, deleteProperty, refreshListings } from "@/lib/appApi";
import { normalize } from "@/lib/normalize";
import { priceLabel, formatDate } from "@/lib/format";
import { whatsappLink } from "@/lib/site";

const APPROVAL = { pending: "Waiting for approval", rejected: "Not approved", approved: "Live" };

function Listing({ item, user, onDeleted }) {
  const p = normalize(item.property);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const n = item.users.length;

  const remove = async () => {
    setBusy(true);
    setError("");
    try {
      await deleteProperty(p.id, user.id);
      refreshListings();
      onDeleted(p.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <motion.article layout className="dash-item" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -60 }}>
      <div className="dash-main">
        <Link href={`/property/${p.id}`} className="dash-img">
          <PropertyImage p={p} />
        </Link>
        <div className="dash-info">
          <span className={`dash-approval ap-${p.approval_status || "approved"}`}>{APPROVAL[p.approval_status] || "Live"}</span>
          <Link href={`/property/${p.id}`}>
            <h3>{p.title}</h3>
          </Link>
          <p className="dash-price">{priceLabel(p)}</p>
          <small className="muted">Posted on {formatDate(p.postedOn)}</small>
        </div>
        <div className="dash-actions">
          <button className={`dash-count ${n ? "has" : ""}`} onClick={() => n && setOpen((o) => !o)} aria-expanded={open}>
            <Icon name="chat" size={16} />
            {n ? `${n} ${n === 1 ? "Enquiry" : "Enquiries"}` : "No enquiries yet"}
            {n > 0 && <Icon name="chevron" size={14} style={{ transform: open ? "rotate(180deg)" : "none" }} />}
          </button>
          <Link href={`/post-property?edit=${p.id}`} className="btn btn-outline btn-sm">
            <Icon name="doc" size={15} /> Edit
          </Link>
          <button className="btn btn-sm dash-del" onClick={() => setConfirm(true)}>
            <Icon name="close" size={15} /> Delete
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul className="dash-users" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {item.users.map((u) => (
              <li key={u.enquiryId || u.userId}>
                <span className="pcard-avatar">{(u.userName || "U").charAt(0).toUpperCase()}</span>
                <span className="dash-user">
                  <b>{u.userName || "Thirty Forty user"}</b>
                  <small>+91 {String(u.phoneNumber || "").slice(-10)}</small>
                  {u.message && <em>“{u.message}”</em>}
                </span>
                <a className="call-round sm" href={`tel:+91${String(u.phoneNumber || "").slice(-10)}`} aria-label={`Call ${u.userName}`}>
                  <Icon name="phone" size={16} />
                </a>
                <a
                  className="call-round sm wa"
                  href={whatsappLink(`Hi ${u.userName}, thanks for your enquiry about my ${p.title} on Thirty Forty.`, `91${String(u.phoneNumber || "").slice(-10)}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp ${u.userName}`}
                >
                  <WhatsAppIcon size={16} />
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirm && (
          <motion.div className="dash-confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <p>
              <b>Delete property?</b> This will permanently remove this property and all its enquiries. This can&apos;t be undone.
            </p>
            {error && <p className="form-error">{error}</p>}
            <div>
              <button className="btn btn-outline btn-sm" onClick={() => setConfirm(false)} disabled={busy}>
                Cancel
              </button>
              <button className="btn btn-sm dash-del solid" onClick={remove} disabled={busy}>
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function Board({ user }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const load = useCallback(() => {
    ownerDashboard(user.id)
      .then((list) => setItems(list.filter((x) => x.property?._id)))
      .catch((err) => setError(err.message));
  }, [user.id]);
  useEffect(load, [load]);

  if (error) return <p className="form-error">{error}</p>;
  if (!items) return <div className="loading-rows" aria-busy="true"><span /><span /></div>;
  if (!items.length)
    return (
      <div className="empty">
        <span className="empty-icon">
          <Icon name="dashboard" size={32} />
        </span>
        <h3>Your dashboard is empty</h3>
        <p>
          The dashboard is where you manage the properties you list and review the enquiries buyers and tenants send you. Upload your
          first property to start receiving enquiries.
        </p>
        <Link href="/post-property" className="btn btn-green">
          Upload property
        </Link>
      </div>
    );
  const total = items.reduce((s, x) => s + x.users.length, 0);
  return (
    <>
      <div className="dash-stats">
        <span>
          <b>{items.length}</b> {items.length === 1 ? "property" : "properties"}
        </span>
        <span>
          <b>{total}</b> {total === 1 ? "enquiry" : "enquiries"}
        </span>
        <Link href="/post-property" className="btn btn-green btn-sm">
          <Icon name="plus" size={16} /> Post another
        </Link>
      </div>
      <div className="dash-list">
        <AnimatePresence>
          {items.map((item) => (
            <Listing key={item.property._id} item={item} user={user} onDeleted={(id) => setItems((xs) => xs.filter((x) => x.property._id !== id))} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

// The app's Dashboard / My Property List
export default function Dashboard() {
  return (
    <RequireLogin title="Login to manage your properties" text="See your listings and everyone who enquired — the same Dashboard as the app.">
      {(user) => (
        <section className="section">
          <div className="container">
            <Board user={user} />
          </div>
        </section>
      )}
    </RequireLogin>
  );
}
