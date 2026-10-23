import Link from "next/link";

// The 3040 Property logo from the app — the white/gold art on dark
// backgrounds, the green app tile everywhere else
export default function Logo({ variant = "light", height = 44, className = "" }) {
  const src = variant === "tile" ? "/brand/logo.png" : "/brand/logo-light.png";
  return (
    <Link href="/" className={`logo logo-${variant} ${className}`} aria-label="Thirty Forty — home">
      <img src={src} alt="3040 Property" style={{ height }} />
    </Link>
  );
}
