"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";
import RequireLogin from "./RequireLogin";
import { fetchNotifications, deleteNotifications } from "@/lib/appApi";
import { timeAgo } from "@/lib/format";

function Inbox({ user }) {
  const [items, setItems] = useState(null);
  const [picked, setPicked] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchNotifications(user.id)
      .then(setItems)
      .catch((err) => setError(err.message));
  }, [user.id]);

  const remove = async () => {
    setBusy(true);
    setError("");
    try {
      await deleteNotifications(user.id, picked);
      setItems((xs) => xs.filter((n) => !picked.includes(n.id)));
      setPicked([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!items && !error) return <div className="loading-rows" aria-busy="true"><span /><span /></div>;
  if (items && !items.length)
    return (
      <div className="empty">
        <span className="empty-icon">
          <Icon name="bell" size={32} />
        </span>
        <h3>You&apos;re all caught up</h3>
        <p>New enquiries on your properties and updates from Thirty Forty show up here.</p>
      </div>
    );

  return (
    <>
      <AnimatePresence>
        {picked.length > 0 && (
          <motion.div className="notif-bar" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <b>{picked.length} selected</b>
            <span className="muted">This can&apos;t be undone.</span>
            <button className="link-btn" onClick={() => setPicked([])}>
              Cancel
            </button>
            <button className="btn btn-sm dash-del solid" onClick={remove} disabled={busy}>
              {busy ? "Deleting…" : "Delete"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="form-error">{error}</p>}
      <ul className="notif-list">
        <AnimatePresence>
          {(items || []).map((n, i) => {
            const on = picked.includes(n.id);
            return (
              <motion.li key={n.id} className={on ? "on" : ""} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }} exit={{ opacity: 0, x: -40 }}>
                <label className="notif-check">
                  <input type="checkbox" checked={on} onChange={() => setPicked((s) => (on ? s.filter((x) => x !== n.id) : [...s, n.id]))} aria-label="Select" />
                  <span />
                </label>
                <span className="notif-icon">
                  <Icon name="bell" size={18} />
                </span>
                <span className="notif-text">
                  <b>{n.title}</b>
                  <span>{n.body}</span>
                  <small>{timeAgo(n.createdAt)}</small>
                </span>
                {n.propertyId && (
                  <Link href={`/property/${n.propertyId}`} className="notif-go" aria-label="Open property">
                    <Icon name="arrow" size={18} />
                  </Link>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </>
  );
}

export default function NotificationsList() {
  return (
    <RequireLogin title="Login to see notifications" text="Enquiries on your properties and updates from Thirty Forty.">
      {(user) => (
        <section className="section">
          <div className="container notif-wrap">
            <Inbox user={user} />
          </div>
        </section>
      )}
    </RequireLogin>
  );
}
