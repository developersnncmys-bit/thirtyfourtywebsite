"use client";
import { useSyncExternalStore } from "react";

// Saved properties live in this browser only (like the heart in the app before login)
const KEY = "3040:favourites";
const listeners = new Set();
let cache = null;

function read() {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    cache = [];
  }
  return cache;
}

function write(ids) {
  cache = ids;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {}
  listeners.forEach((l) => l());
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const EMPTY = [];

export function useFavourites() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = (id) => write(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  return { ids, toggle, has: (id) => ids.includes(id) };
}
