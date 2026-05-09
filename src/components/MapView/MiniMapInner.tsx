"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SIDO_COORDS } from "./coords";

const pinIcon = L.divIcon({
  className: "shop-pin",
  html: `
    <div style="
      width:18px;height:18px;border-radius:50%;
      background:#18181b;border:3px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.25);
      transform:translate(-50%,-50%);
    "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function MiniMapInner({ sido }: { sido: string; sigungu?: string }) {
  const coord = SIDO_COORDS[sido] ?? [36.5, 127.8];
  return (
    <MapContainer
      center={coord}
      zoom={12}
      scrollWheelZoom={false}
      dragging
      doubleClickZoom
      zoomControl={false}
      className="h-full w-full"
      style={{ background: "#fafaf8" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={18}
      />
      <Marker position={coord} icon={pinIcon} />
    </MapContainer>
  );
}
