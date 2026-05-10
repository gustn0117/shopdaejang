import { Icon } from "@/components/Icon";

export default function Loading() {
  return (
    <div className="container-custom py-6 lg:py-10">
      <div className="mb-3">
        <div className="h-6 w-24 bg-zinc-200 rounded animate-pulse" />
      </div>
      <div className="grid lg:grid-cols-[1fr_360px] gap-3 h-[78vh]">
        <div className="surface-card flex items-center justify-center">
          <span className="inline-flex items-center gap-2 text-sm text-muted">
            <Icon.Map size={14} />
            지도를 불러오는 중...
          </span>
        </div>
        <div className="surface-card animate-pulse">
          <div className="p-4 border-b border-border">
            <div className="h-4 w-32 bg-zinc-200 rounded mb-2" />
            <div className="h-3 w-24 bg-zinc-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
