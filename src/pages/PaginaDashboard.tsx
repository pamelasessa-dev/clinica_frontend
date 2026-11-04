import { Link } from "react-router";
import { useMemo, useState } from "react";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import { AlertaBanner } from "../components/ui";
import { SkeletonMetricCard } from "../components/SkeletonMetricCard";
import { useMetricasDashboard } from "../hooks/useMetricasDashboard";

export default function PaginaDashboard() {
  const [mantenimiento, setMantenimiento] = useState(false);
  const { datos, cargando, error, recargar } = useMetricasDashboard();

  const metricas = useMemo(() => {
    if (!datos) return [];

    const totalCitasContabilizadas = datos.citasProgramadas + datos.citasCompletadas;
    const porcentajeCompletadas = totalCitasContabilizadas === 0
      ? 0
      : Math.round((datos.citasCompletadas / totalCitasContabilizadas) * 100);

    return [
      { id: "pacientes", titulo: "Pacientes", valor: datos.pacientes, descripcion: "Pacientes registrados", tendencia: "positiva" as const, icono: "👥" },
      { id: "medicos", titulo: "Médicos", valor: datos.medicos, descripcion: "Médicos registrados", tendencia: "positiva" as const, icono: "🩺" },
      { id: "programadas", titulo: "Citas programadas", valor: datos.citasProgramadas, descripcion: "Pendientes de atención", tendencia: "neutra" as const, icono: "📅" },
      { id: "completadas", titulo: "Citas completadas", valor: datos.citasCompletadas, descripcion: "Citas finalizadas", tendencia: "positiva" as const, icono: "✅" },
      { id: "total-citas", titulo: "Citas contabilizadas", valor: totalCitasContabilizadas, descripcion: "Programadas + completadas", tendencia: "neutra" as const, icono: "📋" },
      { id: "porcentaje-completadas", titulo: "Citas completadas", valor: `${porcentajeCompletadas}%`, descripcion: "De las citas programadas y completadas", tendencia: "positiva" as const, icono: "📈" },
    ];
  }, [datos]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {mantenimiento && (
          <div
            role="alert"
            className="mb-6 rounded-lg bg-rose-100 p-4 font-medium text-rose-800"
          >
            El sistema está en modo mantenimiento.
          </div>
        )}

        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Clínica Salud Integral
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Panel de control
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Resumen general de la clínica
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/pacientes"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Ver Pacientes
            </Link>

            <StatusBadge activo={!mantenimiento} />
          </div>
        </header>

        <section aria-label="Métricas de la clínica">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-800">
              Indicadores principales
            </h2>

            <button
              type="button"
              onClick={() => void recargar()}
              disabled={cargando}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              {cargando ? "Actualizando..." : "Actualizar datos"}
            </button>

            <button
              type="button"
              onClick={() => setMantenimiento((prev) => !prev)}
              aria-pressed={mantenimiento}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              {mantenimiento
                ? "Desactivar mantenimiento"
                : "Activar mantenimiento"}
            </button>
          </div>

          {cargando && (
            <div
              role="status"
              aria-label="Cargando métricas"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
              {Array.from({ length: 4 }, (_, index) => (
                <SkeletonMetricCard key={index} />
              ))}
            </div>
          )}

          {!cargando && error && (
            <AlertaBanner
              tipo="error"
              titulo="No se pudieron cargar las métricas"
              mensaje={error}
              accion={{ label: "Reintentar", onClick: () => void recargar() }}
            />
          )}

          {!cargando && !error && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {metricas.map((metrica) => (
                <MetricCard key={metrica.id} metrica={metrica} />
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Link
              to="/reportes"
              className="text-sm font-semibold text-blue-700 transition hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Ver reportes completos →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
