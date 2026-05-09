"use client";

import dynamic from "next/dynamic";
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

export function MiniMap({ sido, sigungu }: { sido: string; sigungu?: string }) {
  return (
    <div className="relative aspect-video bg-zinc-100 rounded overflow-hidden border border-border">
      <Inner sido={sido} sigungu={sigungu} />
    </div>
  );
}
