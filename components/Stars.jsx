// Five-star rating display; the number is always shown next to it
export default function Stars({ value, size = 14 }) {
  const pct = `${(value / 5) * 100}%`;
  const row = (
    <svg viewBox="0 0 120 24" width={size * 5} height={size} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          transform={`translate(${i * 24} 0)`}
          d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z"
        />
      ))}
    </svg>
  );
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      <span className="stars-bg">{row}</span>
      <span className="stars-fg" style={{ width: pct }}>
        {row}
      </span>
    </span>
  );
}
