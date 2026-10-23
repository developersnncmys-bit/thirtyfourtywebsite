"use client";
import { useEffect, useSyncExternalStore } from "react";
import { toggleFavorite, fetchFavoriteIds } from "./appApi";
import { useSession } from "./session";

// Favourites. Kept in this browser so the heart works for everyone, and synced
// with the app's /favorites API once you're logged in — so the same
// properties show in the app's Favorite tab.
const KEY = "3040:favourites";
const EMPTY = [];
const listeners = new Set();
let cache = null;

function read() {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(cache)) cache = [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(list) {
  cache = list;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l) {
  listeners.add(l);
  const onStorage = (e) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useShortlist() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);
  const user = useSession();
  return {
    ids,
    has: (id) => ids.includes(id),
    toggle: (id) => {
      const on = ids.includes(id);
      write(on ? ids.filter((x) => x !== id) : [...ids, id]);
      if (user?.id) {
        // Same call as the app's heart button; undo locally if it fails
        toggleFavorite({ customerId: user.id, customerName: user.userName, propertyId: id }).catch(() => {
          const now = read();
          write(on ? [...now, id] : now.filter((x) => x !== id));
        });
      }
    },
  };
}

// Mounted once in the layout: after login, merge this browser's hearts into
// the account and load the account's favourites from the app
export function FavouritesSync() {
  const user = useSession();
  useEffect(() => {
    if (!user?.id) return;
    let alive = true;
    (async () => {
      const server = await fetchFavoriteIds(user.id);
      const local = read();
      const missing = local.filter((id) => !server.includes(id));
      for (const id of missing) {
        try {
          await toggleFavorite({ customerId: user.id, customerName: user.userName, propertyId: id });
        } catch {}
      }
      if (alive) write([...new Set([...server, ...local])]);
    })();
    return () => {
      alive = false;
    };
  }, [user?.id, user?.userName]);
  return null;
}
