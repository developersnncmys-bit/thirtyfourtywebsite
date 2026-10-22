"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "../Icon";
import { CATEGORIES } from "@/lib/data";

// The four round shortcuts under the search bar in the app
export default function Categories() {
  return (
    <section id="categories" className="cats">
      <div className="container cats-row">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={c.href} className="cat">
              <motion.span className="cat-circle" whileHover={{ y: -6, rotate: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                <Icon name={c.icon} size={30} strokeWidth={2} />
              </motion.span>
              <span className="cat-label">{c.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
