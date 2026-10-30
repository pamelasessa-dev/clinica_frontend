export function SkeletonPacienteRow() {
  return (
    <article aria-hidden="true" className="min-h-[258px] animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-6 w-2/3 rounded bg-slate-200" />
      <div className="mt-3 h-6 w-24 rounded-full bg-slate-100" />
      <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
      <div className="mt-6 space-y-3">
        <div className="h-4 w-4/5 rounded bg-slate-100" />
        <div className="h-4 w-3/5 rounded bg-slate-100" />
        <div className="h-4 w-2/3 rounded bg-slate-100" />
      </div>
      <div className="mt-6 h-8 w-2/5 rounded bg-slate-100" />
    </article>
  );
}
