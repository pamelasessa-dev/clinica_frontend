export function SkeletonMetricCard() {
  return (
    <article aria-hidden="true" className="min-h-[190px] animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-9 w-20 rounded bg-slate-200" />
        </div>
        <div className="size-12 rounded-xl bg-slate-100" />
      </div>
      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="h-4 w-3/4 rounded bg-slate-100" />
      </div>
    </article>
  );
}
