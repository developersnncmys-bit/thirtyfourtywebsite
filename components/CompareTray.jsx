"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";
import { useCompare, COMPARE_MAX } from "@/lib/store";
import { PROPERTIES } from "@/lib/data";

// Floating bar that appears once something is added to compare
export default function CompareTray() {
  const { ids, remove, clear } = useCompare();
  const pathname = usePathname();
  const items = ids.map((id) => PROPERTIES.find((p) => p.id === id)).filter(Boolean);
  const show = items.length > 0 && pathname !== "/compare";

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          className="cmp-tray"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          aria-label="Compare properties"
        >
          <div className="cmp-thumbs">
            {Array.from({ length: COMPARE_MAX }, (_, i) =>
              items[i] ? (
                <span key={items[i].id} className="cmp-thumb">
                  <img src={items[i].images[0]} alt={items[i].title} />
                  <button aria-label={`Remove ${items[i].title}`} onClick={() => remove(items[i].id)}>
                    <Icon name="close" size={12} strokeWidth={2.6} />
                  </button>
                </span>
              ) : (
                <span key={i} className="cmp-thumb cmp-slot">
                  <Icon name="plus" size={16} />
                </span>
              )
            )}
          </div>
          <div className="cmp-actions">
            <button className="link-btn light" onClick={clear}>
              Clear
            </button>
            <Link href="/compare" className={`btn btn-yellow ${items.length < 2 ? "is-dim" : ""}`}>
              Compare {items.length}
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
