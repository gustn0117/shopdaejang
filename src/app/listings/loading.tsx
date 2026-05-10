export default function Loading() {
  return (
    <div className="container-custom py-6 lg:py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-32 bg-zinc-200 rounded" />
        <div className="h-3 w-48 bg-zinc-100 rounded" />
        <div className="grid lg:grid-cols-[260px_1fr] gap-6 pt-4">
          <div className="surface-card p-4 h-80" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="surface-card p-3">
                <div className="aspect-4/3 bg-zinc-100 rounded" />
                <div className="h-3 mt-3 bg-zinc-100 rounded w-3/4" />
                <div className="h-3 mt-2 bg-zinc-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
