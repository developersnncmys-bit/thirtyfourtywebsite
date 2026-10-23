"use client";
import { useSyncExternalStore } from "react";

// The signed-in user, kept in this browser like the app keeps it in
// SharedPreferences: { id, userName, phone, email }
const KEY = "3040:user";
const listeners = new Set();
let cache;

function read() {
  if (cache !== undefined) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    cache = null;
  }
  return cache;
}

function write(user) {
  cache = user;
  try {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l) {
  listeners.add(l);
  const onStorage = (e) => {
    if (e.key === KEY) {
      cache = undefined;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSession() {
  return useSyncExternalStore(subscribe, read, () => null);
}

// Server user object (from /verify-otp or /userbyid) → session
export function signIn(u, phoneFallback = "") {
  write({
    id: String(u?._id || u?.id || ""),
    userName: String(u?.userName || ""),
    phone: String(u?.phonenumber || phoneFallback || ""),
    email: String(u?.email || ""),
  });
}

export const updateSession = (patch) => write({ ...read(), ...patch });
export const signOut = () => write(null);

// Where to send someone who must log in first
export const loginHref = (next) => `/login?next=${encodeURIComponent(next || "/")}`;
