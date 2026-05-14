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

const TILE_BY_LAYER = {
  map: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri World Imagery",
  },
} as const;

type Layer = keyof typeof TILE_BY_LAYER;

export default function MiniMapInner({
  sido,
  layer = "map",
}: {
  sido: string;
  sigungu?: string;
  layer?: Layer;
}) {
  const coord = SIDO_COORDS[sido] ?? [36.5, 127.8];
  const tile = TILE_BY_LAYER[layer];
  return (
    <MapContainer
      center={coord}
      zoom={13}
      scrollWheelZoom={false}
      dragging
      doubleClickZoom
      zoomControl
      className="h-full w-full"
      style={{ background: "#fafaf8" }}
    >
      <TileLayer
        key={layer}
        attribution={tile.attribution}
        url={tile.url}
        maxZoom={19}
      />
      <Marker position={coord} icon={pinIcon} />
    </MapContainer>
  );
}
