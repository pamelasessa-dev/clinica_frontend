export function SkeletonCitaRow() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[76px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 animate-pulse"
    >
      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-2/5 rounded bg-slate-200" />
        <div className="h-3 w-1/4 rounded bg-slate-100" />
      </div>
      <div className="hidden h-4 w-32 rounded bg-slate-100 sm:block" />
      <div className="h-6 w-24 rounded-full bg-slate-200" />
    </div>
  );
}
