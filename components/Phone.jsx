// A phone frame for showing real 30Forty app screens
export default function Phone({ src, alt = "", className = "", children }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-notch" />
      <div className="phone-screen">{children || <img src={src} alt={alt} loading="lazy" />}</div>
    </div>
  );
}
