export default function Loading() {
  return (
    <div className="container-custom py-10 lg:py-16">
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-zinc-200 rounded" />
        <div className="h-4 w-64 bg-zinc-100 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="surface-card p-3">
              <div className="aspect-4/3 bg-zinc-100 rounded" />
              <div className="h-3 mt-3 bg-zinc-100 rounded w-3/4" />
              <div className="h-3 mt-2 bg-zinc-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
