"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import PropertyCard from "./PropertyCard";
import RequireLogin from "./RequireLogin";
import { myEnquiries } from "@/lib/appApi";
import { normalize } from "@/lib/normalize";

const STATUS = { pending: "Pending", accept: "Accepted", reject: "Declined" };

function List({ user }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    myEnquiries(user.id)
      .then((list) => setItems(list.filter((e) => e.property?._id).map((e) => ({ ...e, p: normalize(e.property) }))))
      .catch((err) => setError(err.message));
  }, [user.id]);

  if (error) return <p className="form-error">{error}</p>;
  if (!items) return <div className="loading-rows" aria-busy="true"><span /><span /></div>;
  if (!items.length)
    return (
      <div className="empty">
        <span className="empty-icon">
          <Icon name="chat" size={32} />
        </span>
        <h3>No enquiries found</h3>
        <p>Tap Enquire Now on any property and it will show up here.</p>
        <Link href="/properties" className="btn btn-green">
          Explore properties
        </Link>
      </div>
    );
  return (
    <div className="row-list">
      {items.map((e, i) => (
        <div key={e.id} className="enq-wrap">
          <span className={`enq-status st-${e.status}`}>{STATUS[e.status] || e.status}</span>
          <PropertyCard p={e.p} index={i} row />
        </div>
      ))}
    </div>
  );
}

// The app's "Enquiries" screen: properties you enquired about
export default function MyEnquiries() {
  return (
    <RequireLogin title="Login to see your enquiries" text="Every property you enquire about is listed here — on the website and in the app.">
      {(user) => (
        <section className="section">
          <div className="container">
            <List user={user} />
          </div>
        </section>
      )}
    </RequireLogin>
  );
}
