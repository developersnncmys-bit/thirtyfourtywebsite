import Link from "next/link";

// The 3040 Property app icon, cropped to its green tile
export default function Logo({ size = 48, withText = false, className = "" }) {
  return (
    <Link href="/" className={`logo ${className}`} aria-label="3040 Property — home">
      <span className="logo-tile" style={{ width: size, height: size }}>
        <img src="/logo-mark.png" alt="" width={size} height={size} />
      </span>
      {withText && (
        <span className="logo-text">
          <b>
            30<em>40</em>
          </b>
          <small>PROPERTY</small>
        </span>
      )}
    </Link>
  );
}
