
import type { Metrica, Tendencia } from '../types';

interface MetricCardProps {
  metrica: Metrica;
}

const colorPorTendencia: Record<Tendencia, string> = {
  positiva: 'text-emerald-600',
  negativa: 'text-rose-600',
  neutra: 'text-slate-600',
};

export default function MetricCard({
  metrica,
}: MetricCardProps) {
  return (
  <article className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-sm font-medium text-slate-500">
          {metrica.titulo}
        </h2>

        <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          {metrica.valor}
        </p>
      </div>

      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl transition group-hover:bg-emerald-100">
        <span aria-hidden="true">{metrica.icono}</span>
      </div>
    </div>

    <div className="mt-5 border-t border-slate-100 pt-4">
      <p className={`text-sm font-medium ${colorPorTendencia[metrica.tendencia]}`}>
        {metrica.descripcion}
      </p>
    </div>
  </article>
);
}