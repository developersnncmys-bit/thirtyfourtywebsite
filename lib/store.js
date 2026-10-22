"use client";
import { useSyncExternalStore } from "react";

// Small lists kept in this browser only: shortlist, compare, recently viewed,
// saved searches. Each list is one localStorage key; every component using it
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

export const COMPARE_MAX = 4;

export function useCompare() {
  const [ids, write] = useList("3040:compare");
  return {
    ids,
    has: (id) => ids.includes(id),
    full: ids.length >= COMPARE_MAX,
    toggle: (id) => {
      if (ids.includes(id)) write(ids.filter((x) => x !== id));
      else if (ids.length < COMPARE_MAX) write([...ids, id]);
    },
    remove: (id) => write(ids.filter((x) => x !== id)),
    clear: () => write([]),
  };
}

export function useRecent() {
  const [ids, write] = useList("3040:recent");
  return {
    ids,
    add: (id) => write([id, ...ids.filter((x) => x !== id)].slice(0, 12)),
    clear: () => write([]),
  };
}

// A saved search is the query string of the search page plus a readable label
export function useSavedSearches() {
  const [list, write] = useList("3040:searches");
  return {
    list,
    has: (query) => list.some((s) => s.query === query),
    save: (query, label) => !list.some((s) => s.query === query) && write([{ query, label, at: Date.now() }, ...list].slice(0, 20)),
    remove: (query) => write(list.filter((s) => s.query !== query)),
  };
}
