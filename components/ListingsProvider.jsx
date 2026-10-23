"use client";
import { createContext, useContext } from "react";

// Every live listing, loaded once on the server and shared with the
// browser-only parts of the site (favourites, recently viewed).
const Ctx = createContext([]);

export default function ListingsProvider({ listings, children }) {
  return <Ctx.Provider value={listings}>{children}</Ctx.Provider>;
}

export const useListings = () => useContext(Ctx);
