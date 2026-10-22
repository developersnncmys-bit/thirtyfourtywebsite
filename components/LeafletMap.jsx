"use client";
import { useEffect } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Price-pill markers, like the map view on property portals
function pill(label, active) {
  return L.divIcon({
    className: "map-pin-wrap",
    html: `<span class="map-pin${active ? " active" : ""}">${label}</span>`,
    iconSize: null,
    iconAnchor: [0, 0],
  });
}

const dot = L.divIcon({ className: "map-pin-wrap", html: '<span class="map-dot"></span>', iconSize: null });

// Re-fit only when the set of properties changes, not on every re-render
function FitBounds({ points }) {
  const map = useMap();
  const key = points.map((p) => p.id).join("|");
  useEffect(() => {
    if (points.length > 1) map.fitBounds(points.map((p) => [p.lat, p.lng]), { padding: [40, 40], maxZoom: 15 });
    else if (points.length === 1) map.setView([points[0].lat, points[0].lng], 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);
  return null;
}

/**
 * points: [{ id, lat, lng, label, title, href, image, sub }]
 * single: show one plain pin (property / locality location)
 */
export default function LeafletMap({ points, single = false, zoom = 14, height = 420, activeId }) {
  const center = points.length ? [points[0].lat, points[0].lng] : [12.3052, 76.6552];
  return (
    <div className="map" style={{ height }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!single && <FitBounds points={points} />}
        {points.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={single ? dot : pill(p.label, p.id === activeId)}>
            {p.href && (
              <Popup>
                <Link href={p.href} className="map-pop">
                  {p.image && <img src={p.image} alt="" />}
                  <span>
                    <b>{p.title}</b>
                    <small>{p.sub}</small>
                    <em>{p.label}</em>
                  </span>
                </Link>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
