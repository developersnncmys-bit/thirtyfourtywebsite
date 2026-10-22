"use client";
import dynamic from "next/dynamic";

// Leaflet touches `window`, so the map only loads in the browser
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading map…</div>,
});

export default function MapView(props) {
  return <LeafletMap {...props} />;
}
