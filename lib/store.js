"use client";
import { useSyncExternalStore } from "react";

// Favourites kept in this browser only. Each list is one localStorage key; every component using it
// re-renders when it changes (including from another tab).
const EMPTY = [];
const stores = {};

function store(key) {
  if (stores[key]) return stores[key];
  const listeners = new Set();
  let cache = null;
  const s = {
    read() {
      if (cache) return cache;
      try {
        cache = JSON.parse(localStorage.getItem(key) || "[]");
        if (!Array.isArray(cache)) cache = [];
      } catch {
        cache = [];
      }
      return cache;
    },
    write(list) {
      cache = list;
      try {
        localStorage.setItem(key, JSON.stringify(list));
      } catch {}
      listeners.forEach((l) => l());
    },
    subscribe(l) {
      listeners.add(l);
      const onStorage = (e) => {
        if (e.key === key) {
          cache = null;
          l();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(l);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
  stores[key] = s;
  return s;
}

function useList(key) {
  const s = store(key);
  const list = useSyncExternalStore(s.subscribe, s.read, () => EMPTY);
  return [list, s.write];
}

export function useShortlist() {
  const [ids, write] = useList("3040:favourites");
  return {
    ids,
    has: (id) => ids.includes(id),
    toggle: (id) => write(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
  };
}

