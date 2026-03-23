export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header skeleton */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="h-7 w-28 rounded bg-muted animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
        </div>
      </header>

      <div className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Featured section skeleton */}
        <div className="mb-8">
          <div className="h-6 w-48 rounded bg-muted animate-pulse mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[200px] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        </div>

        {/* Search + tabs skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="h-10 w-full sm:w-64 rounded-lg bg-muted animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-16 rounded bg-muted animate-pulse" />
            <div className="h-9 w-20 rounded bg-muted animate-pulse" />
            <div className="h-9 w-18 rounded bg-muted animate-pulse" />
          </div>
        </div>

        {/* Notebook cards grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
              <div className="flex gap-2 mt-4">
                <div className="h-6 w-14 rounded-full bg-muted animate-pulse" />
                <div className="h-6 w-14 rounded-full bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
