import { Link } from "react-router";
import { GraficaCitasPorEspecialidad } from "../components/GraficaCitasPorEspecialidad";
import { GraficaCitasPorDia } from "../components/GraficaCitasPorDia";

export function PaginaReportes() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Clínica Salud Integral
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Reportes
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Actividad de citas de la clínica.
            </p>
          </div>

          <Link
            to="/"
            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            ← Volver al dashboard
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <GraficaCitasPorEspecialidad />
          <GraficaCitasPorDia />
        </div>
      </div>
    </main>
  );
}
