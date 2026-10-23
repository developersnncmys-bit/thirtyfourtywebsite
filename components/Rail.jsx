"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

// Horizontal row with round arrow buttons, like the 99acres home page rails
export default function Rail({ children, className = "", label = "items" }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const move = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className={`xrail ${className}`}>
      <div ref={ref} className="xrail-track" onScroll={update} role="list" aria-label={label}>
        {children}
      </div>
      {!edge.start && (
        <button className="xrail-btn left" aria-label="Scroll left" onClick={() => move(-1)}>
          <Icon name="back" size={20} />
        </button>
      )}
      {!edge.end && (
        <button className="xrail-btn right" aria-label="Scroll right" onClick={() => move(1)}>
          <Icon name="back" size={20} style={{ transform: "rotate(180deg)" }} />
        </button>
      )}
    </div>
  );
}
