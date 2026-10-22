"use client";
import Icon from "./Icon";
import { useCompare, COMPARE_MAX } from "@/lib/store";

export default function CompareButton({ id, className = "", label = true }) {
  const { has, toggle, full } = useCompare();
  const on = has(id);
  const disabled = !on && full;
  return (
    <button
      type="button"
      className={`cmp-btn ${on ? "on" : ""} ${className}`}
      aria-pressed={on}
      disabled={disabled}
      title={disabled ? `You can compare up to ${COMPARE_MAX} properties` : on ? "Remove from compare" : "Add to compare"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
    >
      <span className="cmp-box">{on && <Icon name="check" size={12} strokeWidth={3} />}</span>
      {label && <span>{on ? "Comparing" : "Compare"}</span>}
    </button>
  );
}
