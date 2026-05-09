"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { type DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { TierBadge } from "@/components/TierBadge";
import { formatKRW } from "@/lib/format";
import { SIDO_COORDS, KOREA_CENTER } from "./coords";

function makeIcon(count: number, tier?: Listing["tier"]): DivIcon {
  const colors: Record<Listing["tier"], string> = {
    urgent: "#dc2626",
    premium: "#1e3a8a",
    normal: "#404040",
    free: "#15803d",
  };
  const bg = tier ? colors[tier] : "#18181b";
  const html = `
    <div style="
      background:${bg};
      color:white;
      width:44px;height:44px;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-weight:800;font-size:13px;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);
      border:2px solid white;
      transform:translate(-50%,-50%);
      line-height:1;
    ">${count}</div>`;
  return L.divIcon({
    className: "shop-map-marker",
    html,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

function FlyToBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 8, duration: 0.4 });
  }, [map, points]);
  return null;
}

export default function ListingsMap({
  listings,
  filter,
}: {
  listings: Listing[];
  filter?: Listing["tier"] | "all";
}) {
  const filtered = useMemo(
    () =>
      filter && filter !== "all"
        ? listings.filter((l) => l.tier === filter)
        : listings,
    [listings, filter]
  );

  const grouped = useMemo(() => {
    const m = new globalThis.Map<string, Listing[]>();
    for (const l of filtered) {
      const arr = m.get(l.sido) ?? [];
      arr.push(l);
      m.set(l.sido, arr);
    }
    return m;
  }, [filtered]);

  const points = useMemo<[number, number][]>(
    () =>
      Array.from(grouped.keys())
        .map((s) => SIDO_COORDS[s])
        .filter((c): c is [number, number] => Boolean(c)),
    [grouped]
  );

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <MapContainer
        center={KOREA_CENTER}
        zoom={7}
        scrollWheelZoom
        className="h-full w-full"
        style={{ background: "#fafaf8" }}
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />
        <FlyToBounds points={points} />
        {Array.from(grouped.entries()).map(([sido, arr]) => {
          const coord = SIDO_COORDS[sido];
          if (!coord) return null;
          const tier = arr[0]?.tier;
          return (
            <Marker
              key={sido}
              position={coord}
              icon={makeIcon(arr.length, tier)}
            >
              <Popup minWidth={240} maxWidth={300}>
                <div className="font-sans">
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-[13px] font-bold text-foreground">{sido}</strong>
                    <span className="text-[11px] text-muted">{arr.length}건</span>
                  </div>
                  <ul className="space-y-1.5 max-h-44 overflow-y-auto">
                    {arr.slice(0, 5).map((l) => (
                      <li key={l.id}>
                        <Link
                          href={`/listings/${l.id}`}
                          className="block text-[12px] text-foreground hover:text-foreground/70"
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            <TierBadge tier={l.tier} size="xs" />
                            <span className="text-[10px] text-muted">{l.category} · {l.area}평</span>
                          </div>
                          <p className="font-semibold line-clamp-1">{l.title}</p>
                          <p className="text-[11px] text-muted tabular">
                            {formatKRW(l.deposit + l.premium)}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {arr.length > 5 && (
                    <Link
                      href={`/listings?sido=${encodeURIComponent(sido)}`}
                      className="block text-center mt-2 text-[11px] font-bold text-foreground hover:underline"
                    >
                      {sido} 전체 {arr.length}건 보기 →
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
