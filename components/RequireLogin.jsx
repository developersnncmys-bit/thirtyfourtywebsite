"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { useSession, loginHref } from "@/lib/session";

// Wraps pages that need an account, like the app (everything after /auth)
export default function RequireLogin({ children, title = "Login to continue", text = "Use your phone number — we'll send you an OTP." }) {
  const user = useSession();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) return <div className="section container gate-wait" aria-busy="true" />;
  if (user?.id) return children(user);
  return (
    <section className="section">
      <div className="container">
        <div className="empty gate">
          <span className="empty-icon">
            <Icon name="lock" size={32} />
          </span>
          <h3>{title}</h3>
          <p>{text}</p>
          <Link href={loginHref(typeof window !== "undefined" ? location.pathname + location.search : pathname)} className="btn btn-green">
            Login / Sign up
          </Link>
        </div>
      </div>
    </section>
  );
}
