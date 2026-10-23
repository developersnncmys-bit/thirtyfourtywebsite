"use client";
import { useSyncExternalStore } from "react";

// The city picked in the header ("All India ▾" on 99acres). Kept in this
// browser only; "" means every city.
const KEY = "3040:city";
const listeners = new Set();

function read() {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function setCity(city) {
  try {
    if (city) localStorage.setItem(KEY, city);
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

export function useCity() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => ""
  );
}
