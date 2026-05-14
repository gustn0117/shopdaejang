"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
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

function Recenter({ coord, zoom }: { coord: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coord, zoom, { animate: true });
  }, [map, coord, zoom]);
  return null;
}

async function geocode(query: string): Promise<[number, number] | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1&countrycodes=kr&accept-language=ko`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data.length) return null;
    return [Number(data[0].lat), Number(data[0].lon)];
  } catch {
    return null;
  }
}

export default function MiniMapInner({
  sido,
  sigungu,
  dong,
  layer = "map",
}: {
  sido: string;
  sigungu?: string;
  dong?: string;
  layer?: Layer;
}) {
  const initial = SIDO_COORDS[sido] ?? [36.5, 127.8];
  const [coord, setCoord] = useState<[number, number]>(initial);
  const [zoom, setZoom] = useState(sigungu ? 14 : 11);
  const tile = TILE_BY_LAYER[layer];

  useEffect(() => {
    const parts = [sido, sigungu, dong].filter(Boolean).join(" ");
    if (!sigungu && !dong) return; // 시·도만 알 땐 그대로
    let cancelled = false;

    // 1) 가장 구체적인 쿼리 먼저 → 실패 시 dong 빼고 → 그래도 실패 시 sigungu만
    const queries = [parts, `${sido} ${sigungu}`].filter(Boolean);
    (async () => {
      for (const q of queries) {
        const r = await geocode(q);
        if (cancelled) return;
        if (r) {
          setCoord(r);
          setZoom(dong ? 16 : 14);
          return;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sido, sigungu, dong]);

  return (
    <MapContainer
      center={initial}
      zoom={zoom}
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
      <Recenter coord={coord} zoom={zoom} />
    </MapContainer>
  );
}
