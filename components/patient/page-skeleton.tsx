export function PageSkeleton() {
  return (
    <div aria-busy="true" className="space-y-4">
      <div className="h-10 w-2/3 animate-pulse rounded-xl bg-muted" />
      <div className="h-40 animate-pulse rounded-3xl bg-muted" />
      <div className="h-64 animate-pulse rounded-3xl bg-muted" />
    </div>
  )
}
