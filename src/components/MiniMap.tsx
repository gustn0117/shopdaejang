"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Icon } from "./Icon";

const Inner = dynamic(() => import("./MapView/MiniMapInner"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted bg-zinc-50">
      <span className="inline-flex items-center gap-1.5">
        <Icon.Map size={14} />
        지도를 불러오는 중
      </span>
    </div>
  ),
});

type Layer = "map" | "satellite";

export function MiniMap({ sido, sigungu }: { sido: string; sigungu?: string }) {
  const [layer, setLayer] = useState<Layer>("map");

  return (
    <div className="relative aspect-video bg-zinc-100 rounded overflow-hidden border border-border min-h-72 lg:min-h-96">
      <Inner sido={sido} sigungu={sigungu} layer={layer} />
      <div className="absolute top-3 right-3 z-400 surface-card p-1 flex gap-1 shadow-sm">
        <button
          type="button"
          onClick={() => setLayer("map")}
          className={`px-2.5 py-1 text-[11px] font-bold rounded ${
            layer === "map" ? "bg-foreground text-white" : "text-muted hover:text-foreground"
          }`}
        >
          지도
        </button>
        <button
          type="button"
          onClick={() => setLayer("satellite")}
          className={`px-2.5 py-1 text-[11px] font-bold rounded ${
            layer === "satellite" ? "bg-foreground text-white" : "text-muted hover:text-foreground"
          }`}
        >
          위성
        </button>
      </div>
    </div>
  );
}
