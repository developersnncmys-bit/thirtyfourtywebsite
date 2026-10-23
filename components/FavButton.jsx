"use client";
import { motion } from "framer-motion";
import Icon from "./Icon";
import { useShortlist as useFavourites } from "@/lib/store";

export default function FavButton({ id, className = "" }) {
  const { has, toggle } = useFavourites();
  const on = has(id);
  return (
    <motion.button
      type="button"
      className={`fav-btn ${on ? "on" : ""} ${className}`}
      aria-label={on ? "Remove from saved" : "Save property"}
      aria-pressed={on}
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
    >
      <motion.span
        key={String(on)}
        initial={{ scale: on ? 0.4 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <Icon name={on ? "heartFilled" : "heart"} size={20} />
      </motion.span>
    </motion.button>
  );
}
