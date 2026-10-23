import { typeInfo } from "@/lib/options";

// A listing's photo, or the app's category illustration when the owner
// published without photos (the app allows that)
export default function PropertyImage({ p, src = p.images[0], className = "", alt = p.title }) {
  if (src) return <img src={src} alt={alt} loading="lazy" className={className} />;
  const t = typeInfo(p.type);
  return (
    <span className={`ph ${className}`} role="img" aria-label={`${t.label} — no photos yet`}>
      <img src={t.icon} alt="" />
      <small>No photos yet</small>
    </span>
  );
}
